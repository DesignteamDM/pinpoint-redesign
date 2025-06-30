// Function to handle toggle details
function setupToggleDetails() {
    document.querySelectorAll('.toggle-details').forEach(button => {
        // Remove any existing listeners to prevent duplicates
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);
        
        newButton.addEventListener('click', function(e) {
            e.stopPropagation();
            const parentRow = this.closest('tr.main-item');
            if (!parentRow) return;
            
            let nextRow = parentRow.nextElementSibling;
            let hasVisibleRows = false;
            
            // First, determine if any related rows are currently visible
            let currentNextRow = nextRow;
            while (currentNextRow && (currentNextRow.classList.contains('size-variations') || 
                                   currentNextRow.classList.contains('specification-item') ||
                                   currentNextRow.classList.contains('size-matrix'))) {
                if (currentNextRow.style.display !== 'none') {
                    hasVisibleRows = true;
                    break;
                }
                currentNextRow = currentNextRow.nextElementSibling;
            }
            
            // Toggle all related rows (size variations, etc.)
            while (nextRow && (nextRow.classList.contains('size-variations') || 
                             nextRow.classList.contains('specification-item') ||
                             nextRow.classList.contains('size-matrix'))) {
                // Toggle the display
                nextRow.style.display = hasVisibleRows ? 'none' : 'table-row';
                nextRow = nextRow.nextElementSibling;
            }
            
            // Update the toggle button text based on the new state
            this.textContent = hasVisibleRows ? '+' : '-';
        });
    });
}

document.addEventListener('DOMContentLoaded', function() {
    // Get all the necessary elements
    const selectAllCheckbox = document.getElementById('selectAllItems');
    const itemCheckboxes = document.querySelectorAll('.item-checkbox');
    const deleteAllBtn = document.getElementById('deleteAllBtn');
    
    // Initial setup of toggle details
    setupToggleDetails();
    
    // Add sorting functionality to the table headers
    const table = document.querySelector('.items-table');
    if (table) {
        const headers = table.querySelectorAll('th');
        headers.forEach((header, index) => {
            // Skip the first column (checkbox) and any columns that shouldn't be sorted
            if (index > 0 && !header.classList.contains('no-sort')) {
                header.style.cursor = 'pointer';
                header.setAttribute('title', 'Click to sort');
                
                // Add sort indicator icon
                const sortIcon = document.createElement('span');
                sortIcon.className = 'sort-icon';
                sortIcon.innerHTML = ' ↕';
                header.appendChild(sortIcon);
                
                header.addEventListener('click', () => {
                    sortTable(table, index, header);
                });
                
                // Add hover effect
                header.addEventListener('mouseenter', () => {
                    sortIcon.textContent = ' ↑↓';
                });
                
                header.addEventListener('mouseleave', () => {
                    if (!header.hasAttribute('data-sort')) {
                        sortIcon.textContent = ' ↕';
                    }
                });
            }
        });
    }
    
    // Function to collect all related rows (size variations, etc.) for a main item
    function getRelatedRows(row) {
        const related = [];
        let nextRow = row.nextElementSibling;
        while (nextRow && (nextRow.classList.contains('size-variations') || 
                          nextRow.classList.contains('specification-item') ||
                          nextRow.classList.contains('size-matrix'))) {
            related.push(nextRow);
            nextRow = nextRow.nextElementSibling;
        }
        return related;
    }

    // Function to sort the table
    function sortTable(table, column, header) {
        const tbody = table.querySelector('tbody');
        const rows = Array.from(tbody.querySelectorAll('tr.main-item'));
        const isNumeric = header.getAttribute('data-type') === 'number';
        const isDate = header.getAttribute('data-type') === 'date';
        const isAsc = header.getAttribute('data-sort') !== 'asc';
        
        // Store the expanded state of each row
        const rowsWithState = rows.map(row => ({
            element: row,
            expanded: row.nextElementSibling && 
                     (row.nextElementSibling.classList.contains('size-variations') || 
                      row.nextElementSibling.classList.contains('specification-item') ||
                      row.nextElementSibling.classList.contains('size-matrix')) &&
                     row.nextElementSibling.style.display !== 'none',
            relatedRows: getRelatedRows(row)
        }));
        
        // Reset sort indicators
        table.querySelectorAll('th').forEach(th => th.removeAttribute('data-sort'));
        
        // Set sort direction
        header.setAttribute('data-sort', isAsc ? 'asc' : 'desc');
        
        // Sort the rows
        rowsWithState.sort((a, b) => {
            // For the Total column (column 6), use the line-total-amount cell
            const aCell = column === 6 
                ? a.element.querySelector('.line-total-amount')
                : a.element.cells[column];
            const bCell = column === 6 
                ? b.element.querySelector('.line-total-amount')
                : b.element.cells[column];
                
            let aText = aCell ? aCell.textContent.trim() : '';
            let bText = bCell ? bCell.textContent.trim() : '';
            
            // For the Total column, always treat as numeric
            if (isNumeric || column === 6) {
                aText = parseFloat(aText.replace(/[^0-9.-]+/g, '')) || 0;
                bText = parseFloat(bText.replace(/[^0-9.-]+/g, '')) || 0;
                return isAsc ? aText - bText : bText - aText;
            } else if (isDate) {
                aText = new Date(aText);
                bText = new Date(bText);
                return isAsc ? aText - bText : bText - aText;
            } else {
                return isAsc 
                    ? aText.localeCompare(bText)
                    : bText.localeCompare(aText);
            }
        });
        
        // Store the current state of the table
        const fragment = document.createDocumentFragment();
        
        // Rebuild the table in the correct order
        rowsWithState.forEach(({element, expanded, relatedRows}) => {
            // Clone the main row and its related rows
            const rowClone = element.cloneNode(true);
            const relatedClones = relatedRows.map(r => r.cloneNode(true));
            
            // Append to fragment
            fragment.appendChild(rowClone);
            relatedClones.forEach(clone => fragment.appendChild(clone));
        });
        
        // Clear and rebuild the tbody
        while (tbody.firstChild) {
            tbody.removeChild(tbody.firstChild);
        }
        tbody.appendChild(fragment);
        
        // Update sort indicator
        const sortIcon = header.querySelector('.sort-icon');
        if (sortIcon) {
            sortIcon.textContent = isAsc ? ' ↑' : ' ↓';
            sortIcon.style.color = '#0066cc';
        }
        
        // Reinitialize all toggle functionality
        setupToggleDetails();
        
        // Restore expanded state
        let currentRow = tbody.firstElementChild;
        while (currentRow) {
            if (currentRow.classList.contains('main-item')) {
                const toggleButton = currentRow.querySelector('.toggle-details');
                if (toggleButton) {
                    const wasExpanded = rowsWithState.some(
                        r => r.element === currentRow && r.expanded
                    );
                    
                    if (wasExpanded) {
                        // Find all related rows
                        let nextRow = currentRow.nextElementSibling;
                        while (nextRow && (nextRow.classList.contains('size-variations') || 
                                         nextRow.classList.contains('specification-item') ||
                                         nextRow.classList.contains('size-matrix'))) {
                            nextRow.style.display = 'table-row';
                            nextRow = nextRow.nextElementSibling;
                        }
                        toggleButton.textContent = '-';
                    } else {
                        toggleButton.textContent = '+';
                    }
                }
            }
            currentRow = currentRow.nextElementSibling;
        }
    }
    
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
