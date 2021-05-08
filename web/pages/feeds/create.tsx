import { useCallback, useRef } from 'react';
import { Form } from '@unform/web';
import Head from 'next/head';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';

import Input from '../../components/Form/Input';
import Toggle from '../../components/Form/Toggle';
import getValidationErrors from '../../util/getValidationErrors';
import { useToast } from '../../hooks/toasts';
import api from '../../services/api';
import { useRouter } from 'next/router';
import Button from '../../components/Form/Button';
import { authenticated } from '../../hooks/auth';

interface FeedFormData extends Feed {}

const CreateFeed = () => {
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const router = useRouter();

  const handleSave = useCallback(
    async (data: FeedFormData) => {
      try {
        formRef.current.setErrors({});
        const schema = Yup.object().shape({
          name: Yup.string().required('Name is required.'),
          url: Yup.string()
            .url('Invalid URL format.')
            .required('URL is required.'),
        });

        await schema.validate(data, { abortEarly: false });

        await api.post('/feeds', data);
        addToast({
          title: 'Success',
          type: 'success',
          description: `Feed ${data.name} created successfully!`,
        });
        await router.push('/feeds');
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          formRef.current.setErrors(getValidationErrors(err));
        } else {
          addToast({
            title: 'Resource creation failed.',
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
        <title>Create Feed Provider | RSS</title>
      </Head>
      <h1 className="text-2xl mb-4 text-gray-300 font-bold">
        Create Feed Provider
      </h1>
      <Form
        className="rounded-lg shadow bg-gray-600 py-6 px-8"
        ref={formRef}
        onSubmit={handleSave}
        initialData={{ active: true }}
      >
        <label className="block mb-2 w-full">
          <span className="block text-gray-300 mb-2">Name</span>
          <Input name="name" focused type="text" />
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
        <Button type="submit" className="bg-blue-400 text-blue-900">
          Save
        </Button>
      </Form>
    </div>
  );
};

CreateFeed.getInitialProps = async ctx => {
  const { token } = authenticated(ctx);
  return { token };
};

export default CreateFeed;
