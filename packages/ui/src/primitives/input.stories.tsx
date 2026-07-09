import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "./input";

const meta: Meta<typeof Input> = {
  title: "Primitives/Input",
  component: Input,
  args: { placeholder: "you@example.com" },
  decorators: [
    (Story) => (
      <div className="max-w-xs">
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof Input>;

export const Default: Story = {};
export const Invalid: Story = { args: { error: true, defaultValue: "not-an-email" } };
export const Disabled: Story = { args: { disabled: true, value: "locked" } };
export const Password: Story = { args: { type: "password", placeholder: "••••••••" } };
