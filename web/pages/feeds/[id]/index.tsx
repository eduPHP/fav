import { GetServerSideProps, GetStaticPaths, GetStaticProps } from 'next';
import { useCallback, useRef } from 'react';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import api from '../../../services/api';
import { Form } from '@unform/web';
import Input from '../../../components/Form/Input';
import Toggle from '../../../components/Form/Toggle';
import getValidationErrors from '../../../util/getValidationErrors';
import { useToast } from '../../../hooks/toasts';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { authenticated } from '../../../hooks/auth';
import Link from 'next/link';

interface FeedFormData extends Feed {}

const Edit = ({ feed }) => {
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const route = useRouter();

  const handleSave = useCallback(
    async (data: FeedFormData) => {
      try {
        formRef.current.setErrors({});
        const schema = Yup.object().shape({
          name: Yup.string().required('Name is requried.'),
          url: Yup.string()
            .url('Invalid URL format.')
            .required('URL is requried.'),
        });

        await schema.validate(data, { abortEarly: false });

        await api.put(`/feeds/${feed.id}`, data);

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
        <title>Update Feed Provider {feed.name} | RSS</title>
      </Head>
      <div className="flex items-center text-gray-300 text-xl gap-2 mb-4">
        <Link href="/feeds">
          <a className="flex items-center">RSS Providers</a>
        </Link>
        /
        <h1 className="text-gray-300">
          Update Feed <span className="font-bold">{feed.name}</span>
        </h1>
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
          <Toggle name="active" type="checkbox" />
          <span className="ml-2 text-gray-300">Active</span>
        </label>
        <label className="flex items-center mb-4">
          <Toggle name="public" type="checkbox" />
          <span className="ml-2 text-gray-300">Public</span>
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
  authenticated({ req });

  const response = await api.get(`/feeds/${id}`);
  const { feed } = response.data;
  return {
    props: { feed },
  };
};

export default Edit;
