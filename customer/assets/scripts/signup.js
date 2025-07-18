document.addEventListener('DOMContentLoaded', function() {
    const signupForm = document.getElementById('signupForm');
    
    // Form submission handler
    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        // Redirect to dashboard without any validation
        window.location.href = 'dashboard.html';
    });
});
