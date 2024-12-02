import { WebGLRenderer } from 'three/src/renderers/WebGLRenderer';
import { ARButton } from 'three/examples/jsm/webxr/ARButton';
import { createScene } from './scene';
// import { hasBrowserArCompatibility } from './utils/domUtils';

export async function initXrApp() {
    // if (!(await hasBrowserArCompatibility())) {
    //     return;
    // }

    // const { devicePixelRatio, innerHeight, innerWidth } = window;

    const renderer = new WebGLRenderer({
        canvas: document.getElementById('arapp'),
        antialias: true,
        alpha: true,
        xr: {
            enabled: true
        }
    });

    // renderer.setSize(innerWidth, innerHeight);
    // renderer.setPixelRatio(devicePixelRatio);

    document.body.appendChild(ARButton.createButton(renderer, { requiredFeatures: ['hit-test'] }));

    createScene(renderer);
}
