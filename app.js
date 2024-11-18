class TextRecognizer {
    constructor() {
        // Initialize DOM elements
        this.video = document.getElementById("video");
        this.canvas = document.getElementById("canvas");
        this.ctx = this.canvas.getContext("2d", { willReadFrequently: true });
        this.result = document.getElementById("result");
        this.startBtn = document.getElementById("startBtn");
        this.stopBtn = document.getElementById("stopBtn");

        // Add after other DOM elements
        this.detectionBox = document.querySelector(".detection-box");

        // Add these properties
        this.boxWidth = 200;
        this.boxHeight = 100;

        // State management
        this.isProcessing = false;
        this.animationFrameId = null;

        // Bind methods
        this.startRecognition = this.startRecognition.bind(this);
        this.stopRecognition = this.stopRecognition.bind(this);
        this.processFrame = this.processFrame.bind(this);

        // Initialize Tesseract worker
        this.worker = null;
        this.initializeWorker();

        // Event listeners
        this.startBtn.addEventListener("click", this.startRecognition);
        this.stopBtn.addEventListener("click", this.stopRecognition);
    }

    async initializeWorker() {
        try {
            // Initialize Tesseract worker with English and German languages
            this.worker = await Tesseract.createWorker();
            await this.worker.load();
            await this.worker.loadLanguage("eng+deu"); // Load both English and German
            await this.worker.initialize("eng+deu"); // Initialize with both languages
            this.startBtn.disabled = false;
        } catch (error) {
            console.error("Failed to initialize Tesseract worker:", error);
            this.result.textContent = "Error: Failed to initialize text recognition";
        }
    }

    async startRecognition() {
        if (this.isProcessing) return;

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "environment" }
            });

            this.video.srcObject = stream;
            await this.video.play();

            // Update canvas dimensions to match the detection box size
            this.canvas.width = this.boxWidth;
            this.canvas.height = this.boxHeight;

            this.isProcessing = true;
            this.processFrame();

            this.startBtn.disabled = true;
            this.stopBtn.disabled = false;
        } catch (error) {
            console.error("Error accessing camera:", error);
            this.result.textContent = "Error: Could not access camera";
        }
    }

    stopRecognition() {
        this.isProcessing = false;
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }

        // Stop video stream
        if (this.video.srcObject) {
            const tracks = this.video.srcObject.getTracks();
            tracks.forEach((track) => track.stop());
            this.video.srcObject = null;
        }

        this.startBtn.disabled = false;
        this.stopBtn.disabled = true;
        this.result.textContent = "";
    }

    async processFrame() {
        if (!this.isProcessing) return;

        if (this.video.readyState === this.video.HAVE_ENOUGH_DATA) {
            // Calculate the position of the detection box relative to the video
            const videoRect = this.video.getBoundingClientRect();
            const boxRect = this.detectionBox.getBoundingClientRect();

            // Calculate scaling factors
            const scaleX = this.video.videoWidth / videoRect.width;
            const scaleY = this.video.videoHeight / videoRect.height;

            // Calculate the box position in video coordinates
            const x = (boxRect.left - videoRect.left) * scaleX;
            const y = (boxRect.top - videoRect.top) * scaleY;
            const width = boxRect.width * scaleX;
            const height = boxRect.height * scaleY;

            // Clear the canvas and draw only the region of interest
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.drawImage(
                this.video,
                x,
                y,
                width,
                height, // Source coordinates
                0,
                0,
                width,
                height // Destination coordinates
            );

            // Throttle recognition to every 500ms
            if (!this.lastRecognizedTime || Date.now() - this.lastRecognizedTime > 500) {
                this.lastRecognizedTime = Date.now(); // Update last recognized time

                try {
                    // Recognize text only from the detection box area
                    const {
                        data: { text }
                    } = await this.worker.recognize(this.canvas);

                    // Clean and validate the result
                    const cleanText = text.trim();

                    // Filter out single letters and random characters
                    if (cleanText.length > 1 && /^[A-Za-z0-9\s.,!?]+$/.test(cleanText)) {
                        this.result.textContent = cleanText;
                    }
                } catch (error) {
                    console.error("Text recognition error:", error);
                }
            }
        }

        // Schedule next frame
        this.animationFrameId = requestAnimationFrame(this.processFrame);
    }

    async cleanup() {
        this.stopRecognition();
        if (this.worker) {
            await this.worker.terminate();
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
    const recognizer = new TextRecognizer();

    // Cleanup on page unload
    window.addEventListener("beforeunload", () => recognizer.cleanup());
});
