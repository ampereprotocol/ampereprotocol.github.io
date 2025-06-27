/* assets/js/subscriptions.js */

document.addEventListener("DOMContentLoaded", () => {

    // 1. GSAP Scroll-Triggered Panel Pinning & Animation
    gsap.registerPlugin(ScrollTrigger);

    if (document.querySelector("#pin-container")) {
        if (window.matchMedia("(min-width: 992px)").matches) {
            ScrollTrigger.create({
                trigger: "#pin-container",
                pin: ".panel-visual-pin-wrapper",
                start: "top top",
                end: "bottom bottom",
            });

            const featureCards = gsap.utils.toArray('.scroll-feature-card');
            featureCards.forEach((card) => {
                ScrollTrigger.create({
                    trigger: card,
                    start: "top 75%",
                    end: "bottom 25%",
                    toggleClass: "is-in-view",
                });
            });
        }
    }

    // 2. Payment Calculator Logic
    const financingSlider = document.getElementById('financingYears');
    const planRadios = document.querySelectorAll('input[name="plan"]');
    if (financingSlider) {
        const panelInstallmentEl = document.getElementById('panelInstallment');
        const subscriptionFeeEl = document.getElementById('subscriptionFee');
        const totalMonthlyCostEl = document.getElementById('totalMonthlyCost');

        function calculateTotal() {
            const panelBasePrice = 4500;
            const financingInterest = 0.025;

            const years = parseInt(financingSlider.value);
            const selectedPlanFee = parseFloat(document.querySelector('input[name="plan"]:checked').value);

            let panelMonthly = 0;
            if (years > 0) {
                const totalFinanced = panelBasePrice * (1 + financingInterest);
                panelMonthly = totalFinanced / (years * 12);
            }

            const totalMonthly = panelMonthly + selectedPlanFee;

            panelInstallmentEl.textContent = `€${panelMonthly.toFixed(2)}`;
            subscriptionFeeEl.textContent = `€${selectedPlanFee.toFixed(2)}`;
            totalMonthlyCostEl.textContent = `€${totalMonthly.toFixed(2)}`;
        }

        financingSlider.addEventListener('input', calculateTotal);
        planRadios.forEach(radio => radio.addEventListener('change', calculateTotal));
        calculateTotal();
    }

    // 3. Payment Modal Logic (CORRECTED AND MADE SAFER)
    const paymentModal = document.getElementById('paymentModal');
    if (paymentModal) {
        const closeModalBtn = document.getElementById('closeModal');
        const subscribeButtons = document.querySelectorAll('.plan-card .btn');
        const modalPlanName = document.getElementById('modalPlanName');
        const modalPlanPrice = document.getElementById('modalPlanPrice'); // This is the element causing the error

        const planPrices = {'Standard': '€15/month', 'Plus': '€25/month', 'Premium': '€45/month'};

        subscribeButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const plan = button.dataset.plan;

                // --- SAFETY CHECKS ADDED HERE ---
                // Check if the modal elements exist before trying to change them.
                if (modalPlanName) {
                    modalPlanName.textContent = plan;
                }
                if (modalPlanPrice) {
                    modalPlanPrice.textContent = planPrices[plan] || 'N/A';
                }
                // --- END OF SAFETY CHECKS ---

                paymentModal.classList.add('active');
            });
        });

        const closeModal = () => paymentModal.classList.remove('active');
        closeModalBtn.addEventListener('click', closeModal);
        paymentModal.addEventListener('click', (e) => { if (e.target === paymentModal) closeModal(); });

        const tabLinks = document.querySelectorAll('.payment-tabs .tab-link');
        const tabContents = document.querySelectorAll('.modal-body .tab-content');
        tabLinks.forEach(link => {
            link.addEventListener('click', () => {
                tabLinks.forEach(l => l.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));
                link.classList.add('active');
                document.getElementById(link.dataset.tab).classList.add('active');
            });
        });

        const cardForm = document.getElementById('card-payment-form');
        if (cardForm) {
            cardForm.addEventListener('submit', (e) => {
                e.preventDefault();
                alert('Thank you for your subscription! (This is a demo)');
                closeModal();
            });
        }
    }

    // 4. FAQ Accordion Logic
    const accordionItems = document.querySelectorAll('.accordion-item');
    if (accordionItems.length > 0) {
        accordionItems.forEach(item => {
            const button = item.querySelector('.accordion-button');
            const content = item.querySelector('.accordion-content');
            if (button && content) {
                button.addEventListener('click', () => {
                    const isOpened = item.classList.contains('active');
                    accordionItems.forEach(otherItem => {
                        otherItem.classList.remove('active');
                        otherItem.querySelector('.accordion-content').style.maxHeight = null;
                    });
                    if (!isOpened) {
                        item.classList.add('active');
                        content.style.maxHeight = content.scrollHeight + 'px';
                    }
                });
            }
        });
    }

    console.log("Subscriptions page interactive scripts loaded successfully.");
});
