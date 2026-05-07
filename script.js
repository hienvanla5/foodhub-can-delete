const registerForm = document.getElementById("registerForm");

registerForm.addEventListener("submit", function(e){

    e.preventDefault();

    // INPUT VALUES
    const fullName = document.getElementById("fullName").value.trim();

    const email = document.getElementById("email").value.trim();

    const password = document.getElementById("password").value;

    const confirmPassword =
    document.getElementById("confirmPassword").value;

    const phone = document.getElementById("phone").value.trim();

    const agree = document.getElementById("agree").checked;

    // ERROR ELEMENTS
    const fullNameError =
    document.getElementById("fullNameError");

    const emailError =
    document.getElementById("emailError");

    const passwordError =
    document.getElementById("passwordError");

    const confirmPasswordError =
    document.getElementById("confirmPasswordError");

    const phoneError =
    document.getElementById("phoneError");

    const agreeError =
    document.getElementById("agreeError");

    const successMessage =
    document.getElementById("successMessage");

    // RESET
    fullNameError.innerHTML = "";
    emailError.innerHTML = "";
    passwordError.innerHTML = "";
    confirmPasswordError.innerHTML = "";
    phoneError.innerHTML = "";
    agreeError.innerHTML = "";
    successMessage.innerHTML = "";

    // REGEX
    const emailPattern =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const passwordPattern =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

    const phonePattern =
    /^[0-9]{10}$/;

    let isValid = true;

    // FULL NAME
    if(fullName === ""){
        fullNameError.innerHTML =
        "Full name cannot be empty";

        isValid = false;
    }

    // EMAIL
    if(!emailPattern.test(email)){
        emailError.innerHTML =
        "Invalid email format";

        isValid = false;
    }

    // PASSWORD
    if(!passwordPattern.test(password)){
        passwordError.innerHTML =
        "Password must contain at least 8 characters, 1 uppercase letter, 1 number and 1 special character";

        isValid = false;
    }

    // CONFIRM PASSWORD
    if(confirmPassword !== password){
        confirmPasswordError.innerHTML =
        "Confirm password does not match";

        isValid = false;
    }

    // PHONE NUMBER
    if(!phonePattern.test(phone)){
        phoneError.innerHTML =
        "Phone number must contain exactly 10 digits";

        isValid = false;
    }

    // TERMS
    if(!agree){
        agreeError.innerHTML =
        "You must agree to the terms";

        isValid = false;
    }

    // SUCCESS
    if(isValid){

    localStorage.setItem(
        "loginSuccess",
        "true"
    );

    window.location.href = "index.html";
}

});