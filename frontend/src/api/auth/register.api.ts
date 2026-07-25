import axios from 'axios';
import type { RegisterPayload } from '../../schemas/payload/registerPayload.type';
import type { ApiResponse } from '../../schemas/response/apiResponse';
import type { RegisterResponse } from '../../schemas/response/registerResponse';

export const registerApi = async (payload: RegisterPayload) => {
  return await axios.post<ApiResponse<RegisterResponse>>(
    'auth/register',
    payload
  );
};
