// ============================================
// ANDROID EXTENDED SCREEN V2
// WebRTC video streaming
// ============================================

const home = document.getElementById("home");
const host = document.getElementById("host");
const viewer = document.getElementById("viewer");

const statusText = document.getElementById("status");

const hostBtn = document.getElementById("hostBtn");
const viewerBtn = document.getElementById("viewerBtn");

const hostBack = document.getElementById("hostBack");
const viewerBack = document.getElementById("viewerBack");

const localVideo =
    document.getElementById("localVideo");

const remoteVideo =
    document.getElementById("remoteVideo");

const offerBox =
    document.getElementById("offer");

const offerInput =
    document.getElementById("offerInput");

const answerBox =
    document.getElementById("answer");

const answerInput =
    document.getElementById("answerInput");

const cameraBtn =
    document.getElementById("cameraBtn");

const screenBtn =
    document.getElementById("screenBtn");

const copyOffer =
    document.getElementById("copyOffer");

const copyAnswer =
    document.getElementById("copyAnswer");

const connectHost =
    document.getElementById("connectHost");

const createAnswer =
    document.getElementById("createAnswer");

const fullscreen =
    document.getElementById("fullscreen");


// ============================================
// WEBRTC CONFIGURATION
// ============================================

const rtcConfig = {

    iceServers: [
        {
            urls: "stun:stun.l.google.com:19302"
        },
        {
            urls: "stun:stun1.l.google.com:19302"
        }
    ]

};


// ============================================
// VARIABLES
// ============================================

let hostConnection = null;

let viewerConnection = null;

let localStream = null;


// ============================================
// PAGE SWITCHING
// ============================================

function showPage(page) {

    home.classList.remove("active");
    host.classList.remove("active");
    viewer.classList.remove("active");

    page.classList.add("active");

}


// ============================================
// STATUS
// ============================================

function setStatus(text, online = false) {

    statusText.textContent = "● " + text;

    if (online) {

        statusText.classList.add("online");

    } else {

        statusText.classList.remove("online");

    }

}


// ============================================
// HOST MODE
// ============================================

hostBtn.onclick = () => {

    showPage(host);

    setStatus("Host");

};


// ============================================
// VIEWER MODE
// ============================================

viewerBtn.onclick = () => {

    showPage(viewer);

    setStatus("Display");

};


// ============================================
// CAMERA
// ============================================

cameraBtn.onclick = async () => {

    try {

        localStream =
            await navigator.mediaDevices.getUserMedia({

                video: {
                    facingMode: "environment"
                },

                audio: false

            });

        localVideo.srcObject =
            localStream;

        setStatus("Camera Ready", true);

    } catch (error) {

        alert(
            "Camera permission was denied or unavailable."
        );

        console.error(error);

    }

};


// ============================================
// SCREEN CAPTURE
// ============================================

screenBtn.onclick = async () => {

    try {

        localStream =
            await navigator.mediaDevices.getDisplayMedia({

                video: true,

                audio: false

            });

        localVideo.srcObject =
            localStream;

        setStatus("Screen Capture Ready", true);

    } catch (error) {

        alert(
            "Screen sharing was cancelled or is not supported."
        );

        console.error(error);

    }

};


// ============================================
// CREATE HOST OFFER
// ============================================

async function createHostOffer() {

    if (!localStream) {

        alert(
            "First choose Camera or Share Screen."
        );

        return;

    }

    hostConnection =
        new RTCPeerConnection(rtcConfig);


    // Add video tracks

    localStream.getTracks().forEach(track => {

        hostConnection.addTrack(
            track,
            localStream
        );

    });


    hostConnection.onicecandidate =
        event => {

            if (!event.candidate) {

                offerBox.value =
                    JSON.stringify(
                        hostConnection.localDescription
                    );

            }

        };


    hostConnection.onconnectionstatechange =
        () => {

            console.log(
                "Host:",
                hostConnection.connectionState
            );

            if (
                hostConnection.connectionState ===
                "connected"
            ) {

                setStatus(
                    "Connected",
                    true
                );

            }

        };


    const offer =
        await hostConnection.createOffer();

    await hostConnection.setLocalDescription(
        offer
    );

}


screenBtn.addEventListener(
    "dblclick",
    createHostOffer
);

cameraBtn.addEventListener(
    "dblclick",
    createHostOffer
);


// ============================================
// CONNECT HOST WITH VIEWER ANSWER
// ============================================

connectHost.onclick = async () => {

    if (!hostConnection) {

        await createHostOffer();

    }

    try {

        const answer =
            JSON.parse(
                answerInput.value
            );

        await hostConnection.setRemoteDescription(
            new RTCSessionDescription(answer)
        );

        setStatus(
            "Connected",
            true
        );

    } catch (error) {

        alert(
            "Invalid Display answer."
        );

        console.error(error);

    }

};


// ============================================
// VIEWER CREATE ANSWER
// ============================================

createAnswer.onclick = async () => {

    try {

        const offer =
            JSON.parse(
                offerInput.value
            );


        viewerConnection =
            new RTCPeerConnection(rtcConfig);


        viewerConnection.ontrack =
            event => {

                remoteVideo.srcObject =
                    event.streams[0];

                setStatus(
                    "Streaming",
                    true
                );

            };


        viewerConnection.onconnectionstatechange =
            () => {

                console.log(
                    "Viewer:",
                    viewerConnection.connectionState
                );

            };


        await viewerConnection.setRemoteDescription(

            new RTCSessionDescription(
                offer
            )

        );


        const answer =
            await viewerConnection.createAnswer();


        await viewerConnection.setLocalDescription(
            answer
        );


        viewerConnection.onicecandidate =
            event => {

                if (!event.candidate) {

                    answerBox.value =
                        JSON.stringify(
                            viewerConnection.localDescription
                        );

                }

            };


    } catch (error) {

        alert(
            "Invalid Host offer."
        );

        console.error(error);

    }

};


// ============================================
// COPY OFFER
// ============================================

copyOffer.onclick = async () => {

    if (!offerBox.value) {

        alert(
            "Create the Host offer first."
        );

        return;

    }

    await navigator.clipboard.writeText(
        offerBox.value
    );

    copyOffer.textContent =
        "Copied ✓";

};


// ============================================
// COPY ANSWER
// ============================================

copyAnswer.onclick = async () => {

    if (!answerBox.value) {

        alert(
            "Create the Display answer first."
        );

        return;

    }

    await navigator.clipboard.writeText(
        answerBox.value
    );

    copyAnswer.textContent =
        "Copied ✓";

};


// ============================================
// FULLSCREEN
// ============================================

fullscreen.onclick = async () => {

    try {

        if (!document.fullscreenElement) {

            await remoteVideo.requestFullscreen();

        } else {

            await document.exitFullscreen();

        }

    } catch (error) {

        console.error(error);

    }

};


// ============================================
// BACK BUTTONS
// ============================================

hostBack.onclick = () => {

    if (localStream) {

        localStream.getTracks().forEach(
            track => track.stop()
        );

        localStream = null;

    }

    if (hostConnection) {

        hostConnection.close();

        hostConnection = null;

    }

    localVideo.srcObject = null;

    offerBox.value = "";
    answerInput.value = "";

    setStatus("Offline");

    showPage(home);

};


viewerBack.onclick = () => {

    if (viewerConnection) {

        viewerConnection.close();

        viewerConnection = null;

    }

    remoteVideo.srcObject = null;

    offerInput.value = "";
    answerBox.value = "";

    setStatus("Offline");

    showPage(home);

};
