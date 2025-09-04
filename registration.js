document.addEventListener('DOMContentLoaded', () => {
    // --- Configuration ---
    // These are your project's connection details for Firebase.
    const firebaseConfig = {
        apiKey: "AIzaSyAah84lK5EK5MrMU4ZyADkifGZvewXIWYA",
        authDomain: "cosmogtest.firebaseapp.com",
        databaseURL: "https://cosmogtest-default-rtdb.asia-southeast1.firebasedabase.app",
        projectId: "cosmogtest",
        storageBucket: "cosmogtest.firebasestorage.app",
        messagingSenderId: "893484280877",
        appId: "1:893484280877:web:37cfb26cc2fa8ea3155ca4",
        measurementId: "G-1BZTRNPX3X"
    };

    // Your public key for Razorpay.
    const RAZORPAY_KEY_ID = 'rzp_live_R9r2qnsNEVDi7p';

    // Descriptions for the "Learn More" section of each event.
    const eventDetails = {
        "Web Craft": {
            overview: "Web Craft is a creative and technical event designed to test participants’ ability to effectively leverage AI platforms for web development. The focus is on prompting skills, creativity, and efficiency in using AI tools to build a frontend website within the given time frame.<br><br>On the day of the event, a surprise theme will be announced. Participants must then use AI platforms to design and develop a website that reflects the theme. Collaboration among team members is encouraged to brainstorm ideas and finalize the design.",
            rules: ["Participants must bring their own laptops, mobile devices, internet connections (hotspot/dongle), and required cables or chargers.", "The organizing team will not provide technical equipment.", "The website must be created using only two AI platforms/tools. One of these will be mandatorily suggested by the Event Head.", "The suggested AI platform will have a limited number of prompts; participants must use them wisely.", "A team may consist of 1 to 4 members.", "Only registered participants are allowed to work on the project; no external help is permitted.", "Evaluation is based on Creativity, Effective Use of AI, Design & UX, and Team Collaboration."]
        },
        "Art Attack": {
            overview: "Get ready for Art Attack, a 45-minute on-the-spot art competition where your creativity and speed will be put to the test!<br><br> At the start of the event, all participants will be given an A4 sheet and a secret theme. Using your own supplies, you'll have just 45 minutes to bring your most creative ideas to life.<br><br>Our judges will be looking for originality, creativity, theme interpretation, and technical skill. Two winners will be chosen to receive an exciting cash prize!",
            rules: ["Bring Your Supplies: Artists must bring their own drawing and painting materials. Only the A4 paper will be provided.", "Time Limit: The competition is strictly 45 minutes. Late submissions will not be accepted.", "Original Work Only: All artwork must be created on the spot. Any form of copying or using pre-made work will lead to immediate disqualification.", "No Electronic Devices: The use of mobile phones or any other electronic devices is strictly prohibited during the competition.", "Fair Play: All participants are expected to maintain discipline and respect their fellow contestants to ensure a fair and fun competition for everyone."]
        },
        "TreQueza": {
            overview: "TreQueza is a celebration of knowledge that sharpens your thinking skills while introducing you to new insights. It is a fun and engaging event that combines quiz rounds with entertaining activities, encouraging team spirit and keeping participants thoroughly engaged.<br><br>The event consists of three rounds:<br><br><b>Round 1:</b> consist of 25 questions, each correct answer earns 1 points to the team. Questions cover a wide range of categories such as movies, anime, sports, technology, history, current affairs, mythology, and many more. This round is designed to test general knowledge and warmup participants.<br><br><b>Round 2:</b> consist of 15 questions, each correct answer earns 2 points to the team. Questions are more challenging than round 1 and continue to cover a blend of all categories. Course from this round combined with round 1, determine the winner<br><br><b>Round 3:Fun Round </b> consist of 10 questions/tasks. This sound is purely entertainment focused with no scoring. Includes fun interactive tasks to engage participants and add excitement.",
            rules: ["no negative marks for wrong answers", "question in each round, will cover multiple categories", "Difficulty increases with each round", "Mobile phones and electronic devices or Using AI during the event are strictly prohibited.", "Cheating is not allowed to ensure a fair and healthy competition, any violation will result in instant elimination."]
        },
        "Capture and Creative": {
            overview: "capture and create is an exciting team based event where creativity meets storytelling. Participants will be given 45 minutes to explore the campus and capture the fresh photos or video clips. After that, they will get one hour to edit their recorded content into a college promotional video. The final video should be minimum of 20 seconds to 60 seconds duration the event is designed to test participants, vision, editing skills, and ability to craft a compelling story within a short span of time",
            rules: ["Fresh footage captured during the event is allowed previously recorded clips or stock footage will lead to disqualification", "Participant must use your phone device(mobile/ camera/ laptop) and editing tools.", "The content should be appropriate, respectful and align with the theme of promoting the college", "Creativity, storytelling, technical editing, and overall presentation will be the key judging criteria", "All final submissions must be made within the given time limit late entries will not be acceptable."]
        },
        "Mission Impossible": {
            overview: "An exciting event where teams face thrilling challenges inspired by action movies. This event tests thinking, problem-solving, speed, and teamwork.<br><br><b>Round 1 – Memory Testing:</b> Teams have 1 minute to find all the differences between two nearly identical images.<br><br><b>Round 2 – Physical Challenge:</b> Each of the 4 team members performs a different task simultaneously: Bottle Flip, Balance & Build, Ball Drop, and Ball Tap Challenge.<br><br><b>Round 3 – Diffuse the Bomb:</b> Teams use clues and objects from multiple locations to find and defuse a 'bomb' at the final destination.",
            rules: ["Team Size: 4 members.", "No mobile phones or AI may be used; violation will lead to immediate disqualification.", "Misusing permissions given by the crew during tasks will result in elimination.", "Cheating in any round leads to direct elimination.", "Only registered participants are allowed to take part in the event."]
        },
        "Game-On (BGMI)": {
            overview: "Game-On brings the thrill of competitive gaming to campus! Gear up for intense battles in BGMI, where reflexes, strategy, and survival skills will decide the champions.<br><br><b>Event Format:</b> The event consists of a Qualification Round held in two slots, with the top 5 teams from each slot advancing. The 10 qualified teams will then compete in the Final Round for the Winner and Runner-up titles.<br><br><b>Participation:</b> Players can compete solo or in squads of up to 4 members.",
            rules: ["This competition is for BGMI (Battlegrounds Mobile India) only.", "Participants must use their own mobile devices; no external devices will be provided.", "Both solo and squad formats have separate prize categories.", "A squad can have a maximum of 4 members.", "No substitutes are allowed once a match begins.", "Players must join the game lobby on time; late entries will not be allowed.", "Any form of cheating, hacking, or unfair play will result in disqualification."]
        },
        "Game-On (Free Fire)": {
            overview: "Game-On brings the thrill of competitive gaming to campus! Gear up for intense battles in Free Fire, where reflexes, strategy, and survival skills will decide the champions.<br><br><b>Event Format:</b> The event consists of a Qualification Round held in two slots, with the top 5 teams from each slot advancing. The 10 qualified teams will then compete in the Final Round for the Winner and Runner-up titles.<br><br><b>Participation:</b> Players can compete solo or in squads of up to 4 members.",
            rules: ["This competition is for Free Fire only.", "Participants must use their own mobile devices; no external devices will be provided.", "Both solo and squad formats have separate prize categories.", "A squad can have a maximum of 4 members.", "No substitutes are allowed once a match begins.", "Players must join the game lobby on time; late entries will not be allowed.", "Any form of cheating, hacking, or unfair play will result in disqualification."]
        },
        "Glam Jam": {
            overview: "A day to shine! Glam Jam is a fun event exclusively for girls, designed to turn an ordinary college day into a memorable one.<br><br><b>Round 1 – Blindfolded Senses:</b> Blindfolded participants must find and identify various objects and food items using only their senses and instincts.<br><br><b>Round 2 – Whisper Challenge:</b> One teammate wears headphones with loud music while the other whispers a phrase. The teammate must guess the phrase by lip-reading.",
            rules: ["Team Size: 2-4 members (Fee is per person).", "Fair Play: No peeking during the blindfolded game and no shouting answers during the Whisper Challenge.", "Team Spirit: Support your team and cheer for others.", "Follow Instructions: Listen carefully to the coordinators.", "Have Fun: Enjoy every moment!", "Eligibility: This event is strictly for girls only."]
        },
        "Cultural Carnival": {
            overview: "Cultural Carnival is the perfect platform to showcase your talent and creativity! Participants can perform in multiple categories, and all students are welcome to enjoy the show and cheer for the performers.<br><br><b>Performance Categories:</b><br>&bull; Dance (Solo, Duo, or Group)<br>&bull; Singing (Solo or Duo)<br>&bull; Special Talents (Stand-up Comedy, Beatboxing, etc.)",
            rules: ["This event is open to all students to perform and watch.", "Performers can participate in multiple categories.", "Creativity, originality, and stage presence will be appreciated and rewarded.", "The main goal is to celebrate talent, have fun, and create unforgettable memories!"]
        },
        "default": {
            overview: "Welcome to one of the flagship events of COSMOG 2025! This is where your skills will be put to the ultimate test. Get ready for an exciting challenge that combines innovation, teamwork, and a healthy dose of competition.",
            rules: ["All participants must be current students of St. Martin's Engineering College.", "Team size must adhere to the limits specified for this event.", "Participants must bring their own laptops and any required software unless stated otherwise.", "Any form of plagiarism or misconduct will result in immediate disqualification.", "The decision of the judges and event coordinators is final and binding.", "Please arrive at the venue at least 15 minutes before the scheduled start time."]
        }
    };

    let db;
    try {
        if (firebase.apps.length === 0) {
            firebase.initializeApp(firebaseConfig);
        }
        db = firebase.firestore();
        console.log('✅ Firebase initialized successfully');
    } catch (e) {
        console.error('❌ Firebase initialization error:', e.message);
        document.querySelectorAll('.event-register, .register-btn, .event-learn-more').forEach(btn => btn.style.display = 'none');
        alert('Could not connect to the registration service. Please try again later.');
        return;
    }

    const modalOverlay = document.getElementById('registration-modal-overlay');
    const closeBtn = document.querySelector('.modal-close-btn');
    const registerButtons = document.querySelectorAll('.event-register');
    const learnMoreButtons = document.querySelectorAll('.event-learn-more');
    const descriptionView = document.getElementById('description-view');
    const registrationFormView = document.getElementById('registration-form');
    const confirmationView = document.getElementById('confirmation-view');
    const continueToFormBtn = document.getElementById('continue-to-form-btn');
    const eventNameDisplay = document.getElementById('event-name-display');
    const eventNameDisplayDesc = document.getElementById('event-name-display-desc');
    const departmentSelect = document.getElementById('department');
    const yearSelect = document.getElementById('year');
    const sectionGroup = document.getElementById('section-group');
    const descriptionContent = document.querySelector('#description-view .description-content');

    const departments = ["CSG", "AIML", "CSE", "IT", "ECE", "EEE", "AIDS", "CSM"];
    let currentEventData = { name: '', fee: 0, registrationId: '' };
    let isProcessing = false;

    function generateRegistrationId() {
        const timestamp = Date.now().toString().slice(-6);
        const random = Math.random().toString(36).substr(2, 4).toUpperCase();
        return `COSMOG-${timestamp}-${random}`;
    }

    function populateDepartments() {
        if (!departmentSelect) return;
        departmentSelect.innerHTML = '<option value="">Select your department</option>';
        departments.forEach(dept => {
            departmentSelect.appendChild(new Option(dept, dept));
        });
    }

    function openModal(eventName, fee, isLearnMore = false) {
        if (!eventName || !fee) {
            console.error("Event name or fee is missing.");
            return;
        }
        currentEventData.name = eventName;
        currentEventData.fee = parseInt(fee, 10);
        eventNameDisplay.textContent = eventName;
        eventNameDisplayDesc.textContent = eventName;
        const details = eventDetails[eventName] || eventDetails.default;
        const rulesHtml = details.rules.map(rule => `<li>${rule}</li>`).join('');
        descriptionContent.innerHTML = `<h3>Overview</h3><p>${details.overview}</p><h3>Rules & Regulations</h3><ul>${rulesHtml}</ul>`;
        continueToFormBtn.style.display = 'block'; // Always show the continue button now
        descriptionView.style.display = 'block';
        registrationFormView.style.display = 'none';
        confirmationView.style.display = 'none';
        registrationFormView.reset();
        sectionGroup.style.display = 'none';
        modalOverlay.classList.add('is-visible');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modalOverlay.classList.remove('is-visible');
        document.body.style.overflow = '';
        isProcessing = false;
    }

    async function handleRegistrationSubmit(event) {
        event.preventDefault();
        if (isProcessing) return;
        isProcessing = true;
        const submitBtn = registrationFormView.querySelector('button[type="submit"]');
        const originalButtonText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Processing...';
        try {
            const formData = new FormData(registrationFormView);
            const registrationData = Object.fromEntries(formData.entries());
            currentEventData.registrationId = generateRegistrationId();
            registrationData.registrationId = currentEventData.registrationId;
            registrationData.eventName = currentEventData.name;
            registrationData.amountPaid = currentEventData.fee;
            registrationData.timestamp = new Date().toISOString();
            registrationData.paymentStatus = 'pending'; // Default status
            registrationData.paymentId = null; // Default status
            const docRef = await db.collection('registrations').add(registrationData);
            await initiatePayment(docRef.id, registrationData);
        } catch (error) {
            alert(`Could not save registration: ${error.message}`);
            submitBtn.disabled = false;
            submitBtn.textContent = originalButtonText;
            isProcessing = false;
        }
    }
    
    // This is the insecure function that updates the database from the client.
    async function updateFirestoreOnSuccess(firestoreDocId, razorpayResponse) {
        if (!firestoreDocId || !razorpayResponse.razorpay_payment_id) {
            console.error('Missing Firestore ID or Payment ID for update.');
            return;
        }
        const registrationRef = db.collection('registrations').doc(firestoreDocId);
        try {
            await registrationRef.update({
                paymentStatus: 'completed', // Updates status to completed
                paymentId: razorpayResponse.razorpay_payment_id, // This is the Transaction ID
                paymentTimestamp: new Date().toISOString()
            });
            console.log('✅ Firestore updated successfully (Client-side)');
        } catch (error) {
            console.error('❌ Error updating Firestore (Client-side):', error);
            alert('Your payment was successful, but there was an error updating our records. Please contact the event organizers with your payment details.');
        }
    }

    function initiatePayment(firestoreDocId, registrationData) {
        return new Promise((resolve, reject) => {
            const razorpayKey = RAZORPAY_KEY_ID.trim();
            if (!razorpayKey) {
                alert('Payment gateway is not configured correctly.');
                reject(new Error('Payment gateway not configured.'));
                return;
            }
            const options = {
                key: razorpayKey,
                amount: currentEventData.fee * 100,
                currency: "INR",
                name: "COSMOG 2025",
                description: `Registration for ${currentEventData.name}`,
                image: "logo.png",
                handler: (response) => {
                    // **INSECURE UPDATE**
                    // This now calls the function to update your database directly.
                    updateFirestoreOnSuccess(firestoreDocId, response);
                    showRegistrationSuccess(currentEventData.registrationId);
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
                    ondismiss: () => {
                        closeModal();
                        reject(new Error('Payment dismissed'));
                    }
                }
            };
            const rzp = new Razorpay(options);
            rzp.on('payment.failed', (response) => {
                alert(`Payment Failed: ${response.error.description}. Please try again.`);
                closeModal();
                reject(response.error);
            });
            const submitBtn = registrationFormView.querySelector('button[type="submit"]');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Proceed to Payment';
            rzp.open();
        });
    }

    function showRegistrationSuccess(registrationId) {
        descriptionView.style.display = 'none';
        registrationFormView.style.display = 'none';
        confirmationView.style.display = 'block';
        confirmationView.innerHTML = `
            <div class="confirmation-content">
                <div class="confirmation-icon" style="font-size: 4rem;">✅</div>
                <h2>Registration Successful!</h2>
                <p>Thank you for registering for <strong>${currentEventData.name}</strong>. Your payment was successful.</p>
                <p>Your Registration ID is:<br><strong>${registrationId}</strong></p>
                <p style="font-size: 0.9rem; color: #ffc107;">Please take a screenshot of this confirmation for your records.</p>
                <button class="submit-btn" id="close-success-btn">Close</button>
            </div>
        `;
        document.getElementById('close-success-btn').addEventListener('click', closeModal);
    }

    // --- Event Listeners ---
    registerButtons.forEach(button => button.addEventListener('click', (e) => {
        e.preventDefault();
        openModal(e.currentTarget.dataset.eventName, e.currentTarget.dataset.eventFee);
    }));

    learnMoreButtons.forEach(button => button.addEventListener('click', (e) => {
        e.preventDefault();
        openModal(e.currentTarget.dataset.eventName, e.currentTarget.dataset.eventFee);
    }));

    continueToFormBtn.addEventListener('click', () => {
        descriptionView.style.display = 'none';
        registrationFormView.style.display = 'block';
        populateDepartments();
    });

    yearSelect.addEventListener('change', () => {
        sectionGroup.style.display = ['1', '2', '3', '4'].includes(yearSelect.value) ? 'block' : 'none';
    });

    registrationFormView.addEventListener('submit', handleRegistrationSubmit);
    closeBtn.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalOverlay.classList.contains('is-visible')) closeModal();
    });
});
