export const email = (value) => {
  if (value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) return 'Invalid email address';
};

export const phone = (value) => {
  if (!value) return;
  const digits = value.toString().match(/\d/g);
  if (!digits || digits.length !== 10) {
    return 'Invalid phone number';
  }
};

export const required = (value) => {
  if (!value && value !== 0) return 'Required';
};
