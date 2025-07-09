// Translation dictionary
const translations = {
    en: {
        // Header
        'View Order': 'View Order',
        'Print Order': 'Print Order',
        'Close Order': 'Close Order',
        // Billing Section
        'Billing': 'Billing',
        'Company': 'Company',
        'Contact': 'Contact',
        'Address': 'Address',
        'City': 'City',
        'State': 'State',
        'Zip': 'Zip',
        'Phone': 'Phone',
        'Email': 'Email',
        'Billing Email': 'Billing Email',
        'Turn Emails Off?': 'Turn Emails Off?',
        // Shipping Section
        'Shipping': 'Shipping',
        'Same as Billing': 'Same as Billing',
        'Ship To': 'Ship To',
        'Search Address': 'Search Address',
        // Add more translations as needed
    },
    es: {
        // Header
        'View Order': 'Ver Pedido',
        'Print Order': 'Imprimir Pedido',
        'Close Order': 'Cerrar Pedido',
        // Billing Section
        'Billing': 'Facturación',
        'Company': 'Empresa',
        'Contact': 'Contacto',
        'Address': 'Dirección',
        'City': 'Ciudad',
        'State': 'Estado',
        'Zip': 'Código Postal',
        'Phone': 'Teléfono',
        'Email': 'Correo Electrónico',
        'Billing Email': 'Correo de Facturación',
        'Turn Emails Off?': '¿Desactivar Correos?',
        // Shipping Section
        'Shipping': 'Envío',
        'Same as Billing': 'Igual que Facturación',
        'Ship To': 'Enviar A',
        'Search Address': 'Buscar Dirección',
        // Add more translations as needed
    }
};

// Function to translate the page
function translatePage(language) {
    // Update all translatable elements
    document.querySelectorAll('.translatable').forEach(element => {
        const key = element.getAttribute('data-en') || element.textContent.trim();
        if (translations[language] && translations[language][key]) {
            element.textContent = translations[language][key];
        }
    });
    
    // Update select dropdowns
    document.querySelectorAll('select option').forEach(option => {
        const key = option.textContent.trim();
        if (translations[language] && translations[language][key]) {
            option.textContent = translations[language][key];
        }
    });
    
    // Update input placeholders
    document.querySelectorAll('input[placeholder]').forEach(input => {
        const key = input.getAttribute('placeholder');
        if (translations[language] && translations[language][key]) {
            input.setAttribute('placeholder', translations[language][key]);
        }
    });
    
    // Update button texts
    document.querySelectorAll('button').forEach(button => {
        const key = button.textContent.trim();
        if (translations[language] && translations[language][key] && !button.querySelector('svg')) {
            button.textContent = translations[language][key];
        }
    });
}

// Initialize language selector
document.addEventListener('DOMContentLoaded', function() {
    // Add event listener for language selector
    const languageSelector = document.getElementById('language-selector');
    if (languageSelector) {
        languageSelector.addEventListener('change', function() {
            const selectedLanguage = this.value;
            localStorage.setItem('preferredLanguage', selectedLanguage);
            translatePage(selectedLanguage);
        });
        
        // Set initial language from localStorage or default to English
        const savedLanguage = localStorage.getItem('preferredLanguage') || 'en';
        languageSelector.value = savedLanguage;
        if (savedLanguage !== 'en') {
            translatePage(savedLanguage);
        }
    }
    // Initialize warehouse table toggle functionality
    function initializeWarehouseTable() {
        // First warehouse table
        setupWarehouseTable({
            tableSelector: '.warehouse-list-table .data-table',
            toggleButtonSelector: '.toggle-warehouses',
            toggleIconSelector: '.toggle-icon',
            checkboxId: 'viewAllWarehouses'
        });
        
        // Second warehouse table
        setupWarehouseTable({
            tableSelector: '.warehouse-list-table-two .data-table',
            toggleButtonSelector: '.toggle-warehouses-two',
            toggleIconSelector: '.toggle-icon-two',
            checkboxId: 'viewAllWarehouses-two'
        });
        
        function setupWarehouseTable({ tableSelector, toggleButtonSelector, toggleIconSelector, checkboxId }) {
            const table = document.querySelector(tableSelector);
            const toggleButton = document.querySelector(toggleButtonSelector);
            const toggleIcon = document.querySelector(toggleIconSelector);
            const viewAllCheckbox = document.getElementById(checkboxId);
            
            if (!table) return;
            
            // Get all rows except the header and yellow row
            const toggleableRows = Array.from(table.querySelectorAll('tbody tr:not(.row-yellow)'));
            
            // Function to update row visibility
            const updateRowVisibility = (fromCheckbox = false) => {
                const isExpanded = table.classList.contains('table-expanded');
                const showAll = viewAllCheckbox && viewAllCheckbox.checked;
                
                // Only update the display if we're not coming from checkbox click
                // to prevent flickering
                if (!fromCheckbox) {
                    toggleableRows.forEach(row => {
                        row.style.display = (isExpanded || showAll) ? 'table-row' : 'none';
                    });
                }
                
                if (toggleIcon) {
                    const shouldShowToggleMinus = isExpanded || showAll;
                    toggleIcon.textContent = shouldShowToggleMinus ? '−' : '+';
                }
            };
            
            // Set initial state
            table.classList.remove('table-expanded');
            if (viewAllCheckbox) viewAllCheckbox.checked = false;
            updateRowVisibility();
            
            // Toggle table expansion when clicking the toggle button
            if (toggleButton) {
                toggleButton.addEventListener('click', function() {
                    const newState = !table.classList.contains('table-expanded');
                    table.classList.toggle('table-expanded');
                    if (viewAllCheckbox) {
                        viewAllCheckbox.checked = newState;
                    }
                    updateRowVisibility();
                });
            }
            
            // Toggle all warehouses when checkbox is clicked
            if (viewAllCheckbox) {
                viewAllCheckbox.addEventListener('change', function() {
                    const showAll = this.checked;
                    
                    // Update display immediately for better responsiveness
                    toggleableRows.forEach(row => {
                        row.style.display = showAll ? 'table-row' : 'none';
                    });
                    
                    // Update the table expanded state to match
                    if (showAll) {
                        table.classList.add('table-expanded');
                    } else {
                        table.classList.remove('table-expanded');
                    }
                    
                    // Update the toggle icon if it exists
                    if (toggleIcon) {
                        toggleIcon.textContent = showAll ? '−' : '+';
                    }
                });
            }
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
                
                // Handle promotional products tab visibility
                if (tabId === 'promotional-products') {
                    const searchDiv = document.querySelector('.search-promo-products');
                    const quickQuantityDiv = document.querySelector('.quick-quantity-setup');
                    const fromEdit = button.getAttribute('data-from-edit') === 'true';
                    
                    if (searchDiv && quickQuantityDiv) {
                        if (fromEdit) {
                            // Hide both search div and quick quantity setup when coming from edit
                            searchDiv.style.display = 'none';
                            quickQuantityDiv.style.display = 'none';
                            // Clear the flag after use
                            button.removeAttribute('data-from-edit');
                        } else {
                            // Show both divs when directly clicking the tab
                            searchDiv.style.display = 'block';
                            quickQuantityDiv.style.display = 'block';
                        }
                    }
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

    // Handle edit button clicks for promotional items
    function handlePromoItemEdit() {
        document.addEventListener('click', function(e) {
            // Check if the clicked element is an edit button
            const editButton = e.target.closest('.btn-action[title="Edit"]');
            if (!editButton) return;

            // Check if the edit button is within a promotional item row
            const promoItemRow = editButton.closest('.promo-item');
            if (promoItemRow) {
                e.preventDefault(); // Prevent default action
                e.stopPropagation(); // Stop event from bubbling to other handlers
                
                // Find the promotional products tab button
                const promoTabButton = document.querySelector('.tab-btn[data-tab="promotional-products"]');
                if (promoTabButton) {
                    // Mark that we're navigating from an edit action
                    promoTabButton.setAttribute('data-from-edit', 'true');
                    
                    // Trigger click on the promotional products tab
                    promoTabButton.click();
                    
                    // Hide the search section and quick quantity setup when coming from edit
                    setTimeout(() => {
                        const searchDiv = document.querySelector('.search-promo-products');
                        const quickQuantityDiv = document.querySelector('.quick-quantity-setup');
                        if (searchDiv) {
                            searchDiv.style.display = 'none';
                        }
                        if (quickQuantityDiv) {
                            quickQuantityDiv.style.display = 'none';
                        }
                    }, 0);
                }
            }
        }, true); // Use capture phase to run before other handlers
    }

    // Initialize promotional item edit handling
    handlePromoItemEdit();

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
    
    // Initialize override price functionality
    const overridePriceCheckbox = document.getElementById('overridePriceCheckbox');
    const priceOverrideRows = document.querySelectorAll('.price-override-row');
    
    if (overridePriceCheckbox) {
        overridePriceCheckbox.addEventListener('change', function() {
            priceOverrideRows.forEach(row => {
                row.style.display = this.checked ? 'table-row' : 'none';
            });
        });
    }
    
    // Initialize sale price toggle functionality
    const salePriceCheckbox = document.getElementById('showSalePrice');
    if (salePriceCheckbox) {
        salePriceCheckbox.addEventListener('change', function() {
            const salePriceRows = document.querySelectorAll('.sale-price-row');
            salePriceRows.forEach(row => {
                row.style.display = this.checked ? 'table-row' : 'none';
            });
        });
    }

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
        if (!phoneGroups || phoneGroups.length === 0) return;
        
        phoneGroups.forEach(group => {
            const container = group.querySelector('.phone-inputs-container');
            const addButton = group.querySelector('.add-phone-btn');
            const showMoreButton = group.querySelector('.show-more-phones');
            let isExpanded = false;
            
            // Skip this group if required elements are missing
            if (!container || !addButton) return;
            
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
            if (addButton) {
                addButton.addEventListener('click', function(e) {
                    e.preventDefault();
                    const newInput = createNewPhoneInput();
                    container.appendChild(newInput);
                    
                    // Always show the newly added input
                    newInput.style.display = 'flex';
                    
                    // If this is the third phone number, show the showMoreButton
                    const allInputs = container.querySelectorAll('.phone-inputs');
                    if (allInputs.length >= 3 && showMoreButton) {
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
            }
            
            // Toggle show/hide extra phone numbers
            if (showMoreButton) {
                showMoreButton.addEventListener('click', function(e) {
                    e.preventDefault();
                    isExpanded = !isExpanded;
                    updatePhoneInputsVisibility();
                });
            }
            
            // Initialize the component
            updatePhoneInputsVisibility();
        });
    }
    
    // Initialize phone number functionality on page load
    if (document.querySelector('.phone-group')) {
        initializePhoneNumbers();
    }

// Simple implementation for adding misc lines
function setupMiscLines() {
    // Wait a small amount of time to ensure all other initializations are done
    setTimeout(function() {
        // Get the button and container
        const addButton = document.getElementById('addMiscLineBtn');
        const container = document.getElementById('miscLinesContainer');
        const template = document.getElementById('miscLineTemplate');
        
        if (!addButton || !container || !template) {
            console.error('Required elements not found for misc lines');
            return;
        }
        
        // Counter for new misc lines
        let miscLineCount = 0;
        
        // Function to add a new misc line
        function addMiscLine() {
            try {
                // Clone the template content
                const content = template.content.cloneNode(true);
                
                // Create a container for the new line
                const newLine = document.createElement('div');
                newLine.className = 'misc-line';
                if (miscLineCount > 0) {
                    newLine.classList.add('pui-mt-15px');
                }
                
                // Add the template content to the container
                newLine.appendChild(content);
                
                // Update the title
                const title = newLine.querySelector('h5');
                if (title) {
                    title.textContent = `Misc Line #${miscLineCount + 1}`;
                }
                
                // Add the new line to the container
                container.appendChild(newLine);
                
                // Remove default line if this is the first addition
                if (miscLineCount === 0) {
                    const defaultLine = document.querySelector('.default-misc-line');
                    if (defaultLine && defaultLine.parentNode) {
                        defaultLine.parentNode.removeChild(defaultLine);
                    }
                }
                
                // Increment the counter
                miscLineCount++;
                
                // Scroll to the new line
                newLine.scrollIntoView({ behavior: 'smooth' });
                
                return true;
            } catch (error) {
                console.error('Error adding misc line:', error);
                return false;
            }
        }
        
        // Add click event to the button
        if (addButton) {
            addButton.addEventListener('click', function(e) {
                e.preventDefault();
                addMiscLine();
            });
            
            // Add the first line automatically if there's a default line
            if (document.querySelector('.default-misc-line')) {
                setTimeout(function() {
                    addMiscLine();
                }, 100);
            }
        }
    }, 100); // Small delay to ensure other initializations are done
}

// Initialize misc lines after the page is fully loaded
window.addEventListener('load', function() {
    setupMiscLines();
});

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
