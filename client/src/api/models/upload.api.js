import api from '../axios';

export const uploadApi = {
  uploadFile: async (file, folder = 'class-connect/uploads', options = {}) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    const response = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      signal: options.signal,
    });
    return response.data;
  },
};
