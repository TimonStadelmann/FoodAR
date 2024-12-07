import { createPlaneMarker } from './PlaneMarker';
import { handleXRHitTest } from './utils/hitTest';
import { getImageLink } from './utils/googleapi';
import { AmbientLight, PerspectiveCamera, Scene, TextureLoader, PlaneGeometry, MeshBasicMaterial, Mesh, Group } from 'three';

/**
 * Creates and sets up the 3D scene with XR capabilities
 * @param {WebGLRenderer} renderer - The WebGL renderer instance
 */
export function createScene(renderer) {
	const scene = new Scene();

	// Create a group to hold the camera and content
	const cameraGroup = new Group();
	const camera = new PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.02, 20);
	cameraGroup.add(camera);
	scene.add(cameraGroup);

	const ambientLight = new AmbientLight(0xffffff, 1.0);
	scene.add(ambientLight);

	const textureLoader = new TextureLoader();

	const planeMarker = createPlaneMarker();
	scene.add(planeMarker);

	const controller = renderer.xr.getController(0);
	scene.add(controller);

	controller.addEventListener('select', onSelect);

	/**
	 * Creates a new image plane with a fresh texture from unsplash.it
	 */
	async function createImagePlane(imageLink) {
		const texture = await textureLoader.loadAsync(imageLink);

		// Calculate aspect ratio of the loaded image
		const imageAspect = texture.image.width / texture.image.height;

		// Keep the plane's overall size constant (0.2), but adjust width/height based on aspect ratio
		let planeWidth = 0.2;
		let planeHeight = 0.2;

		if (imageAspect > 1) {
			// Wide image
			planeHeight = planeWidth / imageAspect;
		} else {
			// Tall image
			planeWidth = planeHeight * imageAspect;
		}

		const geometry = new PlaneGeometry(planeWidth, planeHeight).rotateX(-Math.PI / 2);

		const material = new MeshBasicMaterial({
			map: texture,
			transparent: true
		});

		// Set texture's mapping to maintain aspect ratio
		texture.center.set(0.5, 0.5); // Center the texture
		texture.repeat.set(1, 1); // Don't repeat the texture

		const mesh = new Mesh(geometry, material);
		return mesh;
	}

	/**
	 * Handles the select event when tapping the screen in XR mode
	 */
	async function onSelect() {
		if (planeMarker.visible) {
			// @Lukas replace Murg Tikka with your text
			const imageLink = await getImageLink('Murg Tikka');
			const imagePlane = await createImagePlane(imageLink);

			imagePlane.position.setFromMatrixPosition(planeMarker.matrix);
			imagePlane.quaternion.setFromRotationMatrix(planeMarker.matrix);

			scene.add(imagePlane);
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
