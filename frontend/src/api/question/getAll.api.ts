import axiosClient from '../config/axiosClient';

export const getAllQuestions = async (
  page: number = 1,
  page_size: number = 10
) => {
  return await axiosClient.get('/questions/get_all', {
    params: {
      page,
      page_size,
    },
  });
};
