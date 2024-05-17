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


const debugMode = true; // verbose console messages
// global button states. false is released; true is held down.
let btnState = {sLeft: false, sUp: false, eUp: false, eRight: false};
let gameTime = 0; // number of seconds since game start
let gameFrames = 0; // number of physics frames since game start
let gaming; // initialize the timeInterval
const framesPerSecond = 60; // physics frames per second
const frameTimeSeconds = 1 / framesPerSecond; // for kinematic equations
const frameTimeMilliSec = 1000 / framesPerSecond; // milliseconds to delay
const lunarGravityAccel = 1.622; // m/s^2
let massLander = 5000; // kilograms (4280 kg dry, 10334 kg full)
const landerDim = {x: 9.4, y: 7.04}; // width w/ gear deployed, height (meters)

// rcs - two per direction
const rcsTwinNewtons = 2 * 444.8222; // Newtons
let rcsTwinAccel; // rcsTwinNewtons / massLander; // m/s^2

// main engine
const mainEngineNewtons = 16000; // Newtons
const mainEngineMinRamp = 10; // idle percent*100
let mainEngineRamp = mainEngineMinRamp; // start at idle
const mainEngineMaxRamp = 60; // maximum percent*100 allowed
const mainEngineRampRate = 90 * frameTimeSeconds; // percent*100 change per physics frame
let mainEngineAccel; // mainEngineNewtons / massLander;

// initial physics
let linearPosition = {x: 0, y: 0}; // initialize position of lander
linearPosition.x = 200 * ( Math.random() - 0.5 ); // randomize horizontal position a bit
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

    // NOTE: linearAccel is in terms of WHOLE SECONDS. Kinematic equations consider frameTime as the interval.
    linearAccel = {x: 0, y: 0} // reset accel to zero
    
    let btnSnapShot = btnState; // snapshot state of the buttons

    // reconsider acceleration; a = F / m
    rcsTwinAccel = rcsTwinNewtons / massLander; // m/s^2
    mainEngineAccel = mainEngineNewtons / massLander; // m/s^2

    linearAccel.y -= lunarGravityAccel; // apply gravity due to moon

    if (btnSnapShot.sLeft) {
        linearAccel.x -= rcsTwinAccel; // accel leftward // instant on
    }

    if (btnSnapShot.eRight) {
        linearAccel.x += rcsTwinAccel; // accel rightward // instant on
    }

    if (btnSnapShot.sUp || btnSnapShot.eUp) { // at least one demand up
        if (mainEngineRamp <= mainEngineMaxRamp - mainEngineRampRate) {
            mainEngineRamp += mainEngineRampRate; // steadily increase supplied throttle
            // console.log(mainEngineRamp);
        } else if (mainEngineRamp > mainEngineMaxRamp - mainEngineRampRate) {
            mainEngineRamp = mainEngineMaxRamp; // keep below maximum throttle
            // console.log(`mainEngine throttle at top: ${mainEngineRamp}`);
        }
    // next line must be else if
    } else if (!(btnSnapShot.sUp && btnSnapShot.eUp)) { // no up demand
        if (mainEngineRamp >= mainEngineMinRamp + mainEngineRampRate) {
            mainEngineRamp -= mainEngineRampRate; // steadily decrease supplied throttle
            // console.log(mainEngineRamp);
        } else if (mainEngineRamp < mainEngineMinRamp + mainEngineRampRate) {
            mainEngineRamp = mainEngineMinRamp; // keep above minimum throttle
            // console.log(`mainEngine throttle at bottom: ${mainEngineRamp}`);
        }
    }

    ////// TEMPORARY ROCK MODE WHEN FOLLOWING LINE IS DISABLED
    linearAccel.y += mainEngineAccel * ( mainEngineRamp / 100 ); // engine thrust
    ////// END ROCK MODE

    let linearVelNaught = {x: linearVelocity.x, y: linearVelocity.y};
    
    ////// Change in velocity with constant acceleration over the frameTime
    // Kinematic Eq #1: v = v.naught + a * t
    linearVelocity.x = linearVelNaught.x + linearAccel.x * frameTimeSeconds;
    linearVelocity.y = linearVelNaught.y + linearAccel.y * frameTimeSeconds;

    ////// Change in position with constant acceleration over the frameTime
    // Kinematic Eq #3: y.delta = v.naught * t + 1/2 * a * t^2
    linearPosition.x += linearVelNaught.x * frameTimeSeconds + 0.5 * linearAccel.x * frameTimeSeconds ** 2;
    linearPosition.y += linearVelNaught.y * frameTimeSeconds + 0.5 * linearAccel.y * frameTimeSeconds ** 2;

    // advance counters
    gameTime += frameTimeSeconds;
    gameFrames++;

    if (debugMode) {
        // console.log(`Y-Pos: ${Math.floor(linearPosition.y)}\nY-Vel: ${Math.floor(linearVelocity.y)}`); // y pos & vel
        console.log(`sLeft: ${btnSnapShot.sLeft}\nsUp: ${btnSnapShot.sUp}\nmainEngineRamp: ${mainEngineRamp}\neUp: ${btnSnapShot.eUp}\neRight: ${btnSnapShot.eRight}\nY-Pos: ${linearPosition.y} m AGL\nY-Vel_0: ${linearVelNaught.y} m/s\nY-Accel ${linearAccel.y} m/s^2\nY-Vel: ${linearVelocity.y} m/s`);

        // console.log(`Linear position X=${linearPosition.x} Y=${linearPosition.y}`); // position
        // console.log(`Linear velocity X=${linearVelocity.x} Y=${linearVelocity.y}`); // velocity
        // console.log(`Linear acceleration X=${linearAccel.x} Y=${linearAccel.y}`); // acceleration

        console.log(`Game was running for ${gameTime} seconds\n  at frame ${gameFrames}`);

        ////// stop EARLY after x limit
        // const limiter = 61;
        // if (gameFrames >= limiter) {
        //     clearInterval(gaming);
        //     alert(`Stopping after ${limiter} frames`);
        //     return true;
        // }
    }

    ////// test for win and fail conditions
    //// TODO: Use a DOM modified modal instead of alerts
    // 4.47 m/s = 10 mph; 4 m/s = 8.95 mpg; 3 m/s = 6.71 mph; 2 m/s = 4.47 mph; 1 m/s = 2.24 mph;

    if (-3.6576 > linearVelocity.y && linearPosition.y <= 0) {
        clearInterval(gaming);
        alert(`LANDER DESTROYED\n\nYOU DIED\n\nR.I.P.`);
        return false;
    } else if (-1.8288 > linearVelocity.y && linearPosition.y <= 0) {
        clearInterval(gaming);
        alert(`Descent stage was DESTROYED! Ascent stage is DAMAGED !!!\n\nYou knew there could be no rescue.\n\nR.I.P.`);
        return false;
    } else if (-0.9144 > linearVelocity.y && linearPosition.y <= 0) {
        clearInterval(gaming);
        alert(`Descent stage is DAMAGED!\n\nThe Eagle has landed!\n\nIs the ascent stage intact?!`);
        return false;
    } else if (-0.9144 <= linearVelocity.y && linearPosition.y <= 0) {
        clearInterval(gaming);
        alert(`Tranquility base here. The Eagle has LANDED!`);
        return true;
    }
    if (linearPosition.y < 0) {
        clearInterval(gaming)
        alert(`Final position ${linearPosition.y} is below zero!`);
        return false;
    }
    drawFrame(); // update graphics
}

function drawFrame() {
    // TODO: update graphic positions
}

function gameLoop() {
    gaming = setInterval(gamePhysics, frameTimeMilliSec);
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
    btnState.sLeft = true;
}
function sButtonLeftOff(event) {
    event.stopPropagation();
    console.log(`s-L: Thrust left off.`);
    btnState.sLeft = false;
}

// Up
function sButtonUpAct(event) {
    event.stopPropagation();
    console.log(`s-U: Thrust up activated.`);
    btnState.sUp = true;
}
function sButtonUpOff(event) {
    event.stopPropagation();
    console.log(`s-U: Thrust up off.`);
    btnState.sUp = false;
}

////// End (Right side controller)
// Up
function eButtonUpAct(event) {
    event.stopPropagation();
    console.log(`e-U: Thrust up activated.`);
    btnState.eUp = true;
}
function eButtonUpOff(event) {
    event.stopPropagation();
    console.log(`e-U: Thrust up off.`);
    btnState.eUp = false;
}

// Right
function eButtonRightAct(event) {
    event.stopPropagation();
    console.log(`e-R: Thrust right activated.`);
    btnState.eRight = true;
}
function eButtonRightOff(event) {
    event.stopPropagation();
    console.log(`e-R: Thrust right off.`);
    btnState.eRight = false;
}

// openFullscreen(); // browsers refuse to do this without user gesture (security reasons)
createEventListeners();
gameLoop();