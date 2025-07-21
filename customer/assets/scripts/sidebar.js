/**
 * Sidebar functionality for the Pinpoint Customer Portal
 * Handles sidebar toggling, responsive behavior, and state management
 */

(function() {
    'use strict';
    
    // Wait for the DOM to be fully loaded
    document.addEventListener('DOMContentLoaded', function() {
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
        // Initialize the sidebar
        function initializeSidebar() {
            // Toggle sidebar on all screen sizes
            if (sidebarToggle) {
                sidebarToggle.addEventListener('click', function() {
                    const isCollapsed = document.body.classList.toggle('sidebar-collapsed');
                    
                    // Toggle full-width class on main content
                    if (mainContent) {
                        mainContent.classList.toggle('full-width', isCollapsed);
                        
                        // Adjust margin for main content
                        if (isCollapsed) {
                            mainContent.style.marginLeft = '60px';
                            mainContent.style.width = 'calc(100% - 60px)';
                        } else {
                            mainContent.style.marginLeft = '250px';
                            mainContent.style.width = 'calc(100% - 250px)';
                        }
                    }
                    
                    // Save user preference
                    localStorage.setItem('sidebarState', isCollapsed ? 'collapsed' : 'expanded');
                });
                
                // Initialize the sidebar state from localStorage
                const sidebarState = localStorage.getItem('sidebarState') || 'expanded';
                if (sidebarState === 'collapsed') {
                    document.body.classList.add('sidebar-collapsed');
                    if (mainContent) {
                        mainContent.classList.add('full-width');
                        mainContent.style.marginLeft = '60px';
                        mainContent.style.width = 'calc(100% - 60px)';
                    }
                } else if (mainContent) {
                    mainContent.style.marginLeft = '250px';
                    mainContent.style.width = 'calc(100% - 250px)';
                }
            }
        }
        
        // Call the initialization function
        initializeSidebar();
        
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
            console.log('Adding click event listener to sidebar toggle button');
            sidebarToggle.addEventListener('click', function(e) {
                console.log('Sidebar toggle clicked', { 
                    windowWidth: window.innerWidth,
                    isMobile: window.innerWidth <= 768,
                    isCollapsed: document.body.classList.contains('sidebar-collapsed')
                });
                console.log('Before toggle - body classes:', document.body.className);
                console.log('Before toggle - sidebar classes:', sidebar.className);
                console.log('Before toggle - mainContent classes:', mainContent.className);
                
                // Force a reflow to ensure styles are applied
                document.body.offsetHeight;
                
                if (window.innerWidth <= 768) {
                    // For mobile: toggle slide-in sidebar
                    const isActive = sidebar.classList.toggle('active');
                    console.log('Mobile: Toggled sidebar active class. New state:', isActive);
                    localStorage.setItem('sidebarState', isActive ? 'expanded' : 'collapsed');
                } else {
                    // For desktop: toggle collapsed sidebar using computed styles
                    const currentWidth = window.getComputedStyle(sidebar).width;
                    const isCollapsed = currentWidth === '60px';
                    
                    console.log('Current sidebar width:', currentWidth);
                    
                    if (isCollapsed) {
                        // Expand the sidebar
                        sidebar.style.width = '250px';
                        if (mainContent) {
                            mainContent.style.marginLeft = '250px';
                            mainContent.style.width = 'calc(100% - 250px)';
                        }
                        document.body.classList.remove('sidebar-collapsed');
                        console.log('Desktop: Sidebar expanded');
                    } else {
                        // Collapse the sidebar
                        sidebar.style.width = '60px';
                        if (mainContent) {
                            mainContent.style.marginLeft = '60px';
                            mainContent.style.width = 'calc(100% - 60px)';
                        }
                        document.body.classList.add('sidebar-collapsed');
                        console.log('Desktop: Sidebar collapsed');
                    }
                    
                    // Save state
                    const newState = !isCollapsed ? 'collapsed' : 'expanded';
                    localStorage.setItem('sidebarState', newState);
                    console.log('Saved sidebar state:', newState);
                    
                    // Force browser to repaint with new styles
                    document.body.offsetHeight;
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
            const isClickInside = sidebar.contains(event.target) || 
                                (sidebarToggle && sidebarToggle.contains(event.target));
            
            if (window.innerWidth <= 768 && !isClickInside) {
                sidebar.classList.remove('active');
            }
        });
        
        // Handle active navigation items
        const navItems = document.querySelectorAll('.sidebar-nav li');
        navItems.forEach(item => {
            item.addEventListener('click', function() {
                navItems.forEach(i => i.classList.remove('active'));
                this.classList.add('active');
                
                // On mobile, close the sidebar after clicking a nav item
                if (window.innerWidth <= 768) {
                    sidebar.classList.remove('active');
                }
            });
        });
        
        // Handle window resize events
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                // On desktop, remove mobile-specific classes
                sidebar.classList.remove('active');
                
                // Maintain collapsed state if already collapsed
                // (no action needed as the state is already handled by other event listeners)
            } else {
                // On mobile
                if (document.body.classList.contains('sidebar-collapsed')) {
                    // If was collapsed on desktop, reset for mobile
                    document.body.classList.remove('sidebar-collapsed');
                    if (mainContent) mainContent.classList.remove('full-width');
                }
            }
        });
    });
})();
