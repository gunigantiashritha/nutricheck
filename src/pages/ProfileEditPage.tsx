import React from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/PageLayout';
import ProfileSetup from '@/components/ProfileSetup';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const ProfileEditPage = () => {
  const navigate = useNavigate();

  return (
    <PageLayout>
      <div className="flex flex-col items-center w-full space-y-6">
        <div className="w-full max-w-md flex items-center">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/profile')} 
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Profile
          </Button>
        </div>

        <div className="text-center mb-2">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Edit Your Profile</h1>
          <p className="text-gray-600 text-sm md:text-base">
            Update your health information for better recommendations
          </p>
        </div>
        
        <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-5 duration-300">
          <ProfileSetup />
        </div>
      </div>
    </PageLayout>
  );
};

export default ProfileEditPage;
