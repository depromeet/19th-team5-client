import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { Button } from '@/components/common/button/Button';
import { TextField } from '@/components/common/text-field/TextField';
import { formatInputChange } from '@/utils/FormatInput';

const meta = {
  title: 'Components/TextField',
  component: TextField,
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
} satisfies Meta<typeof TextField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const FormattedInputs: Story = {
  name: '날짜 · 시간 · 전화번호 자동 입력',
  render: () => (
    <div style={{ display: 'grid', gap: 16 }}>
      <TextField
        label='날짜'
        placeholder='YYYY.MM.DD'
        inputMode='numeric'
        onChange={(e) => formatInputChange(e, 'date')}
      />
      <TextField
        label='시간'
        placeholder='HH:mm'
        inputMode='numeric'
        onChange={(e) => formatInputChange(e, 'time')}
      />
      <TextField
        label='전화번호'
        placeholder='010-0000-0000'
        type='tel'
        onChange={(e) => formatInputChange(e, 'phone')}
      />
    </div>
  ),
};

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

type ProfileForm = {
  name: string;
  email: string;
  company: string;
};

/**
 * `register` 결과를 그대로 spread 해서 사용해요.
 * 검증 에러는 `error`·`helperText`로 연결하고, 글자수는 `maxLength`로 표시해요.
 * `maxLength`는 입력을 막지 않고 초과 시 에러 스타일만 적용해요. 제출 차단은 `maxLength` 규칙으로 처리해요.
 * 필수 검증은 react-hook-form 규칙으로 하고, `required`는 라벨의 `*` 표시를 위해 넘겨요.
 * (브라우저 기본 검증 말풍선 대신 react-hook-form 메시지를 쓰도록 form에 `noValidate`를 둬요.)
 */
export const WithReactHookForm: Story = {
  render: function Render() {
    const [submitted, setSubmitted] = useState<ProfileForm | null>(null);
    const {
      register,
      handleSubmit,
      reset,
      formState: { errors },
    } = useForm<ProfileForm>({
      mode: 'onTouched',
      defaultValues: { name: '', email: '', company: '팀 파이브' },
    });

    const onSubmit: SubmitHandler<ProfileForm> = (data) => setSubmitted(data);

    return (
      <form
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        style={{ display: 'grid', gap: 24 }}
      >
        <TextField
          label='이름'
          placeholder='이름을 입력해 주세요'
          maxLength={20}
          required
          error={!!errors.name}
          helperText={errors.name?.message}
          {...register('name', {
            required: '이름을 입력해 주세요.',
            minLength: { value: 2, message: '2자 이상 입력해 주세요.' },
            maxLength: { value: 20, message: '20자 이내로 입력해 주세요.' },
          })}
        />
        <TextField
          type='email'
          label='이메일'
          placeholder='example@email.com'
          required
          error={!!errors.email}
          helperText={errors.email?.message ?? '결과를 받아볼 이메일이에요.'}
          {...register('email', {
            required: '이메일을 입력해 주세요.',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: '이메일 형식이 올바르지 않아요.',
            },
          })}
        />
        <TextField
          label='회사'
          placeholder='회사명을 입력해 주세요'
          maxLength={30}
          error={!!errors.company}
          helperText={errors.company?.message}
          {...register('company', {
            maxLength: { value: 30, message: '30자 이내로 입력해 주세요.' },
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
          <pre style={{ margin: 0 }}>{JSON.stringify(submitted, null, 2)}</pre>
        )}
      </form>
    );
  },
};
