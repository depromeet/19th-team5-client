import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { Button } from '@/components/common/button/Button';
import { TextArea } from '@/components/common/text-area/TextArea';

const meta = {
  title: 'Components/TextArea',
  component: TextArea,
  argTypes: {
    label: { control: 'text', description: '입력 위 라벨' },
    helperText: {
      control: 'text',
      description: '입력 아래 도움말. `error`이면 에러 색으로 표시돼요.',
    },
    error: { control: 'boolean', description: '에러 상태' },
    showCount: {
      control: 'boolean',
      description: '`maxLength`가 있을 때 글자수 표시 여부',
      table: { defaultValue: { summary: 'true' } },
    },
    maxLength: { control: 'number' },
    placeholder: { control: 'text' },
    required: { control: 'boolean', description: '라벨 옆 `*` 표시' },
    disabled: { control: 'boolean' },
  },
  args: {
    label: '라벨',
    placeholder: '내용을 입력해 주세요',
    maxLength: 100,
    required: true,
    error: false,
    disabled: false,
    showCount: true,
  },
  decorators: [
    (Story) => (
      <div style={{ width: 360 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TextArea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithHelperText: Story = {
  args: { helperText: '도움말 문구' },
};

export const Invalid: Story = {
  args: {
    defaultValue: '입력한 내용',
    error: true,
    helperText: '도움말 문구',
  },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const Optional: Story = {
  args: { required: false },
};

export const OverLimit: Story = {
  args: {
    maxLength: 10,
    defaultValue: '열 글자를 넘긴 입력값이에요',
  },
};

type InterviewForm = {
  introduction: string;
  memo: string;
};

export const WithReactHookForm: Story = {
  render: function Render() {
    const [submitted, setSubmitted] = useState<InterviewForm | null>(null);
    const {
      register,
      handleSubmit,
      reset,
      formState: { errors },
    } = useForm<InterviewForm>({
      mode: 'onTouched',
      defaultValues: { introduction: '', memo: '' },
    });

    const onSubmit: SubmitHandler<InterviewForm> = (data) => setSubmitted(data);

    return (
      <form
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        style={{ display: 'grid', gap: 24 }}
      >
        <TextArea
          label='자기소개'
          placeholder='간단한 자기소개를 입력해 주세요'
          maxLength={300}
          required
          error={!!errors.introduction}
          helperText={
            errors.introduction?.message ?? '20자 이상 입력해 주세요.'
          }
          {...register('introduction', {
            required: '자기소개를 입력해 주세요.',
            minLength: { value: 20, message: '20자 이상 입력해 주세요.' },
            maxLength: { value: 300, message: '300자 이내로 입력해 주세요.' },
          })}
        />
        <TextArea
          label='메모'
          placeholder='면접관에게 남길 메모가 있다면 적어 주세요'
          maxLength={100}
          error={!!errors.memo}
          helperText={errors.memo?.message}
          {...register('memo', {
            maxLength: { value: 100, message: '100자 이내로 입력해 주세요.' },
          })}
        />
        <div style={{ display: 'flex', gap: 8 }}>
          <Button type='submit'>제출</Button>
          <Button
            type='button'
            variant='secondary'
            onClick={() => {
              reset();
              setSubmitted(null);
            }}
          >
            초기화
          </Button>
        </div>
        {submitted && (
          <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
            {JSON.stringify(submitted, null, 2)}
          </pre>
        )}
      </form>
    );
  },
};
