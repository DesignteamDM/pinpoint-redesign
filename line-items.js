document.addEventListener('DOMContentLoaded', function() {
    // Get all the necessary elements
    const selectAllCheckbox = document.getElementById('selectAllItems');
    const itemCheckboxes = document.querySelectorAll('.item-checkbox');
    const deleteAllBtn = document.getElementById('deleteAllBtn');
    
    // Function to update the select all checkbox state
    function updateSelectAllCheckbox() {
        const allChecked = Array.from(itemCheckboxes).every(checkbox => checkbox.checked);
        selectAllCheckbox.checked = allChecked;
        
        // Show/hide delete all button based on selection
        const anyChecked = Array.from(itemCheckboxes).some(checkbox => checkbox.checked);
        deleteAllBtn.style.display = anyChecked ? 'inline-flex' : 'none';
    }
    
    // Add event listener to the select all checkbox
    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', function() {
            const isChecked = this.checked;
            itemCheckboxes.forEach(checkbox => {
                checkbox.checked = isChecked;
            });
            
            // Update delete all button visibility
            deleteAllBtn.style.display = isChecked ? 'inline-flex' : 'none';
        });
    }
    
    // Add event listeners to individual checkboxes
    itemCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateSelectAllCheckbox);
    });
    
    // Add event listener to delete all button
    if (deleteAllBtn) {
        deleteAllBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get all checked checkboxes
            const checkedItems = Array.from(itemCheckboxes).filter(checkbox => checkbox.checked);
            
            if (checkedItems.length === 0) {
                alert('Please select at least one item to delete.');
                return;
            }
            
            // Confirm before deletion
            if (confirm(`Are you sure you want to delete ${checkedItems.length} selected item(s)?`)) {
                // Here you would typically make an API call to delete the items
                // For now, we'll just remove the rows from the DOM
                checkedItems.forEach(checkbox => {
                    const row = checkbox.closest('tr.main-item');
                    if (row) {
                        // Also remove any associated size variations or specification items
                        const nextRow = row.nextElementSibling;
                        if (nextRow && (nextRow.classList.contains('size-variations') || 
                                      nextRow.classList.contains('specification-item'))) {
                            nextRow.remove();
                        }
                        row.remove();
                    }
                });
                
                // Update the select all checkbox and hide delete button
                selectAllCheckbox.checked = false;
                deleteAllBtn.style.display = 'none';
                
                // Show a success message
                alert(`${checkedItems.length} item(s) have been deleted.`);
            }
        });
    }
});
