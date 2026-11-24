import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '@/components/common/button/Button';
import { Dialog } from '@/components/common/dialog/Dialog';
import { useDisclosure } from '@/hooks/useDisclosure';

const meta = {
  title: 'Components/Dialog',
  component: Dialog,
  args: { isOpen: false },
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithOutBody: Story = {
  render: function Render() {
    const { isOpen, open, close } = useDisclosure();

    return (
      <>
        <Button onClick={open}>다이얼로그 열기</Button>
        <Dialog isOpen={isOpen}>
          <Dialog.Header>면접을 종료할까요?</Dialog.Header>
          <Dialog.Description>
            종료하면 지금까지의 답변으로 결과를 만들어요.
          </Dialog.Description>
          <Dialog.Footer>
            <Button
              variant='secondary'
              size='large'
              display='block'
              onClick={close}
            >
              계속하기
            </Button>
            <Button size='large' display='block' onClick={close}>
              종료하기
            </Button>
          </Dialog.Footer>
        </Dialog>
      </>
    );
  },
};

export const WithBody: Story = {
  render: function Render() {
    const { isOpen, open, close } = useDisclosure();

    return (
      <>
        <Button onClick={open}>다이얼로그 열기</Button>
        <Dialog isOpen={isOpen}>
          <Dialog.Header>면접 안내</Dialog.Header>
          <Dialog.Description>
            시작 전에 아래 내용을 확인해 주세요.
          </Dialog.Description>
          <Dialog.Body>
            <div
              style={{
                height: 120,
                borderRadius: 12,
                background: '#F4F7FB',
              }}
            />
          </Dialog.Body>
          <Dialog.Footer>
            <Button size='large' display='block' onClick={close}>
              확인
            </Button>
          </Dialog.Footer>
        </Dialog>
      </>
    );
  },
};
