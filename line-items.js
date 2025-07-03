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

// Function to extract the numeric value from a cell (removes $ and other non-numeric characters except decimal point)
function extractNumericValue(text) {
    if (!text) return '';
    // Remove currency symbols and thousands separators, but keep decimal point
    return text.replace(/[^0-9.-]+/g, '');
}

// Function to make a cell editable
function makeCellEditable(cell, isNumeric = true) {
    if (!cell) return;
    
    // Get the current display text
    const displayText = cell.textContent.trim();
    let valueToEdit = displayText;
    
    // For price and total cells, extract just the numeric value for editing
    if (cell.classList.contains('pui-text-right') && displayText.includes('$')) {
        valueToEdit = extractNumericValue(displayText);
    }
    
    // Store original display value if not already done
    if (!cell.hasAttribute('data-original-value')) {
        cell.dataset.originalValue = displayText;
    }
    
    // Create input element
    const input = document.createElement('input');
    // Use text input for all fields, including numeric ones
    input.type = 'text';
    input.className = 'editable-input';
    
    // For price and total fields, show just the numeric value during editing
    if ((cell.classList.contains('pui-text-right') || cell.classList.contains('line-total-amount')) && valueToEdit) {
        const numValue = parseFloat(extractNumericValue(valueToEdit));
        if (!isNaN(numValue)) {
            // Show just the number during editing
            input.value = numValue.toString();
        } else {
            input.value = valueToEdit.replace(/[^0-9.-]/g, '');
        }
        
        // Add input mode for better mobile keyboard
        input.inputMode = 'decimal';
    } else {
        input.value = valueToEdit;
    }
    
    // Clear cell and add input
    cell.innerHTML = '';
    cell.appendChild(input);
    
    // Focus the input
    setTimeout(() => input.focus(), 0);
}

// Function to make specification items editable
function setupSpecificationItemsEdit(mainRow, isEditMode) {
    if (!mainRow) return;
    
    // Find all related specification items
    let nextRow = mainRow.nextElementSibling;
    while (nextRow && (nextRow.classList.contains('size-variations') || 
                      nextRow.classList.contains('specification-item') || 
                      nextRow.classList.contains('size-matrix'))) {
        
        if (nextRow.classList.contains('specification-item')) {
            if (isEditMode) {
                nextRow.classList.add('edit-mode');
                // Make cells editable (qty, qty shipped, price, total)
                const cells = nextRow.cells;
                makeCellEditable(cells[3], true); // Qty
                makeCellEditable(cells[4], true); // Qty Shipped
                makeCellEditable(cells[5], true); // Price
                makeCellEditable(cells[6], true); // Total
            } else {
                nextRow.classList.remove('edit-mode');
            }
        }
        nextRow = nextRow.nextElementSibling;
    }
}

// Function to handle edit mode for a line item - opens the flat-goods modal
function setupEditMode(button) {
    // Open the flat-goods modal
    openFlatGoodsModal(button);
    
    // Prevent default behavior
    return false;
}

// Function to exit edit mode for specification items
function exitSpecificationItemsEdit(mainRow, cancel) {
    if (!mainRow) return;
    
    // Find all related specification items
    let nextRow = mainRow.nextElementSibling;
    while (nextRow && (nextRow.classList.contains('size-variations') || 
                      nextRow.classList.contains('specification-item') || 
                      nextRow.classList.contains('size-matrix'))) {
        
        if (nextRow.classList.contains('specification-item')) {
            if (cancel) {
                // Restore original values
                const cells = nextRow.cells;
                for (let i = 3; i <= 6; i++) {
                    restoreCellValue(cells[i]);
                }
            } else {
                // Save changes from inputs back to cells
                const cells = nextRow.cells;
                for (let i = 3; i <= 6; i++) {
                    const input = cells[i].querySelector('input');
                    if (input) {
                        // Format as currency if it's the price or total column
                        if ((i === 5 || i === 6) && cells[i].classList.contains('pui-text-right')) {
                            const numValue = parseFloat(extractNumericValue(input.value));
                            if (!isNaN(numValue)) {
                                cells[i].textContent = `$${numValue.toFixed(2)}`;
                                continue;
                            }
                        }
                        cells[i].textContent = input.value;
                    }
                }
            }
            nextRow.classList.remove('edit-mode');
        }
        nextRow = nextRow.nextElementSibling;
    }
}

// Function to exit edit mode
function exitEditMode(row, cancel) {
    if (cancel) {
        // Restore main row cells
        const cells = row.cells;
        for (let i = 3; i <= 4; i++) {
            restoreCellValue(cells[i]);
        }
        
        // Exit edit mode for specification items (restore original values)
        exitSpecificationItemsEdit(row, true);
        
        // Restore size rows
        let nextRow = row.nextElementSibling;
        while (nextRow && (nextRow.classList.contains('size-variations') || 
                         nextRow.classList.contains('specification-item') ||
                         nextRow.classList.contains('size-matrix'))) {
            if (nextRow.classList.contains('size-variations')) {
                const sizeCells = nextRow.cells;
                for (let i = 1; i < sizeCells.length; i++) {
                    restoreCellValue(sizeCells[i]);
                }
            }
            nextRow = nextRow.nextElementSibling;
        }
    } else {
        // Save changes from inputs back to cells
        const cells = row.cells;
        
        // Save qty and qty shipped
        for (let i = 3; i <= 4; i++) {
            const input = cells[i].querySelector('input');
            if (input) {
                cells[i].textContent = input.value;
            }
        }
        
        // Save total if it's an input
        const totalInput = row.querySelector('.line-total-amount input');
        if (totalInput) {
            const totalCell = row.querySelector('.line-total-amount');
            const numValue = parseFloat(extractNumericValue(totalInput.value));
            if (!isNaN(numValue)) {
                totalCell.textContent = `$${numValue.toFixed(2)}`;
            } else {
                totalCell.textContent = totalInput.value;
            }
        }
        
        // Save specification items
        exitSpecificationItemsEdit(row, false);
        
        // Save size variations if any
        let nextRow = row.nextElementSibling;
        while (nextRow && (nextRow.classList.contains('size-variations') || 
                         nextRow.classList.contains('specification-item') ||
                         nextRow.classList.contains('size-matrix'))) {
            if (nextRow.classList.contains('size-variations')) {
                const sizeCells = nextRow.cells;
                for (let i = 1; i < sizeCells.length; i++) {
                    const input = sizeCells[i].querySelector('input');
                    if (input) {
                        sizeCells[i].textContent = input.value;
                    }
                }
            }
            nextRow = nextRow.nextElementSibling;
        }
    }
    
    // Remove edit mode class
    row.classList.remove('edit-mode');
    
    // Restore edit button
    const editBtn = row.querySelector('.btn-action[title="Save"], .btn-action[title="Edit"]');
    if (editBtn) {
        editBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" 
                 stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path>
            </svg>`;
        editBtn.title = 'Edit';
    }
    
    // Remove cancel button
    const cancelBtn = row.querySelector('.btn-cancel-edit');
    if (cancelBtn) {
        cancelBtn.remove();
    }
}

// Function to restore a cell's original value
function restoreCellValue(cell) {
    if (!cell || !cell.dataset.originalValue) return;
    
    // For currency cells, ensure proper formatting
    if (cell.classList.contains('pui-text-right') || cell.classList.contains('line-total-amount')) {
        const numValue = parseFloat(extractNumericValue(cell.dataset.originalValue));
        if (!isNaN(numValue)) {
            cell.textContent = `$${numValue.toFixed(2)}`;
            return;
        }
    }
    
    // For regular cells, just restore the original value
    cell.textContent = cell.dataset.originalValue;
}

// Function to handle edit mode for a specification item
function setupSpecificationItemEditMode(button) {
    const row = button.closest('tr.specification-item');
    if (!row) return;
    
    // Toggle edit mode class
    const isEditMode = row.classList.toggle('edit-mode');
    
    if (isEditMode) {
        // Entering edit mode
        const cells = row.cells;
        
        // Make qty, qty shipped, price, and total cells editable
        makeCellEditable(cells[3], true); // Qty (index 3)
        makeCellEditable(cells[4], true); // Qty Shipped (index 4)
        makeCellEditable(cells[5], true); // Price (index 5)
        makeCellEditable(cells[6], true); // Total (index 6)
        
        // Change button to save icon
        button.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" 
                 stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                <polyline points="17 21 17 13 7 13 7 21"></polyline>
                <polyline points="7 3v5h8"></polyline>
            </svg>`;
            
        // Add cancel button if it doesn't exist
        if (!row.querySelector('.btn-cancel-edit')) {
            const cancelBtn = document.createElement('button');
            cancelBtn.className = 'btn-action btn-cancel-edit';
            cancelBtn.title = 'Cancel';
            cancelBtn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" 
                     stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>`;
            button.parentNode.insertBefore(cancelBtn, button.nextSibling);
            
            cancelBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                // Exit edit mode without saving
                exitSpecificationItemEditMode(row, true);
            });
        }
    } else {
        // Save changes
        exitSpecificationItemEditMode(row, false);
    }
}

// Function to exit edit mode for a specification item
function exitSpecificationItemEditMode(row, cancel) {
    if (cancel) {
        // Restore original values
        const cells = row.cells;
        for (let i = 3; i <= 6; i++) {
            restoreCellValue(cells[i]);
        }
    } else {
        // Update the values from the input fields
        const cells = row.cells;
        for (let i = 3; i <= 6; i++) {
            const input = cells[i].querySelector('input');
            if (input) {
                // Format as currency if it's the price or total column
                if ((i === 5 || i === 6) && cells[i].classList.contains('pui-text-right')) {
                    const numValue = parseFloat(extractNumericValue(input.value));
                    if (!isNaN(numValue)) {
                        cells[i].textContent = `$${numValue.toFixed(2)}`;
                        continue;
                    }
                }
                cells[i].textContent = input.value;
            }
        }
    }
    
    // Remove edit mode class
    row.classList.remove('edit-mode');
    
    // Restore edit button
    const editBtn = row.querySelector('.btn-action[title="Save"]');
    if (editBtn) {
        editBtn.title = 'Edit';
        editBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" 
                 stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path>
            </svg>`;
    }
    
    // Remove cancel button
    const cancelBtn = row.querySelector('.btn-cancel-edit');
    if (cancelBtn) {
        cancelBtn.remove();
    }
}

// Function to handle the Flat-Goods Edit Modal
function setupFlatGoodsModal() {
    const modal = document.getElementById('flatGoodsModal');
    if (!modal) return;

    // Open modal when edit button is clicked
    document.addEventListener('click', function(e) {
        const editBtn = e.target.closest('.edit-flat-goods');
        if (editBtn) {
            e.preventDefault();
            openFlatGoodsModal(editBtn);
        }
    });

    // Close modal when clicking the close button or outside the modal
    modal.addEventListener('click', function(e) {
        if (e.target === modal || e.target.classList.contains('close-modal')) {
            closeFlatGoodsModal();
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            closeFlatGoodsModal();
        }
    });

    // Handle size quantity changes
    const sizesGrid = modal.querySelector('.sizes-grid');
    if (sizesGrid) {
        sizesGrid.addEventListener('input', function(e) {
            if (e.target.classList.contains('form-control') && e.target.type === 'number') {
                updateTotals();
            }
        });
    }

    // Handle remove size button
    modal.addEventListener('click', function(e) {
        const removeBtn = e.target.closest('.btn-remove');
        if (removeBtn) {
            e.preventDefault();
            const sizeItem = removeBtn.closest('.size-item');
            if (sizeItem) {
                sizeItem.remove();
                updateTotals();
            }
        }
    });

    // Handle add new size
    const addSizeBtn = modal.querySelector('.btn-icon');
    if (addSizeBtn) {
        addSizeBtn.addEventListener('click', function(e) {
            const sizeInput = this.preElementSibling;
            if (sizeInput && sizeInput.value.trim()) {
                addNewSize(sizeInput.value.trim());
                sizeInput.value = '';
            }
        });
    }

    // Handle form submission
    const saveBtn = modal.querySelector('.save-changes');
    if (saveBtn) {
        saveBtn.addEventListener('click', function() {
            saveFlatGoodsChanges();
        });
    }
}

function openFlatGoodsModal(button) {
    const modal = document.getElementById('flatGoodsModal');
    if (!modal) return;

    // Store the row data for later use
    const row = button.closest('tr');
    if (row) {
        modal.dataset.rowId = row.dataset.id || '';
        
        // Here you would populate the form with the row data
        // For example:
        // const colorSelect = modal.querySelector('select');
        // const priceInput = modal.querySelector('input[type="number"]');
        // colorSelect.value = row.dataset.color || '';
        // priceInput.value = row.dataset.price || '';
    }

    // Show the modal
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeFlatGoodsModal() {
    const modal = document.getElementById('flatGoodsModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
}

function addNewSize(sizeName) {
    const sizesGrid = document.querySelector('.sizes-grid');
    if (!sizesGrid) return;

    const sizeItem = document.createElement('div');
    sizeItem.className = 'size-item';
    sizeItem.innerHTML = `
        <div class="size-header">
            <span>${sizeName}</span>
            <button type="button" class="btn-remove">&times;</button>
        </div>
        <input type="number" class="form-control" value="0" min="0">
    `;
    
    sizesGrid.appendChild(sizeItem);
    updateTotals();
}

function updateTotals() {
    const quantityInputs = document.querySelectorAll('.sizes-grid .form-control');
    let total = 0;
    
    quantityInputs.forEach(input => {
        total += parseInt(input.value) || 0;
    });
    
    // Update the total displays
    const totalDisplays = document.querySelectorAll('.total-value');
    totalDisplays.forEach(display => {
        display.textContent = total;
    });
}

function saveFlatGoodsChanges() {
    const modal = document.getElementById('flatGoodsModal');
    if (!modal) return;

    // Collect form data
    const formData = {
        color: modal.querySelector('select').value,
        costOverride: parseFloat(modal.querySelector('input[type="number"]').value) || 0,
        price: parseFloat(modal.querySelectorAll('input[type="number"]')[1].value) || 0,
        taxable: modal.querySelector('#taxable').checked,
        note: modal.querySelector('textarea').value,
        sizes: []
    };

    // Collect size data
    const sizeItems = modal.querySelectorAll('.size-item');
    sizeItems.forEach(item => {
        const sizeName = item.querySelector('.size-header span').textContent;
        const quantity = parseInt(item.querySelector('input').value) || 0;
        if (sizeName && quantity > 0) {
            formData.sizes.push({ size: sizeName, quantity });
        }
    });

    // Here you would typically send the data to the server
    console.log('Saving flat-goods data:', formData);
    
    // Close the modal after saving
    closeFlatGoodsModal();
    
    // Show success message or update the UI as needed
    alert('Changes saved successfully!');
}

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the flat goods modal
    setupFlatGoodsModal();
    
    // Handle Customer Provided Items checkbox
    const customerItemsCheckbox = document.getElementById('customer-items');
    const customerNotesTextareas = document.querySelectorAll('.customer-notes');
    
    if (customerItemsCheckbox && customerNotesTextareas.length > 0) {
        // Save the default notes text from the first textarea (assuming all have same default text)
        const defaultNotes = customerNotesTextareas[0].value;
        let isDefaultTextProtected = true;
        
        // Function to update all customer notes textareas
        const updateCustomerNotes = (checked) => {
            customerNotesTextareas.forEach(textarea => {
                if (!checked) {
                    // Clear the notes when unchecked
                    textarea.value = '';
                    isDefaultTextProtected = false;
                } else {
                    // Restore default notes when checked
                    textarea.value = defaultNotes;
                    isDefaultTextProtected = true;
                }
            });
        };
        
        // Function to protect default text
        const protectDefaultText = (textarea) => {
            if (!isDefaultTextProtected) return;
            
            const currentValue = textarea.value;
            
            // If text is shorter than default, restore default
            if (currentValue.length < defaultNotes.length) {
                textarea.value = defaultNotes;
                return;
            }
            
            // If text doesn't start with default, restore default
            if (!currentValue.startsWith(defaultNotes)) {
                const cursorPos = textarea.selectionStart;
                textarea.value = defaultNotes + currentValue.substring(defaultNotes.length);
                textarea.setSelectionRange(cursorPos, cursorPos);
            }
        };
        
        // Add event listeners to each textarea
        customerNotesTextareas.forEach(textarea => {
            // Handle keydown to prevent deleting default text
            textarea.addEventListener('keydown', function(e) {
                if (!isDefaultTextProtected) return;
                
                const cursorPos = this.selectionStart;
                const cursorEnd = this.selectionEnd;
                
                // Allow arrow keys, tab, delete, etc.
                if ([37, 38, 39, 40, 8, 46, 9, 16, 17, 18, 91, 13].includes(e.keyCode)) {
                    // If backspace or delete would affect default text, prevent it
                    if ((e.keyCode === 8 && cursorPos <= defaultNotes.length && cursorPos === cursorEnd) ||
                        (e.keyCode === 46 && cursorPos < defaultNotes.length && cursorPos === cursorEnd)) {
                        e.preventDefault();
                    }
                    return;
                }
                
                // If cursor is before the end of default text and not a selection
                if (cursorPos < defaultNotes.length && cursorPos === cursorEnd) {
                    // Move cursor to end of default text
                    this.setSelectionRange(defaultNotes.length, defaultNotes.length);
                }
            });
            
            // Handle paste
            textarea.addEventListener('paste', function(e) {
                if (!isDefaultTextProtected) return;
                
                const cursorPos = this.selectionStart;
                if (cursorPos < defaultNotes.length) {
                    e.preventDefault();
                    // Move cursor to end of default text and paste there
                    this.setSelectionRange(defaultNotes.length, defaultNotes.length);
                    const pastedText = (e.clipboardData || window.clipboardData).getData('text');
                    document.execCommand('insertText', false, pastedText);
                }
            });
            
            // Handle input changes
            textarea.addEventListener('input', function() {
                if (isDefaultTextProtected) {
                    protectDefaultText(this);
                }
            });
            
            // Handle mouse clicks to prevent placing cursor in default text
            textarea.addEventListener('click', function() {
                if (!isDefaultTextProtected) return;
                
                const cursorPos = this.selectionStart;
                if (cursorPos < defaultNotes.length) {
                    this.setSelectionRange(defaultNotes.length, defaultNotes.length);
                }
            });
        });
        
        // Handle checkbox change
        customerItemsCheckbox.addEventListener('change', function() {
            updateCustomerNotes(this.checked);
        });
        
        // Initialize the state on page load
        updateCustomerNotes(customerItemsCheckbox.checked);
    }
    
    // Get all the necessary elements
    const selectAllCheckbox = document.getElementById('selectAllItems');
    const itemCheckboxes = document.querySelectorAll('.item-checkbox');
    const deleteAllBtn = document.getElementById('deleteAllBtn');
    
    // Initial setup of toggle details
    setupToggleDetails();
    
    // Add event delegation for edit buttons and save on Enter key
    document.addEventListener('click', function(e) {
        // Check if edit button was clicked
        const editBtn = e.target.closest('.btn-action[title="Edit"]');
        if (editBtn) {
            e.preventDefault();
            e.stopPropagation();
            setupEditMode(editBtn);
            return;
        }
        
        // Handle save on clicking the save button (which is now the edit button in edit mode)
        const saveBtn = e.target.closest('tr.main-item.edit-mode .btn-action');
        if (saveBtn && saveBtn.getAttribute('title') !== 'Edit' && saveBtn.getAttribute('title') !== 'Cancel') {
            e.preventDefault();
            e.stopPropagation();
            const row = saveBtn.closest('tr.main-item');
            exitEditMode(row, false); // Save changes
            return;
        }
        
        // Check if clicking outside an editable area while in edit mode
        const activeEditRow = document.querySelector('tr.main-item.edit-mode');
        if (activeEditRow && !e.target.closest('.editable-input, .btn-action')) {
            exitEditMode(activeEditRow, false); // Save changes
        }
    });
    
    // Handle Enter key to save changes
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            const activeInput = document.activeElement;
            if (activeInput && activeInput.classList.contains('editable-input')) {
                e.preventDefault();
                const activeEditRow = document.querySelector('tr.main-item.edit-mode');
                if (activeEditRow) {
                    exitEditMode(activeEditRow, false); // Save changes
                }
            }
        }
    });
    
    // Add sorting functionality to the main items table headers
    const tables = document.querySelectorAll('.items-table');
    tables.forEach(table => {
        // Skip size-breakdown tables
        if (table.closest('.size-breakdown') || table.classList.contains('no-sort')) {
            return;
        }
        
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
    });
    
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
