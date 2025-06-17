import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/PageLayout';
import AnalysisResults from '@/components/AnalysisResults';
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Upload, Award, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAnalysis } from '@/services/AnalysisContext';
import { useUser } from '@/services/UserContext';
import { useToast } from '@/hooks/use-toast';
const ResultsPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { analysisResults, extractedText, nutritionData } = useAnalysis();
  const { healthProfile } = useUser();
  const { toast } = useToast();
  const navigate = useNavigate();

  const hasResults = analysisResults && analysisResults.length > 0;
  const hasCompletedScans = healthProfile.scanHistory && healthProfile.scanHistory.count > 0;

  // Simulate loading for better UX
  useEffect(() => {
    if (hasResults) {
      // Small delay to show loading state for better UX
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 800);
      return () => clearTimeout(timer);
    } else {
      setIsLoading(false);
    }
  }, [hasResults]);
  
  // Show achievement notifications when user reaches milestones
  useEffect(() => {
    const { achievements, scanHistory } = healthProfile;
    
    if (achievements.firstScan && scanHistory.count === 1) {
      toast({
        title: "Achievement Unlocked! 🎉",
        description: "First Scan: You've scanned your first product!",
        duration: 5000,
      });
    }
    
    if (achievements.threeDayStreak && scanHistory.streak === 3) {
      toast({
        title: "Achievement Unlocked! 🎉",
        description: "Consistent Checker: You've used the app 3 days in a row!",
        duration: 5000,
      });
    }
    
    if (achievements.tenScans && scanHistory.count === 10) {
      toast({
        title: "Achievement Unlocked! 🎉",
        description: "Nutrition Expert: You've scanned 10 different products!",
        duration: 5000,
      });
    }
    
    if (achievements.fiveSafeProducts) {
      toast({
        title: "Achievement Unlocked! 🎉",
        description: "Safe Food Finder: You've found 5 products that are safe for your health!",
        duration: 5000,
      });
    }
  }, [healthProfile, toast]);

  return (
    <PageLayout>
      <div className="flex flex-col items-center w-full">
        <div className="text-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Analysis Results</h1>
          <p className="text-gray-600 text-sm md:text-base">
            Check if this food product is suitable for your health needs
          </p>
        </div>
        
        {hasResults && (
          <div className="bg-gray-50 rounded-lg p-3 mb-4 flex items-center shadow-sm w-full max-w-md">
            <Award className="h-5 w-5 text-health-blue mr-2" />
            <p className="text-sm">
              <span className="font-medium">Scan #{healthProfile.scanHistory.count}</span>
              {healthProfile.scanHistory.streak > 1 && (
                <span className="ml-2">• {healthProfile.scanHistory.streak} day streak!</span>
              )}
            </p>
          </div>
        )}
        
        {isLoading && hasResults ? (
          <div className="flex flex-col items-center justify-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-health-blue mb-4" />
            <p className="text-sm text-gray-600">Analyzing nutrition data...</p>
          </div>
        ) : hasResults ? (
          <div className="w-full max-w-md mx-auto">
            <AnalysisResults 
              results={analysisResults}
              isLoading={false}
              nutritionData={nutritionData}
            />
          </div>
        ) : (
          <div className="text-center space-y-4 w-full px-4">
            <Card className="w-full max-w-md mx-auto">
              <CardContent className="pt-6 flex flex-col items-center">
                <FileText className="h-12 w-12 text-gray-300 mb-2" />
                <p className="text-gray-500">No analysis results yet. Upload an image to get started.</p>
              </CardContent>
            </Card>
            
            <Button 
              onClick={() => navigate('/upload')}
              className="flex items-center mt-6 mx-auto"
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload a Nutrition Label
            </Button>
          </div>
        )}
        
        <div className="mt-8 flex flex-wrap gap-3 justify-center">
          <Button 
            variant="default"
            onClick={() => navigate('/upload')}
          >
            Upload Another Label
          </Button>
          
          <Button 
            variant="outline"
            onClick={() => navigate('/profile')}
          >
            View Achievements
          </Button>
        </div>
      </div>
    </PageLayout>
  );
};

export default ResultsPage;
