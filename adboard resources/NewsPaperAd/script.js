// Complete Ad Placements from Prothom Alo Media Kit (Pages 4-5)
const adPlacements = [
    // HOME PAGE ADS - DESKTOP (from Page 4)
    {
        id: 'home-t1',
        name: 'T1 Position',
        category: 'home',
        type: 'Super Premium Banner',
        platform: 'desktop',
        dimensions: '970x90 px',
        format: 'Image/HTML5',
        cpmLocal: '75 BDT',
        cpmInternational: '100 BDT',
        position: 'Top Header - Super Premium',
        description: 'Premium header banner on homepage with maximum visibility'
    },
    {
        id: 'home-r1',
        name: 'R1 Position',
        category: 'home',
        type: 'Standard Rectangle',
        platform: 'desktop',
        dimensions: '300x250 px',
        format: 'Image/HTML5',
        cpmLocal: '75 BDT',
        cpmInternational: '100 BDT',
        position: 'Right Sidebar Position 1',
        description: 'First position in right sidebar on homepage'
    },
    {
        id: 'home-b1',
        name: 'B1 Position',
        category: 'home',
        type: 'Bottom Banner',
        platform: 'desktop',
        dimensions: '970x250 px or 970x90 px',
        format: 'Image/HTML5',
        cpmLocal: '60 BDT',
        cpmInternational: '80 BDT',
        position: 'Bottom Banner Position 1',
        description: 'First bottom banner position on homepage'
    },
    {
        id: 'home-r2',
        name: 'R2 Position',
        category: 'home',
        type: 'Standard Rectangle',
        platform: 'desktop',
        dimensions: '300x250 px',
        format: 'Image/HTML5',
        cpmLocal: '60 BDT',
        cpmInternational: '80 BDT',
        position: 'Right Sidebar Position 2',
        description: 'Second position in right sidebar on homepage'
    },
    {
        id: 'home-b2',
        name: 'B2 Position',
        category: 'home',
        type: 'Bottom Banner',
        platform: 'desktop',
        dimensions: '970x250 px or 970x90 px',
        format: 'Image/HTML5',
        cpmLocal: '50 BDT',
        cpmInternational: '70 BDT',
        position: 'Bottom Banner Position 2',
        description: 'Second bottom banner position on homepage'
    },
    {
        id: 'home-r3',
        name: 'R3 Position',
        category: 'home',
        type: 'Standard Rectangle',
        platform: 'desktop',
        dimensions: '300x250 px',
        format: 'Image/HTML5',
        cpmLocal: '50 BDT',
        cpmInternational: '70 BDT',
        position: 'Right Sidebar Position 3',
        description: 'Third position in right sidebar on homepage'
    },
    {
        id: 'home-sticky',
        name: 'Sticky Ad',
        category: 'home',
        type: 'Sticky Banner',
        platform: 'desktop',
        dimensions: '970x90 px or 728x90 px',
        format: 'Image/HTML5',
        cpmLocal: '75 BDT',
        description: 'Sticky banner that remains visible while scrolling on desktop'
    },

    // HOME PAGE ADS - MOBILE (from Page 4)
    {
        id: 'home-mobile-t1',
        name: 'T1 Position (Mobile)',
        category: 'home',
        type: 'Mobile Banner',
        platform: 'mobile',
        dimensions: '300x100 px',
        format: 'Image/HTML5',
        cpmLocal: '75 BDT',
        cpmInternational: '100 BDT',
        position: 'Top Mobile Banner',
        description: 'Top banner on mobile homepage'
    },
    {
        id: 'home-mobile-r1',
        name: 'R1 Position (Mobile)',
        category: 'home',
        type: 'Mobile Rectangle',
        platform: 'mobile',
        dimensions: '300x250 px',
        format: 'Image/HTML5',
        cpmLocal: '75 BDT',
        cpmInternational: '100 BDT',
        position: 'Mobile Rectangle Position 1',
        description: 'First rectangle position on mobile homepage'
    },
    {
        id: 'home-mobile-b1',
        name: 'B1 Position (Mobile)',
        category: 'home',
        type: 'Mobile Banner',
        platform: 'mobile',
        dimensions: '300x250 px',
        format: 'Image/HTML5',
        cpmLocal: '60 BDT',
        cpmInternational: '80 BDT',
        position: 'Bottom Mobile Banner 1',
        description: 'First bottom banner on mobile homepage'
    },
    {
        id: 'home-mobile-r2',
        name: 'R2 Position (Mobile)',
        category: 'home',
        type: 'Mobile Rectangle',
        platform: 'mobile',
        dimensions: '300x250 px',
        format: 'Image/HTML5',
        cpmLocal: '60 BDT',
        cpmInternational: '80 BDT',
        position: 'Mobile Rectangle Position 2',
        description: 'Second rectangle position on mobile homepage'
    },
    {
        id: 'home-mobile-b2',
        name: 'B2 Position (Mobile)',
        category: 'home',
        type: 'Mobile Banner',
        platform: 'mobile',
        dimensions: '300x250 px',
        format: 'Image/HTML5',
        cpmLocal: '50 BDT',
        cpmInternational: '70 BDT',
        position: 'Bottom Mobile Banner 2',
        description: 'Second bottom banner on mobile homepage'
    },
    {
        id: 'home-mobile-r3',
        name: 'R3 Position (Mobile)',
        category: 'home',
        type: 'Mobile Rectangle',
        platform: 'mobile',
        dimensions: '300x250 px',
        format: 'Image/HTML5',
        cpmLocal: '50 BDT',
        cpmInternational: '70 BDT',
        position: 'Mobile Rectangle Position 3',
        description: 'Third rectangle position on mobile homepage'
    },
    {
        id: 'home-mobile-anchor',
        name: 'Anchor Ad (Mobile)',
        category: 'home',
        type: 'Anchor Banner',
        platform: 'mobile',
        dimensions: '360x60 px',
        format: 'Image/HTML5',
        cpmLocal: 'Various',
        position: 'Mobile Anchor',
        description: 'Anchor ad that stays at bottom on mobile'
    },

    // ARTICLE PAGE ADS - DESKTOP (from Page 5)
    {
        id: 'article-t1',
        name: 'T1 Position',
        category: 'article',
        type: 'Super Premium Banner',
        platform: 'desktop',
        dimensions: '970x90 px',
        format: 'Image/HTML5',
        cpmLocal: '75 BDT',
        cpmInternational: '100 BDT',
        position: 'Top of Article - Super Premium',
        description: 'Header banner on article pages'
    },
    {
        id: 'article-r1',
        name: 'R1 Position',
        category: 'article',
        type: 'Standard Rectangle',
        platform: 'desktop',
        dimensions: '300x250 px',
        format: 'Image/HTML5',
        cpmLocal: '75 BDT',
        cpmInternational: '100 BDT',
        position: 'Right Sidebar Position 1',
        description: 'First position in right sidebar on article pages'
    },
    {
        id: 'article-in-article1',
        name: 'In Article Position 1',
        category: 'article',
        type: 'Inline Banner',
        platform: 'desktop',
        dimensions: '970x250 or 970x90 px',
        format: 'Image/HTML5',
        cpmLocal: '60 BDT',
        cpmInternational: '80 BDT',
        position: 'Within Article Content - Position 1',
        description: 'First inline banner within article content'
    },
    {
        id: 'article-b2',
        name: 'B2 Position',
        category: 'article',
        type: 'Bottom Banner',
        platform: 'desktop',
        dimensions: '970x250 or 970x90 px',
        format: 'Image/HTML5',
        cpmLocal: '50 BDT',
        cpmInternational: '70 BDT',
        position: 'Bottom Article Banner',
        description: 'Bottom banner on article pages'
    },
    {
        id: 'article-sticky',
        name: 'Sticky Ad',
        category: 'article',
        type: 'Sticky Banner',
        platform: 'desktop',
        dimensions: '970x90 or 728x90 px',
        format: 'Image/HTML5',
        cpmLocal: '75 BDT',
        description: 'Sticky banner that remains visible while scrolling on article pages'
    },

    // ARTICLE PAGE ADS - MOBILE (from Page 5)
    {
        id: 'article-mobile-t1',
        name: 'T1 Position (Mobile)',
        category: 'article',
        type: 'Super Premium Banner',
        platform: 'mobile',
        dimensions: '320x50 px',
        format: 'Image/HTML5',
        cpmLocal: '75 BDT',
        cpmInternational: '100 BDT',
        position: 'Top Mobile Article - Super Premium',
        description: 'Top banner on mobile article pages - Super Premium Position'
    },
    {
        id: 'article-mobile-r1',
        name: 'R1 Position (Mobile)',
        category: 'article',
        type: 'Mobile Rectangle',
        platform: 'mobile',
        dimensions: '300x250 px',
        format: 'Image/HTML5',
        cpmLocal: '75 BDT',
        cpmInternational: '100 BDT',
        position: 'Mobile Rectangle Position 1',
        description: 'First rectangle position on mobile article pages'
    },
    {
        id: 'article-mobile-in-article1',
        name: 'In Article Position 1 (Mobile)',
        category: 'article',
        type: 'Inline Banner',
        platform: 'mobile',
        dimensions: '300x250 px',
        format: 'Image/HTML5',
        cpmLocal: '60 BDT',
        cpmInternational: '80 BDT',
        position: 'Within Mobile Article - Position 1',
        description: 'First inline banner within mobile article content'
    },
    {
        id: 'article-mobile-r2',
        name: 'R2 Position (Mobile)',
        category: 'article',
        type: 'Mobile Rectangle',
        platform: 'mobile',
        dimensions: '300x250 px',
        format: 'Image/HTML5',
        cpmLocal: '60 BDT',
        cpmInternational: '80 BDT',
        position: 'Mobile Rectangle Position 2',
        description: 'Second rectangle position on mobile article pages - Same rate as In Article Position 1'
    },
    {
        id: 'article-mobile-b2',
        name: 'B2 Position (Mobile)',
        category: 'article',
        type: 'Bottom Banner',
        platform: 'mobile',
        dimensions: '320x100 px',
        format: 'Image/HTML5',
        cpmLocal: '50 BDT',
        cpmInternational: '70 BDT',
        position: 'Bottom Mobile Article Banner',
        description: 'Bottom banner on mobile article pages'
    },
    {
        id: 'article-mobile-anchor',
        name: 'Anchor Ad (Mobile)',
        category: 'article',
        type: 'Anchor Banner',
        platform: 'mobile',
        dimensions: '360x60 px',
        format: 'Image/HTML5',
        cpmLocal: '75 BDT',
        position: 'Mobile Article Anchor',
        description: 'Anchor ad that stays at bottom on mobile article pages'
    },

    // RICH MEDIA ADS (from Pages 6-12)
    {
        id: 'interstitial',
        name: 'Interstitial Ad',
        category: 'rich-media',
        type: 'Pop-up',
        platform: 'both',
        dimensions: '660x440 & 320x480 px',
        format: 'Image/HTML5',
        pricing: '15,000 BDT/hour',
        requirements: 'Minimum 4 hours, 2 frequency capping per user',
        description: 'Full-screen ad between page transitions'
    },
    {
        id: 'outstream-video',
        name: 'Outstream Video Ad',
        category: 'rich-media',
        type: 'Video',
        platform: 'both',
        dimensions: 'Various',
        format: 'MP4 Video (Below 1MB)',
        cpmLocal: '200 BDT',
        description: 'Video ad within article content, CPM basis'
    },
    {
        id: 'page-takeover',
        name: 'Page Take Over',
        category: 'rich-media',
        type: 'Interactive',
        platform: 'both',
        dimensions: 'Full Page',
        format: 'HTML5',
        pricing: '15,000 BDT/hour + 50,000 BDT creative cost',
        requirements: 'Minimum 4 hours, 2 frequency capping',
        description: 'Complete page takeover with custom HTML5 creative'
    },

    // FACEBOOK ADS (from Pages 13-14)
    {
        id: 'fb-live',
        name: 'Facebook Live Show',
        category: 'facebook',
        type: 'Video Live',
        platform: 'facebook',
        dimensions: 'Live Video',
        format: 'Video + Branding',
        pricing: 'Custom Pricing',
        description: 'Sponsored live show with brand integration'
    },
    {
        id: 'fb-gpi',
        name: 'Facebook GPI',
        category: 'facebook',
        type: 'Image Post',
        platform: 'facebook',
        dimensions: 'Facebook Post',
        format: 'Image + Text',
        requirements: 'Minimum 20 posts',
        description: 'Branded image posts with targeting'
    },

    // CONTENT MARKETING (from Pages 15-17)
    {
        id: 'product-launch',
        name: 'Product Launching',
        category: 'content',
        type: 'Multi-platform',
        platform: 'both',
        format: 'Video + Article + Social',
        components: 'FB Live + Review + Feature Article',
        description: 'Complete product launch package across platforms'
    },
    {
        id: 'advertorial',
        name: 'Advertorial Campaign',
        category: 'content',
        type: 'Content',
        platform: 'both',
        format: 'Article + Banners',
        reach: '1+ million per advertorial',
        description: 'Editorial-style sponsored content with social sharing'
    }
];

// File requirements for each ad type
const fileRequirements = {
    'Image/HTML5': 'Supported formats: JPG, PNG, GIF, HTML5. Max size: 2MB. For HTML5: ZIP package with all assets.',
    'MP4 Video (Below 1MB)': 'Format: MP4, Max size: 1MB, Duration: 15-30 seconds, Codec: H.264',
    'HTML5': 'HTML5 package with all assets. Creative making cost: 50,000 BDT. Max size: 5MB. Must include fallback image.',
    'Image + Text': 'High-quality image with brand text. JPG/PNG format. Max size: 2MB. Recommended: 1200x630px for Facebook.',
    'Video + Branding': 'MP4 video with brand elements. Max 5 minutes. Include branding in video content.',
    'Video + Article + Social': 'Video file (MP4, max 5MB) and article content package (Word/PDF format)',
    'Article + Banners': 'Article content (Word/PDF) + banner creatives (Image/HTML5 as specified)'
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    loadAds('all');
    setupEventListeners();
});

function loadAds(category) {
    const grid = document.getElementById('adGrid');
    grid.innerHTML = '';

    const filteredAds = category === 'all' 
        ? adPlacements 
        : adPlacements.filter(ad => ad.category === category);

    if (filteredAds.length === 0) {
        grid.innerHTML = '<div class="no-ads">No ad placements found for this category.</div>';
        return;
    }

    filteredAds.forEach(ad => {
        const adCard = createAdCard(ad);
        grid.appendChild(adCard);
    });
}

function createAdCard(ad) {
    const card = document.createElement('div');
    card.className = `ad-card platform-${ad.platform} ad-${ad.category}`;
    
    // Determine pricing display
    let pricingDisplay = '';
    if (ad.cpmLocal) {
        pricingDisplay = `
            <div class="cpm-price">
                CPM: ${ad.cpmLocal} ${ad.cpmInternational ? `| Int'l: ${ad.cpmInternational}` : ''}
            </div>
        `;
    } else if (ad.pricing) {
        pricingDisplay = `
            <div class="pricing-badge">
                ${ad.pricing}
            </div>
        `;
    }

    // Add requirements badge if exists
    const requirementsBadge = ad.requirements ? 
        `<span class="requirement-badge">Requirements</span>` : '';

    card.innerHTML = `
        <div class="ad-header">
            <div class="ad-name">${ad.name} ${requirementsBadge}</div>
            <div class="ad-type">${ad.type}</div>
        </div>
        
        <div class="ad-details">
            <div class="detail-item">
                <span class="detail-label">Platform:</span>
                <span class="detail-value">${getPlatformDisplay(ad.platform)}</span>
            </div>
            
            ${ad.dimensions ? `
            <div class="detail-item">
                <span class="detail-label">Dimensions:</span>
                <span class="detail-value">${ad.dimensions}</span>
            </div>
            ` : ''}
            
            <div class="detail-item">
                <span class="detail-label">Format:</span>
                <span class="detail-value">${ad.format}</span>
            </div>
            
            ${ad.position ? `
            <div class="detail-item">
                <span class="detail-label">Position:</span>
                <span class="detail-value">${ad.position}</span>
            </div>
            ` : ''}
            
            ${ad.reach ? `
            <div class="detail-item">
                <span class="detail-label">Reach:</span>
                <span class="detail-value">${ad.reach}</span>
            </div>
            ` : ''}
            
            ${ad.components ? `
            <div class="detail-item">
                <span class="detail-label">Components:</span>
                <span class="detail-value">${ad.components}</span>
            </div>
            ` : ''}
            
            ${pricingDisplay}
            
            ${ad.requirements ? `
            <div class="requirement-item">
                <strong>Requirements:</strong> ${ad.requirements}
            </div>
            ` : ''}
            
            <div class="detail-item full-width">
                <span class="detail-label">Description:</span>
                <span class="detail-value">${ad.description}</span>
            </div>
        </div>
        
        <button class="upload-btn" onclick="openUploadModal('${ad.id}')" aria-label="Upload creative for ${ad.name}">
            📤 Upload Creative
        </button>
    `;
    
    return card;
}

function getPlatformDisplay(platform) {
    const platforms = {
        'desktop': '🖥️ Desktop Only',
        'mobile': '📱 Mobile Only',
        'both': '🖥️📱 Desktop & Mobile',
        'facebook': '📘 Facebook Platform'
    };
    return platforms[platform] || platform;
}

function setupEventListeners() {
    // Category navigation
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            loadAds(this.dataset.category);
        });
    });

    // Modal close
    document.querySelector('.close').addEventListener('click', closeModal);
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('uploadModal');
        if (event.target === modal) {
            closeModal();
        }
    });
}

let currentAdId = '';

function openUploadModal(adId) {
    currentAdId = adId;
    const ad = adPlacements.find(a => a.id === adId);
    const modal = document.getElementById('uploadModal');
    const modalInfo = document.getElementById('modalAdInfo');
    const fileReq = document.getElementById('fileRequirements');

    modalInfo.innerHTML = `
        <div style="background: #f8f9fa; padding: 1rem; border-radius: 8px; margin-bottom: 1rem;">
            <h4 style="margin-bottom: 0.5rem; color: #2c3e50;">${ad.name}</h4>
            <p style="margin: 0.3rem 0;"><strong>Type:</strong> ${ad.type}</p>
            <p style="margin: 0.3rem 0;"><strong>Platform:</strong> ${getPlatformDisplay(ad.platform)}</p>
            <p style="margin: 0.3rem 0;"><strong>Format:</strong> ${ad.format}</p>
            ${ad.dimensions ? `<p style="margin: 0.3rem 0;"><strong>Dimensions:</strong> ${ad.dimensions}</p>` : ''}
            ${ad.cpmLocal ? `<p style="margin: 0.3rem 0;"><strong>CPM:</strong> ${ad.cpmLocal} ${ad.cpmInternational ? `(International: ${ad.cpmInternational})` : ''}</p>` : ''}
            ${ad.pricing ? `<p style="margin: 0.3rem 0;"><strong>Pricing:</strong> ${ad.pricing}</p>` : ''}
        </div>
    `;

    fileReq.textContent = fileRequirements[ad.format] || 'Please upload appropriate creative files as specified in the media kit.';

    modal.style.display = 'block';
}

function closeModal() {
    document.getElementById('uploadModal').style.display = 'none';
    document.getElementById('uploadForm').reset();
    document.getElementById('uploadPreview').innerHTML = '';
}

// Handle file upload form
document.getElementById('uploadForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const fileInput = document.getElementById('adImage');
    const ad = adPlacements.find(a => a.id === currentAdId);
    
    if (fileInput.files.length > 0) {
        // Validate file types and sizes
        const files = Array.from(fileInput.files);
        let isValid = true;
        let errorMessage = '';
        
        files.forEach(file => {
            // Basic validation based on format
            if (ad.format.includes('Image') && !file.type.startsWith('image/')) {
                isValid = false;
                errorMessage = 'Please upload image files for this ad type.';
            } else if (ad.format.includes('MP4') && !file.type.includes('video/mp4')) {
                isValid = false;
                errorMessage = 'Please upload MP4 video files for this ad type.';
            } else if (ad.format.includes('HTML5') && !file.name.endsWith('.zip')) {
                isValid = false;
                errorMessage = 'Please upload HTML5 packages as ZIP files.';
            }
            
            // Size validation
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                isValid = false;
                errorMessage = `File ${file.name} exceeds maximum size limit of 5MB.`;
            }
        });
        
        if (!isValid) {
            alert(`Upload Error: ${errorMessage}`);
            return;
        }
        
        // Simulate successful upload
        showUploadSuccess(ad.name, files);
        
    } else {
        alert('Please select a file to upload');
    }
});

function showUploadSuccess(adName, files) {
    const modal = document.getElementById('uploadModal');
    const modalContent = modal.querySelector('.modal-content');
    
    modalContent.innerHTML = `
        <span class="close" aria-label="Close modal">&times;</span>
        <div style="text-align: center; padding: 2rem;">
            <div style="font-size: 4rem; margin-bottom: 1rem;">✅</div>
            <h3 style="color: #27ae60; margin-bottom: 1rem;">Upload Successful!</h3>
            <p><strong>Ad Placement:</strong> ${adName}</p>
            <p><strong>Files Uploaded:</strong> ${files.length} file(s)</p>
            <div style="margin-top: 2rem; padding: 1rem; background: #f8f9fa; border-radius: 8px;">
                <p style="margin: 0.5rem 0;"><strong>Next Steps:</strong></p>
                <p style="margin: 0.5rem 0; font-size: 0.9rem;">1. Our team will review your creative within 24 hours</p>
                <p style="margin: 0.5rem 0; font-size: 0.9rem;">2. You will receive confirmation email</p>
                <p style="margin: 0.5rem 0; font-size: 0.9rem;">3. Campaign will go live after approval</p>
            </div>
            <button onclick="closeModal()" class="upload-btn" style="margin-top: 1.5rem; background: #27ae60;">
                👍 Got It!
            </button>
        </div>
    `;
    
    // Re-attach close event
    modalContent.querySelector('.close').addEventListener('click', closeModal);
}

// File preview functionality
document.getElementById('adImage').addEventListener('change', function(e) {
    const preview = document.getElementById('uploadPreview');
    preview.innerHTML = '';
    
    if (e.target.files.length === 0) {
        return;
    }
    
    const fileList = document.createElement('div');
    fileList.style.marginBottom = '1rem';
    
    Array.from(e.target.files).forEach((file, index) => {
        const fileItem = document.createElement('div');
        fileItem.style.display = 'flex';
        fileItem.style.alignItems = 'center';
        fileItem.style.padding = '0.5rem';
        fileItem.style.border = '1px solid #ecf0f1';
        fileItem.style.borderRadius = '5px';
        fileItem.style.marginBottom = '0.5rem';
        fileItem.style.background = '#f8f9fa';
        
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const img = document.createElement('img');
                img.src = e.target.result;
                img.style.width = '50px';
                img.style.height = '50px';
                img.style.objectFit = 'cover';
                img.style.borderRadius = '4px';
                img.style.marginRight = '1rem';
                fileItem.insertBefore(img, fileItem.firstChild);
            };
            reader.readAsDataURL(file);
        } else {
            const fileIcon = document.createElement('div');
            fileIcon.textContent = '📄';
            fileIcon.style.fontSize = '2rem';
            fileIcon.style.marginRight = '1rem';
            fileItem.appendChild(fileIcon);
        }
        
        const fileInfo = document.createElement('div');
        fileInfo.innerHTML = `
            <div style="font-weight: bold;">${file.name}</div>
            <div style="font-size: 0.8rem; color: #7f8c8d;">
                ${(file.size / 1024).toFixed(2)} KB • ${file.type || 'Unknown type'}
            </div>
        `;
        
        fileItem.appendChild(fileInfo);
        fileList.appendChild(fileItem);
    });
    
    preview.appendChild(fileList);
});

// Add keyboard accessibility
document.addEventListener('keydown', function(e) {
    const modal = document.getElementById('uploadModal');
    if (modal.style.display === 'block') {
        if (e.key === 'Escape') {
            closeModal();
        }
    }
});