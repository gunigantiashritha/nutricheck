import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeartPulse } from 'lucide-react';

const SplashPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/home', { replace: true });
    }, 4000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#4A9FE8] via-[#5BB4E5] to-[#6DD5E3]">
      <div className="animate-fade-in">
        <div className="rounded-full bg-[#7DD3D8]/60 backdrop-blur-sm p-12 shadow-2xl">
          <HeartPulse className="h-32 w-32 text-white" strokeWidth={2.5} />
        </div>
        <h1 className="text-5xl font-bold text-white text-center mt-8 tracking-wide">
          NutriCheck
        </h1>
      </div>
    </div>
  );
};

export default SplashPage;
