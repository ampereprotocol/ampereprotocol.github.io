document.addEventListener('DOMContentLoaded', function() {
    // Initialize 3D Model Viewer
    init3DModelViewer();

    // Initialize Charts
    initCharts();

    // Setup Table of Contents navigation
    setupTOCNavigation();

    // Setup interactive tabs
    setupInteractiveTabs();

    // Setup download buttons
    setupDownloadButtons();

    // Setup mobile menu for whitepaper navigation
    setupMobileNavigation();

    // Initialize smooth scroll for anchor links
    initSmoothScroll();
});

function init3DModelViewer() {
    const container = document.getElementById('model-viewer');
    if (!container) return;

    // Create scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    // Create camera
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 5;

    // Create renderer
    const renderer = new THREE.WebGLRenderer({
        canvas: document.getElementById('3d-canvas'),
        antialias: true
    });
    renderer.setSize(container.clientWidth, container.clientHeight);

    // Add lights
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // Create solar system model
    createSolarSystemModel(scene);

    // Add controls
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;

    // Handle view changes
    const viewButtons = document.querySelectorAll('.model-control-btn');
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const view = this.getAttribute('data-view');
            changeModelView(view, camera, controls);

            // Update active button
            viewButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }

    animate();

    // Hide loading indicator
    setTimeout(() => {
        document.querySelector('.model-loading').style.display = 'none';
    }, 1500);

    // Handle window resize
    window.addEventListener('resize', function() {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
}

function createSolarSystemModel(scene) {

    // Create solar farm base
    const solarFarmBase = new THREE.Group();

    // Create ground plane
    const groundGeometry = new THREE.PlaneGeometry(10, 10);
    const groundMaterial = new THREE.MeshStandardMaterial({
        color: 0x333333,
        roughness: 0.8,
        metalness: 0.2
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    solarFarmBase.add(ground);

    // Create solar panels array
    const solarPanelGeometry = new THREE.BoxGeometry(0.8, 0.02, 0.5);
    const solarPanelMaterial = new THREE.MeshStandardMaterial({
        color: 0x111111,
        emissive: 0xFFC107,
        emissiveIntensity: 0.3,
        metalness: 0.7,
        roughness: 0.2

    });

    // Create 4x4 grid of solar panels
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            const panel = new THREE.Mesh(solarPanelGeometry, solarPanelMaterial);
            panel.position.x = (i - 1.5) * 1.2;
            panel.position.z = (j - 1.5) * 0.8;
            panel.position.y = 0.01;
            panel.castShadow = true;
            panel.receiveShadow = true;

            // Add slight tilt to panels
            panel.rotation.x = -Math.PI / 6;

            solarFarmBase.add(panel);
        }
    }

    // Create blockchain nodes (servers)
    const nodeGeometry = new THREE.BoxGeometry(0.4, 0.6, 0.4);
    const nodeMaterial = new THREE.MeshStandardMaterial({
        color: 0x3E80FF,
        emissive: 0x3E80FF,
        emissiveIntensity: 0.1,
        metalness: 0.5,
        roughness: 0.5
    });

    // Create 3 blockchain nodes
    for (let i = 0; i < 3; i++) {
        const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
        node.position.x = -3 + i * 3;
        node.position.y = 0.3;
        node.position.z = -2;
        node.castShadow = true;
        node.receiveShadow = true;

        // Add LED lights to nodes
        const ledGeometry = new THREE.SphereGeometry(0.05, 8, 8);
        const ledMaterial = new THREE.MeshStandardMaterial({
            color: 0x00FF00,
            emissive: 0x00FF00,
            emissiveIntensity: 0.5
        });

        for (let j = 0; j < 3; j++) {
            const led = new THREE.Mesh(ledGeometry, ledMaterial);
            led.position.x = -0.15 + j * 0.15;
            led.position.y = 0.25;
            led.position.z = 0.2;
            node.add(led);
        }

        scene.add(node);
    }

    // Create energy storage (battery)
    const batteryGeometry = new THREE.BoxGeometry(0.5, 0.8, 0.3);
    const batteryMaterial = new THREE.MeshStandardMaterial({
        color: 0x4CAF50,
        metalness: 0.3,
        roughness: 0.4
    });
    const battery = new THREE.Mesh(batteryGeometry, batteryMaterial);
    battery.position.set(0, 0.4, 2);
    battery.castShadow = true;
    battery.receiveShadow = true;
    scene.add(battery);

    // Add energy flow lines
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x4CAF50, linewidth: 2 });

    // From solar to battery
    const solarToBatteryPoints = [];
    solarToBatteryPoints.push(new THREE.Vector3(0, 0.5, 0));
    solarToBatteryPoints.push(new THREE.Vector3(0, 0.8, 1));
    solarToBatteryPoints.push(new THREE.Vector3(0, 0.4, 2));
    const solarToBatteryGeometry = new THREE.BufferGeometry().setFromPoints(solarToBatteryPoints);
    const solarToBatteryLine = new THREE.Line(solarToBatteryGeometry, lineMaterial);
    scene.add(solarToBatteryLine);

    // From battery to nodes
    for (let i = 0; i < 3; i++) {
        const batteryToNodePoints = [];
        batteryToNodePoints.push(new THREE.Vector3(0, 0.4, 2));
        batteryToNodePoints.push(new THREE.Vector3(-3 + i * 3, 0.3, -1));
        batteryToNodePoints.push(new THREE.Vector3(-3 + i * 3, 0.3, -2));
        const batteryToNodeGeometry = new THREE.BufferGeometry().setFromPoints(batteryToNodePoints);
        const batteryToNodeLine = new THREE.Line(batteryToNodeGeometry, lineMaterial);
        scene.add(batteryToNodeLine);
    }

    // Add token flow particles
    const particleCount = 100;
    const particles = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
        // Position particles along the energy flow lines
        const t = Math.random();
        let x, y, z;

        if (t < 0.5) {
            // Solar to battery path
            x = 0;
            y = 0.5 + t * 0.6;
            z = t * 4;
        } else {
            // Battery to nodes path
            const nodeIndex = Math.floor(Math.random() * 3);
            x = -3 + nodeIndex * 3;
            y = 0.3;
            z = -2 + (1 - t) * 4;
        }

        particlePositions[i * 3] = x;
        particlePositions[i * 3 + 1] = y;
        particlePositions[i * 3 + 2] = z;

        // Random gold/yellow color for tokens
        particleColors[i * 3] = 0.9 + Math.random() * 0.1; // R
        particleColors[i * 3 + 1] = 0.7 + Math.random() * 0.2; // G
        particleColors[i * 3 + 2] = 0.1 + Math.random() * 0.1; // B
    }

    particles.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particles.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleMaterial = new THREE.PointsMaterial({
        size: 0.1,
        vertexColors: true,
        transparent: true,
        opacity: 0.8
    });

    const particleSystem = new THREE.Points(particles, particleMaterial);
    scene.add(particleSystem);

    // Add the solar farm to the scene
    scene.add(solarFarmBase);

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    // Add directional light (sun)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 7);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    // Add hemisphere light for natural lighting
    const hemisphereLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 0.5);
    scene.add(hemisphereLight);
}
function changeModelView(view, camera, controls) {
    switch(view) {
        case 'overview':
            camera.position.set(0, 3, 5);
            controls.target.set(0, 0, 0);
            break;
        case 'blockchain':
            camera.position.set(0, 1, 3);
            controls.target.set(0, 0, 0);
            break;
        case 'solar':
            camera.position.set(3, 2, 3);
            controls.target.set(0, 0, 0);
            break;
        case 'token':
            camera.position.set(-3, 1, 3);
            controls.target.set(0, 0, 0);
            break;
    }
}

function initCharts() {
    // Energy Flow Chart
    const energyCtx = document.getElementById('energyFlowChart');
    if (energyCtx) {
        new Chart(energyCtx, {
            type: 'doughnut',
            data: {
                labels: ['Solar Production', 'Grid Storage', 'Direct Consumption', 'Token Conversion'],
                datasets: [{
                    data: [45, 25, 20, 10],
                    backgroundColor: [
                        '#FFC107',
                        '#4CAF50',
                        '#3E80FF',
                        '#9C27B0'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    // Token Flow Chart
    const tokenCtx = document.getElementById('tokenFlowChart');
    if (tokenCtx) {
        new Chart(tokenCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Token Generation',
                    data: [1200, 1900, 1700, 2100, 2400, 2800],
                    borderColor: '#3E80FF',
                    backgroundColor: 'rgba(62, 128, 255, 0.1)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    // Network Growth Chart
    const networkCtx = document.getElementById('networkGrowthChart');
    if (networkCtx) {
        new Chart(networkCtx, {
            type: 'bar',
            data: {
                labels: ['2023', '2024', '2025', '2026', '2027'],
                datasets: [{
                    label: 'Solar Nodes',
                    data: [50, 200, 800, 2000, 5000],
                    backgroundColor: '#3E80FF'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    // Token Distribution Chart
    const tokenDistCtx = document.getElementById('tokenDistributionChart');
    if (tokenDistCtx) {
        new Chart(tokenDistCtx, {
            type: 'pie',
            data: {
                labels: ['Energy Production', 'Network Security', 'Development Fund', 'Community Rewards', 'Reserve'],
                datasets: [{
                    data: [65, 15, 10, 7, 3],
                    backgroundColor: [
                        '#3E80FF',
                        '#4CAF50',
                        '#FFC107',
                        '#9C27B0',
                        '#F44336'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }
}

function setupTOCNavigation() {
    // Generate sidebar navigation
    const sections = document.querySelectorAll('.content-section');
    const navList = document.getElementById('whitepaper-nav');

    if (sections.length && navList) {
        sections.forEach(section => {
            const id = section.getAttribute('id');
            const title = section.querySelector('h2').textContent;

            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = `#${id}`;
            a.textContent = title;

            li.appendChild(a);
            navList.appendChild(li);
        });
    }

    // Highlight current section in sidebar
    window.addEventListener('scroll', function() {
        const fromTop = window.scrollY + 150;

        document.querySelectorAll('.content-section').forEach(section => {
            const sectionId = section.getAttribute('id');
            const navItem = document.querySelector(`#whitepaper-nav a[href="#${sectionId}"]`);

            if (section.offsetTop <= fromTop &&
                section.offsetTop + section.offsetHeight > fromTop) {
                navItem.classList.add('active');
            } else {
                navItem.classList.remove('active');
            }
        });
    });
}

function setupInteractiveTabs() {
    // Visualization tabs
    const vizTabs = document.querySelectorAll('.viz-tab');
    const vizPanes = document.querySelectorAll('.viz-pane');

    vizTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');

            // Update active tab
            vizTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');

            // Show corresponding pane
            vizPanes.forEach(pane => {
                pane.classList.remove('active');
                if (pane.id === `${tabName}-viz`) {
                    pane.classList.add('active');
                }
            });
        });
    });

    // Model view tabs are handled in init3DModelViewer()
}

function setupDownloadButtons() {
    const downloadBtns = document.querySelectorAll('[id^="download"]');

    downloadBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();

            // Simulate download
            this.innerHTML = '<i class="lni lni-checkmark"></i> Downloading...';

            setTimeout(() => {
                this.innerHTML = '<i class="lni lni-download"></i> Download Complete';
                this.classList.add('downloaded');

                // Reset after 3 seconds
                setTimeout(() => {
                    this.innerHTML = '<i class="lni lni-download"></i> Download PDF';
                    this.classList.remove('downloaded');
                }, 3000);
            }, 1500);
        });
    });
}

function setupMobileNavigation() {
    const mobileNavToggle = document.createElement('button');
    mobileNavToggle.className = 'mobile-nav-toggle';
    mobileNavToggle.innerHTML = '<i class="lni lni-menu"></i> Whitepaper Sections';

    const sidebar = document.querySelector('.whitepaper-sidebar');
    if (sidebar) {
        sidebar.insertBefore(mobileNavToggle, sidebar.firstChild);

        mobileNavToggle.addEventListener('click', function() {
            sidebar.classList.toggle('mobile-active');
        });

        // Close when clicking outside
        document.addEventListener('click', function(e) {
            if (!sidebar.contains(e.target) && e.target !== mobileNavToggle) {
                sidebar.classList.remove('mobile-active');
            }
        });
    }
}

function initSmoothScroll() {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });

                // Close mobile nav if open
                const sidebar = document.querySelector('.whitepaper-sidebar');
                if (sidebar) {
                    sidebar.classList.remove('mobile-active');
                }
            }
        });
    });
}

// Initialize Three.js if not already loaded
if (typeof THREE === 'undefined') {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
    script.onload = function() {
        const orbitScript = document.createElement('script');
        orbitScript.src = 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.min.js';
        document.head.appendChild(orbitScript);
    };
    document.head.appendChild(script);
}

// Initialize Chart.js if not already loaded
if (typeof Chart === 'undefined') {
    const chartScript = document.createElement('script');
    chartScript.src = 'https://cdn.jsdelivr.net/npm/chart.js';
    document.head.appendChild(chartScript);
}

// Mobile-friendly 3D viewer adjustments
function adapt3DViewerForMobile() {
    const modelViewer = document.getElementById('model-viewer');
    if (!modelViewer) return;

    function handleResize() {
        if (window.innerWidth < 768) {
            // Mobile adjustments
            modelViewer.style.height = '300px';

            // Make controls scrollable
            const controls = document.querySelector('.model-controls');
            if (controls) {
                controls.style.overflowX = 'auto';
                controls.style.whiteSpace = 'nowrap';
            }
        } else {
            // Reset desktop settings
            modelViewer.style.height = '500px';
            const controls = document.querySelector('.model-controls');
            if (controls) {
                controls.style.overflowX = '';
                controls.style.whiteSpace = '';
            }
        }
    }

    // Initial setup
    handleResize();

    // Update on resize
    window.addEventListener('resize', handleResize);
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', function() {
    // Existing initialization code...
    adapt3DViewerForMobile();
});
