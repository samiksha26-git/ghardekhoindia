// LocalStorage Saved Properties Handling
let savedIds = JSON.parse(localStorage.getItem('ghar_saved')) || [];

function updateSavedCounter() {
  const savedElem = document.getElementById('savedCount');
  if (savedElem) {
    savedElem.innerText = `Saved: ${savedIds.length}`;
  }
}

function toggleSave(id) {
  if (savedIds.includes(id)) {
    savedIds = savedIds.filter(item => item !== id);
  } else {
    savedIds.push(id);
  }
  localStorage.setItem('ghar_saved', JSON.stringify(savedIds));
  updateSavedCounter();
  executeFilter();
}

// Render Engine for Property Cards
function renderListings(items) {
  const container = document.getElementById('propertiesContainer');
  const titleElem = document.getElementById('resultTitle');
  
  if (titleElem) {
    titleElem.innerText = `Showing ${items.length} Properties Across India`;
  }
  
  if (!container) return;

  if (items.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 3rem; background: #fff; border-radius: 8px;">
        <h3>No properties match your exact search criteria</h3>
        <p style="color: var(--gray); margin-top: 0.5rem;">Try searching for a different city or clearing your filters.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = items.map(p => {
    const isLiked = savedIds.includes(p.id);
    return `
      <div class="card">
        <div class="card-img-wrap">
          <img src="${p.images[0]}" alt="${p.title}" loading="lazy">
          <span class="tier-tag">${p.tier}</span>
          <button class="like-btn ${isLiked ? 'liked' : ''}" onclick="toggleSave('${p.id}')">
            ${isLiked ? '❤️' : '🤍'}
          </button>
        </div>
        <div class="card-body">
          <div class="price">₹${p.rent.toLocaleString('en-IN')} <span>/ month</span></div>
          <div class="title">
            <a href="property-detail.html?id=${p.id}" style="text-decoration:none; color:inherit;">${p.title}</a>
          </div>
          <div class="location">📍 ${p.address}</div>
          
          <div class="badges">
            <span class="badge">Type: ${p.propertyType}</span>
            <span class="badge">For: ${p.tenantPreference}</span>
          </div>

          <div style="font-size: 0.8rem; color: #444; margin-bottom: 0.5rem;">
            <strong>Facilities:</strong> ${p.facilities.join(', ')}
          </div>
        </div>
        <div class="owner-box">
          <div>
            <div><strong>Owner:</strong> ${p.ownerName}</div>
          </div>
          <a href="property-detail.html?id=${p.id}" class="btn-contact">View Details</a>
        </div>
      </div>
    `;
  }).join('');
}

// Multi-Parameter Search Function
function executeFilter() {
  const searchInput = document.getElementById('searchInput');
  const typeFilter = document.getElementById('typeFilter');
  const tierFilter = document.getElementById('tierFilter');
  const tenantFilter = document.getElementById('tenantFilter');

  if (!searchInput) return;

  const searchVal = searchInput.value.toLowerCase().trim();
  const selectedType = typeFilter ? typeFilter.value : 'ALL';
  const selectedTier = tierFilter ? tierFilter.value : 'ALL';
  const selectedTenant = tenantFilter ? tenantFilter.value : 'ALL';

  const filtered = propertiesData.filter(item => {
    const matchesQuery = searchVal === "" || 
      item.city.toLowerCase().includes(searchVal) || 
      item.locality.toLowerCase().includes(searchVal) ||
      item.state.toLowerCase().includes(searchVal) ||
      item.title.toLowerCase().includes(searchVal);
      
    const matchesType = selectedType === "ALL" || item.propertyType === selectedType;
    const matchesTier = selectedTier === "ALL" || item.tier === selectedTier;
    const matchesTenant = selectedTenant === "ALL" || item.tenantPreference === selectedTenant;

    return matchesQuery && matchesType && matchesTier && matchesTenant;
  });

  renderListings(filtered);
}

// Read URL parameters when coming from index.html
function applyUrlParams() {
  const urlParams = new URLSearchParams(window.location.search);
  const searchParam = urlParams.get('search');
  const typeParam = urlParams.get('type');

  const searchInput = document.getElementById('searchInput');
  const typeFilter = document.getElementById('typeFilter');

  if (searchParam && searchInput) {
    searchInput.value = decodeURIComponent(searchParam);
  }

  if (typeParam && typeFilter) {
    typeFilter.value = decodeURIComponent(typeParam);
  }
}

// Initial Load
document.addEventListener('DOMContentLoaded', () => {
  updateSavedCounter();
  applyUrlParams();
  executeFilter();
});