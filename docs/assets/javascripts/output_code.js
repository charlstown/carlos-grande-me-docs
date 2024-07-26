function detectOutputs () {
    // Initialize an array to hold the matching div elements
    let matchingDivs = [];

    // Select all div elements with the class 'highlight'
    let divs = document.querySelectorAll('div.highlight');

    // Iterate over the selected div elements
    divs.forEach(div => {
    // Find the span with the class 'filename' inside the current div
    let span = div.querySelector('span.filename');
    
    // Check if the span exists and its text content is 'Output'
    if (span && span.textContent.trim().toLowerCase() === 'output') {
        // Add the div to the array of matching divs
        matchingDivs.push(div);
    }
    });

    return matchingDivs;
}

function addClass (elementsList) {
    elementsList.forEach(div => {
        div.classList.add('output-code');
      });
}

function mainCodeOutput () {
    const detectedDivs = detectOutputs();
    addClass(detectedDivs);
}

mainCodeOutput();