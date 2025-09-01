// 1.11 PASTE YOUR FIREBASE CONFIGURATION OBJECT HERE
// You can find this in your Firebase Project Settings > General tab
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

// 2. Initialize Firebase and Firestore
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();


document.addEventListener('DOMContentLoaded', () => {
    // --- Element Selection ---
    const registerButtons = document.querySelectorAll('.event-register');
    const modalOverlay = document.getElementById('registration-modal-overlay');
    const modal = document.getElementById('registration-modal');
    const closeModalBtn = document.querySelector('.modal-close-btn');

    // Select new views and elements
    const descriptionView = document.getElementById('description-view');
    const form = document.getElementById('registration-form');
    const confirmationView = document.getElementById('confirmation-view');
    const continueToFormBtn = document.getElementById('continue-to-form-btn');

    const eventNameDisplayDesc = document.getElementById('event-name-display-desc'); // for description view
    const eventNameDisplayForm = document.getElementById('event-name-display'); // for form view

    const yearSelect = document.getElementById('year');
    const departmentSelect = document.getElementById('department');
    const sectionGroup = document.getElementById('section-group');
    const sectionSelect = document.getElementById('section');

    // --- Data & Configuration ---
    const departmentOptions = {
        '1': ['ECE', 'EEE', 'Civil'],
        '2': ['Mechanical', 'ECE', 'CSE'],
        '3': ['AIML', 'CSG', 'CSM'],
        '4': ['IT', 'Cyber Security', 'Data Science']
    };
    const branchesWithSections = ['CSE', 'ECE', 'CSM', 'IT'];

    const eventCodeMapping = {
        "Vibe-A-Thon": { code: "VAT", number: "1" },
        "Art Attack": { code: "ART", number: "2" },
        "TreQueza": { code: "TQZ", number: "3" },
        "Capture and Creative": { code: "CAC", number: "4" },
        "Mission Impossible": { code: "MSI", number: "5" },
        "Game-On": { code: "GMO", number: "6" },
        "Glam Jam": { code: "GMJ", number: "7" },
        "Cultural Carnival": { code: "CCL", number: "8" }
    };

    // --- Modal Logic ---
    const openModal = (eventName) => {
        eventNameDisplayDesc.textContent = eventName;
        eventNameDisplayForm.textContent = eventName;
        modal.dataset.eventName = eventName;
        
        descriptionView.style.display = 'flex';
        form.style.display = 'none';
        confirmationView.style.display = 'none';

        modalOverlay.classList.add('is-visible');
    };

    const closeModal = () => {
        modalOverlay.classList.remove('is-visible');
        form.reset();
        updateDepartmentOptions();
        setTimeout(() => {
            if (descriptionView) descriptionView.style.display = 'flex';
            if (form) form.style.display = 'none';
            if (confirmationView) confirmationView.style.display = 'none';
        }, 500); 
    };

    if (continueToFormBtn) {
        continueToFormBtn.addEventListener('click', () => {
            descriptionView.style.display = 'none';
            form.style.display = 'grid';
        });
    }

    registerButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const eventBox = button.closest('.event-box');
            if (eventBox) {
                const eventName = eventBox.querySelector('.event-title').textContent.trim();
                openModal(eventName);
            }
        });
    });

    if(closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    if(modalOverlay) modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
    });

    // --- Dynamic Form Logic ---
    const updateDepartmentOptions = () => {
        const selectedYear = yearSelect.value;
        departmentSelect.innerHTML = '<option value="">Select Department</option>';
        if (departmentOptions[selectedYear]) {
            departmentOptions[selectedYear].forEach(dept => {
                const option = document.createElement('option');
                option.value = dept;
                option.textContent = dept;
                departmentSelect.appendChild(option);
            });
        }
        updateSectionVisibility();
    };

    const updateSectionVisibility = () => {
        const selectedDept = departmentSelect.value;
        sectionGroup.style.display = branchesWithSections.includes(selectedDept) ? 'flex' : 'none';
        if (!branchesWithSections.includes(selectedDept)) sectionSelect.value = '';
    };

    if (yearSelect) yearSelect.addEventListener('change', updateDepartmentOptions);
    if (departmentSelect) departmentSelect.addEventListener('change', updateSectionVisibility);
    
    // --- Form Submission & Data Handling (NO PAYMENT) ---
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = form.querySelector('.submit-btn');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Saving Registration...'; // Updated text

            const formData = new FormData(form);
            const registrationData = Object.fromEntries(formData.entries());
            const eventName = modal.dataset.eventName;
            const eventInfo = eventCodeMapping[eventName];
            
            if (!eventInfo) {
                alert('Error: Event code not found. Please contact support.');
                submitBtn.disabled = false;
                submitBtn.textContent = 'Submit';
                return;
            }

            try {
                // Get the current registration count for this event from Firestore
                const registrationsRef = db.collection('registrations');
                const q = registrationsRef.where('eventName', '==', eventName);
                const querySnapshot = await q.get();
                const eventSpecificCount = querySnapshot.size;
                
                const nextId = eventSpecificCount + 1;
                const paddedId = String(nextId).padStart(3, '0');
                
                registrationData.registrationId = `${eventInfo.code}${eventInfo.number}${paddedId}`;
                registrationData.eventName = eventName;
                registrationData.timestamp = new Date().toISOString();
                
                // Save data directly to Firebase without payment simulation
                console.log("Saving data to Firebase:", registrationData);
                await db.collection('registrations').add(registrationData);
                
                // Show confirmation screen
                showConfirmation(registrationData.eventName, registrationData.registrationId);

            } catch (error) {
                console.error("Error adding document: ", error);
                alert('An error occurred during registration. Please try again.');
                submitBtn.disabled = false;
                submitBtn.textContent = 'Submit';
            }
        });
    }
    
    // --- Confirmation View ---
    const showConfirmation = (eventName, registrationId) => {
        descriptionView.style.display = 'none';
        form.style.display = 'none';
        confirmationView.innerHTML = `
            <div class="celebration"></div>
            <div class="confirmation-icon"><i class="fas fa-check-circle"></i></div>
            <h2 class="confirmation-title">Registration Successful!</h2>
            <p class="confirmation-text">
                Your Registration ID for <strong>${eventName}</strong> is:
                <br>
                <strong style="color: var(--cosmic-cyan); font-size: 1.5rem; letter-spacing: 2px; margin-top: 8px; display: inline-block;">${registrationId}</strong>
            </p>
        `;
        confirmationView.style.display = 'block';
        triggerCelebration();
    };

    const triggerCelebration = () => {
        const celebrationContainer = confirmationView.querySelector('.celebration');
        if (!celebrationContainer) return;
        celebrationContainer.innerHTML = ''; // Clear previous particles
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.backgroundColor = `hsl(${Math.random() * 360}, 70%, 60%)`;
            particle.style.animationDelay = `${Math.random() * 2}s`;
            celebrationContainer.appendChild(particle);
        }
    };
    
    if (yearSelect) updateDepartmentOptions();
});
