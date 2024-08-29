// Global Vars  
const dataPath = 'publications.json'  
  
// Function to fetch JSON data from the specified URL  
async function fetchPublications() {  
  try {  
   const response = await fetch('/assets/publications.json');  
  
   // Check if the response status is OK (status code 200-299)  
   if (!response.ok) {  
    throw new Error(`HTTP error! Status: ${response.status}`);  
   }  
  
   const publications = await response.json(); // Parse JSON data  
   console.log(publications); // Log JSON data for debugging purposes  
   return publications;  
  } catch (error) {  
   console.error('Error fetching publications:', error);  
  }  
}  
  
// Generates the first elements  
function createGalleryElement(item) {  
  console.log(`creating: ${item}`)  
  const galleryItem = document.createElement('a');  
  galleryItem.className = 'gallery-item card'; // Added 'card' class for styling
  galleryItem.href = item.link; 
  
  const img = document.createElement('img');  
  img.src = item.thumbnail;  
  img.alt = item.title;  
  
  const title = document.createElement('h3');  
  title.textContent = item.title;  
  
  // const link = document.createElement('a');  
  // link.href = item.link;  
  // link.appendChild(title);  
  
  galleryItem.appendChild(img);  
  galleryItem.appendChild(title);  
  
  return galleryItem;  
}  
  
async function mainFunction(){  
  const publications = await fetchPublications();  
  const sortedPublications = publications.sort((a, b) => {  
   return new Date(b.date) - new Date(a.date);  
  });  
  const publicationsList = document.getElementById('publicationsList');  
  sortedPublications.forEach(publication => {  
   const galleryElement = createGalleryElement(publication);  
   publicationsList.appendChild(galleryElement);  
  });  
}  
  
mainFunction();
