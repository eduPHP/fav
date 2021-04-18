import Head from 'next/head';
import { Form } from '@unform/web';
import Input from '../components/Form/Input';
import Toggle from '../components/Form/Toggle';
import { useCallback, useRef } from 'react';
import { FormHandles } from '@unform/core';
import { useToast } from '../hooks/toasts';
import * as Yup from 'yup';
import api from '../services/api';
import getValidationErrors from '../util/getValidationErrors';
import { useRouter } from 'next/router';
import { useAuth } from '../hooks/auth';

interface LoginData {
  email: string
  password: string
}

interface UserData {
  user: {
    name: string
  }
}

export default function Login() {
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const router = useRouter();
  const { signIn } = useAuth();

  const handleLogin = useCallback(async (data: LoginData) => {
    try {
      formRef.current.setErrors({});
      const schema = Yup.object().shape({
        email: Yup.string().required('Email Obrigatório').email('Formato Inválido'),
        password: Yup.string().min(6, 'Mínimo 6 caracteres').required('URL obrigatória'),
      });

      await schema.validate(data, { abortEarly: false });

      const response = await signIn(data);

      addToast({
        title: 'Success',
        type: 'success',
        description: `Welcome ${response.user.name}!`
      })

      await router.push('/')
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        formRef.current.setErrors(getValidationErrors(err));
      } else {
        addToast({
          title: 'Login falhou.',
          type: 'error',
          description: err.response?.data.message || null,
        });
      }
    }
  }, [addToast]);

  return (
    <div className="flex flex-col max-w-md mx-auto">
      <Head>
        <title>Create Feed Entry | RSS</title>
      </Head>
      <h1 className="text-2xl mb-4 text-gray-300 font-bold">Login</h1>
      <Form className="rounded-lg shadow bg-gray-600 py-6 px-8" ref={formRef} onSubmit={handleLogin} initialData={{active: true}}>
        <label className="block mb-2 w-full">
          <span className="block text-gray-300 mb-2">Email</span>
          <Input name="email" focused className="bg-gray-100 rounded px-4 py-4 w-full bg-gray-300 focus:outline-none focus:ring-4 focus:ring-indigo-500" type="email"/>
        </label>
        <label className="block mb-8 w-full">
          <span className="block text-gray-300 mb-2">Password</span>
          <Input name="password" className="bg-gray-100 rounded px-4 py-4 w-full bg-gray-300 focus:outline-none focus:ring-4 focus:ring-indigo-500" type="password"/>
        </label>
        <button type="submit" className="rounded bg-blue-400 px-6 py-4 text-blue-900 w-full">Login</button>
      </Form>
    </div>
  )
}
