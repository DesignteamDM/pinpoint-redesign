document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const forgotPasswordLink = document.getElementById('forgotPasswordLink');
    
    // Handle login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const username = document.getElementById('username').value;
            const rememberMe = document.getElementById('rememberMe').checked;
            
            // No validation for mockup purposes
            
            // Store username if remember me is checked
            if (rememberMe && username) {
                localStorage.setItem('rememberedUsername', username);
            }
            
            // Set session storage to indicate user is logged in
            sessionStorage.setItem('isLoggedIn', 'true');
            
            // Redirect to the dashboard
            window.location.href = 'dashboard.html';
        });
    }
    
    // Handle "Forgot Password" link click
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', function(event) {
            event.preventDefault();
            alert('Please contact your system administrator to reset your password.');
        });
    }
    
    // Check for remembered username and populate the field
    const rememberedUsername = localStorage.getItem('rememberedUsername');
    if (rememberedUsername) {
        const usernameField = document.getElementById('username');
        if (usernameField) {
            usernameField.value = rememberedUsername;
            document.getElementById('rememberMe').checked = true;
        }
    }
});
