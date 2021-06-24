import Head from 'next/head';
import { Form } from '@unform/web';
import Input from '@components/Form/Input';
import { useCallback, useRef, useState } from 'react';
import { FormHandles } from '@unform/core';
import { useToast } from '@hooks/toasts';
import * as Yup from 'yup';
import getValidationErrors from '@util/getValidationErrors';
import Link from 'next/link';
import Button from '@components/Form/Button';
import api from '@services/api';

interface ForgotData {
  email: string;
}

const Index = () => {
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const handleRecover = useCallback(
    async (data: ForgotData) => {
      setSending(true);
      try {
        formRef.current.setErrors({});
        const schema = Yup.object().shape({
          email: Yup.string()
            .required('Email is requried.')
            .email('Invalid email format.'),
        });

        await schema.validate(data, { abortEarly: false });

        const response = await api.post<{ sent: boolean }>(
          '/auth/recover',
          data,
        );

        setSent(response.data.sent);
        setSending(false);
      } catch (err) {
        setSending(false);
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
    [addToast],
  );

  return (
    <div className="flex flex-col max-w-md mx-auto">
      <Head>
        <title>Password Recovery | RSS</title>
      </Head>
      <h1 className="text-xl mb-4 text-gray-300">Password recovery</h1>
      {sent ? (
        <div className="rounded-lg shadow bg-gray-600 py-6 px-8">
          <div className="flex justify-center mb-3 text-green-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 stroke-current"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="mb-4 px-10 text-center">
            An email was sent with instructions to reset your password.
          </p>
        </div>
      ) : (
        <>
          <Form
            className="rounded-lg shadow bg-gray-600 py-6 px-8"
            ref={formRef}
            onSubmit={handleRecover}
          >
            <p className="mb-4 px-10 text-center">
              Enter the email address associated with your account.
            </p>
            <label className="block mb-4 w-full">
              <span className="block text-gray-300 mb-2">Email</span>
              <Input name="email" focused type="email" disabled={sending} />
            </label>
            <Button
              type="submit"
              loading={sending}
              className="bg-blue-400 text-blue-100"
            >
              Continue
            </Button>
          </Form>
          <p className="my-4 text-center">
            <Link href="/login">
              <a className="text-blue-300">Go back to Sign Up</a>
            </Link>
          </p>
        </>
      )}
    </div>
  );
};

export default Index;
