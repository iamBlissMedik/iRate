import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "./badge";

const meta: Meta<typeof Badge> = {
  title: "Primitives/Badge",
  component: Badge,
  args: { children: "Badge" },
};
export default meta;

type Story = StoryObj<typeof Badge>;

export const All: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge>Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="success">Verified</Badge>
      <Badge variant="warning">Pending</Badge>
      <Badge variant="destructive">Rejected</Badge>
      <Badge variant="outline">No KYC</Badge>
    </div>
  ),
};
