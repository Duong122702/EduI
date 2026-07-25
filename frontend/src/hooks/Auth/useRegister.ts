import { useMutation } from '@tanstack/react-query';
import { registerApi } from '../../api/auth/register.api';
import type { CustomApiError } from '../../types/exception.type';
import type { AxiosResponse } from 'axios';
import type { ApiResponse } from '../../schemas/response/apiResponse';
import type { RegisterResponse } from '../../schemas/response/registerResponse';
import type { RegisterPayload } from '../../schemas/payload/registerPayload.type';

export const useRegister = () => {
  return useMutation<
    AxiosResponse<ApiResponse<RegisterResponse>>,
    CustomApiError,
    RegisterPayload
  >({
    mutationFn: (payload: RegisterPayload) => registerApi(payload),
    // Không gọi useAuthStore ở đây vì người dùng chưa được kích hoạt tài khoản
  });
};
