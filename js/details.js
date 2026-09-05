document.addEventListener("DOMContentLoaded", () => {
    // 1. Extract the 'id' parameter from the URL query string
    const urlParams = new URLSearchParams(window.location.search);
    const propertyId = urlParams.get('id');

    // 2. Validate that propertyData exists (from js/data.js)
    if (!window.propertyData) {
        console.error("Property data not loaded. Make sure js/data.js is linked first.");
        return;
    }

    // 3. Find matching property item (convert ID string to Number if needed)
    const property = window.propertyData.find(item => item.id == propertyId) || window.propertyData[0];

    if (property) {
        renderPropertyDetails(property);
    }
});

function renderPropertyDetails(data) {
    // Target element IDs inside details.html
    const titleEl = document.getElementById('detailTitle');
    const priceEl = document.getElementById('detailPrice');
    const locationEl = document.getElementById('detailLocation');
    const imageEl = document.getElementById('detailImage');
    const descEl = document.getElementById('detailDescription');
    const ownerEl = document.getElementById('detailOwner');

    if (titleEl) titleEl.innerText = data.type || data.name;
    if (priceEl) priceEl.innerText = `₹${data.price} / month`;
    if (locationEl) locationEl.innerText = `📍 ${data.location}`;
    if (imageEl) imageEl.src = data.image;
    if (descEl) descEl.innerText = data.facilities || "No facilities listed.";
    if (ownerEl) ownerEl.innerText = `Owner: ${data.owner}`;
}