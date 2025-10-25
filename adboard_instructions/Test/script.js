// Ad Data from Prothom Alo Media Kit
const adPlacements = [
    // HOME PAGE ADS
    {
        id: 'home-t1',
        name: 'T1 Position',
        category: 'home',
        type: 'Banner',
        platform: 'desktop',
        dimensions: '970x90 px',
        format: 'Image/HTML5',
        cpmLocal: '75 BDT',
        cpmInternational: '100 BDT',
        position: 'Top Banner - Super Premium',
        description: 'Main header banner on homepage'
    },
    {
        id: 'home-r1',
        name: 'R1 Position',
        category: 'home',
        type: 'Rectangle',
        platform: 'desktop',
        dimensions: '300x250 px',
        format: 'Image/HTML5',
        cpmLocal: 'Various',
        cpmInternational: 'Various',
        position: 'Right Sidebar Position 1',
        description: 'First position in right sidebar'
    },

    // ARTICLE PAGE ADS
    {
        id: 'article-t1',
        name: 'Article T1 Position',
        category: 'article',
        type: 'Banner',
        platform: 'desktop',
        dimensions: '970x90 px',
        format: 'Image/HTML5',
        cpmLocal: '75 BDT',
        cpmInternational: '100 BDT',
        position: 'Top of Article - Super Premium',
        description: 'Header banner on article pages'
    },
    {
        id: 'article-in-article1',
        name: 'In Article 1',
        category: 'article',
        type: 'Banner',
        platform: 'desktop',
        dimensions: '970x250 or 970x90 px',
        format: 'Image/HTML5',
        cpmLocal: '75 BDT',
        cpmInternational: '100 BDT',
        position: 'Within Article Content - Position 1',
        description: 'First inline banner within article content'
    },

    // RICH MEDIA ADS
    {
        id: 'interstitial',
        name: 'Interstitial Ad',
        category: 'rich-media',
        type: 'Pop-up',
        platform: 'both',
        dimensions: '660x440 & 320x480 px',
        format: 'Image/HTML5',
        pricing: '15,000 BDT/hour',
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
        description: 'Video ad within article content'
    },
    {
        id: 'page-takeover',
        name: 'Page Take Over',
        category: 'rich-media',
        type: 'Interactive',
        platform: 'both',
        dimensions: 'Full Page',
        format: 'HTML5',
        pricing: '15,000 BDT/hour',
        description: 'Complete page takeover with frequency capping'
    },

    // FACEBOOK ADS
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

    // CONTENT MARKETING
    {
        id: 'product-launch',
        name: 'Product Launching',
        category: 'content',
        type: 'Multi-platform',
        platform: 'both',
        format: 'Video + Article + Social',
        components: 'FB Live + Review + Feature Article',
        description: 'Complete product launch package'
    },
    {
        id: 'advertorial',
        name: 'Advertorial Campaign',
        category: 'content',
        type: 'Content',
        platform: 'both',
        format: 'Article + Banners',
        reach: '1+ million per advertorial',
        description: 'Editorial-style sponsored content'
    }
];

// File requirements for each ad type
const fileRequirements = {
    'Image/HTML5': 'Supported formats: JPG, PNG, GIF, HTML5. Max size: 2MB',
    'MP4 Video': 'Format: MP4, Max size: 1MB, Duration: 15-30 seconds',
    'HTML5': 'HTML5 package with all assets. Max size: 5MB',
    'Image + Text': 'High-quality image with brand text. JPG/PNG format',
    'Video + Branding': 'MP4 video with brand elements. Max 5 minutes',
    'Video + Article + Social': 'Video file and article content package'
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

    filteredAds.forEach(ad => {
        const adCard = createAdCard(ad);
        grid.appendChild(adCard);
    });
}

function createAdCard(ad) {
    const card = document.createElement('div');
    card.className = `ad-card platform-${ad.platform}`;
    
    card.innerHTML = `
        <div class="ad-header">
            <div class="ad-name">${ad.name}</div>
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
            
            ${ad.cpmLocal ? `
            <div class="cpm-price">
                CPM: ${ad.cpmLocal} ${ad.cpmInternational ? `| Int'l: ${ad.cpmInternational}` : ''}
            </div>
            ` : ''}
            
            ${ad.pricing ? `
            <div class="detail-item">
                <span class="detail-label">Pricing:</span>
                <span class="detail-value">${ad.pricing}</span>
            </div>
            ` : ''}
            
            <div class="detail-item">
                <span class="detail-label">Description:</span>
                <span class="detail-value">${ad.description}</span>
            </div>
        </div>
        
        <button class="upload-btn" onclick="openUploadModal('${ad.id}')">
            Upload Creative
        </button>
    `;
    
    return card;
}

function getPlatformDisplay(platform) {
    const platforms = {
        'desktop': 'Desktop Only',
        'mobile': 'Mobile Only',
        'both': 'Desktop & Mobile',
        'facebook': 'Facebook Platform'
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
        <h4>${ad.name}</h4>
        <p><strong>Format:</strong> ${ad.format}</p>
        <p><strong>Platform:</strong> ${getPlatformDisplay(ad.platform)}</p>
        ${ad.dimensions ? `<p><strong>Dimensions:</strong> ${ad.dimensions}</p>` : ''}
    `;

    fileReq.textContent = fileRequirements[ad.format] || 'Please upload appropriate creative files';

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
    
    if (fileInput.files.length > 0) {
        const ad = adPlacements.find(a => a.id === currentAdId);
        alert(`Creative uploaded successfully for ${ad.name}!`);
        closeModal();
        
        // Here you would typically send the file to a server
        // For demo purposes, we just show an alert
    } else {
        alert('Please select a file to upload');
    }
});

// File preview
document.getElementById('adImage').addEventListener('change', function(e) {
    const preview = document.getElementById('uploadPreview');
    preview.innerHTML = '';
    
    Array.from(e.target.files).forEach(file => {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const img = document.createElement('img');
                img.src = e.target.result;
                img.style.maxWidth = '200px';
                img.style.margin = '10px';
                preview.appendChild(img);
            };
            reader.readAsDataURL(file);
        } else {
            const fileInfo = document.createElement('p');
            fileInfo.textContent = `File: ${file.name} (${file.type})`;
            preview.appendChild(fileInfo);
        }
    });
});