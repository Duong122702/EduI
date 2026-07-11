import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '../../store/authStore';
import { loginAndFetchUserApi } from './useAuth';

export const useLogin = () => {
  const loginSuccess = useAuthStore((state) => state.loginSuccess);

  return useMutation({
    mutationFn: loginAndFetchUserApi,
    onSuccess: (data) => {
      // Cập nhật cả accessToken và object User (đã có đủ id, role từ api /me) vào Zustand
      loginSuccess(data.accessToken, data.user.data);
    },
  });
};
