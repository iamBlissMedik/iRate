import type { Meta, StoryObj } from "@storybook/react";
import { Money } from "./money";

const meta: Meta<typeof Money> = {
  title: "Data/Money",
  component: Money,
  args: { value: "4800000" },
};
export default meta;

type Story = StoryObj<typeof Money>;

export const Default: Story = {};
export const Credit: Story = { args: { value: "250000", colorize: true, signed: true } };
export const Debit: Story = { args: { value: "-250000", colorize: true, signed: true } };

export const Showcase: Story = {
  render: () => (
    <div className="space-y-1 font-medium">
      <div>
        <Money value="4800000" />
      </div>
      <div>
        <Money value="250000" colorize signed />
      </div>
      <div>
        <Money value="-200000" colorize signed />
      </div>
      <div>
        <Money value="900719925474099300" />
      </div>
    </div>
  ),
};
