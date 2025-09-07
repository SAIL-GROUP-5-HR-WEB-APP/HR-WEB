import { useState, useEffect } from "react";
import { LuDollarSign, LuGift, LuHistory } from "react-icons/lu";
import Api from "../Components/Reuseable/Api";

// Define interfaces for Payroll and Bonus based on backend schemas
interface Payroll {
  _id: string;
  userId: string;
  amount: number;
  month: string;
  transactionId?: string;
  recipientCode?: string;
  status: "pending" | "success" | "failed";
  createdAt: string;
}

interface Bonus {
  _id: string;
  employeeId: string;
  amount: number;
  reason: string;
  awardedBy: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  transactionId?: string;
  recipientCode?: string;
  status: "pending" | "success" | "failed";
  createdAt: string;
}

interface FormData {
  userId: string;
  amount: string;
  month: string;
  employeeId: string;
  bonusAmount: string;
  reason: string;
}

const Payroll: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"payroll" | "bonus" | "history">(
    "payroll"
  );
  const [payrolls, setPayrolls] = useState<Payroll[]>([]);
  const [bonuses, setBonuses] = useState<Bonus[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    userId: "",
    amount: "",
    month: "",
    employeeId: "",
    bonusAmount: "",
    reason: "",
  });

  // Fetch payroll data
  const fetchPayrolls = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await Api.get<Payroll[]>("/api/v1/payroll/my");
      setPayrolls(response.data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to fetch payrolls");
    } finally {
      setLoading(false);
    }
  };

  // Fetch bonuses data
  const fetchBonuses = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await Api.get<Bonus[]>("/api/v1/bonuses/my");
      setBonuses(response.data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to fetch bonuses");
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle payroll submission
  const handlePayrollSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    try {
      setLoading(true);
      await Api.post("/api/v1/payroll", {
        userId: formData.userId,
        amount: parseFloat(formData.amount),
        month: formData.month,
      });
      setFormData((prev) => ({ ...prev, userId: "", amount: "", month: "" }));
      await fetchPayrolls();
      alert("Payroll processed successfully!");
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Failed to process payroll"
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle bonus submission
  const handleBonusSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    try {
      setLoading(true);
      await Api.post("/api/v1/bonuses", {
        employeeId: formData.employeeId,
        amount: parseFloat(formData.bonusAmount),
        reason: formData.reason,
      });
      setFormData((prev) => ({
        ...prev,
        employeeId: "",
        bonusAmount: "",
        reason: "",
      }));
      await fetchBonuses();
      alert("Bonus awarded successfully!");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to award bonus");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "payroll" || activeTab === "history") fetchPayrolls();
    if (activeTab === "bonus" || activeTab === "history") fetchBonuses();
  }, [activeTab]);

  return (
    <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-10">
      {/* Header */}
      <div className="flex mb-8 items-center justify-center text-center bg-gradient-to-r from-indigo-800 to-indigo-600 text-white text-3xl sm:text-4xl px-8 py-6 rounded-2xl w-fit mx-auto shadow-lg">
        <span className="mr-3">
          {activeTab === "payroll" && <LuDollarSign />}
          {activeTab === "bonus" && <LuGift />}
          {activeTab === "history" && <LuHistory />}
        </span>
        <h1>
          {activeTab === "payroll" && "Payroll Management"}
          {activeTab === "bonus" && "Bonus Awards"}
          {activeTab === "history" && "Payroll & Bonus History"}
        </h1>
      </div>
      <p className="text-gray-600 mb-8 text-center text-sm sm:text-base">
        {activeTab === "payroll" &&
          "Manage and process monthly employee salaries."}
        {activeTab === "bonus" &&
          "Award micro-bonuses to boost employee morale."}
        {activeTab === "history" && "View your payroll and bonus history."}
      </p>

      {/* Tabs */}
      <div className="flex justify-center mb-8">
        <div className="flex space-x-2 bg-gray-100 p-1 rounded-full">
          {(["payroll", "bonus", "history"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-full text-sm sm:text-base font-medium transition-all duration-300 ${
                activeTab === tab
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-200"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6 text-center">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-6">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
        </div>
      )}

      {/* Payroll Tab */}
      {activeTab === "payroll" && !loading && (
        <div className="space-y-8">
          {/* HR Payroll Form */}
          <form
            onSubmit={handlePayrollSubmit}
            className="bg-white p-6 rounded-2xl shadow-lg"
          >
            <h2 className="text-xl font-semibold mb-4">Process Payroll</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <input
                type="text"
                name="userId"
                value={formData.userId}
                onChange={handleInputChange}
                placeholder="Employee ID"
                className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                required
              />
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                placeholder="Amount (₦)"
                className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                min="0"
                required
              />
              <input
                type="text"
                name="month"
                value={formData.month}
                onChange={handleInputChange}
                placeholder="Month (YYYY-MM)"
                className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                pattern="\d{4}-\d{2}"
                required
              />
              <button
                type="submit"
                className="col-span-1 sm:col-span-3 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors"
                disabled={loading}
              >
                Process Payroll
              </button>
            </div>
          </form>

          {/* Payroll Table */}
          <div className="rounded-2xl overflow-x-auto bg-white shadow-lg">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 text-sm sm:text-base">
                  <th className="text-left px-4 py-3">Month</th>
                  <th className="text-right px-4 py-3">Amount (₦)</th>
                  <th className="text-right px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {payrolls.map((payroll) => (
                  <tr key={payroll._id} className="border-b">
                    <td className="px-4 py-3">{payroll.month}</td>
                    <td className="px-4 py-3 text-right">
                      ₦{payroll.amount.toLocaleString()}
                    </td>
                    <td
                      className={`px-4 py-3 text-right capitalize ${
                        payroll.status === "success"
                          ? "text-green-600"
                          : payroll.status === "failed"
                          ? "text-red-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {payroll.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Bonus Tab */}
      {activeTab === "bonus" && !loading && (
        <div className="space-y-8">
          {/* HR Bonus Form */}
          <form
            onSubmit={handleBonusSubmit}
            className="bg-white p-6 rounded-2xl shadow-lg"
          >
            <h2 className="text-xl font-semibold mb-4">Award Bonus</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <input
                type="text"
                name="employeeId"
                value={formData.employeeId}
                onChange={handleInputChange}
                placeholder="Employee ID"
                className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                required
              />
              <input
                type="number"
                name="bonusAmount"
                value={formData.bonusAmount}
                onChange={handleInputChange}
                placeholder="Bonus Amount (₦500-₦5000)"
                className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                min="500"
                max="5000"
                required
              />
              <input
                type="text"
                name="reason"
                value={formData.reason}
                onChange={handleInputChange}
                placeholder="Reason for Bonus"
                className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                required
              />
              <button
                type="submit"
                className="col-span-1 sm:col-span-3 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors"
                disabled={loading}
              >
                Award Bonus
              </button>
            </div>
          </form>

          {/* Bonus Table */}
          <div className="rounded-2xl overflow-x-auto bg-white shadow-lg">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 text-sm sm:text-base">
                  <th className="text-left px-4 py-3">Reason</th>
                  <th className="text-right px-4 py-3">Amount (₦)</th>
                  <th className="text-left px-4 py-3">Awarded By</th>
                  <th className="text-right px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {bonuses.map((bonus) => (
                  <tr key={bonus._id} className="border-b">
                    <td className="px-4 py-3">{bonus.reason}</td>
                    <td className="px-4 py-3 text-right">
                      ₦{bonus.amount.toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      {bonus.awardedBy?.firstName} {bonus.awardedBy?.lastName}
                    </td>
                    <td
                      className={`px-4 py-3 text-right capitalize ${
                        bonus.status === "success"
                          ? "text-green-600"
                          : bonus.status === "failed"
                          ? "text-red-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {bonus.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* History Tab */}
      {activeTab === "history" && !loading && (
        <div className="space-y-8">
          <div className="rounded-2xl overflow-x-auto bg-white shadow-lg">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 text-sm sm:text-base">
                  <th className="text-left px-4 py-3">Type</th>
                  <th className="text-left px-4 py-3">Details</th>
                  <th className="text-right px-4 py-3">Amount (₦)</th>
                  <th className="text-right px-4 py-3">Status</th>
                  <th className="text-right px-4 py-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {[...payrolls, ...bonuses]
                  .sort(
                    (a, b) =>
                      new Date(b.createdAt).getTime() -
                      new Date(a.createdAt).getTime()
                  )
                  .map((item) => (
                    <tr key={item._id} className="border-b">
                      <td className="px-4 py-3">
                        {"month" in item ? "Payroll" : "Bonus"}
                      </td>
                      <td className="px-4 py-3">
                        {"month" in item ? item.month : item.reason}
                      </td>
                      <td className="px-4 py-3 text-right">
                        ₦{item.amount.toLocaleString()}
                      </td>
                      <td
                        className={`px-4 py-3 text-right capitalize ${
                          item.status === "success"
                            ? "text-green-600"
                            : item.status === "failed"
                            ? "text-red-600"
                            : "text-yellow-600"
                        }`}
                      >
                        {item.status}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
};

export default Payroll;
