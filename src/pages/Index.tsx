
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/');
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-neo-bg">
      <div className="neo-flat p-6 rounded-full animate-pulse">
        <div className="h-12 w-12 border-4 border-neo-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>
  );
};

export default Index;
