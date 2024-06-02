let page = 1; // Initial page number
const limit = 5; // Number of items to load per page
let isLoading = false; // Flag to prevent multiple simultaneous requests

window.addEventListener('load', function () {
    loadPublications();
    window.addEventListener('scroll', handleScroll);
});

function loadPublications() {
    if (isLoading) return;
    isLoading = true;

    fetch('assets/javascripts/publications.js')
        .then(response => response.json())
        .then(jsonData => {
            const startIndex = (page - 1) * limit;
            const endIndex = startIndex + limit;
            const publications = jsonData.publications.slice(startIndex, endIndex);
            renderPublications(publications);
            page++;
            isLoading = false;
        })
        .catch(error => {
            console.error('Error fetching or parsing JSON file:', error);
            isLoading = false;
        });
}

function renderPublications(publications) {
    const publicationsList = document.getElementById('publicationsList');

    publications.forEach(publication => {
        const listItem = document.createElement('li');
        const image = document.createElement('img');
        const title = document.createElement('p');
        const date = document.createElement('p');

        image.src = publication.image_link;
        title.textContent = publication.title;
        date.textContent = publication.date;
        date.classList.add('date');

        listItem.appendChild(image);
        listItem.appendChild(title);
        listItem.appendChild(date);

        publicationsList.appendChild(listItem);
    });
}

function handleScroll() {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = window.scrollY;

    if (Math.ceil(scrolled) === scrollable) {
        loadPublications();
    }
}
