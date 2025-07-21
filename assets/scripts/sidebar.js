// Sidebar submenu dropdown logic
document.addEventListener('DOMContentLoaded', function () {
    var sidebar = document.querySelector('.sidebar-nav');
    if (!sidebar) return;
    sidebar.addEventListener('click', function (e) {
        var target = e.target;
        // Only handle clicks on <a> inside .has-submenu
        if (target.tagName === 'A' && target.parentElement.classList.contains('has-submenu')) {
            e.preventDefault();
            e.stopPropagation();
            var li = target.parentElement;
            // For nested submenus, only close siblings at the same level
            var siblings = Array.from(li.parentElement.children).filter(function (el) {
                return el !== li && el.classList && el.classList.contains('has-submenu');
            });
            siblings.forEach(function (sib) { sib.classList.remove('open'); });
            li.classList.toggle('open');
        }
    });
    // Optional: close all submenus when clicking outside
    document.addEventListener('click', function (e) {
        var sidebarEl = document.querySelector('.sidebar');
        if (sidebarEl && !sidebarEl.contains(e.target)) {
            document.querySelectorAll('.sidebar-nav li.has-submenu.open').forEach(function (li) {
                li.classList.remove('open');
            });
        }
    });
});
// ...existing code...

        // --- Submenu Dropdown Logic ---
        // Mark items with submenu
        document.querySelectorAll('.sidebar-nav li').forEach(function(li) {
            if (li.querySelector('.submenu')) {
                li.classList.add('has-submenu');
            }
        });

        // Handle submenu toggle (supports 3 levels)
        document.querySelectorAll('.sidebar-nav li.has-submenu > a').forEach(function(link) {
            link.addEventListener('click', function(e) {
                // Only handle if clicking the menu, not a submenu link
                e.preventDefault();
                e.stopPropagation();

                const parentLi = this.parentElement;
                const isOpen = parentLi.classList.contains('open');

                // Close other open siblings at this level
                Array.from(parentLi.parentElement.children).forEach(function(sibling) {
                    if (sibling !== parentLi) sibling.classList.remove('open');
                });

                // Toggle current
                parentLi.classList.toggle('open', !isOpen);
            });
        });

        // Prevent submenu link click from bubbling up
        document.querySelectorAll('.sidebar-nav .submenu a').forEach(function(link) {
            link.addEventListener('click', function(e) {
                e.stopPropagation();
                // Allow navigation if href is set
            });
        });

// ...existing code...