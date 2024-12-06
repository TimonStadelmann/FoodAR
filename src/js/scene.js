import { createPlaneMarker } from './PlaneMarker';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { handleXRHitTest } from './utils/hitTest';

import { AmbientLight, PerspectiveCamera, Scene } from 'three';

/**
 * Creates and sets up the 3D scene with XR capabilities
 * @param {WebGLRenderer} renderer - The WebGL renderer instance
 */
export function createScene(renderer) {
    const scene = new Scene();

    const camera = new PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.02, 20);

    const ambientLight = new AmbientLight(0xffffff, 1.0);
    scene.add(ambientLight);

    const gltfLoader = new GLTFLoader();

    let koalaModel;

    gltfLoader.load('/models/koala.glb', (gltf) => {
        koalaModel = gltf.scene.children[0];
    });

    const planeMarker = createPlaneMarker();
    scene.add(planeMarker);

    const controller = renderer.xr.getController(0);
    scene.add(controller);

    controller.addEventListener('select', onSelect);

    /**
     * Handles the select event when tapping the screen in XR mode
     */
    function onSelect() {
        if (planeMarker.visible) {
            const model = koalaModel.clone();
            model.position.setFromMatrixPosition(planeMarker.matrix);
            model.rotation.y = Math.random() * (Math.PI * 2);
            model.visible = true;
            scene.add(model);
        }
    }

    /**
     * Updates the plane marker position when hit test results are available
     * @param {Float32Array} hitPoseTransformed - The transformed hit test pose matrix
     */
    function onHitTestResultReady(hitPoseTransformed) {
        if (hitPoseTransformed) {
            planeMarker.visible = true;
            planeMarker.matrix.fromArray(hitPoseTransformed);
        }
    }

    /**
     * Hides the plane marker when no hit test results are available
     */
    function onHitTestResultEmpty() {
        planeMarker.visible = false;
    }

    /**
     * The main render loop
     * @param {number} timestamp - The current timestamp
     * @param {XRFrame} frame - The current XR frame
     */
    const renderLoop = (timestamp, frame) => {
        if (renderer.xr.isPresenting) {
            if (frame) {
                handleXRHitTest(renderer, frame, onHitTestResultReady, onHitTestResultEmpty);
            }

            renderer.render(scene, camera);
        }
    };

    renderer.setAnimationLoop(renderLoop);
}
