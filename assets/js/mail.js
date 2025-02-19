(function() {
    emailjs.init("DTj1fXmGPJsMg2K0K");
})();

document.getElementById("contact-form").addEventListener("submit", function(event) {
    event.preventDefault();

    const userEmail = document.getElementById("email").value;
    const currentDate = new Date().toLocaleDateString(); // Get current date as "YYYY-MM-DD"

    // Get the emailSentCount from localStorage
    const emailSentCount = JSON.parse(localStorage.getItem(`emailSentCount_${userEmail}`)) || { count: 0, lastSentDate: "" };

    // Check if email limit is reached
    if (emailSentCount.lastSentDate === currentDate && emailSentCount.count >= 2) {
        Swal.fire({
            icon: 'info',
            title: 'Email Limit Reached!',
            text: 'You can only send two emails per day. Please try again tomorrow.',
            confirmButtonText: 'OK'
        });
        return;
    }

    const formData = {
        from_name: document.getElementById("name").value,
        from_mail: userEmail,
        message: document.getElementById("message").value,
    };

    const serviceID = "service_ts83j5f";
    const templateID = "template_51k1gpp";

    // Validate that all fields are filled in
    if(formData.from_name === "" || formData.from_mail === "" || formData.message === "") {
        Swal.fire({
            icon: 'warning',
            title: 'Missing Information',
            text: 'Please fill out all the fields.',
            confirmButtonText: 'OK'
        });
        return;
    }

    // Validate the message length (at least 5 words)
    const messageWordsCount = formData.message.trim().split(/\s+/).length;
    if (messageWordsCount < 5) {
        Swal.fire({
            icon: 'warning',
            title: 'Message Too Short',
            text: 'Please enter at least 5 words in your message.',
            confirmButtonText: 'OK'
        });
        return;
    }

    // Send the email via emailjs
    emailjs.send(serviceID, templateID, formData)
        .then(function(response) {
            // Update localStorage after successful email sending
            if (emailSentCount.lastSentDate !== currentDate) {
                emailSentCount.count = 0; // Reset count for the new day
            }

            emailSentCount.count += 1; // Increment the count
            emailSentCount.lastSentDate = currentDate; // Set the last sent date to today

            // Save updated count and date to localStorage
            localStorage.setItem(`emailSentCount_${userEmail}`, JSON.stringify(emailSentCount));

            // Reset the form and show success message
            document.getElementById("contact-form").reset();
            Swal.fire({
                icon: 'success',
                title: 'Email Sent!',
                text: 'Your message has been sent successfully.',
                confirmButtonText: 'OK'
            });
        }, function(error) {
            // Show error message if email sending fails
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong. Please try later.',
                confirmButtonText: 'OK'
            });
        });
});
