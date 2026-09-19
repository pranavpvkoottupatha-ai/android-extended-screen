// ==========================================
// ANDROID EXTENDED SCREEN V1
// ==========================================

const startScreen = document.getElementById("startScreen");
const hostScreen = document.getElementById("hostScreen");
const displayScreen = document.getElementById("displayScreen");

const hostButton = document.getElementById("hostButton");
const displayButton = document.getElementById("displayButton");

const hostBack = document.getElementById("hostBack");
const displayBack = document.getElementById("displayBack");

const hostCode = document.getElementById("hostCode");
const copyCode = document.getElementById("copyCode");

const codeInput = document.getElementById("codeInput");
const connectButton = document.getElementById("connectButton");

const displayWorkspace =
    document.getElementById("displayWorkspace");

const fullscreenButton =
    document.getElementById("fullscreenButton");

const connectionStatus =
    document.getElementById("connectionStatus");


// ==========================================
// SCREEN SWITCHING
// ==========================================

function showScreen(screen) {

    startScreen.classList.remove("active");
    hostScreen.classList.remove("active");
    displayScreen.classList.remove("active");

    screen.classList.add("active");
}


// ==========================================
// GENERATE CONNECTION CODE
// ==========================================

function generateCode() {

    return Math.floor(
        100000 + Math.random() * 900000
    ).toString();
}


// ==========================================
// HOST MODE
// ==========================================

let currentHostCode = "";

hostButton.addEventListener("click", () => {

    currentHostCode = generateCode();

    hostCode.textContent = currentHostCode;

    connectionStatus.textContent = "● Host Ready";
    connectionStatus.className = "status online";

    showScreen(hostScreen);

});


// ==========================================
// COPY CONNECTION CODE
// ==========================================

copyCode.addEventListener("click", async () => {

    if (!currentHostCode) {
        return;
    }

    try {

        await navigator.clipboard.writeText(
            currentHostCode
        );

        copyCode.textContent = "Copied ✓";

        setTimeout(() => {
            copyCode.textContent = "Copy Code";
        }, 1500);

    } catch (error) {

        alert(
            "Your browser does not allow automatic copying."
        );

    }

});


// ==========================================
// EXTENDED SCREEN MODE
// ==========================================

displayButton.addEventListener("click", () => {

    connectionStatus.textContent = "● Waiting";
    connectionStatus.className = "status offline";

    showScreen(displayScreen);

    codeInput.focus();

});


// ==========================================
// CONNECT
// ==========================================

connectButton.addEventListener("click", () => {

    const enteredCode =
        codeInput.value.trim();

    if (enteredCode.length !== 6) {

        alert(
            "Please enter the 6-digit connection code."
        );

        return;
    }

    /*
       V1 DEMO CONNECTION

       This version demonstrates the second-screen
       interface. Real device-to-device networking
       will be added in V2.
    */

    displayWorkspace.classList.remove("hidden");

    connectionStatus.textContent =
        "● Connected";

    connectionStatus.className =
        "status online";

    connectButton.textContent =
        "Connected ✓";

});


// ==========================================
// FULLSCREEN
// ==========================================

fullscreenButton.addEventListener(
    "click",
    async () => {

        const workspace =
            document.getElementById(
                "displayWorkspace"
            );

        try {

            if (!document.fullscreenElement) {

                await workspace.requestFullscreen();

            } else {

                await document.exitFullscreen();

            }

        } catch (error) {

            alert(
                "Fullscreen is not supported by this browser."
            );

        }

    }
);


// ==========================================
// DESKTOP ICONS
// ==========================================

const desktopCards =
    document.querySelectorAll(".desktop-card");

desktopCards.forEach(card => {

    card.addEventListener("click", () => {

        const name =
            card.querySelector("span").textContent;

        alert(
            name +
            " window selected."
        );

    });

});


// ==========================================
// BACK BUTTONS
// ==========================================

hostBack.addEventListener("click", () => {

    connectionStatus.textContent =
        "● Offline";

    connectionStatus.className =
        "status offline";

    showScreen(startScreen);

});


displayBack.addEventListener("click", () => {

    connectionStatus.textContent =
        "● Offline";

    connectionStatus.className =
        "status offline";

    displayWorkspace.classList.add("hidden");

    connectButton.textContent =
        "🔗 Connect";

    codeInput.value = "";

    showScreen(startScreen);

});


// ==========================================
// ENTER KEY
// ==========================================

codeInput.addEventListener(
    "keydown",
    event => {

        if (event.key === "Enter") {

            connectButton.click();

        }

    }
);
