// Global Vars
const dataPath = '/assets/publications.json'; // Use absolute path

// Fetch JSON data and return the items array
async function fetchPublications() {
  try {
    const response = await fetch(dataPath);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    if (!data || !Array.isArray(data.items)) {
      throw new Error('Invalid publications.json format: missing items[]');
    }
    return data.items;
  } catch (error) {
    console.error('Error fetching publications:', error);
    return [];
  }
}

// Build a gallery card element
function createGalleryElement(item) {
  const galleryItem = document.createElement('a');
  galleryItem.className = 'gallery-item card';
  galleryItem.href = item.link;

  const img = document.createElement('img');
  img.src = item.thumbnail;
  img.alt = item.title || '';

  const title = document.createElement('h3');
  title.textContent = item.title || '';

  galleryItem.appendChild(img);
  galleryItem.appendChild(title);

  return galleryItem;
}

async function mainFunction() {
  const publicationsList = document.getElementById('publicationsList');
  if (!publicationsList) {
    // Not on a page that renders the publications list; no-op
    return;
  }

  const items = await fetchPublications();
  // Sort by date descending (newest first); invalid dates go last
  const sortedPublications = items.sort((a, b) => {
    const da = new Date(a && a.date ? a.date : 0);
    const db = new Date(b && b.date ? b.date : 0);
    return db - da;
  });

  sortedPublications.forEach((publication) => {
    const galleryElement = createGalleryElement(publication);
    publicationsList.appendChild(galleryElement);
  });
}

mainFunction();
