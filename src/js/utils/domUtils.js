/**
 * Checks if the browser has AR compatibility.
 *
 * This function checks if the browser supports WebXR and if it supports immersive AR sessions.
 *
 * @returns {Promise<boolean>} A promise that resolves to a boolean indicating whether the browser supports immersive AR.
 */
export async function hasBrowserArCompatibility() {
    if (window.navigator.xr) {
        return await navigator.xr.isSessionSupported('immersive-ar');
    }
    return false;
}

/**
 * Displays a message indicating that the user's browser does not support augmented reality with WebXR.
 * The message is appended to an element with the ID 'app-root'.
 * The message consists of three paragraphs:
 * 1. A sad face emoji with the text "Oh no!"
 * 2. A message indicating the lack of WebXR support.
 * 3. A suggestion to use a recent version of Chrome on Android.
 */
export function displayUnsupportedBrowserMessage() {
    const appRoot = document.getElementById('app-root');
    const bigMessage = document.createElement('p');

    bigMessage.innerText = '😢 Oh no!';
    if (appRoot) {
        appRoot.appendChild(bigMessage);
    }

    const middleMessage = document.createElement('p');
    middleMessage.innerText = 'Your browser does not seem to support augmented reality with WebXR.';

    if (appRoot) {
        appRoot.appendChild(middleMessage);
    }

    const helpMessage = document.createElement('p');

    helpMessage.innerText = 'Try opening the page using a recent version of Chrome on Android.';

    if (appRoot) {
        appRoot.appendChild(helpMessage);
    }
}

/**
 * Displays an introduction message in the app root element.
 *
 * This function creates and appends three elements to the DOM:
 * - A big message welcoming the user.
 * - A middle message instructing the user to press a button to enter the AR experience.
 * - A help message with a note about the best conditions for using the app.
 *
 * The help message is styled with specific font size, weight, padding, and opacity.
 *
 * @returns {Function} A function that removes the appended messages from the app root element.
 */
export function displayIntroductionMessage() {
    const appRoot = document.getElementById('app-root');

    const bigMessage = document.createElement('h1');
    bigMessage.innerText = 'Welcome! 👋';

    const middleMessage = document.createElement('p');
    middleMessage.innerText = 'Press the button below to enter the AR experience.';

    const helpMessage = document.createElement('p');
    helpMessage.innerText = 'Note: The app works best in a well lit environment, with enough space to move around.';

    helpMessage.style.fontSize = '16px';
    helpMessage.style.fontWeight = 'bold';
    helpMessage.style.padding = '64px 64px 0px 64px';
    helpMessage.style.opacity = '0.8';

    if (appRoot) {
        appRoot.appendChild(bigMessage);
        appRoot.appendChild(middleMessage);
        appRoot.appendChild(helpMessage);
    }

    return () => {
        if (appRoot) {
            if (appRoot.contains(middleMessage)) {
                appRoot.removeChild(middleMessage);
            }
            if (appRoot.contains(bigMessage)) {
                appRoot.removeChild(bigMessage);
            }
            if (appRoot.contains(helpMessage)) {
                appRoot.removeChild(helpMessage);
            }
        }
    };
}

export default {
    hasBrowserArCompatibility,
    displayIntroductionMessage,
    displayUnsupportedBrowserMessage
};
