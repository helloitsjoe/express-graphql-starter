/* eslint-disable import/prefer-default-export */
export const handleAxiosError = e => {
  if (e.response.data.errors) {
    const { message, stack } = e.response.data.errors[0];
    console.log(`e.response.data.errors:`, e.response.data.errors);
    console.error('ERROR', message);
    console.error('Stack trace:', stack);
  } else {
    console.error(`e:`, e.message);
  }
};

export const logGraphqlErrors = res => {
  if (res.errors && res.errors.length) {
    const [error] = res.errors;
    const message = `${error.message}: at ${JSON.stringify(error.locations)} path: ${error.path}`;
    console.error(message);
    throw new Error(message);
  }
  return res;
};

export const getRandom = arr => arr[Math.floor(Math.random() * arr.length)];

export const matchName = (obj, name) => obj.name.match(new RegExp(name, 'i'));
export const matchTitle = (obj, title) => obj.title.match(new RegExp(title, 'i'));
