import type { Meta, StoryObj } from "@storybook/react";
import { Wallet } from "lucide-react";
import { StatCard } from "./stat-card";

const meta: Meta<typeof StatCard> = {
  title: "Data/StatCard",
  component: StatCard,
  args: { label: "Total balance", value: "₦48,000.00", icon: Wallet, delta: 12.4 },
  decorators: [
    (Story) => (
      <div className="max-w-xs">
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof StatCard>;

export const Default: Story = {};
export const Negative: Story = { args: { delta: -4.2, hint: "vs last week" } };
export const Loading: Story = { args: { loading: true } };
