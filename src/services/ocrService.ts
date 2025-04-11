
import { createWorker } from 'tesseract.js';

export async function extractTextFromImage(imageFile: File): Promise<string> {
  try {
    console.log('Starting OCR process with file:', imageFile.name, imageFile.type, imageFile.size);
    
    // Create a worker with English language data
    const worker = await createWorker('eng');
    console.log('OCR worker created successfully');
    
    // Recognize text in the image
    const result = await worker.recognize(imageFile);
    console.log('OCR completed, confidence:', result.data.confidence);
    
    // Clean up
    await worker.terminate();
    
    // Return the extracted text
    return result.data.text;
  } catch (error) {
    console.error('OCR Error:', error);
    throw new Error('Failed to extract text from image');
  }
}
