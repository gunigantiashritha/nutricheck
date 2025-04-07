
import React, { useState } from 'react';
import Header from '@/components/Header';
import ImageUploader from '@/components/ImageUploader';
import AnalysisResults from '@/components/AnalysisResults';
import { extractTextFromImage } from '@/services/ocrService';
import { parseNutritionInfo, analyzeForHealthConditions, HealthAnalysis } from '@/services/analysisService';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, FileText, Info } from 'lucide-react';

const Index = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedText, setExtractedText] = useState<string | null>(null);
  const [analysisResults, setAnalysisResults] = useState<HealthAnalysis[]>([]);
  const { toast } = useToast();

  const handleImageCapture = async (imageFile: File) => {
    try {
      setIsProcessing(true);
      setExtractedText(null);
      setAnalysisResults([]);
      
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
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-health-blue/10 to-health-teal/10">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-xl flex items-center">
                <Info className="h-5 w-5 mr-2 text-health-blue" />
                About This Tool
              </CardTitle>
              <CardDescription>
                Upload a photo of a food nutrition label and get instant health recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                Our analysis tool helps you determine if a food product is suitable for people with 
                specific health conditions like diabetes, hypertension, thyroid issues, or food allergies. 
                Just take a clear photo of the nutrition facts panel and ingredients list, and we'll provide 
                personalized guidance based on the nutritional content.
              </p>
            </CardContent>
          </Card>

          <Tabs defaultValue="upload" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="upload" className="flex items-center">
                <Camera className="h-4 w-4 mr-2" />
                Upload Image
              </TabsTrigger>
              <TabsTrigger value="results" className="flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                Analysis Results
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="upload">
              <ImageUploader onImageCapture={handleImageCapture} isProcessing={isProcessing} />
              
              {extractedText && (
                <Card className="mt-6 w-full max-w-md mx-auto">
                  <CardHeader>
                    <CardTitle className="text-lg">Extracted Text</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="max-h-48 overflow-y-auto bg-gray-50 p-3 rounded text-sm">
                      <pre className="whitespace-pre-wrap">{extractedText}</pre>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="results">
              <AnalysisResults 
                results={analysisResults}
                isLoading={isProcessing}
              />
              
              {!isProcessing && analysisResults.length === 0 && (
                <Card className="w-full max-w-md mx-auto">
                  <CardContent className="pt-6 flex flex-col items-center">
                    <FileText className="h-12 w-12 text-gray-300 mb-2" />
                    <p className="text-gray-500">No analysis results yet. Upload an image to get started.</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <footer className="bg-white py-4 border-t">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          <p>Food Savvy Health Guide © 2025 | This tool provides general guidance and is not a replacement for professional medical advice.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
