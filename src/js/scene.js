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
			// Capture current camera view as a screenshot
			const canvas = renderer.domElement; // The WebGLRenderer's canvas

			// Create a temporary canvas to hold the screenshot
			const tempCanvas = document.createElement('canvas');
			const context = tempCanvas.getContext('2d');

			// Set the canvas size to match the WebGL canvas
			tempCanvas.width = canvas.width;
			tempCanvas.height = canvas.height;

			// Draw the current frame from the WebGL canvas onto the temporary canvas
			context.drawImage(canvas, 0, 0, tempCanvas.width, tempCanvas.height);

			// Convert the canvas content to a Blob
			tempCanvas.toBlob(
				async (blob) => {
					if (!blob) {
						console.log('error while converting the canvas to a Blob');
						return;
					}

					const formData = new FormData();
					formData.append('image', blob, 'screenshot.png');

					// Send the image Blob to the server
					try {
						// update cloudflare tunnel link!
						const response = await fetch('https://worthy-jokes-partly-myth.trycloudflare.com/upload-image', {
							method: 'POST',
							body: formData
						});

						const data = await response.json();

						if (data.text) {
							const imageLink = await getImageLink(data.text);
							const imagePlane = await createImagePlane(imageLink);

							imagePlane.position.setFromMatrixPosition(planeMarker.matrix);
							imagePlane.quaternion.setFromRotationMatrix(planeMarker.matrix);

							scene.add(imagePlane);
						} else {
							alert('Error: No text extracted.');
						}
					} catch (error) {
						console.error('Error:', error);
						outputElement.textContent = 'Error processing the screenshot.';
					}
				},
				'image/png' // Format for the screenshot
			);
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
