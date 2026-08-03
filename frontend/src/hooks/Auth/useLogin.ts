import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '../../store/authStore';
import { loginAndFetchUserApi } from './useAuth';
import { useNavigate } from 'react-router-dom';
import type { CustomApiError } from '../../types/exception.type';
import type { LoginPayload } from '../../schemas/payload/loginPayload.type';

export const useLogin = () => {
  const loginSuccess = useAuthStore((state) => state.loginSuccess);
  const navigate = useNavigate();

  return useMutation<
    Awaited<ReturnType<typeof loginAndFetchUserApi>>,
    CustomApiError,
    LoginPayload
  >({
    mutationFn: loginAndFetchUserApi,
    onSuccess: (data) => {
      // Cập nhật cả accessToken và object User (đã có đủ id, role từ api /me) vào Zustand
      loginSuccess(data.access_token, data.user.data);
      navigate('/dashboard');
    },
  });
};
