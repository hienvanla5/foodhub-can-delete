const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", function(e){

    e.preventDefault();

    // VALUES
    const email =
    document.getElementById("loginEmail").value.trim();

    const password =
    document.getElementById("loginPassword").value;

    // ERROR ELEMENTS
    const emailError =
    document.getElementById("loginEmailError");

    const passwordError =
    document.getElementById("loginPasswordError");

    const loginSuccess =
    document.getElementById("loginSuccess");

    // RESET
    emailError.innerHTML = "";
    passwordError.innerHTML = "";
    loginSuccess.innerHTML = "";

    // REGEX EMAIL
    const emailPattern =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    let isValid = true;

    // EMAIL
    if(!emailPattern.test(email)){

        emailError.innerHTML =
        "Invalid email format";

        isValid = false;
    }

    // PASSWORD
    if(password === ""){

        passwordError.innerHTML =
        "Password cannot be empty";

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