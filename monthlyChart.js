// monthlyChart.js
document.addEventListener('DOMContentLoaded', function () {
    const ctx = document.getElementById('readingTrendChart').getContext('2d');

    function getMonthlyReadData() {
        const data = JSON.parse(localStorage.getItem('books')) || [];
        const monthlyCounts = new Array(12).fill(0);
        data.forEach(book => {
            if (book.dateFinished) {
                const date = new Date(book.dateFinished);
                if (!isNaN(date.getTime())) {
                    const month = date.getMonth(); // 0 - 11
                    monthlyCounts[month]++;
                }
            }
        });
        return monthlyCounts;
    }

    const currentYear = new Date().getFullYear();

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [{
                label: `${currentYear}年阅读趋势`,
                data: getMonthlyReadData(),
                backgroundColor: [
                    '#b8c0d4', '#c8d6c1', '#d9cfc3', '#e8c0b9',
                    '#f4d7d0', '#dbc2cf', '#bedadc', '#c2c2b0',
                    '#b6a6ca', '#b9d8d3', '#d4cbc4', '#c6d3c8'
                ],
                borderRadius: 6
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: (context) => ` ${context.parsed.y} 本书`
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        precision: 0
                    }
                }
            }
        }
    });
});