
import { createWorker } from 'tesseract.js';

export async function extractTextFromImage(imageFile: File): Promise<string> {
  try {
    const worker = await createWorker('eng');
    
    const result = await worker.recognize(imageFile);
    await worker.terminate();
    
    return result.data.text;
  } catch (error) {
    console.error('OCR Error:', error);
    throw new Error('Failed to extract text from image');
  }
}
