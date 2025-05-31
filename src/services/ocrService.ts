

import { createWorker, Worker } from 'tesseract.js';

/**
 * Represents the result of an OCR operation
 */
interface OCRResult {
  text: string;
  confidence: number;
}

/**
 * Extracts text from an image using Tesseract OCR
 * 
 * @param imageFile - The image file to process
 * @returns A promise that resolves to the extracted text
 * @throws Error if OCR processing fails
 */
export async function extractTextFromImage(imageFile: File): Promise<string> {
  let worker: Worker | null = null;
  
  try {
    console.log(`Starting OCR process: ${imageFile.name} (${imageFile.type}, ${imageFile.size} bytes)`);
    
    // Create a worker with English language data
    worker = await createWorker('eng');
    console.log('OCR worker initialized successfully');
    
    // Recognize text in the image
    const result = await worker.recognize(imageFile);
    const ocrResult: OCRResult = {
      text: result.data.text,
      confidence: result.data.confidence
    };
    
    console.log(`OCR completed with ${ocrResult.confidence.toFixed(2)}% confidence`);
    
    // Return the extracted text
    return ocrResult.text;
  } catch (error: unknown) {
    // Improved error handling with type narrowing
    const errorMessage = error instanceof Error 
      ? `OCR Error: ${error.message}` 
      : 'Unknown OCR error occurred';
    
    console.error(errorMessage, error);
    throw new Error('Failed to extract text from image: ' + errorMessage);
  } finally {
    // Clean up resources regardless of success/failure
    if (worker) {
      try {
        await worker.terminate();
        console.log('OCR worker terminated successfully');
      } catch (terminateError) {
        console.warn('Failed to terminate OCR worker:', terminateError);
      }
    }
  }
}
