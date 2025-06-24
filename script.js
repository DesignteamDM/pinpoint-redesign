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
    initializeTableRows();

    // Event listeners for search
    searchCustomerBtn.addEventListener('click', () => {
        performCustomerSearch(customerSearch.value);
    });

    customerSearch.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            performCustomerSearch(customerSearch.value);
        }
    });

    // Tab functionality
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
            tabContent.classList.add('active');
            
            // Reset scroll position of the tab content
            if (tabContent) {
                tabContent.scrollTop = 0;
            }
            
            // Also reset the window scroll position
            window.scrollTo(0, 0);
        });
    });

    // Initialize first tab as active if none is active
    if (!document.querySelector('.tab-btn.active')) {
        const firstTab = document.querySelector('.tab-btn');
        const firstTabContent = document.getElementById(firstTab.getAttribute('data-tab'));
        
        if (firstTab && firstTabContent) {
            firstTab.classList.add('active');
            firstTabContent.classList.add('active');
        }
    }

    // Add click handler for the calendar button
    const calendarBtn = document.querySelector('.calendar-btn');
    if (calendarBtn) {
        calendarBtn.addEventListener('click', function() {
            // In a real implementation, this would open a date picker
            const dateInput = this.previousElementSibling;
            dateInput.type = 'date';
            dateInput.showPicker();
            // Change back to text after selection
            dateInput.addEventListener('change', function() {
                this.type = 'text';
            }, { once: true });
        });
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

    // Add click handler for add buttons
    const addButtons = document.querySelectorAll('.add-btn');
    addButtons.forEach(button => {
        button.addEventListener('click', function() {
            // In a real implementation, this would add a new field
            console.log('Add button clicked');
            // alert('Add functionality would be implemented here');
        });
    });

    // Format phone numbers as user types
    const phoneInputs = document.querySelectorAll('input[type="tel"], input[value*=""]');
    phoneInputs.forEach(input => {
        if (input.value && input.value.match(/\d{10,}/)) {
            // Format existing phone numbers on load
            formatPhoneNumber(input);
        }
        
        input.addEventListener('input', function(e) {
            formatPhoneNumber(this);
        });
    });

    function formatPhoneNumber(input) {
        // Only format if it looks like a phone number
        const value = input.value.replace(/\D/g, '');
        
        if (value.length === 10) {
            // Format as (XXX) XXX-XXXX
            input.value = `(${value.substring(0, 3)}) ${value.substring(3, 6)}-${value.substring(6)}`;
        } else if (value.length > 10) {
            // Format as (XXX) XXX-XXXX ext. XXXX
            input.value = `(${value.substring(0, 3)}) ${value.substring(3, 6)}-${value.substring(6, 10)} ext. ${value.substring(10)}`;
        }
    }


    // Sync Address functionality
    const syncLink = document.querySelector('.sync-link');
    if (syncLink) {
        syncLink.addEventListener('click', function(e) {
            e.preventDefault();
            // In a real implementation, this would sync the billing address from master file
            console.log('Syncing address from master file');
            // alert('Address would be synced from master file');
        });
    }
});
