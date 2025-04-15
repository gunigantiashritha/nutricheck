
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/PageLayout';
import ImageUploader from '@/components/ImageUploader';
import { extractTextFromImage } from '@/services/ocrService';
import { parseNutritionInfo, analyzeForHealthConditions } from '@/services/analysisService';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, ArrowRight, Image, Camera, Sparkles, ScanLine } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAnalysis } from '@/services/AnalysisContext';
import { useUser } from '@/services/UserContext';
import { Badge } from '@/components/ui/badge';

const UploadPage = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { setExtractedText, setAnalysisResults, addToProductHistory } = useAnalysis();
  const { recordScan, healthProfile } = useUser();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleImageCapture = async (imageFile: File) => {
    try {
      setIsProcessing(true);
      
      // Show processing toast
      toast({
        title: "Processing Image",
        description: "Extracting nutrition information...",
      });
      
      // Extract text from image
      const text = await extractTextFromImage(imageFile);
      console.log("Extracted text:", text);
      setExtractedText(text);
      
      if (!text || text.trim().length < 10) {
        toast({
          title: "Text Detection Issue",
          description: "Could not detect enough text from the image. Try adjusting lighting or focus.",
          variant: "destructive",
        });
        setIsProcessing(false);
        return;
      }
      
      // Parse nutrition information
      const nutritionData = parseNutritionInfo(text);
      console.log("Parsed nutrition data:", nutritionData);
      
      if (!nutritionData.ingredients || nutritionData.ingredients.length === 0) {
        toast({
          title: "Ingredients Not Found",
          description: "Could not detect ingredients list. Try capturing a clearer image of the full label.",
          variant: "destructive",
        });
      }
      
      // Analyze for health conditions
      const results = analyzeForHealthConditions(nutritionData);
      setAnalysisResults(results);
      
      // Add to product history
      addToProductHistory(results);
      
      // Check if product is safe (no 'avoid' recommendations)
      const isSafe = !results.some(result => result.recommendation === 'avoid');
      
      // Record scan in user profile to update achievements
      recordScan(isSafe);
      
      toast({
        title: "Analysis complete",
        description: "We've analyzed the nutrition label for health conditions.",
      });
      
      // Navigate to results page
      navigate('/results');
    } catch (error) {
      console.error('Error processing image:', error);
      toast({
        title: "Error",
        description: "Failed to process the image. Please try again with a clearer photo.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const currentStreak = healthProfile.scanHistory.streak || 0;
  const totalScans = healthProfile.scanHistory.count || 0;

  return (
    <PageLayout>
      <div className="flex flex-col items-center w-full">
        <div className="text-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Upload a Nutrition Label</h1>
          <p className="text-gray-600 text-sm md:text-base">
            Take a clear photo of the nutrition facts and ingredients list
          </p>
          
          {totalScans > 0 && (
            <div className="flex items-center justify-center gap-2 mt-2">
              <Badge variant="outline" className="flex gap-1 items-center">
                <Sparkles className="h-3 w-3 text-amber-500" /> 
                {totalScans} scan{totalScans !== 1 ? 's' : ''}
              </Badge>
              
              {currentStreak > 0 && (
                <Badge variant="outline" className="flex gap-1 items-center">
                  <FileText className="h-3 w-3 text-health-blue" />
                  {currentStreak} day streak
                </Badge>
              )}
            </div>
          )}
        </div>
        
        <div className="w-full max-w-lg">
          <ImageUploader onImageCapture={handleImageCapture} isProcessing={isProcessing} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Camera className="mr-2 h-5 w-5 text-health-blue" />
                  Photo Tips
                </CardTitle>
                <CardDescription>
                  For better analysis results
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <span className="font-medium mr-2">•</span>
                    Ensure good lighting with minimal glare
                  </li>
                  <li className="flex items-start">
                    <span className="font-medium mr-2">•</span>
                    Hold the camera steady and close to label
                  </li>
                  <li className="flex items-start">
                    <span className="font-medium mr-2">•</span>
                    Capture both nutrition facts and ingredients list
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <ScanLine className="mr-2 h-5 w-5 text-health-blue" />
                  Health Analysis
                </CardTitle>
                <CardDescription>
                  What we check for
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <span className="font-medium mr-2">•</span>
                    Diabetes concerns (sugars, carbs)
                  </li>
                  <li className="flex items-start">
                    <span className="font-medium mr-2">•</span>
                    Hypertension factors (sodium)
                  </li>
                  <li className="flex items-start">
                    <span className="font-medium mr-2">•</span>
                    Thyroid concerns and allergens
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
          
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
