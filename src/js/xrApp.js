import { WebGLRenderer } from 'three/src/renderers/WebGLRenderer';
import { ARButton } from 'three/examples/jsm/webxr/ARButton';
import { createScene } from './scene';

export async function initXrApp() {
    const renderer = new WebGLRenderer({
        antialias: true,
        alpha: true
    });

    // Can't be set at the declaration, needs to be set afterwards
    renderer.xr.enabled = true;

    document.body.appendChild(ARButton.createButton(renderer, { requiredFeatures: ['hit-test'] }));

    createScene(renderer);
}
