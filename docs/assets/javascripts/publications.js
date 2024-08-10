// Global Vars
const dataPath = 'assets/javascripts/publications.json'


// Extracts data from the file
function getData(url) {
    return fetch(url)
        .then(response => response.json())
        .catch(error => console.error('Error fetching data:', error));
}

// Generates the first elements
function createGalleryElement(item) {
  const galleryItem = document.createElement('div');
  galleryItem.className = 'gallery-item card'; // Added 'card' class for styling

  const img = document.createElement('img');
  img.src = item.image;
  img.alt = item.title;

  const title = document.createElement('h3');
  title.textContent = item.title;

  const link = document.createElement('a');
  link.href = item.link;
  link.appendChild(title);

  galleryItem.appendChild(img);
  galleryItem.appendChild(link);

  return galleryItem;
}

// Function to fetch JSON data and store it in a variable
getData(dataPath).then(data => {
  if (data && Array.isArray(data)) {
    console.lo
  }
});
