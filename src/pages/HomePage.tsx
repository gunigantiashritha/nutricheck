import React from 'react';
import { Link } from 'react-router-dom';
import PageLayout from '@/components/PageLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { HeartPulse } from 'lucide-react';

const HomePage = () => {
  return (
    <PageLayout>
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
        <div className="mb-8 flex flex-col items-center">
          <div className="rounded-full bg-gradient-to-r from-health-blue to-health-teal p-6 mb-4">
            <HeartPulse className="h-20 w-20 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Welcome to NutriCheck</h1>
          <p className="text-xl text-gray-600 mb-6 max-w-md mx-auto">
            Analyze food labels for health conditions at a glance
          </p>
        </div>
        
        <Card className="w-full max-w-md shadow-lg">
          <CardContent className="p-6">
            <p className="mb-6 text-gray-700">
              Upload a nutrition label photo and get instant health recommendations for diabetes, 
              hypertension, thyroid issues, and food allergies.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild className="flex-1">
                <Link to="/about">Learn More</Link>
              </Button>
              <Button asChild className="flex-1" variant="default">
                <Link to="/upload">Get Started</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default HomePage;
