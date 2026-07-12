import axios from 'axios';

export const refreshTokenApi = async (refreshToken: string) => {
  return await axios.post('https://api.your-exam-domain.com/auth/refresh', {
    refreshToken,
  });
};
