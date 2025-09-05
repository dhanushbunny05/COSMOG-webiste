document.addEventListener('DOMContentLoaded', () => {
    // --- Configuration ---

    // IMPORTANT: Replace these placeholder URLs with your actual Google Form links.
    // Create a unique Google Form for each event.
    const googleFormLinks = {
        "Web Craft": "https://docs.google.com/forms/d/e/1FAIpQLSdOYAhwmRebHTxUeda_X8iLnZGL5BpCIsHxxJQTVomWQECFDg/viewform?usp=header",
        "Art Attack": "https://docs.google.com/forms/d/e/1FAIpQLSfIga4Vvk6xd9cPbpI0Nm2CDi4HyAOM2l4n5D88YXWU865Yqw/viewform?usp=header",
        "TreQueza": "https://docs.google.com/forms/d/e/1FAIpQLSf0xrFQ-FnnQLmoWuALB9O0JoAcQq-0nqJIRRCK7oVxCRlehg/viewform?usp=header",
        "Capture and Creative": "https://docs.google.com/forms/d/e/1FAIpQLSdUteJOr3ZJcGRPsO9Nw6dk6RtyZMNjGYZOcc-RXu4tXTReLg/viewform?usp=header",
        "Mission Impossible": https://docs.google.com/forms/d/e/1FAIpQLSdchhd1Bt1BRpH6Bz5JD6cpxrw0X-vbRMeB1T5sVV5APEGROg/viewform?usp=header",
        "Game-On (BGMI)": "https://docs.google.com/forms/d/e/YOUR_FORM_ID_HERE/viewform?usp=sf_link",
        "Game-On (Free Fire)": "https://docs.google.com/forms/d/e/YOUR_FORM_ID_HERE/viewform?usp=sf_link",
        "Glam Jam": "https://docs.google.com/forms/d/e/1FAIpQLSdPoD7TCzkODtkeAfvkGvjuaYVLHUbubTVjtP6eO33Tl0vljw/viewform?usp=header",
        "Cultural Carnival": "https://docs.google.com/forms/d/e/YOUR_FORM_ID_HERE/viewform?usp=sf_link",
        "default": "https://docs.google.com/forms/d/e/YOUR_DEFAULT_FORM_ID_HERE/viewform?usp=sf_link"
    };

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
            overview: "Trequeza is a fun-filled and intellectually stimulating quiz designed to entertain, challenge, and engage participants. It combines general knowledge, logical reasoning, and lateral thinking with a dose of excitement.This year, Trequeza is powered by Kahoot!, making the quiz more interactive and engaging with live questions, instant responses, and leaderboard tracking.<br><br> The quiz consists of multiple rounds covering topics like Movies, Sports, Mythology, Current Affairs, Puzzles, and Logical Reasoning. All rounds will be conducted through Kahoot, ensuring a fair, fast, and fun experience. Participants compete in real-time, with points awarded for both accuracy and speed.",
            rules: ["Participants must bring their own smartphone/tablet with internet access.","Cheating or multiple logins are strictly prohibited.","The top scorers after all rounds will be declared winners."]
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

    // --- Modal Elements ---
    const modalOverlay = document.getElementById('registration-modal-overlay');
    const closeBtn = document.querySelector('.modal-close-btn');
    const registerButtons = document.querySelectorAll('.event-register');
    const learnMoreButtons = document.querySelectorAll('.event-learn-more');
    const descriptionView = document.getElementById('description-view');
    const continueToFormBtn = document.getElementById('continue-to-form-btn');
    const eventNameDisplayDesc = document.getElementById('event-name-display-desc');
    const descriptionContent = document.querySelector('#description-view .description-content');

    let currentEventName = '';

    function openModal(eventName) {
        if (!eventName) {
            console.error("Event name is missing.");
            return;
        }
        currentEventName = eventName;
        
        eventNameDisplayDesc.textContent = eventName;
        const details = eventDetails[eventName] || eventDetails.default;
        const rulesHtml = details.rules.map(rule => `<li>${rule}</li>`).join('');
        descriptionContent.innerHTML = `<h3>Overview</h3><p>${details.overview}</p><h3>Rules & Regulations</h3><ul>${rulesHtml}</ul>`;
        
        descriptionView.style.display = 'block';
        modalOverlay.classList.add('is-visible');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modalOverlay.classList.remove('is-visible');
        document.body.style.overflow = '';
    }

    function redirectToGoogleForm() {
        const formLink = googleFormLinks[currentEventName] || googleFormLinks.default;
        if (formLink && !formLink.includes("YOUR_FORM_ID_HERE")) {
            window.open(formLink, '_blank');
            closeModal();
        } else {
            alert('Registration link for this event is not available yet. Please check back later.');
        }
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

    closeBtn.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalOverlay.classList.contains('is-visible')) closeModal();
    });
});
