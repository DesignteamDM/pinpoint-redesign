// Customer Dashboard JavaScript - Mockup Version

/**
 * Main dashboard functionality
 * - Order status chart
 * - Data loading and UI updates
 */

document.addEventListener('DOMContentLoaded', function() {
    // Sidebar functionality has been moved to assets/scripts/sidebar.js

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

    // Navigation item handling has been moved to sidebar.js

    // Mock data loading for demo purposes
    function loadMockData() {
        console.log('Mock dashboard data loaded');
        // No API calls, just using static data for mockup
    }

    // Load mock data
    loadMockData();
});

// Page transition
setTimeout(function() {
    document.body.classList.add('loaded');
}, 100);
    