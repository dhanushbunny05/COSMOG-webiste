document.addEventListener('DOMContentLoaded', () => {
    // --- Configuration ---
    // TODO: PASTE YOUR FIREBASE CONFIGURATION OBJECT HERE
   const firebaseConfig = {
  apiKey: "AIzaSyAah84lK5EK5MrMU4ZyADkifGZvewXIWYA",
  authDomain: "cosmogtest.firebaseapp.com",
  databaseURL: "https://cosmogtest-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "cosmogtest",
  storageBucket: "cosmogtest.firebasestorage.app",
  messagingSenderId: "893484280877",
  appId: "1:893484280877:web:37cfb26cc2fa8ea3155ca4",
  measurementId: "G-1BZTRNPX3X"
};

    // TODO: ADD YOUR RAZORPAY KEY ID HERE
    const RAZORPAY_KEY_ID = 'rzp_live_R9r2qnsNEVDi7p';

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
        document.querySelectorAll('.event-register, .register-btn').forEach(btn => btn.style.display = 'none');
        return;
    }

    // --- DOM Element Selection (Fixed to match your HTML structure) ---
    const modalOverlay = document.getElementById('registration-modal-overlay');
    const modal = document.getElementById('registration-modal');
    const closeBtn = document.querySelector('.modal-close-btn');
    const registerButtons = document.querySelectorAll('.event-register');
    
    // Fixed: Using your actual HTML structure
    const descriptionView = document.getElementById('description-view');
    const registrationFormView = document.getElementById('registration-form'); // Fixed: matches your HTML
    const registrationForm = document.getElementById('registration-form'); // Fixed: direct form selection
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
    let isProcessing = false;

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
        // Clear existing options first
        departmentSelect.innerHTML = '<option value="">Select your department</option>';
        
        departments.forEach(dept => {
            departmentSelect.appendChild(new Option(dept, dept));
        });
    }

    // --- Modal Management ---
    function openModal(eventName, fee) {
        logDebug('Opening modal for event:', { eventName, fee });
        
        currentEventData.name = eventName;
        currentEventData.amount = fee *100; // Convert to paise
        
        if (eventNameDisplay) eventNameDisplay.textContent = eventName;
        if (eventNameDisplayDesc) eventNameDisplayDesc.textContent = eventName;
        
        // Reset modal state - show description first
        showDescriptionView();
        
        // Clear confirmation and reset form
        if (confirmationView) confirmationView.innerHTML = '';
        if (registrationForm) registrationForm.reset();
        
        // Show modal
        if (modalOverlay) {
            modalOverlay.classList.add('is-visible');
            document.body.style.overflow = 'hidden';
        }
        
        logDebug('Modal opened successfully');
    }

    function closeModal() {
        logDebug('Closing modal');
        if (modalOverlay) {
            modalOverlay.classList.remove('is-visible');
            document.body.style.overflow = '';
        }
        isProcessing = false;
    }

    function showDescriptionView() {
        logDebug('Showing description view');
        if (descriptionView) {
            descriptionView.style.display = 'block';
            logDebug('Description view shown');
        } else {
            logDebug('❌ Description view element not found');
        }
        
        if (registrationFormView) {
            registrationFormView.style.display = 'none';
            logDebug('Registration form hidden');
        } else {
            logDebug('❌ Registration form view element not found');
        }
        
        if (confirmationView) {
            confirmationView.style.display = 'none';
        }
    }

    function showRegistrationForm() {
        logDebug('Showing registration form');
        if (descriptionView) {
            descriptionView.style.display = 'none';
            logDebug('Description view hidden');
        }
        
        if (registrationFormView) {
            registrationFormView.style.display = 'block';
            logDebug('Registration form shown');
        } else {
            logDebug('❌ Registration form view element not found');
            showError('Registration form not found. Please check HTML structure.');
            return;
        }
        
        if (confirmationView) {
            confirmationView.style.display = 'none';
        }
        
        // Populate departments when showing form
        populateDepartments();
    }

    // --- Registration Form Handling ---
    async function handleRegistrationSubmit(event) {
        event.preventDefault();
        
        if (isProcessing) {
            logDebug('Registration already in progress, ignoring duplicate submission');
            return;
        }

        isProcessing = true;
        logDebug('Starting registration submission');

        const submitBtn = registrationForm.querySelector('button[type="submit"]') || 
                          registrationForm.querySelector('.submit-btn');
        
        if (!submitBtn) {
            showError('Submit button not found in form');
            isProcessing = false;
            return;
        }

        const originalButtonText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Saving Registration...';

        try {
            const formData = new FormData(registrationForm);
            const registrationData = Object.fromEntries(formData.entries());
            
            registrationData.eventName = currentEventData.name;
            registrationData.registrationId = generateRegistrationId();
            registrationData.timestamp = new Date().toISOString();
            registrationData.paymentStatus = 'pending';
            registrationData.paymentId = null;

            logDebug('Registration data prepared:', registrationData);

            const requiredFields = ['fullName', 'email', 'phone', 'department'];
            const missingFields = requiredFields.filter(field => !registrationData[field]);
            
            if (missingFields.length > 0) {
                throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
            }

            logDebug('Saving to Firebase...');
            const docRef = await db.collection('registrations').add(registrationData);
            
            logDebug('Registration saved successfully with ID:', docRef.id);
            showSuccess(`Registration saved with ID: ${docRef.id}`);

            await initiatePayment(docRef.id, registrationData);

        } catch (error) {
            logDebug('Registration submission failed:', error);
            showError(`Could not save registration: ${error.message}`);
            
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

            const submitBtn = registrationForm.querySelector('button[type="submit"]') || 
                              registrationForm.querySelector('.submit-btn');
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
                const eventName = button.getAttribute('data-event-name') || 
                                button.closest('.cosmic-event-card')?.querySelector('h4')?.textContent || 
                                'Unknown Event';
                const eventFee = parseInt(button.getAttribute('data-event-fee')) || 60;
                logDebug('Register button clicked:', { eventName, eventFee });
                openModal(eventName, eventFee);
            });
        });

        // Continue to form button
        if (continueToFormBtn) {
            continueToFormBtn.addEventListener('click', (e) => {
                e.preventDefault();
                logDebug('Continue to form button clicked');
                showRegistrationForm();
            });
            logDebug('Continue to form button listener attached');
        } else {
            logDebug('❌ Continue to form button not found');
        }

        // Form submission
        if (registrationForm) {
            registrationForm.addEventListener('submit', handleRegistrationSubmit);
            logDebug('Form submission listener attached');
        } else {
            logDebug('❌ Registration form not found');
        }

        // Close modal button
        if (closeBtn) {
            closeBtn.addEventListener('click', closeModal);
            logDebug('Close button listener attached');
        } else {
            logDebug('❌ Close button not found');
        }

        // Close modal on overlay click
        if (modalOverlay) {
            modalOverlay.addEventListener('click', (e) => {
                if (e.target === modalOverlay) {
                    closeModal();
                }
            });
            logDebug('Modal overlay listener attached');
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
        
        // Check if required elements exist
        logDebug('Checking required DOM elements:');
        logDebug('- modalOverlay:', !!modalOverlay);
        logDebug('- descriptionView:', !!descriptionView);
        logDebug('- registrationFormView:', !!registrationFormView);
        logDebug('- registrationForm:', !!registrationForm);
        logDebug('- continueToFormBtn:', !!continueToFormBtn);
        logDebug('- registerButtons count:', registerButtons.length);
        
        initializeEventListeners();
        
        logDebug('Registration system initialized successfully');
    }

    // Start the system
    initialize();

    // Export functions for debugging
    window.cosmogRegistration = {
        debug: {
            currentEventData,
            isProcessing,
            openModal,
            closeModal,
            showDescriptionView,
            showRegistrationForm,
            logDebug,
            elements: {
                modalOverlay,
                descriptionView,
                registrationFormView,
                registrationForm,
                continueToFormBtn
            }
        }
    };
});
