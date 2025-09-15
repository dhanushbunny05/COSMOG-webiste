document.addEventListener('DOMContentLoaded', () => {

    // --- Configuration ---
    // You can set this to 'true' or 'false' to easily manage registration status.
    // Set to 'true' to enable, 'false' to disable.
    const isRegistrationOpen = false; // 👈 Set this to false to close registration
    const googleFormLinks = {
        // ... (your existing links) ...
    };
    const eventDetails = {
        // ... (your existing event details) ...
    };

    // --- Modal Elements ---
    const modalOverlay = document.getElementById('registration-modal-overlay');
    const closeBtn = document.querySelector('.modal-close-btn');
    const registerButtons = document.querySelectorAll('.event-register');
    const learnMoreButtons = document.querySelectorAll('.event-learn-more');
    const descriptionView = document.getElementById('description-view');
    const closedRegistrationView = document.getElementById('closed-registration-view'); // 👈 NEW
    const continueToFormBtn = document.getElementById('continue-to-form-btn');
    const eventNameDisplayDesc = document.getElementById('event-name-display-desc');
    const descriptionContent = document.querySelector('#description-view .description-content');

    // Make sure the new close button also works
    const closedModalCloseBtn = document.getElementById('closed-modal-close-btn'); // 👈 NEW

    let currentEventName = '';

    function openModal(eventName) {
        // First, check if registration is open
        if (isRegistrationOpen) {
            // Show the "Learn More" view and hide the "Registration Closed" view
            descriptionView.style.display = 'block';
            closedRegistrationView.style.display = 'none';

            if (!eventName) {
                console.error("Event name is missing.");
                return;
            }
            currentEventName = eventName;
            
            // Populate the modal with event details
            eventNameDisplayDesc.textContent = eventName;
            const details = eventDetails[eventName] || eventDetails.default;
            const rulesHtml = details.rules.map(rule => `<li>${rule}</li>`).join('');
            descriptionContent.innerHTML = `<h3>Overview</h3><p>${details.overview}</p><h3>Rules & Regulations</h3><ul>${rulesHtml}</ul>`;
        } else {
            // Registration is closed: Show the "Registration Closed" view
            descriptionView.style.display = 'none';
            closedRegistrationView.style.display = 'block';
        }

        // Always show the modal overlay, regardless of which view is active
        modalOverlay.classList.add('is-visible');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modalOverlay.classList.remove('is-visible');
        document.body.style.overflow = '';
    }

    // --- Event Listeners ---
    registerButtons.forEach(button => button.addEventListener('click', (e) => {
        e.preventDefault();
        openModal(e.currentTarget.dataset.eventName);
    }));

    learnMoreButtons.forEach(button => button.addEventListener('click', (e) => {
        e.preventDefault();
        openModal(e.currentTarget.dataset.eventName);
    }));

    continueToFormBtn.addEventListener('click', redirectToGoogleForm);
    
    // Add event listener for the new close button
    closedModalCloseBtn.addEventListener('click', closeModal); // 👈 NEW
    
    closeBtn.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalOverlay.classList.contains('is-visible')) closeModal();
    });

    // The rest of your functions (redirectToGoogleForm) remain the same.
    function redirectToGoogleForm() {
        const formLink = googleFormLinks[currentEventName] || googleFormLinks.default;
        if (formLink && !formLink.includes("YOUR_FORM_ID_HERE")) {
            window.open(formLink, '_blank');
            closeModal();
        } else {
            alert('Registration link for this event is not available yet. Please check back later.');
        }
    }
});
