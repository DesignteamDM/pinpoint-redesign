document.addEventListener('DOMContentLoaded', function() {
    // Toggle submenus
    const menuItems = document.querySelectorAll('.has-submenu > a');
    
    menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            const parent = this.parentElement;
            const submenu = this.nextElementSibling;
            
            if (submenu && submenu.classList.contains('submenu')) {
                e.preventDefault();
                parent.classList.toggle('active');
                
                // Close other open submenus at the same level
                if (parent.parentElement.classList.contains('submenu')) {
                    const siblings = parent.parentElement.children;
                    Array.from(siblings).forEach(sibling => {
                        if (sibling !== parent && sibling.classList.contains('has-submenu')) {
                            sibling.classList.remove('active');
                        }
                    });
                }
            }
        });
    });
    
    // Handle sidebar toggle for mobile
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const closeSidebar = document.getElementById('closeSidebar');
    const sidebarOverlay = document.querySelector('.sidebar-overlay');
    
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function() {
            document.body.classList.toggle('sidebar-collapsed');
            // For mobile, show/hide sidebar
            if (window.innerWidth <= 768) {
                sidebar.classList.toggle('mobile-visible');
                if (sidebarOverlay) {
                    if (sidebar.classList.contains('mobile-visible')) {
                        sidebarOverlay.classList.add('active');
                        document.body.classList.add('sidebar-open');
                    } else {
                        sidebarOverlay.classList.remove('active');
                        document.body.classList.remove('sidebar-open');
                    }
                }
            }
        });
    }
    
    if (closeSidebar) {
        closeSidebar.addEventListener('click', function() {
            sidebar.classList.remove('mobile-visible');
            if (sidebarOverlay) {
                sidebarOverlay.classList.remove('active');
                document.body.classList.remove('sidebar-open');
            }
        });
    }
    
    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', function() {
            sidebar.classList.remove('mobile-visible');
            this.classList.remove('active');
            document.body.classList.remove('sidebar-open');
        });
    }
    
    // Handle window resize
    function handleResize() {
        if (window.innerWidth > 768) {
            sidebar.classList.remove('mobile-visible');
            if (sidebarOverlay) {
                sidebarOverlay.classList.remove('active');
                document.body.classList.remove('sidebar-open');
            }
        }
    }
    
    window.addEventListener('resize', handleResize);
    
    // Set active menu item based on current page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const menuLinks = document.querySelectorAll('.sidebar-nav a[href]');
    
    menuLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.parentElement.classList.add('active');
            // Expand parent submenus
            let parent = link.closest('.has-submenu');
            while (parent) {
                parent.classList.add('active');
                parent = parent.closest('.has-submenu');
            }
        }
    });
});
