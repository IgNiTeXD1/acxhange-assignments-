const form = document.getElementById("userForm");

// ========================================
// CHARACTER COUNTER
// ========================================

const addressInput = document.getElementById("address");
const charCount = document.getElementById("charCount");

addressInput.addEventListener("input", function () {

    const currentLength = addressInput.value.length;

    charCount.innerText = currentLength;

});

// ========================================
// PASSWORD TOGGLE
// ========================================

const passwordInput = document.getElementById("password");

const togglePassword = document.getElementById("togglePassword");

togglePassword.addEventListener("click", function () {

    if (passwordInput.type === "password") {

        passwordInput.type = "text";

        togglePassword.innerText = "🙈";
    }
    else {

        passwordInput.type = "password";

        togglePassword.innerText = "👁";
    }

});

// ========================================
// PASSWORD STRENGTH METER
// ========================================

const strengthBar = document.getElementById("strengthBar");

const strengthText =
    document.getElementById("strengthText");

passwordInput.addEventListener("input", function () {

    const password =
        passwordInput.value;

    let score = 0;

    // LENGTH CHECK

    if (password.length >= 8) {
        score++;
    }

    // UPPERCASE CHECK

    if (/[A-Z]/.test(password)) {
        score++;
    }

    // NUMBER CHECK

    if (/[0-9]/.test(password)) {
        score++;
    }

    // SPECIAL CHARACTER CHECK

    if (/[^A-Za-z0-9]/.test(password)) {
        score++;
    }

    updateStrength(score);

});

// ========================================
// UPDATE STRENGTH UI
// ========================================

function updateStrength(score) {

    if (score === 0) {

        strengthBar.style.width = "0%";

        strengthBar.style.background =
            "transparent";

        strengthText.innerText =
            "Strength: None";
    }

    else if (score === 1) {

        strengthBar.style.width = "25%";

        strengthBar.style.background =
            "red";

        strengthText.innerText =
            "Strength: Weak";
    }

    else if (score === 2) {

        strengthBar.style.width = "50%";

        strengthBar.style.background =
            "orange";

        strengthText.innerText =
            "Strength: Medium";
    }

    else if (score === 3) {

        strengthBar.style.width = "75%";

        strengthBar.style.background =
            "yellowgreen";

        strengthText.innerText =
            "Strength: Good";
    }

    else {

        strengthBar.style.width = "100%";

        strengthBar.style.background =
            "green";

        strengthText.innerText =
            "Strength: Strong";
    }

}

// ========================================
// FORM SUBMIT VALIDATION
// ========================================

form.addEventListener("submit", function (event) {

    event.preventDefault();

    clearErrors();

    let isValid = true;

    // ====================================
    // GET VALUES
    // ====================================

    const name = document.getElementById("name").value.trim();

    const email = document.getElementById("email").value.trim();

    const phone =
        document.getElementById("phone").value.trim();

    const address =
        document.getElementById("address").value.trim();

    const password =
        passwordInput.value;

    const confirmPassword =
        document
            .getElementById("confirmPassword")
            .value;

    // ====================================
    // NAME VALIDATION
    // ====================================

    const nameRegex =
        /^[A-Za-z\s]{2,50}$/;

    if (!nameRegex.test(name)) {

        showError(
            "nameError",
            "Invalid name"
        );

        isValid = false;
    }

    // ====================================
    // EMAIL VALIDATION
    // ====================================

    const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {

        showError(
            "emailError",
            "Invalid email"
        );

        isValid = false;
    }

    // ====================================
    // PHONE VALIDATION
    // ====================================

    const phoneRegex =
        /^[0-9]{10}$/;

    if (!phoneRegex.test(phone)) {

        showError(
            "phoneError",
            "Phone must be 10 digits"
        );

        isValid = false;
    }

    // ====================================
    // ADDRESS VALIDATION
    // ====================================

    if (address.length < 5) {

        showError(
            "addressError",
            "Address too short"
        );

        isValid = false;
    }

    // ====================================
    // PASSWORD VALIDATION
    // ====================================

    const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

    if (!passwordRegex.test(password)) {

        showError(
            "passwordError",
            "Weak password"
        );

        isValid = false;
    }

    // ====================================
    // CONFIRM PASSWORD
    // ====================================

    if (password !== confirmPassword) {

        showError(
            "confirmPasswordError",
            "Passwords do not match"
        );

        isValid = false;
    }

    // ====================================
    // SUCCESS
    // ====================================

    if (isValid) {

        alert(
            "Form submitted successfully!"
        );

        form.reset();

        charCount.innerText = "0";

        updateStrength(0);

        togglePassword.innerText = "👁";

        passwordInput.type = "password";
    }

});

// ========================================
// SHOW ERROR
// ========================================

function showError(id, message) {

    document
        .getElementById(id)
        .innerText = message;
}

// ========================================
// CLEAR ERRORS
// ========================================

function clearErrors() {

    const errors =
        document.querySelectorAll(".error");

    errors.forEach(function (error) {

        error.innerText = "";
    });

}