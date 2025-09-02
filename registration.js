document.addEventListener('DOMContentLoaded', () => {
    // --- Configuration ---
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
    
    const RAZORPAY_KEY_ID = 'rzp_live_R9r2qnsNEVDi7p'; 

    // --- Initialize Firebase ---
    let db;
    try {
        if (typeof firebase !== 'undefined' && !firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
            db = firebase.firestore();
            console.log('✅ Firebase initialized successfully');
        } else if (firebase.apps.length) {
            db = firebase.firestore();
             console.log('✅ Firebase was already initialized');
        }
        else {
            throw new Error("Firebase SDK not loaded");
        }
    } catch (e) {
        console.error('❌ Firebase initialization error:', e.message);
        document.querySelectorAll('.event-register, .register-btn').forEach(btn => btn.style.display = 'none');
        return;
    }

    // --- DOM Element Selection ---
    const modalOverlay = document.getElementById('registration-modal-overlay');
    const closeBtn = document.querySelector('.modal-close-btn');
    const registerButtons = document.querySelectorAll('.event-register, .register-btn');
    
    const descriptionView = document.getElementById('description-view');
    const registrationForm = document.getElementById('registration-form');
    const confirmationView = document.getElementById('confirmation-view');
    
    const continueToFormBtn = document.getElementById('continue-to-form-btn');
    const eventNameDisplay = document.getElementById('event-name-display');
    const eventNameDisplayDesc = document.getElementById('event-name-display-desc');
    const departmentSelect = document.getElementById('department');
    const yearSelect = document.getElementById('year');
    const sectionGroup = document.getElementById('section-group');
    const sectionSelect = document.getElementById('section');

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

    let currentEventData = { name: '', amount: 0 };
    let isProcessing = false;

    // --- Utility Functions ---
    function generateRegistrationId() {
        const timestamp = Date.now().toString().slice(-6);
        const random = Math.random().toString(36).substr(2, 4).toUpperCase();
        return `COSMOG-${timestamp}-${random}`;
    }

    function showError(message) {
        console.error(`❌ [REGISTRATION ERROR] ${message}`);
        alert(`Registration Error: ${message}`);
    }

    // --- Department Population ---
    function populateDepartments() {
        if (!departmentSelect) return;
        departmentSelect.innerHTML = '<option value="">Select your department</option>';
        departments.forEach(dept => {
            departmentSelect.appendChild(new Option(dept, dept));
        });
    }

    // --- Modal Management ---
    function openModal(eventName, fee) {
        if (!eventName) {
            alert("Could not determine event. Please try again from the Events page.");
            return;
        }
        currentEventData.name = eventName;
        currentEventData.amount = parseInt(fee) * 100; // Store original fee in paise
        
        if (eventNameDisplay) eventNameDisplay.textContent = eventName;
        if (eventNameDisplayDesc) eventNameDisplayDesc.textContent = eventName;
        
        showView('description');
        registrationForm.reset();
        
        modalOverlay.classList.add('is-visible');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modalOverlay.classList.remove('is-visible');
        document.body.style.overflow = '';
        isProcessing = false;
    }
    
    function showView(viewName) {
        descriptionView.style.display = 'none';
        registrationForm.style.display = 'none';
        confirmationView.style.display = 'none';

        if (viewName === 'description') descriptionView.style.display = 'block';
        if (viewName === 'form') registrationForm.style.display = 'grid';
        if (viewName === 'confirmation') confirmationView.style.display = 'block';
    }

    // --- Registration & Payment ---
    async function handleRegistrationSubmit(event) {
        event.preventDefault();
        if (isProcessing) return;
        isProcessing = true;

        const submitBtn = registrationForm.querySelector('button[type="submit"]');
        const originalButtonText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Processing...';

        try {
            const formData = new FormData(registrationForm);
            const registrationData = Object.fromEntries(formData.entries());
            
            registrationData.eventName = currentEventData.name;
            registrationData.registrationId = generateRegistrationId();
            registrationData.timestamp = new Date().toISOString();
            registrationData.paymentStatus = 'pending';
            registrationData.paymentId = null;
            // ✅ Adds the amount paid to the database record
            registrationData.amountPaid = 100; // Storing the test amount (100 paise = ₹1)

            const docRef = await db.collection('registrations').add(registrationData);
            await initiatePayment(docRef.id, registrationData);

        } catch (error) {
            showError(`Could not save registration: ${error.message}`);
            submitBtn.disabled = false;
            submitBtn.textContent = originalButtonText;
            isProcessing = false;
        }
    }

    function initiatePayment(firestoreDocId, registrationData) {
        return new Promise((resolve, reject) => {
            const options = {
                key: RAZORPAY_KEY_ID,
                amount: 100, // FOR TESTING: 100 paise = ₹1. Use currentEventData.amount for production.
                currency: "INR",
                name: "COSMOG 2K25",
                description: `Reg for ${currentEventData.name} (ID: ${registrationData.registrationId})`,
                image: "logo.png",
                handler: async (response) => {
                    await updateRegistrationStatus(firestoreDocId, 'completed', response.razorpay_payment_id);
                    showRegistrationSuccess(registrationData.registrationId);
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
                        await updateRegistrationStatus(firestoreDocId, 'dismissed');
                        closeModal();
                        reject(new Error('Payment dismissed'));
                    }
                }
            };

            const rzp = new Razorpay(options);
            
            rzp.on('payment.failed', async (response) => {
                await updateRegistrationStatus(firestoreDocId, 'failed', null, response.error);
                showError(`Payment failed: ${response.error.description}`);
                closeModal();
                reject(response.error);
            });

            const submitBtn = registrationForm.querySelector('button[type="submit"]');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Proceed to Payment';

            rzp.open();
        });
    }

    async function updateRegistrationStatus(docId, status, paymentId = null, errorDetails = null) {
        try {
            const registrationRef = db.collection('registrations').doc(docId);
            let updateData = { 
                paymentStatus: status, 
                paymentId: paymentId,
                updatedAt: new Date().toISOString()
            };
            if (errorDetails) {
                updateData.paymentError = JSON.parse(JSON.stringify(errorDetails));
            }
            await registrationRef.update(updateData);
        } catch (error) {
            console.error('Failed to update registration status:', error);
        }
    }

    function showRegistrationSuccess(registrationId) {
        confirmationView.innerHTML = `
            <div class="confirmation-content">
                <div class="confirmation-icon">✅</div>
                <h2>Registration Successful!</h2>
                <p>Thank you for registering for <strong>${currentEventData.name}</strong>.</p>
                <p>Your unique Registration ID is: <strong>${registrationId}</strong></p>
                <p>A confirmation has been sent to your email. Please close this window.</p>
            </div>
        `;
        showView('confirmation');
        isProcessing = false;
    }

    // --- Event Listeners Setup ---
    function initializeEventListeners() {
        registerButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                // Find the closest event box to get event details
                const eventBox = e.target.closest('.event-box');
                if (eventBox) {
                    const eventName = eventBox.querySelector('.event-title').textContent.trim();
                    const feeText = eventBox.querySelector('.highlight small:last-of-type').previousElementSibling.textContent.replace('₹', '').trim();
                    const eventFee = parseInt(feeText) || 60; // Default fee if not found
                    openModal(eventName, eventFee);
                } else {
                     // Fallback for general register buttons not inside an event box
                    window.location.href = 'events.html';
                }
            });
        });

        if (continueToFormBtn) {
            continueToFormBtn.addEventListener('click', () => {
                populateDepartments();
                showView('form');
            });
        }

        if(registrationForm) {
            registrationForm.addEventListener('submit', handleRegistrationSubmit);
        }

        if(closeBtn) {
            closeBtn.addEventListener('click', closeModal);
        }
        
        if(modalOverlay) {
            modalOverlay.addEventListener('click', (e) => {
                if (e.target === modalOverlay) closeModal();
            });
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('is-visible')) {
                closeModal();
            }
        });

        // Conditional "Section" field logic
        if (yearSelect && sectionGroup && sectionSelect) {
            yearSelect.addEventListener('change', () => {
                const selectedYear = yearSelect.value;
                if (['2', '3', '4'].includes(selectedYear)) {
                    sectionGroup.style.display = 'block';
                    sectionSelect.required = true;
                } else {
                    sectionGroup.style.display = 'none';
                    sectionSelect.required = false;
                    sectionSelect.value = ''; // Reset value if hidden
                }
            });
        }
    }

    // --- Start the system ---
    initializeEventListeners();
});
