import { createWorker, Worker, PSM } from 'tesseract.js';

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
    
    // Create a worker with English language data and better OCR settings
    worker = await createWorker('eng', 1, {
      logger: m => console.log('OCR Progress:', m)
    });
    
    // Configure OCR for better text recognition on nutrition labels
    await worker.setParameters({
      tessedit_char_whitelist: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz .,():%/-',
      tessedit_pageseg_mode: PSM.SINGLE_UNIFORM_BLOCK, // Use PSM enum instead of string
      preserve_interword_spaces: '1'
    });
    
    console.log('OCR worker initialized successfully');
    
    // Create an image element to preprocess if needed
    const imageUrl = URL.createObjectURL(imageFile);
    const img = new Image();
    
    const processImage = new Promise<string>((resolve, reject) => {
      img.onload = async () => {
        try {
          // Create a canvas to potentially enhance the image
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          if (!ctx) {
            throw new Error('Could not get canvas context');
          }
          
          canvas.width = img.width;
          canvas.height = img.height;
          
          // Draw and potentially enhance the image
          ctx.drawImage(img, 0, 0);
          
          // Convert canvas to blob for OCR
          canvas.toBlob(async (blob) => {
            if (!blob) {
              reject(new Error('Failed to create blob from canvas'));
              return;
            }
            
            try {
              // Recognize text in the processed image
              const result = await worker!.recognize(blob);
              const ocrResult: OCRResult = {
                text: result.data.text,
                confidence: result.data.confidence
              };
              
              console.log(`OCR completed with ${ocrResult.confidence.toFixed(2)}% confidence`);
              console.log("Raw OCR text:", ocrResult.text);
              
              // Clean up the URL
              URL.revokeObjectURL(imageUrl);
              
              resolve(ocrResult.text);
            } catch (ocrError) {
              reject(ocrError);
            }
          }, 'image/jpeg', 0.95);
        } catch (error) {
          reject(error);
        }
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };
    });
    
    img.src = imageUrl;
    const extractedText = await processImage;
    
    // Return the extracted text
    return extractedText;
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
