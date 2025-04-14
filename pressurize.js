const average = arr => arr.reduce((a, b) => a + b, 0) / arr.length
const median = arr => {
    const sorted = [...arr].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
}
const mode = arr => {
        const counts = new Map();
        let maxCount = 0;
        let modeValue;
        
        for (const num of arr) {
            const count = (counts.get(num) || 0) + 1;
            counts.set(num, count);
            
            if (count > maxCount) {
                maxCount = count;
                modeValue = num;
            }
        }
        
        return modeValue;
    }

let pressure = 0;
let pressureHistory = [0, 0, 0];
function getPressure() {
    return Number(Math.max(...pressureHistory) + average(pressureHistory))/2;
}
function start(processingInterval = 75) {
    let interval = processingInterval*2;
    let motionList = [];
    let motion = Infinity;
    let range;
    let avgVel, avgRot, avgMot;
    
    window.addEventListener("devicemotion", (event) => {
        avgVel = average([Math.abs(event.acceleration.x), Math.abs(event.acceleration.y), Math.abs(event.acceleration.z)]);
        avgRot = average([Math.abs(event.rotationRate.alpha), Math.abs(event.rotationRate.beta), Math.abs(event.rotationRate.gamma)]);
        avgMot = avgVel*4 + avgRot;
        if (!range) range = (interval/8000)/event.interval;
        if (motionList.length > 1500) {
            motionList.shift();
        } 
        if (avgMot/motion < 10) {
            motionList.push(avgMot.toFixed(3));
            motion = mode(motionList);
        }
    });
    setInterval(() => {
        // pressure = Math.max(...motionList.slice(Math.max(Math.round(motionList.length - range), 0)));
        // Instead of getting the max one, ill get like the top 3 and average them out
        pressure = average(motionList.slice(Math.max(Math.round(motionList.length - range), 0)).sort((a, b) => b - a).slice(0, 3).map((_, i) => Number(_)));

        let trueMotion = [];
        const motMode = mode(motionList);
        for (let motion of motionList) {
            if (motion < motMode*7.5) {
                trueMotion.push(motion);
            }
        }

        // pressure = Math.log(pressure/mode(trueMotion))/Math.log(10);
        pressure = pressure/mode(trueMotion);

        // pressure *= 0.8;

        // discovered this by playing around with test values in desmos, its so much more accurate than the other ones
        pressure = Math.tanh((pressure - 3.5) * 0.45) * 4 + 5;
        // pressure = Math.log10(pressure);

        // normalize pressure to 0-10
        pressure = pressure/10;
        pressure = Math.pow(pressure, 4/5);
        // no need since tanh clamps it for us
        // pressure = Math.min(Math.max(0, pressure-0.1), 1);

        pressureHistory.push(pressure);
        pressureHistory.shift();
    }, processingInterval);
}

function requestAndStart(processingInterval = 75) {
    if (typeof DeviceMotionEvent.requestPermission === 'function') {
        DeviceMotionEvent.requestPermission()
            .then(permissionState => {
                if (permissionState === 'granted') {
                start();
                }
            })
            .catch(console.error);
    } else {
        // Handle regular non-iOS devices
        start();
    }
}


// export {
//     start,
//     requestAndStart,
//     getPressure
// }

module.exports = {
    start,
    requestAndStart,
    getPressure
}