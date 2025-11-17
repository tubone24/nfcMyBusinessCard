import type { Meta, StoryObj } from '@storybook/html';

interface ButtonArgs {
  label: string;
  primary?: boolean;
  size?: 'small' | 'medium' | 'large';
  onClick?: () => void;
}

const createButton = ({ label, primary = false, size = 'medium' }: ButtonArgs) => {
  const button = document.createElement('button');
  button.type = 'button';
  button.innerText = label;
  button.className = ['storybook-button', `storybook-button--${size}`];

  if (primary) {
    button.classList.add('storybook-button--primary');
  } else {
    button.classList.add('storybook-button--secondary');
  }

  return button;
};

const meta: Meta<ButtonArgs> = {
  title: 'Example/Button',
  tags: ['autodocs'],
  render: (args) => createButton(args),
  argTypes: {
    label: { control: 'text' },
    primary: { control: 'boolean' },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
    },
  },
  args: {
    primary: false,
  },
};

export default meta;
type Story = StoryObj<ButtonArgs>;

export const Primary: Story = {
  args: {
    primary: true,
    label: 'Button',
  },
};

export const Secondary: Story = {
  args: {
    label: 'Button',
  },
};

export const Large: Story = {
  args: {
    size: 'large',
    label: 'Button',
  },
};

export const Small: Story = {
  args: {
    size: 'small',
    label: 'Button',
  },
};
