//////
///// 2D Movement Reference: https://www.sololearn.com/en/compiler-playground/WUVrS54WbnSg/
////

/// gravitational constant: 6.67408*10^-11 N*m^2/kg^2
// gravitation formula F = G * (m1 * m2) / r^2    a = G * (mass of moon) / r^2

//// Reference: https://en.wikipedia.org/wiki/Moon
////// Useful Moon facts:
// surface gravity (g): 1.622 m/s^2
// mass (m): 7.342*10^22 kg
// equatorial radius (r): ~1,738,100 m
// escape velocity (v_esc): 2.38 km/s

//// Reference: https://en.wikipedia.org/wiki/Apollo_Lunar_Module
////// Apollo Lunar Module facts:
// launch mass (standard): 15,200 kg
// ascent stage gross mass: 4,700 kg
// dry mass (standard): 4,280 kg
// ascent stage dry mass: 2,150 kg
// decent stage including propellant: 10,334 kg

//// REF: https://en.wikipedia.org/wiki/Descent_propulsion_system
// main engine thrust: 16,000 N (3,500 lbf)
// throttle range: 10%-60%, full thrust

//// REF: https://space1.com/Artifacts/Apollo_Artifacts/SM_RCS_Thruster/sm_rcs_thruster.html
//// Apollo RCS - Marquardt Corporation Model R-4D
// rated thrust: 444.8222 N (100 pounds)
// thrusters per direction/3-dimension: two

//// precalculated values
// full force of RCS thrusters in one direction:
// 2 * 444.8222 Newtons / 4280 kg = 0.207861 m/s^2

// global button states. false is released; true is held down.
let sButtonLeftState = false;
let sButtonUpState = false;
let eButtonUpState = false;
let eButtonRightState = false;
let gameTime = 0; // number of seconds since game start
let gameFrames = 0; // number of physics frames since game start
let gaming; // initialize the timeInterval
const framesPerSecond = 60; // physics frames per second
const frameTimeSeconds = 1 / framesPerSecond;
// const frameRate = framesPerSecond * 1000; // frames rate per millisecond
const frameTime = 1000 / framesPerSecond; // milliseconds to delay
const lunarGravityAccel = 1.622; // m/s^2
let massLander = 5000; // kilograms (4280 kg dry, 10334 kg full)
const landerDim = {x: 9.4, y: 7.04}; // width w/ gear deployed, height (meters)

// rcs - two per direction
const rcsTwinNewtons = 2 * 444.8222; // Newtons
let rcsTwinAccel = rcsTwinNewtons / massLander; // m/s^2
// console.log(`rcsTwinAccel is ${rcsTwinAccel} meters per second squared.`);

// main engine
const mainEngineNewtons = 16000; // Newtons
const mainEngineMinRamp = 10; // idle percent*100
let mainEngineRamp = mainEngineMinRamp; // start at idle
const mainEngineMaxRamp = 60; // maximum percent*100 allowed
const mainEngineRampRate = 1; // percent*100 change per physics frame
let mainEngineAccel = mainEngineNewtons / massLander;
// console.log(`mainEngineAccel is ${mainEngineAccel} meters per second squared.`);

// initial physics
let linearPosition = {x: 0, y: 0}; // initialize position of lander
linearPosition.x = Math.random() * 200 - 100; // randomize horizontal position a bit
linearPosition.y = 400; // meters above *surface
let linearVelocity = {x: 0, y: 0}; // hover start - m/s
let linearAccel = {x: 0, y: 0}; // linearAccel tracks cumulative acceleration over the physics frame

class gameNormal {
    constructor() {
       //  let sButtonLeftState = false;
       //  let sButtonUpState = false;
       //  let eButtonUpState = false;
       //  let eButtonRightState = false;
       
    }
    // rcsAccelLeft()
    // [-0.207861 * massLander, 0];
    
    // rcsAccelRight
    // [0.207861 * massLander, 0];
    
    // mainImpulseUp
    // [0, ];
}

function gamePhysics() {
    // [x,y] inertia means default acceleration is zero
    // only near object physics is considered.
    
    linearAccel.y -= lunarGravityAccel / framesPerSecond; // apply gravity due to moon
    if (sButtonLeftState) {
        linearAccel.x -= rcsTwinAccel / framesPerSecond; // accel leftward
    }
    if (eButtonRightState) {
        linearAccel.x += rcsTwinAccel / framesPerSecond; // accel rightward
    }
    if (sButtonUpState || eButtonUpState) {
        if (mainEngineRamp < mainEngineMaxRamp) {
            if ((mainEngineRampRate / framesPerSecond) >= (mainEngineMaxRamp - mainEngineMinRamp)) {
                mainEngineRamp = mainEngineMaxRamp; // keep below max in case ramp rate is changed higher
            } else {
            mainEngineRamp += mainEngineRampRate / framesPerSecond; // steadily increase supplied throttle
            }
        }
        if (mainEngineRamp > mainEngineMaxRamp) {
            mainEngineRamp = mainEngineMaxRamp; // keep below max
        }
        ////// TEMPORARY ROCK MODE WHEN FOLLOWING LINE DISABLED
        //linearAccel.y += ( mainEngineAccel / framesPerSecond ) * ( mainEngineRamp / 100 ); // apply engine thrust
    }
    if (!(sButtonUpState && eButtonUpState)) { // no up demand
        if (mainEngineRamp > 10) { // never go below idle
            mainEngineRamp -= mainEngineRampRate / framesPerSecond; // steadily decrease supplied throttle
        }
    }
    // for (axis of linearVelocity) { // this could work with three dimensions too
        // add frame acceleration to velocity vectors.
    let linearVelNaught = {x: linearVelocity.x, y: linearVelocity.y};
    
    // Kinematic Eq #1: v = v.naught + a * t
    linearVelocity.x = linearVelNaught.x + linearAccel.x * frameTimeSeconds;
    linearVelocity.y = linearVelNaught.y + linearAccel.y * frameTimeSeconds;

    // Kinematic Eq #3: y.delta = v.naught
    linearPosition.x += linearVelNaught.x * frameTimeSeconds + 0.5 * linearAccel.x * frameTimeSeconds ** 2;
    linearPosition.y += linearVelNaught.y * frameTimeSeconds + 0.5 * linearAccel.y * frameTimeSeconds ** 2;
    // linearPosition.z += linearVelNaught.z * frameTime + 0.5 * linearAccel.z * frameTime**2;

    console.log(`Y-Pos: ${Math.floor(linearPosition.y)}\nY-Vel: ${Math.floor(linearVelocity.y)}`); // y pos & vel

    // console.log(`Linear position X=${linearPosition.x} Y=${linearPosition.y}`); // position
    // console.log(`Linear velocity X=${linearVelocity.x} Y=${linearVelocity.y}`); // velocity
    // console.log(`Linear acceleration X=${linearAccel.x} Y=${linearAccel.y}`); // acceleration

    gameTime += frameTime / 1000;
    gameFrames++;
    console.log(`Game was running for ${gameTime} seconds\n  at frame ${gameFrames}`);
    
    drawFrame(); // update graphics

    // test for win and fail conditions
    if (10 > linearVelocity.y > 10 && linearPosition.y <= landerDim.y + linearVelocity.y) {
        clearInterval(gaming);
        alert(`CRASH`);
        return false;
    } else if (-1 > linearVelocity.y > 1 && linearPosition.y <= landerDim.y + linearVelocity.y) {
        clearInterval(gaming);
        alert(`SEVERE DAMAGE`);
        return false;
    } else if (-1 <= linearVelocity.y <= 1 && linearPosition.y <= landerDim.y + linearVelocity.y) {
        clearInterval(gaming);
        alert(`Tranquility base here. The Eagle has landed!`);
        return true;
    }
    if (linearPosition.y < 0) {
        clearInterval(gaming)
        console.log(`Final position ${linearPosition.y} is below zero!`);
        return false;
    }
}

function drawFrame() {
    // update graphics positions
}

function gameLoop() {
    gaming = setInterval(gamePhysics, frameTime);
}

////// solution to prevent long press menu on touch devices
///// by user bbsimonbb on stackoverflow:
//// https://stackoverflow.com/questions/3413683/disabling-the-context-menu-on-long-taps-on-android
window.oncontextmenu = function(event) {
    event.preventDefault();
    event.stopPropagation();
    return false;
}

////// resize // 
///// Based on https://developer.mozilla.org/en-US/docs/Web/API/Window/resize_event
addEventListener('resize', (event) => {});
onresize = (event) => {};
function reportWindowSize() {
    const jspWindow = document.getElementById('jsp-window');
    jspWindow.width = window.innerWidth;
    jspWindow.height = window.innerHeight;
}
window.onresize = reportWindowSize();
////// resize //

////// fullscreen video - based on w3schools tutorial
///// https://www.w3schools.com/howto/howto_js_fullscreen.asp
function openFullscreen() {
    const jspWindow = document.getElementById('jsp-window');
    if (jspWindow.requestFullscreen) {
        jspWindow.requestFullscreen(); // standard fullscreen
    } else if (jspWindow.requestFullscreen) {
        jspWindow.webkitRequestFullscreen(); // Safari
    } else if (jspWindow.requestFullscreen) {
        jspWindow.msRequestFullscreen(); // Internet Explorer
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

////// Start (Left side controller)
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

////// End (Right side controller)
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

// openFullscreen(); // browsers refuse to do this without user gesture (security reasons)
createEventListeners();
gameLoop();