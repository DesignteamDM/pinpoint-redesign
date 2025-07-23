document.addEventListener('DOMContentLoaded', function() {
    console.log('Email receipt script loaded');
    
    // Initialize receipt email functionality
    const sendReceiptCheckbox = document.getElementById('sendReceiptEmail');
    const emailReceiptGroup = document.getElementById('emailReceiptGroup');
    const receiptEmailInput = document.getElementById('receiptEmail');
    
    // Initialize shipping email functionality
    const sendShippingCheckbox = document.getElementById('sendShippingEmail');
    const shippingEmailGroup = document.getElementById('shippingEmailGroup');
    const shippingEmailInput = document.getElementById('shippingEmail');
    const sendShippingBtn = document.getElementById('sendShippingEmailBtn');
    
    console.log('Elements initialized');
    
    // Toggle email input visibility when checkbox is clicked
    function toggleEmailInput(show, group, inputField) {
        console.log('Toggle email input:', show);
        if (show) {
            group.style.display = 'block';
            if (inputField) inputField.focus();
        } else {
            group.style.display = 'none';
            if (inputField) inputField.value = ''; // Clear the email input when hiding
        }
    }
    
    // Handle email sending
    function sendEmail(type, emailInput, defaultEmail) {
        const email = emailInput.value.trim();
        const emailToUse = email || defaultEmail;
        
        if (!emailToUse) {
            alert(`Please enter an email address or ensure the order has a contact email for ${type}.`);
            return;
        }
        
        // Here you would typically make an API call to send the email
        console.log(`Sending ${type} email to:`, emailToUse);
        
        // Show success message
        alert(`${type === 'receipt' ? 'Receipt' : 'Shipping notification'} has been sent to ${emailToUse}`);
        
        // Reset the form
        emailInput.value = '';
        if (type === 'receipt') {
            sendReceiptCheckbox.checked = false;
            toggleEmailInput(false, emailReceiptGroup, receiptEmailInput);
        } else {
            sendShippingCheckbox.checked = false;
            toggleEmailInput(false, shippingEmailGroup, shippingEmailInput);
        }
    }
    
    // Initialize receipt email functionality if elements exist
    if (sendReceiptCheckbox && emailReceiptGroup) {
        const sendNowButton = emailReceiptGroup.querySelector('.pui-btn-primary');
        
        // Handle receipt checkbox change event
        sendReceiptCheckbox.addEventListener('change', function() {
            console.log('Receipt checkbox changed:', this.checked);
            toggleEmailInput(this.checked, emailReceiptGroup, receiptEmailInput);
        });
        
        // Handle Send Now button click for receipt
        if (sendNowButton) {
            sendNowButton.addEventListener('click', function() {
                const orderContactEmail = ''; // Get from your backend
                sendEmail('receipt', receiptEmailInput, orderContactEmail);
            });
        }
        
        // Initialize the state
        toggleEmailInput(sendReceiptCheckbox.checked, emailReceiptGroup);
    }
    
    // Initialize shipping email functionality if elements exist
    if (sendShippingCheckbox && shippingEmailGroup) {
        // Handle shipping checkbox change event
        sendShippingCheckbox.addEventListener('change', function() {
            console.log('Shipping checkbox changed:', this.checked);
            toggleEmailInput(this.checked, shippingEmailGroup, shippingEmailInput);
        });
        
        // Handle Send Now button click for shipping
        if (sendShippingBtn) {
            sendShippingBtn.addEventListener('click', function() {
                const orderContactEmail = ''; // Get from your backend
                sendEmail('shipping', shippingEmailInput, orderContactEmail);
            });
        }
    }
            
    // Initialize the state
    if (sendReceiptCheckbox && emailReceiptGroup) {
        toggleEmailInput(sendReceiptCheckbox.checked, emailReceiptGroup, receiptEmailInput);
    }
    if (sendShippingCheckbox && shippingEmailGroup) {
        toggleEmailInput(sendShippingCheckbox.checked, shippingEmailGroup, shippingEmailInput);
    }
});
