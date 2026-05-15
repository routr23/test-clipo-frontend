import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

export default function GoogleAuthButton({ setError }) {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSuccess = async (credentialResponse) => {
    try {
      if (setError) setError('');
      const { data } = await api.post('/auth/google', { token: credentialResponse.credential });
      login(data.user, data.token);
      navigate('/chat');
    } catch (err) {
      if (setError) setError(err.response?.data?.message || 'Google authentication failed. Please try again or check the Client ID.');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => {
          if (setError) setError('Google Login Failed');
        }}
        theme="white"
        shape="rectangular"
        size="large"
        width="100%"
        text="continue_with"
      />
    </div>
  );
}
