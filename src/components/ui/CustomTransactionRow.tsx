"use client";

import { CheckCircle, XCircle, RefreshCw } from "lucide-react";

interface TransactionRowProps {
  user: string;
  amount: string | number;
  type: "fund" | "transfer" | "withdraw";
  status: "success" | "pending" | "failed";
}

const statusIcon = {
  success: <CheckCircle className="text-green-600" size={18} />,
  pending: <RefreshCw className="text-yellow-500 animate-spin" size={18} />,
  failed: <XCircle className="text-red-600" size={18} />,
};

export default function TransactionRow({ user, amount, type, status }: TransactionRowProps) {
  return (
    <tr className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
      <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{user}</td>
      <td className="px-4 py-3 text-gray-900 dark:text-white font-medium">₦{amount}</td>
      <td className="px-4 py-3 capitalize">{type}</td>
      <td className="px-4 py-3 flex items-center gap-2">{statusIcon[status]} <span>{status}</span></td>
    </tr>
  );
}
