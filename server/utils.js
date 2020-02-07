/* eslint-disable import/prefer-default-export */
export const handleAxiosError = e => console.error('ERROR', e.response.data.errors[0].message);

export const logGraphqlErrors = res => {
  if (res.errors && res.errors.length) {
    console.error(res.errors[0].message);
    throw new Error(res.errors[0].message);
  }
  return res;
};

export const getRandom = arr => arr[Math.floor(Math.random() * arr.length)];
