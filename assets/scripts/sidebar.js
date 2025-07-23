// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Toggle sidebar on mobile
    const sidebarToggle = document.getElementById('sidebarToggle');
    const closeSidebar = document.getElementById('closeSidebar');
    const sidebar = document.querySelector('.sidebar');
    
    // Toggle sidebar visibility
    function toggleSidebar(forceExpand = false) {
        if (!sidebar) return;
        
        // If forceExpand is true, make sure sidebar is expanded
        if (forceExpand) {
            sidebar.classList.remove('collapsed');
            document.body.classList.remove('sidebar-collapsed');
            return true; // Return true if we expanded the sidebar
        } else {
            // Check if we're about to collapse the sidebar
            const willCollapse = !sidebar.classList.contains('collapsed');
            
            // Toggle the collapsed state
            sidebar.classList.toggle('collapsed');
            document.body.classList.toggle('sidebar-collapsed');
            
            // If we're collapsing the sidebar, close all submenus
            if (willCollapse) {
                closeAllSubmenus();
            }
            
            return willCollapse; // Return true if it was expanded and is now collapsed
        }
    }
    
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            toggleSidebar();
        });
    }
    
    if (closeSidebar) {
        closeSidebar.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            toggleSidebar();
        });
    }
    
    // Close all submenus except the one being opened
    function closeOtherSubmenus(currentItem) {
        const allMenuItems = document.querySelectorAll('.has-submenu');
        allMenuItems.forEach(item => {
            if (item !== currentItem) {
                item.classList.remove('active');
                const submenu = item.querySelector('.submenu');
                if (submenu) submenu.style.display = 'none';
            }
        });
    }
    
    // Toggle submenu for a menu item
    function toggleSubmenu(item, e) {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        
        const parent = item.closest('.has-submenu');
        if (!parent) return;
        
        // Check if sidebar is collapsed and expand it if needed
        const wasCollapsed = sidebar.classList.contains('collapsed');
        if (wasCollapsed) {
            toggleSidebar(true); // Force expand the sidebar
        }
        
        // Find the direct child submenu using children and class check
        const submenu = Array.from(parent.children).find(el => el.classList.contains('submenu'));
        if (!submenu) return;
        
        const isActive = parent.classList.contains('active');
        
        // Close all other open submenus at the same level
        const parentList = parent.closest('ul');
        if (parentList && parentList.classList.contains('submenu')) {
            const siblings = Array.from(parentList.children).filter(el => el.classList.contains('has-submenu'));
            siblings.forEach(sib => {
                if (sib !== parent) {
                    sib.classList.remove('active');
                    const sibSubmenu = Array.from(sib.children).find(el => el.classList.contains('submenu'));
                    if (sibSubmenu) sibSubmenu.style.display = 'none';
                }
            });
        } else {
            closeOtherSubmenus(parent);
        }
        
        // Toggle current submenu
        if (isActive) {
            parent.classList.remove('active');
            submenu.style.display = 'none';
        } else {
            parent.classList.add('active');
            submenu.style.display = 'block';
            
            // If we expanded the sidebar, ensure the submenu is visible
            if (wasCollapsed) {
                submenu.style.display = 'block';
            }
        }
    }
    
    // Initialize menu items with submenus
    function initializeMenuItems() {
        console.log('Initializing menu items...');
        
        // Get all menu items that have submenus
        const menuItems = document.querySelectorAll('.has-submenu > a, .has-submenu > .menu-item');
        
        menuItems.forEach(item => {
            // Make sure the item is focusable
            item.setAttribute('tabindex', '0');
            
            // Remove any existing event listeners to prevent duplicates
            const newItem = item.cloneNode(true);
            item.parentNode.replaceChild(newItem, item);
            
            // Add click handler to the new node
            newItem.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('Menu item clicked:', newItem.textContent.trim());
                toggleSubmenu(newItem, e);
            });
            
            // Add keyboard accessibility
            newItem.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Key pressed:', e.key, 'on', newItem.textContent.trim());
                    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                        // Navigate between menu items
                        const menuContainer = this.closest('ul');
                        if (menuContainer) {
                            const items = Array.from(menuContainer.querySelectorAll('.menu-item'));
                            const currentIndex = items.indexOf(this);
                            const direction = e.key === 'ArrowRight' ? 1 : -1;
                            const nextIndex = (currentIndex + direction + items.length) % items.length;
                            
                            if (items[nextIndex]) {
                                items[nextIndex].focus();
                            }
                        }
                    } else {
                        toggleSubmenu(this, e);
                    }
                } else if (e.key === 'Escape') {
                    // Close current submenu
                    const parent = this.closest('.has-submenu');
                    if (parent) {
                        parent.classList.remove('active');
                        const submenu = parent.querySelector('> .submenu');
                        if (submenu) submenu.style.display = 'none';
                    }
                }
            });
        });
    }
    
    // Close all submenus by default
    function closeAllSubmenus() {
        const allSubmenus = document.querySelectorAll('.has-submenu');
        allSubmenus.forEach(menu => {
            menu.classList.remove('active');
            const submenu = Array.from(menu.children).find(el => el.classList.contains('submenu'));
            if (submenu) submenu.style.display = 'none';
        });
    }

    // Initialize the menu when the DOM is loaded
    // Use setTimeout to ensure all elements are available
    setTimeout(function() {
        closeAllSubmenus(); // Ensure all submenus are closed on load
        initializeMenuItems();
        console.log('Menu initialization complete');
    }, 100);
    
    // Only close submenus when clicking on their parent menu item
    // Removed outside click handler to prevent closing when clicking outside
    
    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            // Reset all submenus on mobile view
            if (window.innerWidth <= 992) {
                document.querySelectorAll('.has-submenu').forEach(item => {
                    item.classList.remove('active');
                    const submenu = item.querySelector('> .submenu');
                    if (submenu) submenu.style.display = 'none';
                });
            }
        }, 250);
    });
    
    // Initialize the menu
    initializeMenuItems();
});