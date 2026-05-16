// Initialize Lucide icons
lucide.createIcons();

// Navigation function
function showScreen(screenId, element) {
    // Hide all screens
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => {
        screen.classList.remove('active');
    });

    // Show the selected screen
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active');
    }

    // Update active nav link
    if (element) {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.classList.remove('active');
        });
        element.classList.add('active');
    }

    // Scroll to top
    window.scrollTo(0, 0);

    // Specific screen logic
    if (screenId === 'ecocam') {
        startScannerSimulation();
    }
}

// Onboarding logic
function closeOnboarding() {
    const onboarding = document.getElementById('onboarding');
    onboarding.style.opacity = '0';
    onboarding.style.transition = 'opacity 0.5s ease-out';
    setTimeout(() => {
        onboarding.style.display = 'none';
    }, 500);
}

function goToLogin() {
    closeOnboarding();
    setTimeout(() => {
        showScreen('login');
    }, 100);
}

function startScannerSimulation() {
    const corners = document.querySelector('.scan-corners');
    if (corners) {
        corners.style.animation = 'pulse 2s infinite';
    }
}

// Category Selection Logic
function selectCategory(button) {
    // Remove selected class from all category buttons
    const buttons = document.querySelectorAll('.category-btn');
    buttons.forEach(btn => {
        btn.classList.remove('selected');
    });

    // Add selected class to the clicked button
    button.classList.add('selected');
}

function simulateScan() {
    // Show a loading state or just go to success
    alert("¡Escaneo validado! +5 ETK sumados a tu cuenta.");
    showScreen('dashboard');
    
    // Update balance (visual only for demo)
    const tokens = document.querySelectorAll('div[style*="font-weight: 800; font-size: 1.2rem;"]');
    tokens.forEach(el => {
        if (el.innerText === '2,450') el.innerText = '2,455';
    });
}

function submitReport() {
    alert("Reporte enviado exitosamente. Tu contribución está siendo verificada por el equipo de Sentinel-CBBA.");
    showScreen('dashboard');
}

function showConfirmRedemption() {
    showScreen('confirm-redemption');
}

function confirmRedemption() {
    showScreen('ticket');
    
    // Update balance logic (visual for demo)
    const tokens = document.querySelectorAll('div[style*="font-weight: 800; font-size: 1.2rem;"]');
    tokens.forEach(el => {
        if (el.innerText === '2,455' || el.innerText === '2,450') el.innerText = '2,005';
    });
}

function toggleMapDrawer() {
    const drawer = document.getElementById('map-drawer');
    drawer.classList.toggle('active');
}

// Ticket Simulation
function showTicket() {
    const confirm = window.confirm("¿Confirmar canje de 450 ETK por Canasta EMAPA?");
    if (confirm) {
        showScreen('ticket');
    }
}

// Pulse animation for scanner
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0% { transform: translate(-50%, -50%) scale(1); border-color: rgba(0, 200, 83, 0.3); }
        50% { transform: translate(-50%, -50%) scale(1.05); border-color: rgba(0, 200, 83, 0.8); }
        100% { transform: translate(-50%, -50%) scale(1); border-color: rgba(0, 200, 83, 0.3); }
    }
`;
document.head.appendChild(style);

// Check if onboarding was already shown (optional for demo)
// For this demo, we always show it first.
