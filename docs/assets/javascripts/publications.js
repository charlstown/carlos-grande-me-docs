let page = 1;
const limit = 5;
let isLoading = false;

window.addEventListener('load', function () {
    loadPublications();
    window.addEventListener('scroll', handleScroll);
});

function loadPublications() {
    if (isLoading) return;
    isLoading = true;

    fetch('https://raw.githubusercontent.com/charlstown/carlos-grande-me/main/dbs/publications.json')
        .then(response => response.json())
        .then(jsonData => {
            renderPublications(jsonData.publications);
            page++;
            isLoading = false;
        })
        .catch(error => {
            console.error('Error fetching or parsing JSON file:', error);
            isLoading = false;
        });
}

function renderPublications(publications) {
    const publicationsContainer = document.getElementById('publicationsList');
    let ul = publicationsContainer.querySelector('ul');

    if (!ul) {
        ul = document.createElement('ul');
        publicationsContainer.appendChild(ul);
    }

    publications.forEach(publication => {
        const listItem = document.createElement('li');
        const image = document.createElement('img');
        const divText = document.createElement('div');
        const title = document.createElement('h4');
        const date = document.createElement('p');

        image.src = publication.image_link;
        title.textContent = publication.title;
        date.textContent = publication.date;
        date.classList.add('date-subtitle');

        // Set the category as a data attribute
        listItem.setAttribute('data-category', publication.category);
        // listItem.setAttribute('onclick', "handleClick()");
        listItem.setAttribute('class', 'card-content');
        divText.setAttribute('class', 'card-header');

        divText.appendChild(title);
        divText.appendChild(date);

        listItem.appendChild(image);
        listItem.appendChild(divText);

        ul.appendChild(listItem);
    });
}

function handleScroll() {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = window.scrollY;

    if (Math.ceil(scrolled) === scrollable) {
        loadPublications();
    }
}
