import { GetServerSideProps } from 'next';
import { useCallback, useRef } from 'react';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import api from '@services/api';
import { Form } from '@unform/web';
import Input from '@components/Form/Input';
import Toggle from '@components/Form/Toggle';
import getValidationErrors from '@util/getValidationErrors';
import { useToast } from '@hooks/toasts';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { authenticated } from '@hooks/auth';
import Link from 'next/link';
import schema, { FeedType } from '@services/validation/feedSchema';

const Edit = ({ feed, user }) => {
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const route = useRouter();

  const handleSave = useCallback(
    async (data: FeedType) => {
      try {
        formRef.current.setErrors({});

        await schema.validate(data, { abortEarly: false });

        await api.put(`/feeds/${feed._id}`, data);

        addToast({
          title: `Feed updated.`,
          type: 'success',
          description: `Feed <span class="font-bold">${data.name}</span> successfully updated.`,
        });

        await route.push('/feeds');
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          formRef.current.setErrors(getValidationErrors(err));
        } else {
          addToast({
            title: 'Feed creation failed.',
            type: 'error',
            description: err.response?.data.message || null,
          });
        }
      }
    },
    [addToast],
  );
  return (
    <div className="flex flex-col">
      <Head>
        <title>Update Provider {feed.name} | RSS</title>
      </Head>
      <div className="text-gray-300 text-xl mb-4 flex">
        <Link href="/feeds">
          <a className="flex items-center inline">RSS Providers</a>
        </Link>
        <span className="mx-2"> / </span>
        <span className="text-gray-300">
          Update <span className="font-bold">{feed.name}</span>
        </span>
      </div>
      <Form
        className="rounded-lg shadow bg-gray-600 py-6 px-8"
        ref={formRef}
        onSubmit={handleSave}
        initialData={feed}
      >
        <label className="block mb-2 w-full">
          <span className="block text-gray-300 mb-2">Name</span>
          <Input name="name" type="text" />
        </label>
        <label className="block mb-4 w-full">
          <span className="block text-gray-300 mb-2">URL</span>
          <Input name="url" type="url" />
        </label>
        <label className="flex items-center mb-4">
          <Toggle name="is_active" type="checkbox" />
          <span className="ml-2 text-gray-300">Active</span>
        </label>
        <label className="flex items-center mb-4">
          <Toggle disabled={!user.is_admin} name="is_public" type="checkbox" />
          <span className="ml-2 text-gray-300">
            Public feed provider&nbsp;
            <small className="text-xs text-gray-400 italic">*admin only*</small>
          </span>
        </label>
        <button
          type="submit"
          className="rounded bg-green-600 px-6 py-4 text-gray-300 w-full"
        >
          Update
        </button>
      </Form>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  query,
  req,
}) => {
  const { id } = query;
  const { user } = authenticated({ req });

  const response = await api.get(`/feeds/${id}`);
  const { feed } = response.data;
  return {
    props: { feed, user },
  };
};

export default Edit;
