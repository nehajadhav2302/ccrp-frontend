document.addEventListener('DOMContentLoaded', function() {
    const learnMoreButton = document.getElementById('learnMore');
    const contactForm = document.getElementById('contactForm');

    // Check if the learnMore button exists before attaching the event listener
    if (learnMoreButton) {
        learnMoreButton.addEventListener('click', function() {
            alert('Thank you for your interest! More information will be available soon.');
        });
    }

    // Check if the contactForm exists before attaching the event listener
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevents form from submitting

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            // Display an alert with the form data (for demo purposes)
            alert(`Thank you, ${name}! We have received your message.`);

            // Reset the form after submission
            contactForm.reset();
        });
    } else {
        console.log('Contact form not found!');
    }
});
