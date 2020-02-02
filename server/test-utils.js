/* eslint-disable import/prefer-default-export */
export const handleAxiosError = e => console.error('ERROR', e.response.data.errors[0].message);
