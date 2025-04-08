
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/PageLayout';
import ImageUploader from '@/components/ImageUploader';
import { extractTextFromImage } from '@/services/ocrService';
import { parseNutritionInfo, analyzeForHealthConditions } from '@/services/analysisService';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAnalysis } from '@/services/AnalysisContext';

const UploadPage = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { setExtractedText, setAnalysisResults } = useAnalysis();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleImageCapture = async (imageFile: File) => {
    try {
      setIsProcessing(true);
      
      // Extract text from image
      const text = await extractTextFromImage(imageFile);
      setExtractedText(text);
      
      // Parse nutrition information
      const nutritionData = parseNutritionInfo(text);
      
      // Analyze for health conditions
      const results = analyzeForHealthConditions(nutritionData);
      setAnalysisResults(results);
      
      toast({
        title: "Analysis complete",
        description: "We've analyzed the nutrition label for you.",
      });
      
      // Navigate to results page
      navigate('/results');
    } catch (error) {
      console.error('Error processing image:', error);
      toast({
        title: "Error",
        description: "Failed to process the image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <PageLayout>
      <div className="flex flex-col items-center">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold mb-2">Upload a Nutrition Label</h1>
          <p className="text-gray-600">
            Take a clear photo of the nutrition facts and ingredients list
          </p>
        </div>
        
        <div className="w-full max-w-lg">
          <ImageUploader onImageCapture={handleImageCapture} isProcessing={isProcessing} />
          
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <FileText className="mr-2 h-5 w-5 text-health-blue" />
                How to Take a Good Photo
              </CardTitle>
              <CardDescription>
                Follow these tips for better analysis results
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="font-medium mr-2">•</span>
                  Ensure good lighting with minimal glare or shadows
                </li>
                <li className="flex items-start">
                  <span className="font-medium mr-2">•</span>
                  Capture both the nutrition facts panel and ingredients list
                </li>
                <li className="flex items-start">
                  <span className="font-medium mr-2">•</span>
                  Hold the camera steady and make sure text is clearly visible
                </li>
                <li className="flex items-start">
                  <span className="font-medium mr-2">•</span>
                  Avoid covering any part of the label with your fingers
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <div className="flex justify-center mt-6">
            <Button 
              variant="outline"
              onClick={() => navigate('/results')}
              disabled={isProcessing}
              className="flex items-center"
            >
              Skip to Results
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default UploadPage;
