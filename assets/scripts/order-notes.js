/**
 * Order Notes Container Scrolling Functionality
 * This script makes the order-notes-container scrollable with a dynamic height
 * based on the visible area in the window.
 */

document.addEventListener('DOMContentLoaded', function() {
    // Function to calculate and set the height of order notes container
    function setOrderNotesHeight() {
        const orderNotesContainer = document.querySelector('.order-notes-container');
        
        if (orderNotesContainer) {
            // Get the viewport height
            const viewportHeight = window.innerHeight;
            
            // Get container's position from the top of the document
            const containerRect = orderNotesContainer.getBoundingClientRect();
            const containerTop = containerRect.top;
            
            // Calculate available height (viewport height minus container's top position minus bottom padding)
            const bottomPadding = 40; // Space at the bottom of the viewport
            const availableHeight = viewportHeight - containerTop - bottomPadding;
            
            // Set minimum height to ensure usability
            const minHeight = 300; 
            
            // Apply the calculated height, but not less than minimum
            const finalHeight = Math.max(availableHeight, minHeight);
            
            // Apply the height to the container
            orderNotesContainer.style.height = finalHeight + 'px';
            orderNotesContainer.style.overflowY = 'auto';
        }
    }
    
    // Call the function on page load
    setOrderNotesHeight();
    
    // Recalculate on window resize
    window.addEventListener('resize', setOrderNotesHeight);
    
    // Also recalculate when tab content changes, as this may affect positioning
    const tabLinks = document.querySelectorAll('.tab');
    if (tabLinks.length > 0) {
        tabLinks.forEach(tab => {
            tab.addEventListener('click', function() {
                // Use setTimeout to allow the DOM to update first
                setTimeout(setOrderNotesHeight, 100);
            });
        });
    }
});
