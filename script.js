document.addEventListener('DOMContentLoaded', function() {
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

    // Initialize items table functionality
    function initializeItemsTable() {
        const toggleButtons = document.querySelectorAll('.toggle-details');
        
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
