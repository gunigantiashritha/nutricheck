import React from 'react';
import { Link } from 'react-router-dom';
import MobileLayout from '@/components/MobileLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info, Utensils, AlertTriangle, Heart } from 'lucide-react';

const AboutPage = () => {
  return (
    <MobileLayout>
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">About NutriCheck</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our tool helps you make informed decisions about food products based on your health needs.
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Info className="mr-2 h-5 w-5 text-health-blue" />
              Why We Built This Tool
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Reading and interpreting nutrition labels can be challenging, especially for those with 
              specific health conditions. NutriCheck simplifies this process by analyzing nutrition labels
              and providing personalized recommendations based on your health profile.
            </p>
          </CardContent>
        </Card>
        
        <div className="grid gap-6 md:grid-cols-2 mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Utensils className="mr-2 h-5 w-5 text-health-blue" />
                For Dietary Restrictions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                Whether you're managing diabetes, hypertension, thyroid conditions, or food allergies,
                our tool helps identify potentially problematic ingredients in food products.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <AlertTriangle className="mr-2 h-5 w-5 text-health-blue" />
                Identifies Health Concerns
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                We analyze ingredients and nutritional content to flag potential issues, explaining
                how specific ingredients might affect your health condition.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Heart className="mr-2 h-5 w-5 text-health-blue" />
                Supports Better Choices
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                Make informed decisions about your diet with clear, easy-to-understand recommendations
                tailored to your specific health needs.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Info className="mr-2 h-5 w-5 text-health-blue" />
                Not Medical Advice
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                While NutriCheck provides helpful guidance, it's not a substitute for professional
                medical advice. Always consult with your healthcare provider for personalized recommendations.
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="flex justify-center mt-8">
          <Button asChild size="lg">
            <Link to="/upload">Try It Now</Link>
          </Button>
        </div>
      </div>
    </MobileLayout>
  );
};

export default AboutPage;
