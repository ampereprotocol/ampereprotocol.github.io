// Responsive Chart Handling
function handleChartResize() {
    // Token Distribution Chart
    if (window.innerWidth < 768) {
        distributionChart.options.cutout = '60%';
        distributionChart.options.plugins.legend.position = 'bottom';
    } else {
        distributionChart.options.cutout = '70%';
        distributionChart.options.plugins.legend.position = 'right';
    }
    distributionChart.update();

    // Emission Curve Chart
    if (window.innerWidth < 768) {
        const newWidth = document.getElementById('emissionCurveChart').clientWidth - 30;
        d3.select("#emissionCurveChart svg")
            .attr("width", newWidth)
            .attr("height", 250);

        d3.select("#emissionCurveChart svg g")
            .attr("transform", `translate(30,20)`);

        // Adjust axis for mobile
        svg.selectAll(".tick text")
            .style("font-size", "10px");
    }
}

// Initialize and listen for resize
window.addEventListener('load', handleChartResize);
window.addEventListener('resize', handleChartResize);

document.addEventListener('DOMContentLoaded', function() {
    // Initialize animations
    new WOW().init();

    // Token Distribution Chart
    const distributionCtx = document.getElementById('tokenDistributionChart').getContext('2d');
    const distributionChart = new Chart(distributionCtx, {
        type: 'doughnut',
        data: {
            labels: ['Solar Rewards', 'Ecosystem Development', 'Team & Advisors', 'Liquidity & Exchange', 'Community & Marketing'],
            datasets: [{
                data: [40, 25, 15, 12, 8],
                backgroundColor: [
                    '#3E80FF',
                    '#7E57FF',
                    '#FF6F61',
                    '#FFC107',
                    '#4CAF50'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '70%',
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        boxWidth: 12,
                        padding: 20,
                        font: {
                            family: "'DM Sans', sans-serif",
                            size: 12
                        },
                        color: '#666'
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.label}: ${context.raw}%`;
                        }
                    }
                }
            }
        }
    });

    // Emission Curve Chart with D3.js
    const emissionData = [
        { day: 0, emission: 50000 },
        { day: 180, emission: 50000 },
        { day: 181, emission: 42000 },
        { day: 540, emission: 42000 },
        { day: 541, emission: 35000 },
        { day: 900, emission: 35000 },
        { day: 901, emission: 28000 },
        { day: 1200, emission: 28000 }
    ];

    const margin = {top: 20, right: 30, bottom: 40, left: 50};
    const width = document.getElementById('emissionCurveChart').clientWidth - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const svg = d3.select("#emissionCurveChart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear()
        .domain([0, d3.max(emissionData, d => d.day)])
        .range([0, width]);

    const y = d3.scaleLinear()
        .domain([0, d3.max(emissionData, d => d.emission) * 1.1])
        .range([height, 0]);

    const line = d3.line()
        .x(d => x(d.day))
        .y(d => y(d.emission))
        .curve(d3.curveStepAfter);

    svg.append("path")
        .datum(emissionData)
        .attr("fill", "none")
        .attr("stroke", "#3E80FF")
        .attr("stroke-width", 3)
        .attr("d", line);

    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x).ticks(5).tickFormat(d => `Day ${d}`))
        .selectAll("text")
        .style("font-family", "'DM Sans', sans-serif")
        .style("font-size", "12px");

    svg.append("g")
        .call(d3.axisLeft(y).ticks(5).tickFormat(d => `${d/1000}k`))
        .selectAll("text")
        .style("font-family", "'DM Sans', sans-serif")
        .style("font-size", "12px");

    svg.append("text")
        .attr("transform", `translate(${width/2},${height + margin.top + 15})`)
        .style("text-anchor", "middle")
        .style("font-family", "'DM Sans', sans-serif")
        .style("font-size", "12px")
        .text("Days Since Launch");

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .style("font-family", "'DM Sans', sans-serif")
        .style("font-size", "12px")
        .text("Daily Emission (AMPERE)");

    // Add phase annotations
    const phases = [
        { name: "Genesis", start: 0, end: 180, color: "#3E80FF" },
        { name: "Expansion", start: 181, end: 540, color: "#7E57FF" },
        { name: "Stabilization", start: 541, end: 900, color: "#FF6F61" },
        { name: "Maturity", start: 901, end: 1200, color: "#FFC107" }
    ];

    phases.forEach(phase => {
        svg.append("rect")
            .attr("x", x(phase.start))
            .attr("y", 0)
            .attr("width", x(phase.end) - x(phase.start))
            .attr("height", height)
            .attr("fill", phase.color)
            .attr("opacity", 0.05);

        svg.append("text")
            .attr("x", x(phase.start + (phase.end - phase.start)/2))
            .attr("y", height/2)
            .attr("text-anchor", "middle")
            .style("font-family", "'DM Sans', sans-serif")
            .style("font-size", "11px")
            .style("font-weight", "600")
            .style("fill", phase.color)
            .text(phase.name);
    });

    // Solar Calculator Functionality
    const solarCapacity = document.getElementById('solarCapacity');
    const sunHours = document.getElementById('sunHours');
    const efficiency = document.getElementById('efficiency');
    const capacityValue = document.getElementById('capacityValue');
    const sunHoursValue = document.getElementById('sunHoursValue');
    const efficiencyValue = document.getElementById('efficiencyValue');
    const dailyProduction = document.getElementById('dailyProduction');
    const dailyRewards = document.getElementById('dailyRewards');
    const monthlyRewards = document.getElementById('monthlyRewards');
    const monthlyValue = document.getElementById('monthlyValue');

    function updateCalculator() {
        const capacity = parseFloat(solarCapacity.value);
        const hours = parseFloat(sunHours.value);
        const eff = parseFloat(efficiency.value) / 100;

        // Calculate daily production (kW * hours * efficiency)
        const production = capacity * hours * eff;
        // Calculate daily rewards (3.2 AMPERE per kWh)
        const rewards = production * 3.2;
        // Calculate monthly rewards
        const monthly = rewards * 30;
        // Calculate value ($0.042 per AMPERE)
        const value = monthly * 0.042;

        // Update display values
        capacityValue.textContent = capacity;
        sunHoursValue.textContent = hours;
        efficiencyValue.textContent = (eff * 100).toFixed(0);
        dailyProduction.textContent = production.toFixed(2) + ' kWh';
        dailyRewards.textContent = rewards.toFixed(2) + ' AMPERE';
        monthlyRewards.textContent = monthly.toFixed(2) + ' AMPERE';
        monthlyValue.textContent = '$' + value.toFixed(2);
    }

    solarCapacity.addEventListener('input', updateCalculator);
    sunHours.addEventListener('input', updateCalculator);
    efficiency.addEventListener('input', updateCalculator);

    // Initialize calculator
    updateCalculator();

    // Update current emission and halving countdown
    function updateEmissionStats() {
        // Simulate dynamic emission data
        const currentDay = 215; // Example day
        let currentEmission;

        if (currentDay <= 180) currentEmission = 50000;
        else if (currentDay <= 540) currentEmission = 42000;
        else if (currentDay <= 900) currentEmission = 35000;
        else currentEmission = 28000;

        const nextHalving = 541 - currentDay; // Example next halving

        document.getElementById('currentEmission').textContent = currentEmission.toLocaleString();
        document.getElementById('halvingCountdown').textContent = nextHalving > 0 ? nextHalving : '0';
    }

    updateEmissionStats();

    // Simulate price updates
    function updateTokenPrice() {
        // Simulate small price fluctuations
        const currentPrice = 0.042;
        const fluctuation = (Math.random() * 0.002 - 0.001);
        const newPrice = Math.max(0.04, currentPrice + fluctuation);

        document.getElementById('currentPrice').textContent = '$' + newPrice.toFixed(3);

        // Update energy value (price / 0.013125 which is $0.042 per 3.2 kWh)
        const energyValue = (3.2 * newPrice / 0.042).toFixed(1);
        document.getElementById('energyValue').textContent = energyValue + ' kWh';
    }

    // Update price every 5 seconds
    updateTokenPrice();
    setInterval(updateTokenPrice, 5000);

    // Phantom Wallet Integration
    const connectButton = document.getElementById('connectWallet');

    connectButton.addEventListener('click', async () => {
        try {
            if (!window.solana || !window.solana.isPhantom) {
                window.open('https://phantom.app/', '_blank');
                alert('Phantom Wallet is not installed! You will be redirected to the Phantom website.');
                return;
            }

            const resp = await window.solana.connect();
            if (resp.publicKey) {
                console.log('Connected successfully! Public Key:', resp.publicKey.toString());
                connectButton.textContent = "Connected";
                connectButton.classList.add('connected');

                // Store connection status
                localStorage.setItem('walletConnected', 'true');
                localStorage.setItem('publicKey', resp.publicKey.toString());
            }
        } catch (err) {
            console.error('Connection error:', err);
            alert('Error connecting to wallet: ' + err.message);
        }
    });

    // Check if wallet is already connected
    if (localStorage.getItem('walletConnected') === 'true') {
        connectButton.textContent = "Connected";
        connectButton.classList.add('connected');
    }
});
