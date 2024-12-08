import express from 'express';
import ollama from 'ollama';
import cors from 'cors';
import multer from 'multer';
import path from 'path';

const app = express();
const port = 3000;

// Setup multer for file uploads
const upload = multer({ dest: 'uploads/' }); // Files will be saved in the 'uploads' folder

app.use(cors()); // Enable CORS
app.use(express.static('public')); // Serve static files
app.use(express.json());

// POST endpoint to handle image upload and extract text
app.get('/health', async (req, res) => {
	try {
		res.json({ text: 'Application is healthy!' });
	} catch (error) {
		console.error('Error:', error);
		res.status(500).json({ error: 'Error, not healthy :(' });
	}
});

// POST endpoint to handle image upload and extract text
app.post('/upload-image', upload.single('image'), async (req, res) => {
	try {
		console.log(req.file);
		const imagePath = path.join(req.file.path); // Get the full path of the uploaded file

		// Use the uploaded image file with Ollama API
		const response = await ollama.chat({
			model: 'llava-phi3',
			messages: [
				{
					role: 'user',
					content: 'Extract only the text from the image exactly as it appears. Do not add any extra words, comments, or formatting. Output strictly the extracted text, nothing else.',
					images: [imagePath] // Pass the full path of the uploaded image
				}
			]
		});

		console.log('Response', response.message.content);
		res.json({ text: response.message.content }); // Send the extracted text
	} catch (error) {
		console.error('Error:', error);
		res.status(500).json({ error: 'Error processing the image' });
	}
});

// Start server
app.listen(port, () => {
	console.log(`Server running at http://localhost:${port}`);
});
