// Reference: https://www.sololearn.com/en/compiler-playground/WUVrS54WbnSg/

// Start (Left side controller)
// Left
function sButtonLeft(event) {
    event.stopPropagation();
    console.log(`s-L: Thrust left activated.`);
    // alert(`s-L: Thrust left activated.`);
}
function sButtonLeftOff(event) {
    event.stopPropagation();
    console.log(`s-L: Thrust left off.`);
    // alert(`s-L: Thrust left off.`);
}

// Up
function sButtonUp(event) {
    event.stopPropagation();
    console.log(`s-U: Thrust up activated.`);
    // alert(`s-U: Thrust up activated.`);
}
function sButtonUpOff(event) {
    event.stopPropagation();
    console.log(`s-U: Thrust up off.`);
    // alert(`s-U: Thrust up off.`);
}

// End (Right side controller)
// Up
function eButtonUp(event) {
    event.stopPropagation();
    console.log(`e-U: Thrust up activated.`);
    // alert(`e-U: Thrust up activated.`);
}
function eButtonUpOff(event) {
    event.stopPropagation();
    console.log(`e-U: Thrust up off.`);
    // alert(`e-U: Thrust up off.`);
}

// Right
function eButtonRight(event) {
    event.stopPropagation();
    console.log(`e-R: Thrust right activated.`);
    // alert(`e-R: Thrust right activated.`);
}
function eButtonRightOff(event) {
    event.stopPropagation();
    console.log(`e-R: Thrust right off.`);
    // alert(`e-R: Thrust right off.`);
}