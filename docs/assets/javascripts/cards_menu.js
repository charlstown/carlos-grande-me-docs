document.addEventListener("DOMContentLoaded", function() {
    // Get all the <li> elements
    var menuItems = document.querySelectorAll('.cards-menu li');
    var menuItemsHover = document.querySelectorAll('.cards-menu li:hover');
    

    // Apply accent color to the first <li> element
    menuItems[0].style.color = 'var(--md-accent-fg-color)';

    // Add click event listener to each <li> element
    menuItems.forEach(function(item) {
        item.addEventListener('click', function() {
            // Reset color of all <li> elements to black
            menuItems.forEach(function(item) {
                item.style.color = 'black';
            });

            // Change color of clicked <li> to var(--md-accent-fg-color)
            this.style.color = 'var(--md-accent-fg-color)';
        });
    });
});
