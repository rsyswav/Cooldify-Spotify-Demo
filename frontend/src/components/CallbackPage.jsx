import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import spotifyApi from '../services/spotifyApi';
import { Loader2 } from 'lucide-react';

const CallbackPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code');
      const errorParam = searchParams.get('error');

      if (errorParam) {
        setError('Authentication failed. Please try again.');
        setTimeout(() => navigate('/'), 3000);
        return;
      }

      if (code) {
        try {
          await spotifyApi.exchangeCode(code);
          navigate('/');
        } catch (err) {
          console.error('Error during callback:', err);
          setError('Failed to authenticate. Please try again.');
          setTimeout(() => navigate('/'), 3000);
        }
      } else {
        setError('No authorization code received.');
        setTimeout(() => navigate('/'), 3000);
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        {error ? (
          <>
            <p className="text-red-400 text-lg mb-4">{error}</p>
            <p className="text-gray-400">Redirecting to home...</p>
          </>
        ) : (
          <>
            <Loader2 className="h-12 w-12 text-cyan-400 animate-spin mx-auto mb-4" />
            <p className="text-white text-lg mb-2">Authenticating with Spotify...</p>
            <p className="text-gray-400">Please wait</p>
          </>
        )}
      </div>
    </div>
  );
};

export default CallbackPage;
