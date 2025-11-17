document.querySelector("#zip").addEventListener("change", displayCity);
document.querySelector("#state").addEventListener("change", displayCountry);
document.querySelector("#username").addEventListener("change", checkusername);

document.querySelector("#password").addEventListener("focus", suggestPassword);
document.querySelector("#password2").addEventListener("change", checkPasswordMatch);
document.querySelector("form").addEventListener("submit", validateForm);
document.querySelector("#password2").addEventListener("input", checkPasswordMatch);

loadStates();

async function displayCity() {
    let zipCode = document.querySelector("#zip").value;

    let url = `https://csumb.space/api/cityInfoAPI.php?zip=${zipCode}`;
    try {
        let response = await fetch(url);
        let data = await response.json();

        let citySpan = document.querySelector("#city");
        let latSpan = document.querySelector("#latitude");
        let lonSpan = document.querySelector("#longitude");

        if (!data || !data.city) {
            citySpan.innerHTML = "Zip code not found";
            latSpan.innerHTML = "";
            lonSpan.innerHTML = "";
        } else {
            citySpan.innerHTML = data.city;
            latSpan.innerHTML = data.latitude;
            lonSpan.innerHTML = data.longitude;
        }
    } catch (error) {
        document.querySelector("#city").innerHTML = "Zip code not found";
        document.querySelector("#latitude").innerHTML = "";
        document.querySelector("#longitude").innerHTML = "";
    }
}

async function displayCountry() {
    let state = document.querySelector("#state").value;
    let url = `https://csumb.space/api/countyListAPI.php?state=${state}`;
    let response = await fetch(url);
    let data = await response.json();

    let countyList = document.querySelector("#county");
    countyList.innerHTML = "";

    for (let i = 0; i < data.length; i++) {
        countyList.innerHTML += `<option>${data[i].county}</option>`;
    }
}

async function checkusername() {
    let username = document.querySelector("#username").value;
    let url = `https://csumb.space/api/usernamesAPI.php?username=${username}`;
    let response = await fetch(url);
    let data = await response.json();

    let usernameError = document.querySelector("#usernameError");
    if (data.available) {
        usernameError.innerHTML = "Username available";
        usernameError.style.color = "green";
    } else {
        usernameError.innerHTML = "Username taken";
        usernameError.style.color = "red";
    }
}


async function loadStates() {
    let stateSelect = document.querySelector("#state");
    let url = "https://csumb.space/api/allStatesAPI.php";

    try {
        let response = await fetch(url);
        let data = await response.json();

        stateSelect.innerHTML = `<option>Select One</option>`;

        for (let i = 0; i < data.length; i++) {
            stateSelect.innerHTML += `<option value="${data[i].usps}">${data[i].state}</option>`;
        }
    } catch (err) {
        console.log("Error loading states:", err);
    }
}

function suggestPassword() {
    let suggestedSpan = document.querySelector("#suggestedPwd");

    let chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let pwd = "";
    for (let i = 0; i < 8; i++) {
        pwd += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    suggestedSpan.innerHTML = ` Suggested: ${pwd}`;
}

function checkPasswordMatch() {
    let pwd1 = document.querySelector("#password").value;
    let pwd2 = document.querySelector("#password2").value;
    let error = document.querySelector("#passwordError");
    if (pwd1 === "" || pwd2 === "") {
        error.innerHTML = "";
        return;
    }

    if (pwd1.length < 6) {
        error.innerHTML = "Password must be at least 6 characters long";
        error.style.color = "red";
        return;
    }
    if (pwd1 === pwd2) {
        error.innerHTML = "Passwords match!";
        error.style.color = "green";
    } else {
        error.innerHTML = "Passwords do not match";
        error.style.color = "red";
    }
}

function validateForm(event) {
    let pwd1 = document.querySelector("#password").value;
    let pwd2 = document.querySelector("#password2").value;
    let error = document.querySelector("#passwordError");

    if (pwd1.length < 6) {
        error.innerHTML = "Password must be at least 6 characters long";
        error.style.color = "red";
        event.preventDefault(); 
        return;
    }

    if (pwd1 !== pwd2) {
        error.innerHTML = "Passwords do not match";
        error.style.color = "red";
        event.preventDefault();
        return;
    }

}