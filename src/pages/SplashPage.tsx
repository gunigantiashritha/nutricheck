import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeartPulse } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const SplashPage = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    const timer = setTimeout(() => {
      if (user) {
        navigate('/home', { replace: true });
      } else {
        navigate('/auth', { replace: true });
      }
    }, 4000);

    return () => clearTimeout(timer);
  }, [navigate, user, loading]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-health-blue to-health-teal">
      <div className="animate-fade-in">
        <div className="rounded-full bg-white/20 backdrop-blur-sm p-8 shadow-2xl">
          <HeartPulse className="h-32 w-32 text-white animate-pulse-slow" />
        </div>
        <h1 className="text-4xl font-bold text-white text-center mt-6 tracking-wide">
          NutriCheck
        </h1>
      </div>
    </div>
  );
};

export default SplashPage;
