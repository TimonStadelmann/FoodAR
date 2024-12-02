import { WebGLRenderer } from 'three/src/renderers/WebGLRenderer';
import { ARButton } from 'three/examples/jsm/webxr/ARButton';
import { createScene } from './scene';
import { hasBrowserArCompatibility, displayIntroductionMessage, displayUnsupportedBrowserMessage } from './utils/domUtils';

/**
 * Initializes the XR (Extended Reality) application.
 * Sets up the WebGL renderer, enables XR, and appends necessary elements to the document body.
 * Also displays an introduction message and creates the scene.
 *
 * @function
 * @name initializeXRApp
 */
function initializeXRApp() {
    const { devicePixelRatio, innerHeight, innerWidth } = window;

    const renderer = new WebGLRenderer({ antialias: true, alpha: true });

    renderer.setSize(innerWidth, innerHeight);
    renderer.setPixelRatio(devicePixelRatio);

    renderer.xr.enabled = true;

    document.body.appendChild(renderer.domElement);

    document.body.appendChild(ARButton.createButton(renderer, { requiredFeatures: ['hit-test'] }));

    displayIntroductionMessage();

    createScene(renderer);
}

async function start() {
    const isImmersiveArSupported = await hasBrowserArCompatibility();

    isImmersiveArSupported ? initializeXRApp() : displayUnsupportedBrowserMessage();
}

start();
