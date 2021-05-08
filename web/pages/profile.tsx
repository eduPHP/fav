import { authenticated, useAuth } from '../hooks/auth';
import api from '../services/api';
import Head from 'next/head';
import { Form } from '@unform/web';
import Input from '../components/Form/Input';
import Button from '../components/Form/Button';
import { useCallback, useRef } from 'react';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import getValidationErrors from '../util/getValidationErrors';
import { useToast } from '../hooks/toasts';
import { useRouter } from 'next/router';

interface ProfileData {
  name: string;
  email: string;
  password: string;
}

const Profile = ({ props }) => {
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const router = useRouter();
  const { user, updateUser } = useAuth();

  const handleRegister = useCallback(
    async (data: ProfileData) => {
      try {
        formRef.current.setErrors({});
        const schema = Yup.object().shape({
          name: Yup.string().required('Name is required.'),
          email: Yup.string()
            .required('Email is required.')
            .email('Invalid email format.'),
          password: data.password.length
            ? Yup.string()
                .min(6, 'Minimum of 6 character')
                .required('Password is requried.')
            : Yup.string(),
        });

        await schema.validate(data, { abortEarly: false });

        await api.put('/auth/user', data);
        await updateUser(data, props.token);

        addToast({
          title: 'Success',
          type: 'success',
          description: `Profile wuccessfully updated!`,
        });

        await router.push('/');
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          formRef.current.setErrors(getValidationErrors(err));
        } else {
          addToast({
            title: 'Profile update failed.',
            type: 'error',
            description: err.response?.data.message || null,
          });
          console.error(err);
        }
      }
    },
    [addToast],
  );

  return (
    <div className="flex flex-col max-w-md mx-auto">
      <Head>
        <title>Register | RSS</title>
      </Head>
      <h1 className="text-xl mb-4 text-gray-300">Profile</h1>
      <Form
        className="rounded-lg shadow bg-gray-600 py-6 px-8"
        ref={formRef}
        onSubmit={handleRegister}
        initialData={user}
      >
        <label className="block mb-2 w-full">
          <span className="block text-gray-300 mb-2">Name</span>
          <Input name="name" />
        </label>

        <label className="block mb-2 w-full">
          <span className="block text-gray-300 mb-2">Email</span>
          <Input name="email" type="email" />
        </label>
        <label className="block mb-8 w-full">
          <span className="block text-gray-300 mb-2">Password</span>
          <Input name="password" type="password" />
        </label>
        <Button type="submit" className="bg-blue-400 text-blue-100">
          Save
        </Button>
      </Form>
    </div>
  );
};

Profile.getInitialProps = async ctx => {
  const { token } = authenticated(ctx);

  const response = await api.get('/auth/user');

  const user = response.data;

  return { props: { token, user } };
};

export default Profile;
