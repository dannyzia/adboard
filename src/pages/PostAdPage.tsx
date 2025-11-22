import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { useAuth } from '../hooks/useAuth';
// import { categoryFields } from '../config/categoryFields';
import { ImageUploadZone } from '../components/forms/ImageUploadZone';
import { getCountries, getStates, getCities } from '../utils/constants';
import { adService } from '../services/ad.service';
import { uploadService } from '../services/upload.service';
import { useLocation } from 'react-router-dom';
import { useToast } from '../components/ui/ToastContext';

type DynamicDetails = Record<string, any>;

type FormState = {
    title: string;
    description: string;
    category: string;
    price?: number | string;
    priceType?: string;
    currency: string;
    images: File[];
    imageUrls?: string[];
    location: { country: string; state: string; city: string };
    links: { link1?: string; link2?: string };
    contactEmail?: string;
    contactPhone?: string;
    details: DynamicDetails;
    customDuration?: number | '';
};

export const PostAdPage: React.FC = () => {
    const navigate = useNavigate();
    useAuth();
    const location = useLocation();
    const toast = useToast();
    const [formData, setFormData] = useState<FormState>({
        title: '',
        description: '',
        category: '',
        price: '',
        priceType: 'Fixed',
        currency: 'USD',
        images: [] as File[],
            imageUrls: ['', '', '', ''],
        location: { country: '', state: '', city: '' },
            links: { link1: '', link2: '' },
        contactEmail: '',
        contactPhone: '',
        details: {},
        customDuration: '',
    });
    const [formConfig, setFormConfig] = useState<any>(null);
    const [dynamicFields, setDynamicFields] = useState<any[]>([]);
    const [currencies, setCurrencies] = useState<{ code: string; name: string }[]>([]);
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [countries, setCountries] = useState<string[]>([]);
    const [states, setStates] = useState<string[]>([]);
    const [cities, setCities] = useState<string[]>([]);
    const [submitting, setSubmitting] = useState(false);
    const [editingAdId, setEditingAdId] = useState<string | null>(null);
    const [originalStatus, setOriginalStatus] = useState<string | null>(null);
    const [linkErrors, setLinkErrors] = useState<{ link1?: string; link2?: string }>({});

    useEffect(() => {
        fetch('/api/currencies')
            .then((res) => res.json())
            .then((data) => setCurrencies(data.currencies || []))
            .catch(() => setCurrencies([{ code: 'USD', name: 'US Dollar' }]));
    }, []);

    // Fetch form config from backend
    useEffect(() => {
        fetch('/api/form-config')
            .then((res) => res.json())
            .then((data) => setFormConfig(data))
            .catch(() => setFormConfig(null));
    }, []);

    // Detect edit query param and load ad for editing
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const editId = params.get('edit');
        if (editId) {
            setEditingAdId(editId);
            (async () => {
                try {
                    const ad = await adService.getAdById(editId);
                    // remember original status so we can resubmit if necessary
                    setOriginalStatus(ad.status || null);
                    // Map ad to form state where possible
                    setFormData({
                        title: ad.title || '',
                        description: ad.description || '',
                        category: ad.category || '',
                        price: ad.price ?? '',
                        priceType: (ad as any).priceType || 'Fixed',
                        currency: ad.currency || 'USD',
                        images: [] as File[],
                        imageUrls: (ad.images || []).map((i: any) => (typeof i === 'string' ? i : i.url)),
                        location: ad.location || { country: '', state: '', city: '' },
                        links: ad.links || { link1: '', link2: '' },
                        contactEmail: (ad as any).contactEmail || '',
                        contactPhone: (ad as any).contactPhone || '',
                        details: (ad as any).details || {},
                        customDuration: (ad as any).customDuration || '',
                    });
                } catch (err) {
                    console.error('Failed to load ad for editing', err);
                    // If loading fails, clear edit id and continue as new
                    setEditingAdId(null);
                    setOriginalStatus(null);
                    toast.showToast('Failed to load ad for editing', 'error');
                }
            })();
        }
    }, [location.search]);

    useEffect(() => {
        if (formConfig && formData.category && formConfig.specificFields[formData.category]) {
            setDynamicFields(formConfig.specificFields[formData.category]);
        } else {
            setDynamicFields([]);
        }
    }, [formConfig, formData.category]);

    // Ensure logical ordering: when price and priceType both exist, render price before priceType.
    const orderedDynamicFields = (() => {
        if (!dynamicFields || dynamicFields.length === 0) return dynamicFields;
        const fields = [...dynamicFields];
        const priceIndex = fields.findIndex((f: any) => f.name === 'price');
        const priceTypeIndex = fields.findIndex((f: any) => f.name === 'priceType');
        // If priceType appears before price, move it to immediately after price
        if (priceIndex !== -1 && priceTypeIndex !== -1 && priceTypeIndex < priceIndex) {
            const [pt] = fields.splice(priceTypeIndex, 1);
            const insertAt = fields.findIndex((f: any) => f.name === 'price') + 1;
            fields.splice(insertAt, 0, pt);
        }
        // Ensure any declared `currency` field appears before `price` or `startingBid`
        const currencyIndex = fields.findIndex((f: any) => f.name === 'currency');
        const startingBidIndex = fields.findIndex((f: any) => f.name === 'startingBid');
        const effectivePriceIndex = priceIndex !== -1 ? fields.findIndex((f: any) => f.name === 'price') : -1;
        // If currency exists and appears after price or startingBid, move it before the earliest of price/startingBid
        if (currencyIndex !== -1) {
            // determine earliest target index (price takes precedence)
            let targetIndex = -1;
            if (effectivePriceIndex !== -1) targetIndex = effectivePriceIndex;
            else if (startingBidIndex !== -1) targetIndex = startingBidIndex;
            if (targetIndex !== -1 && currencyIndex > targetIndex) {
                const [c] = fields.splice(currencyIndex, 1);
                const insertAt = Math.max(0, fields.findIndex((f: any) => f.name === (effectivePriceIndex !== -1 ? 'price' : 'startingBid')));
                fields.splice(insertAt, 0, c);
            }
        }
        return fields;
    })();

    // Helper: whether the selected category already declares a currency field (after ordering adjustments)
    const hasCurrencyField = orderedDynamicFields.some((f: any) => f.name === 'currency');

    // Validate and auto-correct URL format
    const validateAndCorrectUrl = (url: string): { isValid: boolean; correctedUrl: string; error?: string } => {
        if (!url || url.trim() === '') {
            return { isValid: true, correctedUrl: '' };
        }

        let corrected = url.trim();

        // Auto-add https:// if missing protocol
        if (!corrected.match(/^https?:\/\//i)) {
            // Check if it starts with www. or looks like a domain
            if (corrected.match(/^(www\.|[a-zA-Z0-9-]+\.[a-zA-Z]{2,})/)) {
                corrected = 'https://' + corrected;
            } else {
                return { 
                    isValid: false, 
                    correctedUrl: corrected,
                    error: 'Invalid URL format. Please enter a valid website URL (e.g., www.example.com or https://example.com)'
                };
            }
        }

        // Basic URL validation
        try {
            const urlObj = new URL(corrected);
            if (!urlObj.protocol.match(/^https?:$/)) {
                return { 
                    isValid: false, 
                    correctedUrl: corrected,
                    error: 'URL must use http:// or https:// protocol'
                };
            }
            return { isValid: true, correctedUrl: corrected };
        } catch (e) {
            return { 
                isValid: false, 
                correctedUrl: corrected,
                error: 'Invalid URL format. Please enter a valid website URL (e.g., www.example.com or https://example.com)'
            };
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (submitting) return;

        // Validate and auto-correct external links
        const errors: { link1?: string; link2?: string } = {};
        let correctedLinks = { ...formData.links };
        
        if (formData.links.link1) {
            const validation1 = validateAndCorrectUrl(formData.links.link1);
            if (!validation1.isValid) {
                errors.link1 = validation1.error;
            } else {
                correctedLinks.link1 = validation1.correctedUrl;
            }
        }
        
        if (formData.links.link2) {
            const validation2 = validateAndCorrectUrl(formData.links.link2);
            if (!validation2.isValid) {
                errors.link2 = validation2.error;
            } else {
                correctedLinks.link2 = validation2.correctedUrl;
            }
        }

        if (Object.keys(errors).length > 0) {
            setLinkErrors(errors);
            // Scroll to the links section
            const linksSection = document.querySelector('[data-section="external-links"]');
            if (linksSection) {
                linksSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }

        // Update formData with corrected links
        if (correctedLinks.link1 !== formData.links.link1 || correctedLinks.link2 !== formData.links.link2) {
            setFormData(prev => ({ ...prev, links: correctedLinks }));
        }
        setLinkErrors({});

        // Client-side validation for auctions
        if (formData.category === 'Auction') {
            const auctionEndValue = formData.details['auctionEnd'];
            const startingBidValue = formData.details['startingBid'];

            if (!auctionEndValue) {
                alert('Please provide an Auction End Date');
                return;
            }

            const end = new Date(auctionEndValue);
            if (isNaN(end.getTime())) {
                alert('Auction End Date is invalid');
                return;
            }
            if (end <= new Date()) {
                alert('Auction End Date must be in the future');
                return;
            }

            const starting = parseFloat(startingBidValue);
            if (isNaN(starting) || starting <= 0) {
                alert('Starting Bid must be a number greater than 0');
                return;
            }

            // If category doesn't declare currency field, ensure currency is selected
            if (!hasCurrencyField && (!formData.currency || formData.currency === '')) {
                alert('Please select a currency for the starting bid');
                return;
            }
        }

        setSubmitting(true);
        try {
            // Upload files if any image Files are present
            let uploadedImages: Array<{ url: string; publicId?: string }> = [];
            if (imageFiles && imageFiles.length > 0) {
                try {
                    uploadedImages = await uploadService.uploadImages(imageFiles);
                } catch (err) {
                    console.error('Image upload failed:', err);
                    alert('Failed to upload images. Please try again.');
                    setSubmitting(false);
                    return;
                }
            }

            // Include imageUrls manually entered by user
            const manualUrls = (formData.imageUrls || []).filter(Boolean).map((u) => ({ url: u }));

            const imagesPayload = [...uploadedImages, ...manualUrls];

            // Build payload expected by backend/createAd
            const payload: any = {
                title: formData.title,
                description: formData.description,
                category: formData.category,
                location: formData.location,
                images: imagesPayload,
                contactEmail: formData.contactEmail,
                contactPhone: formData.contactPhone,
                links: formData.links,
                customDuration: formData.customDuration || undefined,
                currency: formData.currency || undefined,
            };

            // Determine price value: it may be stored in formData.price or in dynamic details
            const determinedPrice = (formData.price !== undefined && formData.price !== '') ? formData.price : (formData.details && formData.details['price']) ? formData.details['price'] : undefined;

            if (formData.category === 'Auction') {
                // Convert datetime-local to ISO
                const auctionEndIso = new Date(formData.details['auctionEnd']).toISOString();
                payload.auctionEnd = auctionEndIso;
                payload.startingBid = parseFloat(formData.details['startingBid']);
                if (formData.details['reservePrice']) payload.reservePrice = parseFloat(formData.details['reservePrice']);
            } else {
                if (determinedPrice !== undefined && determinedPrice !== '') payload.price = Number(determinedPrice);
                if (formData.currency) payload.currency = formData.currency;
            }

            // Attach remaining dynamic details (category-specific) into details or top-level as needed
            payload.details = formData.details;

            // Call backend (create or update depending on editing state)
            if (editingAdId) {
                // If the ad was previously rejected, mark as pending for re-review
                if (originalStatus === 'rejected') {
                    (payload as any).status = 'pending';
                }
                await adService.updateAd(editingAdId, payload as any);
                toast.showToast(originalStatus === 'rejected' ? 'Ad updated and resubmitted for review' : 'Ad updated successfully', 'success');
                // After update, navigate to ad detail
                navigate(`/ad/${editingAdId}`);
            } else {
                await adService.createAd(payload as any);
                // Show pending message and return to dashboard for review
                toast.showToast('Ad submitted successfully! It will be visible after admin review.', 'success');
                navigate('/dashboard');
            }
        } catch (err: any) {
            console.error('Create ad error:', err);
            // Prefer server-provided error message when available
            const serverMessage = err?.response?.data?.message || err?.response?.data?.error;
            alert(serverMessage || err?.message || 'Failed to create ad');
        } finally {
            setSubmitting(false);
        }
    };

    const handleFileUpload = (files: FileList | null) => {
        if (!files) return;
        const arr = Array.from(files);
        setImageFiles(arr);
        setFormData((prev) => ({ ...prev, images: arr }));
    };
    const handleRemoveFile = (index: number) => {
        const arr = imageFiles.slice();
        arr.splice(index, 1);
        setImageFiles(arr);
        setFormData((prev) => ({ ...prev, images: arr }));
    };

    useEffect(() => {
        Promise.resolve(getCountries()).then(setCountries);
    }, []);
    // When country changes, set currency based on country metadata (if available)
    useEffect(() => {
        const country = formData.location.country;
        if (!country) return;
        try {
            const currency = (async () => {
                const { getCurrencyForCountry } = await import('../utils/constants');
                // ensure countries are loaded into cache
                await getCountries();
                return getCurrencyForCountry(country);
            })();
            currency.then((c) => {
                if (c) setFormData(prev => ({ ...prev, currency: c }));
            });
        } catch (err) {
            // ignore
        }
    }, [formData.location.country]);
    useEffect(() => {
        if (formData.location.country) {
            Promise.resolve(getStates(formData.location.country)).then(setStates);
        } else {
            setStates([]);
        }
    }, [formData.location.country]);
    useEffect(() => {
        if (formData.location.state) {
            Promise.resolve(getCities(formData.location.state)).then(setCities);
        } else {
            setCities([]);
        }
    }, [formData.location.state]);

    return (
        <>
            <Navbar />
            <div className="container mx-auto py-8">
                <h1 className="text-2xl font-bold mb-6">Post an Ad</h1>
                <form onSubmit={handleSubmit} className="max-w-xl mx-auto bg-white rounded-lg shadow-md p-8 space-y-6 border border-gray-200">
                    {/* Category (moved to top) */}
                    <div>
                        <label className="block mb-2 font-semibold text-gray-700">Category</label>
                        <select
                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            required
                        >
                            <option value="">Select category</option>
                            {formConfig && formConfig.categories && [...formConfig.categories].sort((a: string, b: string) => a.localeCompare(b)).map((cat: string) => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    {/* Title */}
                    <div>
                        <label className="block mb-2 font-semibold text-gray-700">Title</label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                        />
                    </div>
                    {/* Description */}
                    <div>
                        <label className="block mb-2 font-semibold text-gray-700">Description</label>
                        <textarea
                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            required
                        />
                    </div>
                    {/* Image Upload Section */}
                    <div>
                        <label className="block mb-2 font-semibold text-gray-700">Images</label>
                        <ImageUploadZone
                            images={imageFiles}
                            onUpload={(files) => handleFileUpload(files)}
                            onRemove={handleRemoveFile}
                        />
                    </div>

                    {/* Image URL Guidelines and Inputs */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6 mb-2">
                        <div className="flex items-center mb-2">
                            <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" /></svg>
                            <span className="font-semibold text-blue-700">Image URL Guidelines</span>
                        </div>
                        <div className="text-sm text-blue-800 mb-1">
                            <span className="font-semibold">Free Image Hosting Service:</span>
                            <ul className="list-disc ml-6">
                                <li><a href="https://postimg.cc/" target="_blank" rel="noopener noreferrer" className="underline text-blue-600">PostImg.cc</a> - Fast, no registration, direct links (recommended)</li>
                            </ul>
                            <div className="mt-2"><span className="font-semibold">Tip:</span> Upload your images to any hosting service above, then copy the <span className="font-semibold">direct image link</span> (must end in .jpg, .png, .gif, or .webp) and paste it below. You can also use www.domain.com format.</div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        {[1,2,3,4].map((i) => (
                            <input
                                key={i}
                                type="url"
                                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                                placeholder={`Image URL ${i} (e.g., https://i.imgur.com/image.jpg)`}
                                value={formData.imageUrls && formData.imageUrls[i-1] !== undefined ? formData.imageUrls[i-1] : ''}
                                onChange={e => {
                                    const urls = formData.imageUrls ? [...formData.imageUrls] : ['', '', '', ''];
                                    urls[i-1] = e.target.value;
                                    setFormData({ ...formData, imageUrls: urls });
                                }}
                            />
                        ))}
                    </div>

                    {/* External Links (Optional) */}
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4" data-section="external-links">
                        <div className="font-semibold text-gray-700 mb-1">External Links (Optional)</div>
                        <div className="text-sm text-gray-600 mb-3">Add external links related to your ad (websites, social media, product pages, etc.). You can enter URLs with or without https:// - we'll handle it automatically.</div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[1,2].map((i) => (
                                <div key={i}>
                                    <label className="block mb-1 font-medium text-gray-600">Link {i}</label>
                                    <input
                                        type="text"
                                        className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 ${
                                            linkErrors[`link${i}` as 'link1' | 'link2'] 
                                                ? 'border-red-500 focus:ring-red-400' 
                                                : 'border-gray-300 focus:ring-blue-400'
                                        }`}
                                        placeholder={`www.example.com or https://example.com`}
                                        value={formData.links && (formData.links as any)[`link${i}`] ? (formData.links as any)[`link${i}`] : ''}
                                        onChange={e => {
                                            setFormData({
                                                ...formData,
                                                links: { ...formData.links, [`link${i}`]: e.target.value },
                                            });
                                            // Clear error when user starts typing
                                            if (linkErrors[`link${i}` as 'link1' | 'link2']) {
                                                setLinkErrors(prev => ({ ...prev, [`link${i}`]: undefined }));
                                            }
                                        }}
                                        onBlur={e => {
                                            // Auto-correct on blur
                                            const value = e.target.value;
                                            if (value) {
                                                const validation = validateAndCorrectUrl(value);
                                                if (validation.isValid && validation.correctedUrl !== value) {
                                                    setFormData({
                                                        ...formData,
                                                        links: { ...formData.links, [`link${i}`]: validation.correctedUrl },
                                                    });
                                                }
                                            }
                                        }}
                                    />
                                    {linkErrors[`link${i}` as 'link1' | 'link2'] && (
                                        <p className="text-red-600 text-sm mt-1 flex items-center">
                                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                            {linkErrors[`link${i}` as 'link1' | 'link2']}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Location Selection */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block mb-2 font-semibold text-gray-700">Country</label>
                            <select
                                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                                value={formData.location.country}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    location: { ...formData.location, country: e.target.value, state: '', city: '' },
                                })}
                                required
                            >
                                <option value="">Select country</option>
                                {[...countries].sort((a, b) => a.localeCompare(b)).map((country) => (
                                    <option key={country} value={country}>{country}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block mb-2 font-semibold text-gray-700">State</label>
                            <select
                                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                                value={formData.location.state}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    location: { ...formData.location, state: e.target.value, city: '' },
                                })}
                                required
                            >
                                <option value="">Select state</option>
                                {[...states].sort((a, b) => a.localeCompare(b)).map((state) => (
                                    <option key={state} value={state}>{state}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block mb-2 font-semibold text-gray-700">City</label>
                            <select
                                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                                value={formData.location.city}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    location: { ...formData.location, city: e.target.value },
                                })}
                                required
                            >
                                <option value="">Select city</option>
                                {[...cities].sort((a, b) => a.localeCompare(b)).map((city) => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    {/* Contact Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-2 font-semibold text-gray-700">Contact Email</label>
                            <input
                                type="email"
                                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                                value={formData.contactEmail}
                                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-2 font-semibold text-gray-700">Contact Phone</label>
                            <input
                                type="tel"
                                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                                value={formData.contactPhone}
                                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Ad Duration Section */}
                    <div className="mb-6">
                        <label className="block mb-2 font-semibold text-gray-700">Ad Duration (days)</label>
                        <div className="flex items-center gap-2">
                            <button type="button" className="px-3 py-1 bg-gray-200 rounded" onClick={() => setFormData({ ...formData, customDuration: Math.max(1, (formData.customDuration || 1) - 1) })}>-</button>
                            <input
                                type="number"
                                min={1}
                                max={7}
                                value={formData.customDuration || 1}
                                onChange={e => {
                                    const val = Number(e.target.value);
                                    setFormData({ ...formData, customDuration: val });
                                }}
                                className="w-20 px-4 py-2 border border-gray-300 rounded text-center focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                            <button type="button" className="px-3 py-1 bg-gray-200 rounded" onClick={() => setFormData({ ...formData, customDuration: Math.min(7, (formData.customDuration || 1) + 1) })}>+</button>
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                            Your free plan allows ads up to <span className="font-bold">7 days</span>. <a href="#" className="text-blue-600 underline">Upgrade for longer durations.</a>
                        </div>
                        {(formData.customDuration || 1) > 7 && (
                            <div className="text-red-600 mt-2 font-semibold">You have exceeded your plan's limit. Please <a href="#" className="underline">upgrade</a> for longer durations.</div>
                        )}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4 flex items-center">
                            <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" /></svg>
                            <span className="font-semibold text-blue-700">Free Plan: 1 ads remaining</span>
                        </div>
                    </div>
                    {/* Removed hard-coded Currency/Price/PriceType/Condition block to avoid duplicates.
                       These fields are now expected to be provided by `form-config.json` and rendered
                       inside the "Additional Details" area alongside other category-specific fields. */}
                    {/* Dynamic fields (from form-config) */}
                    {dynamicFields.length > 0 && (
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mt-4">
                            <h2 className="text-lg font-bold mb-4 text-blue-700">Additional Details</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {orderedDynamicFields.map((field: any) => {
                                    if (["title", "description", "category", "images", "contactEmail", "contactPhone"].includes(field.name)) return null;

                                    // If this is the price field, render currency first (if category doesn't already declare it)
                                    if (field.name === 'price') {
                                        return (
                                            <div key={field.name} className="mb-2">
                                                {!hasCurrencyField && (
                                                    <div className="mb-2">
                                                        <label className="block mb-1 font-medium text-gray-600">Currency</label>
                                                        <select
                                                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
                                                            value={formData.currency}
                                                            onChange={e => setFormData({ ...formData, currency: e.target.value })}
                                                        >
                                                            {currencies.length === 0 ? (
                                                                <option value="">Loading...</option>
                                                            ) : (
                                                                currencies.map((currency) => (
                                                                    <option key={currency.code} value={currency.code}>{currency.code} - {currency.name}</option>
                                                                ))
                                                            )}
                                                        </select>
                                                    </div>
                                                )}
                                                <label className="block mb-1 font-medium text-gray-600">{field.label}</label>
                                                <input
                                                    type={field.type}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
                                                    value={formData.details[field.name] || ''}
                                                    onChange={e => setFormData({
                                                        ...formData,
                                                        details: { ...formData.details, [field.name]: e.target.value },
                                                    })}
                                                />
                                            </div>
                                        );
                                    }

                                    // If this is the startingBid field (auction), render currency first (if category doesn't already declare it)
                                    if (field.name === 'startingBid') {
                                        return (
                                            <div key={field.name} className="mb-2">
                                                {!hasCurrencyField && (
                                                    <div className="mb-2">
                                                        <label className="block mb-1 font-medium text-gray-600">Currency</label>
                                                        <select
                                                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
                                                            value={formData.currency}
                                                            onChange={e => setFormData({ ...formData, currency: e.target.value })}
                                                        >
                                                            {currencies.length === 0 ? (
                                                                <option value="">Loading...</option>
                                                            ) : (
                                                                currencies.map((currency) => (
                                                                    <option key={currency.code} value={currency.code}>{currency.code} - {currency.name}</option>
                                                                ))
                                                            )}
                                                        </select>
                                                    </div>
                                                )}
                                                <label className="block mb-1 font-medium text-gray-600">{field.label}</label>
                                                <input
                                                    type={field.type}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
                                                    value={formData.details[field.name] || ''}
                                                    onChange={e => setFormData({
                                                        ...formData,
                                                        details: { ...formData.details, [field.name]: e.target.value },
                                                    })}
                                                />
                                            </div>
                                        );
                                    }

                                    // Special currency-select type: render a currency dropdown bound to formData.currency
                                    if (field.type === 'currency-select') {
                                        return (
                                            <div key={field.name} className="mb-2">
                                                <label className="block mb-1 font-medium text-gray-600">{field.label}</label>
                                                <select
                                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
                                                    value={formData.currency}
                                                    onChange={e => setFormData({ ...formData, currency: e.target.value })}
                                                >
                                                    {currencies.length === 0 ? (
                                                        <option value="">Loading...</option>
                                                    ) : (
                                                        currencies.map((currency) => (
                                                            <option key={currency.code} value={currency.code}>{currency.code} - {currency.name}</option>
                                                        ))
                                                    )}
                                                </select>
                                            </div>
                                        );
                                    }

                                    if (field.type === 'select') {
                                        return (
                                            <div key={field.name} className="mb-2">
                                                <label className="block mb-1 font-medium text-gray-600">{field.label}</label>
                                                <select
                                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
                                                    value={formData.details[field.name] || ''}
                                                    onChange={e => setFormData({
                                                        ...formData,
                                                        details: { ...formData.details, [field.name]: e.target.value },
                                                    })}
                                                >
                                                    <option value="">Select {field.label}</option>
                                                    {field.options && field.options.map((opt: string) => (
                                                        <option key={opt} value={opt}>{opt}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        );
                                    }
                                    if (field.type === 'textarea') {
                                        return (
                                            <div key={field.name} className="mb-2">
                                                <label className="block mb-1 font-medium text-gray-600">{field.label}</label>
                                                <textarea
                                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
                                                    value={formData.details[field.name] || ''}
                                                    onChange={e => setFormData({
                                                        ...formData,
                                                        details: { ...formData.details, [field.name]: e.target.value },
                                                    })}
                                                />
                                            </div>
                                        );
                                    }
                                    // Default to text/number
                                    return (
                                        <div key={field.name} className="mb-2">
                                            <label className="block mb-1 font-medium text-gray-600">{field.label}</label>
                                            <input
                                                type={field.type}
                                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
                                                value={formData.details[field.name] || ''}
                                                onChange={e => setFormData({
                                                    ...formData,
                                                    details: { ...formData.details, [field.name]: e.target.value },
                                                })}
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}


                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={submitting}
                        className={`w-full py-3 ${submitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} text-white font-bold rounded-lg shadow transition`}
                    >
                        {submitting ? (editingAdId ? 'Saving...' : 'Posting...') : (editingAdId ? 'Update Ad' : 'Submit Ad')}
                    </button>
                </form>
            </div>
        </>
    );
}