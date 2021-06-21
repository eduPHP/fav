import Head from 'next/head';
import { Form } from '@unform/web';
import Input from '../components/Form/Input';
import { useCallback, useRef } from 'react';
import { FormHandles } from '@unform/core';
import { useToast } from '../hooks/toasts';
import * as Yup from 'yup';
import getValidationErrors from '../util/getValidationErrors';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '../hooks/auth';
import Button from '../components/Form/Button';

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

interface UserData {
  user: {
    name: string;
  };
}

const Register = () => {
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const router = useRouter();
  const { signUp } = useAuth();

  const handleRegister = useCallback(
    async (data: RegisterData) => {
      try {
        formRef.current.setErrors({});
        const schema = Yup.object().shape({
          name: Yup.string().required('Name is required.'),
          email: Yup.string()
            .required('Email is required.')
            .email('Invalid email format.'),
          password: Yup.string()
            .min(6, 'Minimum of 6 character')
            .required('Password is requried.'),
        });

        await schema.validate(data, { abortEarly: false });

        const response = await signUp(data);

        addToast({
          title: 'Success',
          type: 'success',
          description: `Welcome ${response.user.name}!`,
        });

        await router.push('/');
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          formRef.current.setErrors(getValidationErrors(err));
        } else if (err.response?.data?.errors) {
          formRef.current.setErrors(err.response.data.errors);
        } else {
          addToast({
            title: 'Registration failed.',
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
      <h1 className="text-2xl mb-4 text-gray-300 font-bold">Registration</h1>
      <Form
        className="rounded-lg shadow bg-gray-600 py-6 px-8"
        ref={formRef}
        onSubmit={handleRegister}
        initialData={{ active: true }}
      >
        <label className="block mb-2 w-full">
          <span className="block text-gray-300 mb-2">Name</span>
          <Input name="name" focused />
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
          Register
        </Button>
        <div className="text-center mt-4">
          <Link href="/login">
            <a className="text-blue-300">Back to login</a>
          </Link>
        </div>
      </Form>
    </div>
  );
};

export default Register;
