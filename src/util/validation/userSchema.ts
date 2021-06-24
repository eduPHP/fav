import { object, lazy, string, TypeOf } from 'yup';

const user = object({
  name: string().required('Name is required.'),
  email: string().required('Email is required.').email('Invalid email format.'),
  password: string()
    .min(6, 'Minimum of 6 character.')
    .required('Password is requried.'),
});

export const updateSchema = object({
  name: string().required('Name is required.'),
  email: string().required('Email is required.').email('Invalid email format.'),
  password: lazy(value =>
    value.length
      ? string()
          .min(6, 'Minimum of 6 character.')
          .required('Password is requried.')
      : string(),
  ),
});

export type UserType = TypeOf<typeof user>;

export default user;
