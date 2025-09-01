document.addEventListener('DOMContentLoaded', () => {
    // --- Configuration ---
    // TODO: PASTE YOUR FIREBASE CONFIGURATION OBJECT HERE
    const firebaseConfig = {
        apiKey: "YOUR_API_KEY",
        authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
        projectId: "YOUR_PROJECT_ID",
        storageBucket: "YOUR_PROJECT_ID.appspot.com",
        messagingSenderId: "YOUR_SENDER_ID",
        appId: "YOUR_APP_ID"
    };

    // TODO: ADD YOUR RAZORPAY KEY ID HERE
    const RAZORPAY_KEY_ID = 'YOUR_RAZORPAY_KEY_ID';

    // --- Initialize Firebase ---
    let db;
    try {
        if (typeof firebase !== 'undefined') {
            firebase.initializeApp(firebaseConfig);
            db = firebase.firestore();
            console.log('✅ Firebase initialized successfully');
        } else {
            throw new Error("Firebase SDK not loaded");
        }
    } catch (e) {
        console.error('❌ Firebase initialization error:', e.message);
        // Hide all register buttons if Firebase fails to load
        document.querySelectorAll('.event-register, .register-btn').forEach(btn => btn.style.display = 'none');
        return; // Stop the script if Firebase isn't configured
    }

    // --- DOM Element Selection ---
    const modalOverlay = document.getElementById('registration-modal-overlay');
    const modal = document.getElementById('registration-modal');
    const closeBtn = document.querySelector('.modal-close-btn');
    const registerButtons = document.querySelectorAll('.event-register');
    const descriptionView = document.getElementById('description-view');
    const registrationFormView = document.getElementById('registration-form-view'); // Fixed: separate form view
    const registrationForm = document.querySelector('#registration-form-view form'); // Fixed: select actual form element
    const confirmationView = document.getElementById('confirmation-view');
    const continueToFormBtn = document.getElementById('continue-to-form-btn');
    const eventNameDisplay = document.getElementById('event-name-display');
    const eventNameDisplayDesc = document.getElementById('event-name-display-desc');
    const departmentSelect = document.getElementById('department');

    // --- Department Data ---
    const departments = [
        "Computer Science & Design (CSD)",
        "Artificial Intelligence & Machine Learning (AIML)",
        "Computer Science & Engineering (CSE)",
        "Information Technology (IT)",
        "Electronics & Communication Engineering (ECE)",
        "Electrical & Electronics Engineering (EEE)",
        "Mechanical Engineering (MECH)",
        "Civil Engineering (CIVIL)",
        "Humanities & Sciences (H&S)"
    ];

    let currentEventData = { name: '', amount: 6000 };
    let isProcessing = false; // Add flag to prevent double submissions

    // --- Utility Functions ---
    function generateRegistrationId() {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substr(2, 4).toUpperCase();
        return `COSMOG-${timestamp.toString().slice(-6)}-${random}`;
    }

    function logDebug(message, data = null) {
        console.log(`🔍 [REGISTRATION DEBUG] ${message}`, data || '');
    }

    function showError(message) {
        console.error(`❌ [REGISTRATION ERROR] ${message}`);
        alert(`Registration Error: ${message}`);
    }

    function showSuccess(message) {
        console.log(`✅ [REGISTRATION SUCCESS] ${message}`);
    }

    // --- Department Population ---
    function populateDepartments() {
        if (!departmentSelect) {
            logDebug('Department select element not found');
            return;
        }
        
        logDebug('Populating departments dropdown');
        departments.forEach(dept => {
            departmentSelect.appendChild(new Option(dept, dept));
        });
    }

    // --- Modal Management ---
    function openModal(eventName, fee) {
        logDebug('Opening modal for event:', { eventName, fee });
        
        currentEventData.name = eventName;
        currentEventData.amount = fee * 100; // Convert to paise
        
        if (eventNameDisplay) eventNameDisplay.textContent = eventName;
        if (eventNameDisplayDesc) eventNameDisplayDesc.textContent = eventName;
        
        // Reset modal state
        if (descriptionView) descriptionView.style.display = 'block';
        if (registrationFormView) registrationFormView.style.display = 'none';
        if (confirmationView) confirmationView.innerHTML = '';
        if (registrationForm) registrationForm.reset();
        
        // Show modal
        if (modalOverlay) {
            modalOverlay.classList.add('is-visible');
            document.body.style.overflow = 'hidden';
        }
    }

    function closeModal() {
        logDebug('Closing modal');
        if (modalOverlay) {
            modalOverlay.classList.remove('is-visible');
            document.body.style.overflow = '';
        }
        isProcessing = false; // Reset processing flag
    }

    // --- Registration Form Handling ---
    async function handleRegistrationSubmit(event) {
        event.preventDefault();
        
        if (isProcessing) {
            logDebug('Registration already in progress, ignoring duplicate submission');
            return;
        }

        isProcessing = true; // Set processing flag
        logDebug('Starting registration submission');

        const submitBtn = registrationForm.querySelector('button[type="submit"]');
        if (!submitBtn) {
            showError('Submit button not found');
            isProcessing = false;
            return;
        }

        // Update button state
        const originalButtonText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Saving Registration...';

        try {
            // Collect form data
            const formData = new FormData(registrationForm);
            const registrationData = Object.fromEntries(formData.entries());
            
            // Add metadata
            registrationData.eventName = currentEventData.name;
            registrationData.registrationId = generateRegistrationId();
            registrationData.timestamp = new Date().toISOString();
            registrationData.paymentStatus = 'pending';
            registrationData.paymentId = null;

            logDebug('Registration data prepared:', registrationData);

            // Validate required fields
            const requiredFields = ['fullName', 'email', 'phone', 'department'];
            const missingFields = requiredFields.filter(field => !registrationData[field]);
            
            if (missingFields.length > 0) {
                throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
            }

            // Save to Firebase
            logDebug('Saving to Firebase...');
            const docRef = await db.collection('registrations').add(registrationData);
            
            logDebug('Registration saved successfully with ID:', docRef.id);
            showSuccess(`Registration saved with ID: ${docRef.id}`);

            // Initiate payment
            await initiatePayment(docRef.id, registrationData);

        } catch (error) {
            logDebug('Registration submission failed:', error);
            showError(`Could not save registration: ${error.message}`);
            
            // Reset button state on error
            submitBtn.disabled = false;
            submitBtn.textContent = originalButtonText;
            isProcessing = false;
        }
    }

    // --- Payment Handling ---
    function initiatePayment(firestoreDocId, registrationData) {
        return new Promise((resolve, reject) => {
            logDebug('Initiating payment for document ID:', firestoreDocId);

            if (RAZORPAY_KEY_ID === 'YOUR_RAZORPAY_KEY_ID') {
                showError('Razorpay key not configured. Please update RAZORPAY_KEY_ID.');
                reject(new Error('Payment gateway not configured'));
                return;
            }

            const options = {
                key: RAZORPAY_KEY_ID,
                amount: currentEventData.amount,
                currency: "INR",
                name: "COSMOG 2K25",
                description: `Registration for ${currentEventData.name}`,
                image: "logo.png",
                handler: async (response) => {
                    logDebug('Payment successful:', response);
                    await updateRegistrationStatus(firestoreDocId, 'completed', response.razorpay_payment_id);
                    resolve(response);
                },
                prefill: {
                    name: registrationData.fullName,
                    email: registrationData.email,
                    contact: registrationData.phone
                },
                notes: {
                    registrationId: registrationData.registrationId,
                    firestoreDocId: firestoreDocId
                },
                theme: { color: "#8A2BE2" },
                modal: {
                    ondismiss: async () => {
                        logDebug('Payment dismissed by user');
                        await updateRegistrationStatus(firestoreDocId, 'dismissed', null);
                        closeModal();
                        reject(new Error('Payment dismissed'));
                    }
                }
            };

            const rzp = new Razorpay(options);
            
            rzp.on('payment.failed', async (response) => {
                logDebug('Payment failed:', response);
                await updateRegistrationStatus(firestoreDocId, 'failed', null, response.error);
                closeModal();
                reject(response.error);
            });

            // Reset button state before opening payment
            const submitBtn = registrationForm.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Proceed to Payment';
            }

            rzp.open();
        });
    }

    // --- Status Updates ---
    async function updateRegistrationStatus(docId, status, paymentId = null, errorDetails = null) {
        try {
            logDebug('Updating registration status:', { docId, status, paymentId });
            
            const registrationRef = db.collection('registrations').doc(docId);
            let updateData = { 
                paymentStatus: status, 
                paymentId: paymentId,
                updatedAt: new Date().toISOString()
            };
            
            if (errorDetails) {
                updateData.paymentError = {
                    code: errorDetails.code,
                    description: errorDetails.description,
                    timestamp: new Date().toISOString()
                };
            }

            await registrationRef.update(updateData);
            logDebug('Registration status updated successfully');

            if (status === 'completed') {
                showRegistrationSuccess();
            }

        } catch (error) {
            logDebug('Failed to update registration status:', error);
            showError(`Failed to update registration status: ${error.message}`);
        }
    }

    function showRegistrationSuccess() {
        logDebug('Showing registration success message');
        
        if (descriptionView) descriptionView.style.display = 'none';
        if (registrationFormView) registrationFormView.style.display = 'none';
        
        if (confirmationView) {
            confirmationView.innerHTML = `
                <div class="confirmation-content">
                    <div class="confirmation-icon">✅</div>
                    <h2>Registration Successful!</h2>
                    <p>Thank you for registering for <strong>${currentEventData.name}</strong>.</p>
                    <p>Your payment was successful and confirmation has been sent to your email.</p>
                    <button class="btn btn--primary" onclick="location.reload()">Register for Another Event</button>
                </div>
            `;
            confirmationView.style.display = 'block';
        }

        // Auto-close modal after 5 seconds
        setTimeout(() => {
            closeModal();
        }, 5000);
    }

    // --- Event Listeners Setup ---
    function initializeEventListeners() {
        logDebug('Initializing event listeners');

        // Register button clicks
        registerButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const eventName = button.getAttribute('data-event-name') || 'Unknown Event';
                const eventFee = parseInt(button.getAttribute('data-event-fee')) || 60;
                openModal(eventName, eventFee);
            });
        });

        // Continue to form button
        if (continueToFormBtn) {
            continueToFormBtn.addEventListener('click', () => {
                logDebug('Continuing to registration form');
                if (descriptionView) descriptionView.style.display = 'none';
                if (registrationFormView) registrationFormView.style.display = 'block';
            });
        }

        // Form submission
        if (registrationForm) {
            registrationForm.addEventListener('submit', handleRegistrationSubmit);
        }

        // Close modal button
        if (closeBtn) {
            closeBtn.addEventListener('click', closeModal);
        }

        // Close modal on overlay click
        if (modalOverlay) {
            modalOverlay.addEventListener('click', (e) => {
                if (e.target === modalOverlay) {
                    closeModal();
                }
            });
        }

        // Escape key to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('is-visible')) {
                closeModal();
            }
        });
    }

    // --- Initialization ---
    function initialize() {
        logDebug('Initializing registration system');
        
        // Populate departments
        populateDepartments();
        
        // Setup event listeners
        initializeEventListeners();
        
        logDebug('Registration system initialized successfully');
    }

    // Start the system
    initialize();

    // Export functions for debugging (optional)
    window.cosmogRegistration = {
        debug: {
            currentEventData,
            isProcessing,
            openModal,
            closeModal,
            logDebug
        }
    };
});
