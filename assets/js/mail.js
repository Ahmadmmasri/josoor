(function() {
    emailjs.init("DTj1fXmGPJsMg2K0K");
})();

let isAR = document.dir === "rtl";

// Translation object
const translations = {
    emailLimitReached: isAR ? "لقد وصلت إلى الحد الأقصى لعدد الرسائل الإلكترونية!" : "Email Limit Reached!",
    emailLimitMessage: isAR ? "يمكنك إرسال رسالتين فقط في اليوم. يرجى المحاولة غدًا." : "You can only send two emails per day. Please try again tomorrow.",
    missingFields: isAR ? "الرجاء تعبئة جميع الحقول." : "Please fill out all the fields.",
    messageTooShort: isAR ? "يرجى إدخال 5 كلمات على الأقل في رسالتك." : "Please enter at least 5 words in your message.",
    emailSentSuccess: isAR ? "تم إرسال الرسالة بنجاح!" : "Email Sent!",
    emailSentMessage: isAR ? "تم إرسال رسالتك بنجاح." : "Your message has been sent successfully.",
    errorMessage: isAR ? "حدث خطأ. يرجى المحاولة لاحقًا." : "Something went wrong. Please try later."
};

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
            title: translations.emailLimitReached,
            text: translations.emailLimitMessage,
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
    if (formData.from_name === "" || formData.from_mail === "" || formData.message === "") {
        Swal.fire({
            icon: 'warning',
            title: translations.missingFields,
            confirmButtonText: 'OK'
        });
        return;
    }

    // Validate the message length (at least 5 words)
    const messageWordsCount = formData.message.trim().split(/\s+/).length;
    if (messageWordsCount < 5) {
        Swal.fire({
            icon: 'warning',
            title: translations.messageTooShort,
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
                title: translations.emailSentSuccess,
                text: translations.emailSentMessage,
                confirmButtonText: 'OK'
            });
        }, function(error) {
            // Show error message if email sending fails
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: translations.errorMessage,
                confirmButtonText: 'OK'
            });
        });
});
