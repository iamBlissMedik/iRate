"use client";

import TransactionRow from "../ui/MyTransactionRow";


const transactions = [
  { user: "Alice", amount: 1200, type: "fund", status: "success" },
  { user: "Bob", amount: 5000, type: "transfer", status: "pending" },
  { user: "Charlie", amount: 800, type: "withdraw", status: "failed" },
  { user: "Daisy", amount: 3000, type: "fund", status: "success" },
];

export default function RecentTransactions() {
  return (
    <div className="bg-sidebar border border-sidebar-border rounded-xl p-6 shadow-sm overflow-x-auto">
      <h2 className="text-lg font-semibold text-sidebar-foreground mb-4">Recent Transactions</h2>
      <table className="min-w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-800">
            <th className="px-4 py-2 text-gray-600 dark:text-gray-300">User</th>
            <th className="px-4 py-2 text-gray-600 dark:text-gray-300">Amount</th>
            <th className="px-4 py-2 text-gray-600 dark:text-gray-300">Type</th>
            <th className="px-4 py-2 text-gray-600 dark:text-gray-300">Status</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx, index) => (
            <TransactionRow key={index} {...tx} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
