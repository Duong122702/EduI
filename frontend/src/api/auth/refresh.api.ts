import axios from 'axios';

export const refreshTokenApi = async () => {
  return await axios.post(
    'https://api.your-exam-domain.com/auth/refresh',
    {},
    {
      withCredentials: true,
    }
  );
};
