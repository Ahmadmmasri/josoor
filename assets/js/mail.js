(function() {
    emailjs.init("DTj1fXmGPJsMg2K0K");
})();

document.getElementById("contact-form").addEventListener("submit", function(event) {
    event.preventDefault();
    
    const userEmail = document.getElementById("email").value;
    const currentDate = new Date().toLocaleDateString(); // Get current date as "YYYY-MM-DD"

    // Check if email was sent already today
    const lastSentDate = localStorage.getItem(`lastSent_${userEmail}`);

    if (lastSentDate === currentDate) {
        Swal.fire({
            icon: 'info',
            title: 'Email Limit Reached!',
            text: 'You can only send two emails per day. Please try again tomorrow.',
            confirmButtonText: 'OK'
        });
        return;
    }

    localStorage.setItem(`lastSent_${userEmail}`, currentDate);

    const formData = {
        from_name: document.getElementById("name").value,
        from_mail: userEmail,
        message: document.getElementById("message").value,
    };
    
    const serviceID = "service_ts83j5f";
    const templateID = "template_51k1gpp";


    if(formData.from_name === "" || formData.from_mail === "" || formData.message === "") {
        return;
    }
    else{
        emailjs.send(serviceID, templateID, formData)
            .then(function(response) {
                
                document.getElementById("contact-form").reset();
                Swal.fire({
                    icon: 'success',
                    title: 'Email Sent!',
                    text: 'Your message has been sent successfully.',
                    confirmButtonText: 'OK'
                });
            }, function(error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong. Please try later.',
                    confirmButtonText: 'OK'
                });
        });
    }

});
