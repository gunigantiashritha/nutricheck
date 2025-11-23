import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-health-blue/10 to-health-teal/10">
      <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md w-full">
        <AlertTriangle className="h-16 w-16 text-caution mx-auto mb-4" />
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-6">Sorry, the page you're looking for wasn't found</p>
        <Link to="/">
          <Button className="bg-health-blue hover:bg-health-blue/90">
            Return to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
