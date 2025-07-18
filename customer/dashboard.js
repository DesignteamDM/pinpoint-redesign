// Customer Dashboard JavaScript - Mockup Version

document.addEventListener('DOMContentLoaded', function() {
    // Initialize sidebar toggle
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const closeSidebar = document.getElementById('closeSidebar');
    const mainContent = document.querySelector('.main-content');
    
    // Set initial sidebar state - always expanded for mockup
    if (window.innerWidth > 768) {
        document.body.classList.remove('sidebar-collapsed');
        mainContent.classList.remove('expanded');
    }

    // Toggle sidebar on button click
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                sidebar.classList.toggle('active');
            } else {
                document.body.classList.toggle('sidebar-collapsed');
                mainContent.classList.toggle('expanded');
                localStorage.setItem('sidebarCollapsed', document.body.classList.contains('sidebar-collapsed'));
            }
        });
    }

    // Close sidebar on close button click (mobile)
    if (closeSidebar) {
        closeSidebar.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('active');
            }
        });
    }

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(event) {
        if (window.innerWidth <= 768 && !sidebar.contains(event.target) && !sidebarToggle.contains(event.target)) {
            sidebar.classList.remove('active');
        }
    });

    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            sidebar.classList.remove('active');
        }
    });

    // Initialize Order Status Chart
    function initOrderStatusChart() {
        const chartElement = document.getElementById('orderStatusChart');
        if (!chartElement) return;

        const options = {
            series: [30, 40, 30],
            chart: {
                type: 'donut',
                height: 300,
                fontFamily: 'inherit',
                toolbar: {
                    show: false
                },
                animations: {
                    enabled: true,
                    easing: 'easeinout',
                    speed: 800,
                    animateGradually: {
                        enabled: true,
                        delay: 150
                    },
                    dynamicAnimation: {
                        enabled: true,
                        speed: 350
                    }
                }
            },
            labels: ['Processing', 'Shipped', 'Delivered'],
            colors: ['#ff9800', '#2196f3', '#4caf50'],
            legend: {
                position: 'bottom',
                horizontalAlign: 'center',
                fontSize: '13px',
                itemMargin: {
                    horizontal: 8,
                    vertical: 8
                }
            },
            plotOptions: {
                pie: {
                    donut: {
                        size: '65%',
                        labels: {
                            show: true,
                            total: {
                                show: true,
                                showAlways: true,
                                label: 'Total Orders',
                                fontSize: '14px',
                                fontWeight: 500,
                                color: '#333',
                                formatter: function(w) {
                                    return w.globals.seriesTotals.reduce((a, b) => a + b, 0);
                                }
                            }
                        }
                    }
                }
            },
            responsive: [{
                breakpoint: 768,
                options: {
                    chart: {
                        height: 280
                    },
                    legend: {
                        position: 'bottom'
                    }
                }
            }]
        };

        const chart = new ApexCharts(chartElement, options);
        chart.render();
    }

    // Initialize all charts
    function initCharts() {
        initOrderStatusChart();
        // Add more chart initializations here if needed
    }

    // Initialize everything when the DOM is fully loaded
    initCharts();

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

    // Mock data loading for demo purposes
    function loadMockData() {
        console.log('Mock dashboard data loaded');
        // No API calls, just using static data for mockup
    }

    // Load mock data
    loadMockData();
});

// Handle page transitions
setTimeout(function() {
    document.body.classList.add('loaded');
}, 100);


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
    