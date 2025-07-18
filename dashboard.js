// Dashboard functionality
document.addEventListener('DOMContentLoaded', function() {
    // Order count data for OKFFA and BBRGear.com
    const orderCountData = {
        OKFFA: {
            '2024': [120, 135, 140, 150, 160, 170, 180, 175, 165, 155, 145, 130],
            '2025': [110, 125, 130, 140, 150, 160, 170, 165, 155, 145, 135, 120]
        },
        BBRGear: {
            '2024': [60, 70, 75, 80, 85, 90, 95, 92, 88, 84, 80, 75],
            '2025': [55, 65, 70, 75, 80, 85, 90, 88, 84, 80, 76, 72]
        }
    };

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];


    // Button event listeners
    const okffaBtn = document.getElementById('okffaFilterBtn');
    const bbrgearBtn = document.getElementById('bbrgearFilterBtn');
    if (okffaBtn) {
        okffaBtn.addEventListener('click', function() {
            renderOrderCountBarChart('OKFFA');
            okffaBtn.style.background = '#1976d2';
            okffaBtn.style.color = '#fff';
            bbrgearBtn.style.background = '#fff';
            bbrgearBtn.style.color = '#388e3c';
        });
    }
    if (bbrgearBtn) {
        bbrgearBtn.addEventListener('click', function() {
            renderOrderCountBarChart('BBRGear.com');
            bbrgearBtn.style.background = '#388e3c';
            bbrgearBtn.style.color = '#fff';
            okffaBtn.style.background = '#fff';
            okffaBtn.style.color = '#1976d2';
        });
    }
    // Elements
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const closeSidebar = document.getElementById('closeSidebar');
    const mainContent = document.querySelector('.main-content');
    
    // Set initial state based on screen size and saved preference
    if (window.innerWidth <= 768) {
        // On mobile, sidebar is hidden by default
        sidebar.classList.remove('active');
    } else {
        // On desktop, check user preference from localStorage, default to collapsed
        const sidebarState = localStorage.getItem('sidebarState') || 'collapsed';
        
        if (sidebarState === 'collapsed') {
            document.body.classList.add('sidebar-collapsed');
            mainContent.classList.add('full-width');
        } else {
            document.body.classList.remove('sidebar-collapsed');
            mainContent.classList.remove('full-width');
        }
    }
    
    // Make header dot in collapsed mode also toggle the sidebar
    const sidebarHeader = document.querySelector('.sidebar-header');
    if (sidebarHeader) {
        sidebarHeader.addEventListener('click', function() {
            if (window.innerWidth > 768 && document.body.classList.contains('sidebar-collapsed')) {
                // Toggle just like the regular button would
                document.body.classList.remove('sidebar-collapsed');
                mainContent.classList.remove('full-width');
                localStorage.setItem('sidebarState', 'expanded');
            }
        });
    }
    
    // Toggle sidebar on all screen sizes
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                // For mobile: toggle slide-in sidebar
                sidebar.classList.toggle('active');
            } else {
                // For desktop: toggle collapsed sidebar
                document.body.classList.toggle('sidebar-collapsed');
                mainContent.classList.toggle('full-width');
                
                // Add a brief delay before showing tooltips to prevent them from appearing during transition
                sidebar.classList.add('tooltips-disabled');
                setTimeout(() => {
                    sidebar.classList.remove('tooltips-disabled');
                }, 400);
                
                if (document.body.classList.contains('sidebar-collapsed')) {
                    localStorage.setItem('sidebarState', 'collapsed');
                } else {
                    localStorage.setItem('sidebarState', 'expanded');
                }
            }
        });
    }
    
    // Close sidebar only on mobile
    if (closeSidebar) {
        closeSidebar.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('active');
            }
        });
    }
    
    // Close sidebar when clicking outside on mobile only
    document.addEventListener('click', function(event) {
        const isClickInside = sidebar.contains(event.target) || sidebarToggle.contains(event.target);
        
        if (!isClickInside && window.innerWidth <= 768 && sidebar.classList.contains('active')) {
            sidebar.classList.remove('active');
        }
    });
    
    // Handle window resize events
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            // On desktop
            sidebar.classList.remove('active'); // Remove mobile active state
            // Maintain collapsed state if already collapsed
        } else {
            // On mobile
            if (document.body.classList.contains('sidebar-collapsed')) {
                // If was collapsed on desktop, hide on mobile
                document.body.classList.remove('sidebar-collapsed');
                sidebar.classList.remove('active');
                mainContent.classList.remove('full-width');
            }
        }
    });
    
    // Check if user is logged in
    const checkAuthStatus = function() {
        // This is a simple check, you would typically use more secure authentication
        const isLoggedIn = sessionStorage.getItem('isLoggedIn') || localStorage.getItem('rememberedUsername');
        
        if (!isLoggedIn) {
            // Redirect to login page if not logged in
            window.location.href = 'login.html';
        }
    };
    
    // Call auth check
    checkAuthStatus();
    
    // Set username from localStorage if available
    const userNameElement = document.querySelector('.user-name');
    const userAvatarElement = document.querySelector('.user-avatar span');
    const rememberedUsername = localStorage.getItem('rememberedUsername');
    
    if (rememberedUsername && userNameElement) {
        userNameElement.textContent = rememberedUsername;
        
        if (userAvatarElement) {
            // Create initials for avatar
            const initials = rememberedUsername
                .split(' ')
                .map(name => name.charAt(0).toUpperCase())
                .join('')
                .slice(0, 2);
            
            userAvatarElement.textContent = initials;
        }
    }
    
    // Handle logout
    const logoutButton = document.querySelector('.logout-btn');
    
    if (logoutButton) {
        logoutButton.addEventListener('click', function(event) {
            // Remove login info
            sessionStorage.removeItem('isLoggedIn');
            // Don't remove rememberedUsername to keep "Remember me" functionality
            
            // No need to prevent default as we want the href to work
            // to redirect to login page
        });
    }
    // Bright Store Order Split Pie Chart
    const brightStorePie = document.getElementById('brightStorePieChart');
    if (brightStorePie) {
        const brightStorePieCtx = brightStorePie.getContext('2d');
        new Chart(brightStorePieCtx, {
            type: 'pie',
            data: {
                labels: ['OKFFA', 'BBR'],
                datasets: [{
                    data: [80, 20],
                    backgroundColor: [
                        'rgba(255, 193, 7, 0.85)', // Amber
                        'rgba(76, 175, 80, 0.85)'  // Green
                    ],
                    borderColor: [
                        'rgba(255, 193, 7, 1)',
                        'rgba(76, 175, 80, 1)'
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            boxWidth: 16,
                            font: { size: 13 }
                        }
                    },
                    title: {
                        display: true,
                        text: 'OKFFA vs BBR Split',
                        font: { size: 15 }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.raw;
                                return `${label}: ${value}%`;
                            }
                        }
                    }
                }
            }
        });
    }
});
