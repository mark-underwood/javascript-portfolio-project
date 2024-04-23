// global button states. false is released; true is held down.
let sButtonLeftState = false; 
let sButtonUpState = false;
let eButtonUpState = false;
let eButtonRightState = false;

// Reference: https://www.sololearn.com/en/compiler-playground/WUVrS54WbnSg/
window.oncontextmenu = function(event) {
    // solution to prevent long press menu on touch devices
    // by user bbsimonbb on stackoverflow
    // https://stackoverflow.com/questions/3413683/disabling-the-context-menu-on-long-taps-on-android
    event.preventDefault();
    event.stopPropagation();
    return false;
}

////// resize // 
//// Based on https://developer.mozilla.org/en-US/docs/Web/API/Window/resize_event
addEventListener('resize', (event) => {});
onresize = (event) => {};
function reportWindowSize() {
    const jspWindow = document.getElementById('jsp-window');
    jspWindow.width = window.innerWidth;
    jspWindow.height = window.innerHeight;
}
window.onresize = reportWindowSize();
////// resize //

// fullscreen video - based on w3schools tutorial
// https://www.w3schools.com/howto/howto_js_fullscreen.asp
const jspViewport = document.getElementById("jsp-viewport");
function openFullscreen() {
    if (jspViewport.requestFullscreen) {
        jspViewport.requestFullscreen(); // standard fullscreen
    } else if (jspViewport.requestFullscreen) {
        jspViewport.webkitRequestFullscreen(); // Safari
    } else if (jspViewport.requestFullscreen) {
        jspViewport.msRequestFullscreen(); // Internet Explorer
    }
}

function createEventListeners() {
    const sBtnLeft = document.getElementById("sbuttonleft");
    sBtnLeft.addEventListener("pointerdown", sButtonLeftAct);
    sBtnLeft.addEventListener("pointerup", sButtonLeftOff);

    const sBtnUp = document.getElementById("sbuttonup");
    sBtnUp.addEventListener("pointerdown", sButtonUpAct);
    sBtnUp.addEventListener("pointerup", sButtonUpOff);

    const eBtnUp = document.getElementById("ebuttonup");
    eBtnUp.addEventListener("pointerdown", eButtonUpAct);
    eBtnUp.addEventListener("pointerup", eButtonUpOff);

    const eBtnRight = document.getElementById("ebuttonright");
    eBtnRight.addEventListener("pointerdown", eButtonRightAct);
    eBtnRight.addEventListener("pointerup", eButtonRightOff);
}

// Start (Left side controller)
// Left
function sButtonLeftAct(event) {
    event.stopPropagation();
    console.log(`s-L: Thrust left activated.`);
    sButtonLeftState = true;
    // alert(`s-L: Thrust left activated.`);
}
function sButtonLeftOff(event) {
    event.stopPropagation();
    console.log(`s-L: Thrust left off.`);
    sButtonLeftState = false;
    // alert(`s-L: Thrust left off.`);
}

// Up
function sButtonUpAct(event) {
    event.stopPropagation();
    console.log(`s-U: Thrust up activated.`);
    sButtonUpState = true;
    // alert(`s-U: Thrust up activated.`);
}
function sButtonUpOff(event) {
    event.stopPropagation();
    console.log(`s-U: Thrust up off.`);
    sButtonUpState = false;
    // alert(`s-U: Thrust up off.`);
}

// End (Right side controller)
// Up
function eButtonUpAct(event) {
    event.stopPropagation();
    console.log(`e-U: Thrust up activated.`);
    eButtonUpState = true;
    // alert(`e-U: Thrust up activated.`);
}
function eButtonUpOff(event) {
    event.stopPropagation();
    console.log(`e-U: Thrust up off.`);
    eButtonUpState = false;
    // alert(`e-U: Thrust up off.`);
}

// Right
function eButtonRightAct(event) {
    event.stopPropagation();
    console.log(`e-R: Thrust right activated.`);
    eButtonRightState = true;
    // alert(`e-R: Thrust right activated.`);
}
function eButtonRightOff(event) {
    event.stopPropagation();
    console.log(`e-R: Thrust right off.`);
    eButtonRightState = false;
    // alert(`e-R: Thrust right off.`);
}

createEventListeners();