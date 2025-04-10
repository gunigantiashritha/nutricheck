
import React, { useState } from 'react';
import PageLayout from '@/components/PageLayout';
import ProfileSetup from '@/components/ProfileSetup';
import Achievements from '@/components/Achievements';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from '@/services/UserContext';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { User, Award, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';

const ProfilePage = () => {
  const { healthProfile, resetProfile } = useUser();
  const { toast } = useToast();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  const handleResetProfile = () => {
    resetProfile();
    toast({
      title: "Profile Reset",
      description: "Your health profile and achievements have been reset.",
    });
  };

  const hasAnyCondition = Object.values(healthProfile.hasCondition).some(value => 
    Array.isArray(value) ? value.length > 0 : value
  );

  return (
    <PageLayout>
      <div className="flex flex-col items-center w-full space-y-6">
        <div className="text-center mb-2">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Your Profile</h1>
          <p className="text-gray-600 text-sm md:text-base">
            Personalize your experience for better health recommendations
          </p>
        </div>
        
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-xl flex items-center">
              <User className="h-5 w-5 mr-2 text-health-blue" />
              Health Information
            </CardTitle>
            <CardDescription>
              {hasAnyCondition 
                ? "Your health profile helps us tailor recommendations" 
                : "You haven't added any health conditions yet"}
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <ul className="space-y-2">
              <li className="flex items-center text-sm">
                <span className="font-medium min-w-[120px]">Diabetes:</span> 
                <span>{healthProfile.hasCondition.diabetes ? "Yes" : "No"}</span>
              </li>
              <li className="flex items-center text-sm">
                <span className="font-medium min-w-[120px]">Hypertension:</span> 
                <span>{healthProfile.hasCondition.hypertension ? "Yes" : "No"}</span>
              </li>
              <li className="flex items-center text-sm">
                <span className="font-medium min-w-[120px]">Thyroid Issues:</span> 
                <span>{healthProfile.hasCondition.thyroidIssues ? "Yes" : "No"}</span>
              </li>
              <li className="flex items-center text-sm">
                <span className="font-medium min-w-[120px] align-top">Food Allergies:</span> 
                <span>
                  {healthProfile.hasCondition.foodAllergies.length > 0 
                    ? healthProfile.hasCondition.foodAllergies.join(", ") 
                    : "None"}
                </span>
              </li>
            </ul>
          </CardContent>
          <CardFooter className="pt-2">
            <Collapsible 
              open={isProfileOpen} 
              onOpenChange={setIsProfileOpen}
              className="w-full"
            >
              <CollapsibleTrigger asChild>
                <Button variant="outline" className="w-full flex justify-center items-center">
                  {isProfileOpen ? 'Hide Profile Editor' : 'Edit Profile'}
                  {isProfileOpen ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
                </Button>
              </CollapsibleTrigger>
            </Collapsible>
          </CardFooter>
        </Card>
        
        <div className="w-full max-w-md">
          <Achievements />
        </div>
        
        <Collapsible open={isProfileOpen} className="w-full max-w-md">
          <CollapsibleContent>
            <div className="pt-4 w-full">
              <ProfileSetup />
            </div>
          </CollapsibleContent>
        </Collapsible>
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" className="text-gray-500 mt-4">
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset Profile
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will reset your health profile and all your achievements. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleResetProfile}>Reset</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </PageLayout>
  );
};

export default ProfilePage;
