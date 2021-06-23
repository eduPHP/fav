import Head from 'next/head';
import { Form } from '@unform/web';
import Input from '../../components/Form/Input';
import { useCallback, useRef } from 'react';
import { FormHandles } from '@unform/core';
import { useToast } from '../../hooks/toasts';
import * as Yup from 'yup';
import getValidationErrors from '../../util/getValidationErrors';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { AuthState, useAuth } from '../../hooks/auth';
import Button from '../../components/Form/Button';
import api from '../../services/api';

interface RecoverData {
  email: string;
  password: string;
}

const Reset_token = () => {
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const { setToken } = useAuth();
  const router = useRouter();

  const handleReset = useCallback(
    async (data: RecoverData) => {
      try {
        formRef.current.setErrors({});
        const schema = Yup.object().shape({
          password: Yup.string()
            .min(6, 'Minimum 6 characters.')
            .required('Password id requried.'),
        });

        await schema.validate(data, { abortEarly: false });

        const response = await api.put<AuthState>('/auth/recover', {
          password: data.password,
          token: router.query.reset_token,
        });

        setToken(response.data);

        addToast({
          title: 'Password set successfully',
          type: 'success',
          description: `Welcome ${response.data.user.name}!`,
        });

        await router.push('/');
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          formRef.current.setErrors(getValidationErrors(err));
        } else if (err.response?.data?.errors) {
          formRef.current.setErrors(err.response.data.errors);
        } else {
          addToast({
            title: 'Recover failed.',
            type: 'error',
            description: err.response?.data.message || null,
          });
          console.error(err);
        }
      }
    },
    [addToast, router.query.reset_token],
  );

  return (
    <div className="flex flex-col max-w-md mx-auto">
      <Head>
        <title>Password Recovery | RSS</title>
      </Head>
      <h1 className="text-xl mb-4 text-gray-300">Passwrod reset</h1>
      <Form
        className="rounded-lg shadow bg-gray-600 py-6 px-8"
        ref={formRef}
        onSubmit={handleReset}
      >
        <p className="mb-4 px-10 text-center">Enter your new password.</p>
        <label className="block mb-4 w-full">
          <span className="block text-gray-300 mb-2">Password</span>
          <Input name="password" type="password" />
        </label>
        <Button type="submit" className="bg-blue-400 text-blue-100">
          Save new password
        </Button>
      </Form>
      <p className="my-4 text-center">
        <Link href="/login">
          <a className="text-blue-300">Go back to Sign Up</a>
        </Link>
      </p>
    </div>
  );
};

export default Reset_token;
