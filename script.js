document.addEventListener('DOMContentLoaded', function() {
    // Initialize warehouse table toggle functionality
    function initializeWarehouseTable() {
        const table = document.querySelector('.warehouse-list-table .data-table');
        const toggleButton = document.querySelector('.toggle-warehouses');
        const toggleIcon = document.querySelector('.toggle-icon');
        const viewAllCheckbox = document.getElementById('viewAllWarehouses');
        
        if (!table || !toggleButton) return;
        
        // Get all rows except the header and yellow row
        const toggleableRows = Array.from(table.querySelectorAll('tbody tr:not(.row-yellow)'));
        
        // Function to update row visibility
        const updateRowVisibility = () => {
            const isExpanded = table.classList.contains('table-expanded');
            const showAll = viewAllCheckbox && viewAllCheckbox.checked;
            
            toggleableRows.forEach(row => {
                row.style.display = (isExpanded || showAll) ? 'table-row' : 'none';
            });
            
            if (toggleIcon) {
                const shouldShowToggleMinus = isExpanded || showAll;
                toggleIcon.textContent = shouldShowToggleMinus ? '−' : '+';
                
                // Ensure checkbox matches the toggle state
                if (viewAllCheckbox) {
                    viewAllCheckbox.checked = shouldShowToggleMinus;
                }
            }
        };
        
        // Set initial state
        table.classList.remove('table-expanded');
        if (viewAllCheckbox) viewAllCheckbox.checked = false;
        updateRowVisibility();
        
        // Toggle table expansion when clicking the toggle button
        toggleButton.addEventListener('click', function() {
            table.classList.toggle('table-expanded');
            // Update checkbox to match toggle state
            if (viewAllCheckbox) {
                viewAllCheckbox.checked = table.classList.contains('table-expanded');
            }
            updateRowVisibility();
        });
        
        // Toggle all warehouses when checkbox is clicked
        if (viewAllCheckbox) {
            viewAllCheckbox.addEventListener('change', function() {
                if (this.checked) {
                    table.classList.add('table-expanded');
                } else {
                    table.classList.remove('table-expanded');
                }
                updateRowVisibility();
            });
        }
    }
    
    // Initialize the warehouse table functionality
    initializeWarehouseTable();
    
    // Initialize customer search functionality
    const customerSearch = document.getElementById('customerSearch');
    const searchCustomerBtn = document.getElementById('searchCustomerBtn');
    const customerResultsBody = document.getElementById('customerResultsBody');
    const customerSearchResults = document.getElementById('customerSearchResults');
    let allTableRows = [];

    // Get all table rows and store them
    function initializeTableRows() {
        allTableRows = Array.from(customerResultsBody.getElementsByTagName('tr'));
    }

    // Function to perform customer search
    function performCustomerSearch(searchTerm) {
        const searchLower = searchTerm.toLowerCase().trim();
        
        if (!searchLower) {
            // If search is empty, show all rows
            allTableRows.forEach(row => {
                row.style.display = '';
            });
            return;
        }

        // Filter rows based on search term
        allTableRows.forEach(row => {
            const rowText = row.textContent.toLowerCase();
            row.style.display = rowText.includes(searchLower) ? '' : 'none';
        });
    }

    // Initialize the table rows
    if (customerResultsBody) {
        initializeTableRows();
    }

    // Event listeners for search
    if (searchCustomerBtn && customerSearch) {
        searchCustomerBtn.addEventListener('click', () => {
            performCustomerSearch(customerSearch.value);
        });

        customerSearch.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') {
                performCustomerSearch(customerSearch.value);
            }
        });
    }


    // Tab functionality
    function initializeTabs() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons and contents
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));

                // Add active class to clicked button
                button.classList.add('active');


                // Show corresponding tab content and reset scroll position
                const tabId = button.getAttribute('data-tab');
                const tabContent = document.getElementById(tabId);
                if (tabContent) {
                    tabContent.classList.add('active');
                    tabContent.scrollTop = 0; // Reset scroll position
                }
                
                // Also reset the window scroll position
                window.scrollTo(0, 0);
                
                // Re-initialize components for the active tab
                setTimeout(initializeCalendarButtons, 0);
            });
        });

        // Initialize first tab as active if none is active
        if (!document.querySelector('.tab-btn.active')) {
            const firstTab = document.querySelector('.tab-btn');
            if (firstTab) {
                const firstTabContent = document.getElementById(firstTab.getAttribute('data-tab'));
                if (firstTabContent) {
                    firstTab.classList.add('active');
                    firstTabContent.classList.add('active');
                }
            }
        }
    }
    
    // Initialize tabs
    initializeTabs();

    // Add click handler for all calendar buttons
    function initializeCalendarButtons() {
        const calendarBtns = document.querySelectorAll('.calendar-btn');
        
        calendarBtns.forEach(btn => {
            // Only add the event listener if it doesn't already have one
            if (!btn.dataset.initialized) {
                btn.addEventListener('click', function() {
                    const dateInput = this.previousElementSibling;
                    if (dateInput && dateInput.tagName === 'INPUT') {
                        // Store the current value to restore if needed
                        const currentValue = dateInput.value;
                        
                        // Change to date type to show native date picker
                        dateInput.type = 'date';
                        
                        // Focus and show the date picker
                        dateInput.focus();
                        
                        // For browsers that support showPicker()
                        if (dateInput.showPicker) {
                            dateInput.showPicker();
                        }
                        
                        // Change back to text after selection or blur
                        const handleBlur = function() {
                            dateInput.type = 'text';
                            dateInput.removeEventListener('blur', handleBlur);
                            dateInput.removeEventListener('change', handleChange);
                        };
                        
                        const handleChange = function() {
                            dateInput.type = 'text';
                            dateInput.removeEventListener('blur', handleBlur);
                            dateInput.removeEventListener('change', handleChange);
                        };
                        
                        dateInput.addEventListener('blur', handleBlur, { once: true });
                        dateInput.addEventListener('change', handleChange, { once: true });
                    }
                });
                
                // Mark as initialized to prevent duplicate event listeners
                btn.dataset.initialized = 'true';
            }
        });
    }
    
    // Initialize calendar buttons on page load
    initializeCalendarButtons();

    // Function to toggle all product details
    function toggleAllProductDetails(expand) {
        const toggleButtons = document.querySelectorAll('.toggle-details');
        
        toggleButtons.forEach(button => {
            // Only toggle buttons that don't match the desired state
            if ((expand && button.textContent === '+') || (!expand && button.textContent === '-')) {
                button.click();
            }
        });
    }
    
    // Initialize items table functionality
    function initializeItemsTable() {
        const toggleButtons = document.querySelectorAll('.toggle-details');
        const expandAllCheckbox = document.getElementById('expandAllProducts');
        
        // Add event listener for the expand all checkbox
        if (expandAllCheckbox) {
            expandAllCheckbox.addEventListener('change', function() {
                toggleAllProductDetails(this.checked);
            });
            
            // Update the expand all checkbox state when individual items are toggled
            document.addEventListener('click', function(e) {
                if (e.target.classList.contains('toggle-details')) {
                    const allExpanded = Array.from(document.querySelectorAll('.toggle-details')).every(
                        btn => btn.textContent === '-'
                    );
                    expandAllCheckbox.checked = allExpanded;
                }
            });
        }
        
        toggleButtons.forEach(button => {
            button.addEventListener('click', function() {
                const currentRow = this.closest('tr');
                let nextRow = currentRow.nextElementSibling;
                
                // Toggle the + and - sign
                if (this.textContent === '+') {
                    this.textContent = '-';
                    
                    // Show size variations and matrix rows
                    while (nextRow && (nextRow.classList.contains('size-variations') || nextRow.classList.contains('size-matrix') || nextRow.classList.contains('specification-item'))) {
                        nextRow.style.display = 'table-row';
                        nextRow = nextRow.nextElementSibling;
                    }
                } else {
                    this.textContent = '+';
                    
                    // Hide size variations and matrix rows
                    while (nextRow && (nextRow.classList.contains('size-variations') || nextRow.classList.contains('size-matrix') || nextRow.classList.contains('specification-item'))) {
                        nextRow.style.display = 'none';
                        nextRow = nextRow.nextElementSibling;
                    }
                }
            });
            
            // Initialize the state of the details (all collapsed by default)
            const currentRow = button.closest('tr');
            let nextRow = currentRow.nextElementSibling;
            while (nextRow && (nextRow.classList.contains('size-variations') || nextRow.classList.contains('size-matrix'))) {
                nextRow.style.display = 'none';
                nextRow = nextRow.nextElementSibling;
            }
        });
    }
    
    // Initialize the items table functionality
    initializeItemsTable();

    // Initialize accordion functionality
    function initializeAccordions() {
        const accordionToggles = document.querySelectorAll('.accordion-toggle');
        
        accordionToggles.forEach(toggle => {
            // Set initial state (all closed)
            const targetId = toggle.getAttribute('data-target');
            const content = document.getElementById(targetId);
            const icon = toggle.querySelector('.accordion-icon');
            
            if (content) {
                content.style.display = 'none';
                if (icon) icon.textContent = '+';
            }
            
            // Add click handler
            toggle.addEventListener('click', function() {
                const targetId = this.getAttribute('data-target');
                const content = document.getElementById(targetId);
                const icon = this.querySelector('.accordion-icon');
                
                // Toggle current accordion
                if (content.style.display === 'none' || content.style.display === '') {
                    content.style.display = 'block';
                    if (icon) icon.textContent = '-';
                } else {
                    content.style.display = 'none';
                    if (icon) icon.textContent = '+';
                }
            });
        });
    }

    // Initialize accordions on page load
    if (document.querySelector('.accordion-toggle')) {
        initializeAccordions();
    }

    // Initialize phone number functionality
    function initializePhoneNumbers() {
        const phoneGroups = document.querySelectorAll('.phone-group');
        
        phoneGroups.forEach(group => {
            const container = group.querySelector('.phone-inputs-container');
            const addButton = group.querySelector('.add-phone-btn');
            const showMoreButton = group.querySelector('.show-more-phones');
            let isExpanded = false;
            
            // Function to create a new phone input group
            function createNewPhoneInput() {
                const newPhoneInput = document.createElement('div');
                newPhoneInput.className = 'phone-inputs';
                newPhoneInput.innerHTML = `
                    <select class="phone-type">
                        <option>Cell</option>
                        <option>Home</option>
                        <option>Work</option>
                        <option>Other</option>
                    </select>
                    <input class="phone-number" type="text" placeholder="Phone number">
                    <span class="phone-ext">Ext.</span>
                    <input class="ext-input" type="text" placeholder="Ext">
                    <button type="button" class="remove-phone">×</button>
                `;
                
                // Add remove button handler
                const removeBtn = newPhoneInput.querySelector('.remove-phone');
                if (removeBtn) {
                    removeBtn.addEventListener('click', function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                        newPhoneInput.remove();
                        updatePhoneInputsVisibility();
                    });
                }
                
                return newPhoneInput;
            }
            
            // Update phone inputs visibility based on expanded state
            function updatePhoneInputsVisibility() {
                const allInputs = Array.from(container.querySelectorAll('.phone-inputs'));
                
                // Always show first two inputs
                allInputs.forEach((input, index) => {
                    if (index < 2) {
                        input.style.display = 'flex';
                    } else if (isExpanded) {
                        input.style.display = 'flex';
                    } else {
                        input.style.display = 'none';
                    }
                });
                
                // Update show more button
                if (allInputs.length <= 2) {
                    showMoreButton.style.display = 'none';
                } else {
                    showMoreButton.style.display = 'block';
                    if (isExpanded) {
                        showMoreButton.textContent = 'Collapse phone numbers';
                    } else {
                        showMoreButton.textContent = `Show ${allInputs.length - 2} more phone numbers`;
                    }
                }
                
                // Update remove buttons (hide for first input)
                allInputs.forEach((input, index) => {
                    const removeBtn = input.querySelector('.remove-phone');
                    if (removeBtn) {
                        removeBtn.style.display = index === 0 ? 'none' : 'flex';
                    }
                });
            }
            
            // Add event listener for add button
            addButton.addEventListener('click', function(e) {
                e.preventDefault();
                const newInput = createNewPhoneInput();
                container.appendChild(newInput);
                
                // Always show the newly added input
                newInput.style.display = 'flex';
                
                // If this is the third phone number, show the showMoreButton
                const allInputs = container.querySelectorAll('.phone-inputs');
                if (allInputs.length >= 3) {
                    showMoreButton.style.display = 'block';
                    // Expand the view if it was collapsed
                    if (!isExpanded) {
                        isExpanded = true;
                    }
                }
                
                // Update the show more button text and visibility
                updatePhoneInputsVisibility();
                
                // Scroll to the new input
                setTimeout(() => {
                    newInput.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    // Focus on the phone number input
                    const phoneInput = newInput.querySelector('.phone-number');
                    if (phoneInput) phoneInput.focus();
                }, 100);
            });
            
            // Toggle show/hide extra phone numbers
            showMoreButton.addEventListener('click', function(e) {
                e.preventDefault();
                isExpanded = !isExpanded;
                updatePhoneInputsVisibility();
            });
            
            // Initialize the component
            updatePhoneInputsVisibility();
        });
    }
    
    // Initialize phone number functionality on page load
    if (document.querySelector('.phone-group')) {
        initializePhoneNumbers();
    }

    // Add click handler for the search button
    const searchBtn = document.querySelector('.search-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            const searchInput = this.previousElementSibling;
            const searchTerm = searchInput.value.trim();
            
            if (searchTerm) {
                // In a real implementation, this would trigger a search
                console.log('Searching for:', searchTerm);
                // alert(`Search functionality would look for: ${searchTerm}`);
            } else {
                // alert('Please enter a search term');
            }
        });
    }

    // Add button click handler - functionality removed as per requirements
    document.querySelectorAll('.add-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault(); // Prevent default action
            console.log('Add button clicked - functionality not implemented');
        });
    });

    // Phone number formatting functionality has been removed as per requirements


    // Form submission handler - minimal implementation
    const orderDetailsForm = document.getElementById('order-details-form');
    if (orderDetailsForm) {
        orderDetailsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Form submission - functionality not implemented');
        });
    }
    
    // Sync Address functionality
    const syncLink = document.querySelector('.sync-link');
    if (syncLink) {
        syncLink.addEventListener('click', function(e) {
            e.preventDefault();
            // In a real implementation, this would sync the billing address from master file
            console.log('Syncing address from master file');
            
            // Show feedback to user
            const originalText = this.textContent;
            this.textContent = 'Syncing...';
            
            // Simulate API call
            setTimeout(() => {
                this.textContent = '✓ Synced';
                setTimeout(() => {
                    this.textContent = originalText;
                }, 2000);
            }, 1000);
        });
    }
});
