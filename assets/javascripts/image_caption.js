function addCaption () {
    // Get all images
    const images = document.querySelectorAll('.image-caption');

    // Convert to array
    const imagesArray = Array.from(images);

    // Create the caption element
    imagesArray.forEach(createCaption);
}


function createCaption (imageElement) {
    // Create de Element in the document
    const newDiv = document.createElement('div');
    const parentDiv = document.createElement('div');

    // Get the text of the element
    const captionText = imageElement.alt;

    // Add properties
    parentDiv.className = 'parent-caption';

    newDiv.className = 'caption';
    newDiv.textContent = captionText;

    //Insert parent div element before the image
    imageElement.parentNode.insertBefore(parentDiv, imageElement);

    // Move the existing elements into the parent element
    parentDiv.appendChild(imageElement);
    parentDiv.appendChild(newDiv);
}

addCaption()