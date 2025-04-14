# Impulse.js

## Overview
Impulse.js is a groundbreaking JavaScript library that enables pressure detection on mobile devices without requiring built-in pressure sensors like 3D Touch. By leveraging the device's accelerometer and gyroscopic sensors, Impulse.js calculates the relative pressure exerted with each touch interaction, providing a new dimension of user input for web applications.

This library is the first of its kind, offering web developers the ability to detect pressure sensitivity on any modern mobile device (and even some laptops :D) equipped with motion sensors. Impulse.js opens up new possibilities for creating more intuitive and responsive user interfaces in web applications.

## How It Works
Impulse.js works by:
1. Capturing motion and rotation data from the device's sensors
2. Processing this data to calculate relative pressure based on device movement during touch events
3. Normalizing the values to provide a consistent pressure reading between 0 and 1

The library uses sophisticated algorithms to filter and process the sensor data, including averaging, median, and mode calculations to ensure accurate and stable pressure readings.

## Use Cases
- Interactive games with pressure-sensitive controls
- Drawing applications with variable line thickness
- Music applications with velocity-sensitive virtual instruments
- Enhanced UI elements that respond to the intensity of touch
- Accessibility features that adapt to user input force

## Installation
```bash
npm install impulse-js
```

## Basic Usage
```javascript
import { start, getPressure } from 'impulse-js';

// Initialize the pressure detection
start();

// Get the current pressure value (0-1)
function update() {
  const currentPressure = getPressure();
  console.log(`Current pressure: ${currentPressure}`);
  
  // Use the pressure value in your application
  element.style.transform = `scale(${1 + currentPressure})`;
  
  requestAnimationFrame(update);
}

update();
```

## Documentation

### Functions

#### `start(processingInterval = 75)`
Initializes the pressure detection system and begins monitoring device motion.

**Parameters:**
- `processingInterval` (optional): Defines how frequently (in milliseconds) the pressure value is updated. The default value of 75ms is generally suitable for most applications. 

**Note:** When adjusting this parameter, try to optimize for accuracy by keeping the interval large enough to gather sufficient data, while maintaining a short enough interval to capture varying pressure values between user interactions. Higher values may provide more stable readings but less responsiveness, while lower values offer more immediate feedback but potentially less accuracy.

#### `getPressure()`
Returns the current calculated pressure value.

**Returns:**
- A normalized pressure value between 0 and 1, where 0 represents minimal pressure and 1 represents maximum detected pressure.

## Browser Compatibility
Impulse.js requires devices with accelerometer and gyroscopic sensors. It works on most modern smartphones and tablets with these capabilities.

## Permissions
Your web application must request permission to access device motion and orientation events. This typically requires a user interaction (like a button click) before the following code:


## Implementation and usage of `requestAndStart`

The `requestAndStart` function is the recommended way to initialize Impulse.js because it handles the permission requirements for iOS devices while also starting the pressure detection system. Here's how it works and why it's important:


### Using Impulse.js with Permission Handling

#### `requestAndStart(processingInterval = 75)`
This is the recommended function to initialize Impulse.js, as it handles device motion permissions properly.

**Parameters:**
- `processingInterval` (optional): Defines how frequently (in milliseconds) the pressure value is updated. Default is 75ms.

**Why use this function:**
iOS devices require explicit user permission before accessing device motion and orientation data. This function properly requests this permission and only starts the pressure detection if permission is granted.

**Example usage:**
```javascript
import { requestAndStart, getPressure } from 'impulse-js';

// Create a button for user interaction
const button = document.getElementById('start-button');

button.addEventListener('click', () => {
  // Call requestAndStart when user interacts with the page
  requestAndStart();
  
  // Now you can start using the pressure values
  updateUI();
});

function updateUI() {
  const pressure = getPressure();
  // Use pressure value in your application
  requestAnimationFrame(updateUI);
}
```

### Why Button Interaction is Required

Apple's iOS requires that DeviceMotionEvent permissions must be requested in response to a user gesture (like a button click). This is a security and privacy measure implemented by Apple to ensure users are aware when websites are accessing motion sensor data.

If you try to request these permissions without a user gesture:
1. The permission request will be rejected
2. Your application won't be able to access motion data
3. Impulse.js won't function properly

This is why the demo page includes a button with the text "Request shig" that calls `DeviceMotionEvent.requestPermission()` - it's demonstrating this required user interaction.

### Implementation Details

The `requestAndStart` function should:
1. Check if the device requires permission (iOS devices)
2. Request permission if needed
3. Start the pressure detection with the specified interval if permission is granted
4. Directly start the detection on non-iOS devices that don't require explicit permission

This approach ensures maximum compatibility across different devices and platforms while respecting user privacy.




```javascript
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
```

## Examples
Check out the examples directory for sample implementations showing how to use Impulse.js in various scenarios.

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

---

Made with ❤️ by MaxDevv
