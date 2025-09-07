import { useState, useEffect } from "react";
import { LuDollarSign, LuGift } from "react-icons/lu";
import Select from "react-select";
import Api from "../Components/Reuseable/Api";

// Define interfaces for Payroll, Bonus, and User
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

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  bankAccount: string;
  bankCode: string;
}

interface FormData {
  userId: string;
  amount: string;
  month: string;
  employeeId: string;
  bonusAmount: string;
  reason: string;
}

interface SelectOption {
  value: string;
  label: string;
}

interface ConfirmData {
  type: "payroll" | "bonus";
  employeeName: string;
  amount: number;
  bankAccount: string;
  bankCode: string;
  month?: string;
  reason?: string;
}

const Payroll: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"payroll" | "bonus">("payroll");
  const [payrolls, setPayrolls] = useState<Payroll[]>([]);
  const [bonuses, setBonuses] = useState<Bonus[]>([]);
  const [employees, setEmployees] = useState<User[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<User | null>(null);
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
  const [isPayrollModalOpen, setIsPayrollModalOpen] = useState<boolean>(false);
  const [isBonusModalOpen, setIsBonusModalOpen] = useState<boolean>(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState<boolean>(false);
  const [confirmData, setConfirmData] = useState<ConfirmData | null>(null);

  // Fetch employees for dropdown
  const fetchEmployees = async (): Promise<void> => {
    try {
      const response = await Api.get<User[]>("/api/v1/users");
      const data = response.data;
      setEmployees(Array.isArray(data) ? data : []);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch employees"
      );
      setEmployees([]);
    }
  };

  // Fetch all payrolls (HR view)
  const fetchPayrolls = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await Api.get<Payroll[]>("/api/v1/payroll");
      const data = response.data;
      setPayrolls(Array.isArray(data) ? data : []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to fetch payrolls");
      setPayrolls([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all bonuses (HR view)
  const fetchBonuses = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await Api.get<Bonus[]>("/api/v1/bonuses");
      const data = response.data;
      setBonuses(Array.isArray(data) ? data : []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to fetch bonuses");
      setBonuses([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle employee selection
  const handleEmployeeSelect = (
    selected: SelectOption | null,
    field: "userId" | "employeeId"
  ): void => {
    const userId = selected ? selected.value : "";
    setFormData((prev) => ({ ...prev, [field]: userId }));
    const employee = employees.find((emp) => emp._id === userId) || null;
    setSelectedEmployee(employee);
  };

  // Open confirmation modal for payroll or bonus
  const openConfirm = (type: "payroll" | "bonus") => {
    if (!selectedEmployee) return;
    const amount = parseFloat(
      type === "payroll" ? formData.amount : formData.bonusAmount
    );
    if (isNaN(amount)) {
      setError("Invalid amount");
      return;
    }
    setConfirmData({
      type,
      employeeName: `${selectedEmployee.firstName} ${selectedEmployee.lastName}`,
      amount,
      bankAccount: selectedEmployee.bankAccount,
      bankCode: selectedEmployee.bankCode,
      month: type === "payroll" ? formData.month : undefined,
      reason: type === "bonus" ? formData.reason : undefined,
    });
    setIsConfirmOpen(true);
  };

  // Handle confirmation yes
  const handleConfirmYes = async (): Promise<void> => {
    if (!confirmData) return;
    try {
      setLoading(true);
      setError(null);
      if (confirmData.type === "payroll") {
        await Api.post("/api/v1/payroll", {
          userId: formData.userId,
          amount: confirmData.amount,
          month: confirmData.month,
        });
        setFormData((prev) => ({ ...prev, userId: "", amount: "", month: "" }));
        setIsPayrollModalOpen(false);
        await fetchPayrolls();
      } else {
        await Api.post("/api/v1/bonuses", {
          employeeId: formData.employeeId,
          amount: confirmData.amount,
          reason: confirmData.reason,
        });
        setFormData((prev) => ({
          ...prev,
          employeeId: "",
          bonusAmount: "",
          reason: "",
        }));
        setIsBonusModalOpen(false);
        await fetchBonuses();
      }
      alert(
        `${
          confirmData.type.charAt(0).toUpperCase() + confirmData.type.slice(1)
        } processed successfully!`
      );
    } catch (err: unknown) {
      const message =
        err instanceof Error && err.message.includes("zyraHR")
          ? err.message
          : `Failed to process ${confirmData.type}. Please check the input data.`;
      setError(message);
    } finally {
      setLoading(false);
      setIsConfirmOpen(false);
      setConfirmData(null);
    }
  };

  useEffect(() => {
    fetchEmployees();
    if (activeTab === "payroll") fetchPayrolls();
    if (activeTab === "bonus") fetchBonuses();
  }, [activeTab]);

  // Prepare employee options for react-select
  const employeeOptions: SelectOption[] = employees.map((employee) => ({
    value: employee._id,
    label: `${employee.firstName} ${employee.lastName}`,
  }));

  // Get employee name by ID
  const getEmployeeName = (id: string): string => {
    const employee = employees.find((emp) => emp._id === id);
    return employee ? `${employee.firstName} ${employee.lastName}` : "Unknown";
  };

  return (
    <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-10">
      {/* Header */}
      <div className="flex mb-8 items-center justify-center text-center bg-gradient-to-r from-indigo-800 to-indigo-600 text-white text-3xl sm:text-4xl px-8 py-6 rounded-2xl w-fit mx-auto shadow-lg">
        <span className="mr-3">
          {activeTab === "payroll" && <LuDollarSign />}
          {activeTab === "bonus" && <LuGift />}
        </span>
        <h1>
          {activeTab === "payroll" && "Payroll Management"}
          {activeTab === "bonus" && "Bonus Awards"}
        </h1>
      </div>
      <p className="text-gray-600 mb-8 text-center text-sm sm:text-base">
        {activeTab === "payroll" &&
          "Manage and process monthly employee salaries."}
        {activeTab === "bonus" &&
          "Award micro-bonuses to boost employee morale."}
      </p>

      {/* Tabs */}
      <div className="flex justify-center mb-8">
        <div className="flex space-x-2 bg-gray-100 p-1 rounded-full">
          {(["payroll", "bonus"] as const).map((tab) => (
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
          {/* Make Payment Button */}
          <div className="flex justify-end">
            <button
              onClick={() => setIsPayrollModalOpen(true)}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Make Payment
            </button>
          </div>

          {/* Payroll Table */}
          <div className="rounded-2xl overflow-x-auto bg-white shadow-lg">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 text-sm sm:text-base">
                  <th className="text-left px-4 py-3">Employee</th>
                  <th className="text-left px-4 py-3">Month</th>
                  <th className="text-right px-4 py-3">Amount (₦)</th>
                  <th className="text-right px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {payrolls.map((payroll) => (
                  <tr key={payroll._id} className="border-b">
                    <td className="px-4 py-3">
                      {getEmployeeName(payroll.userId)}
                    </td>
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
          {/* Award Bonus Button */}
          <div className="flex justify-end">
            <button
              onClick={() => setIsBonusModalOpen(true)}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Award Bonus
            </button>
          </div>

          {/* Bonus Table */}
          <div className="rounded-2xl overflow-x-auto bg-white shadow-lg">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 text-sm sm:text-base">
                  <th className="text-left px-4 py-3">Employee</th>
                  <th className="text-left px-4 py-3">Reason</th>
                  <th className="text-right px-4 py-3">Amount (₦)</th>
                  <th className="text-left px-4 py-3">Awarded By</th>
                  <th className="text-right px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {bonuses.map((bonus) => (
                  <tr key={bonus._id} className="border-b">
                    <td className="px-4 py-3">
                      {getEmployeeName(bonus.employeeId)}
                    </td>
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

      {/* Payroll Modal */}
      {isPayrollModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Process Payroll</h2>
            <div className="space-y-4">
              <Select
                options={employeeOptions}
                onChange={(selected) =>
                  handleEmployeeSelect(selected, "userId")
                }
                placeholder="Select Employee"
                className="text-sm"
                isClearable
                isSearchable
                required
              />
              <input
                type="text"
                value={selectedEmployee?.bankAccount || ""}
                placeholder="Bank Account"
                className="border p-3 rounded-lg w-full bg-gray-100"
                disabled
              />
              <input
                type="text"
                value={selectedEmployee?.bankCode || ""}
                placeholder="Bank Code"
                className="border p-3 rounded-lg w-full bg-gray-100"
                disabled
              />
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                placeholder="Amount (₦)"
                className="border p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-indigo-600"
                min="0"
                required
              />
              <input
                type="text"
                name="month"
                value={formData.month}
                onChange={handleInputChange}
                placeholder="Month (YYYY-MM)"
                className="border p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-indigo-600"
                pattern="\d{4}-\d{2}"
                required
              />
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setIsPayrollModalOpen(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={() => openConfirm("payroll")}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                  disabled={
                    !selectedEmployee || !formData.amount || !formData.month
                  }
                >
                  Pay
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bonus Modal */}
      {isBonusModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Award Bonus</h2>
            <div className="space-y-4">
              <Select
                options={employeeOptions}
                onChange={(selected) =>
                  handleEmployeeSelect(selected, "employeeId")
                }
                placeholder="Select Employee"
                className="text-sm"
                isClearable
                isSearchable
                required
              />
              <input
                type="text"
                value={selectedEmployee?.bankAccount || ""}
                placeholder="Bank Account"
                className="border p-3 rounded-lg w-full bg-gray-100"
                disabled
              />
              <input
                type="text"
                value={selectedEmployee?.bankCode || ""}
                placeholder="Bank Code"
                className="border p-3 rounded-lg w-full bg-gray-100"
                disabled
              />
              <input
                type="number"
                name="bonusAmount"
                value={formData.bonusAmount}
                onChange={handleInputChange}
                placeholder="Bonus Amount (₦500-₦5000)"
                className="border p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-indigo-600"
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
                className="border p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-indigo-600"
                required
              />
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setIsBonusModalOpen(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={() => openConfirm("bonus")}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                  disabled={
                    !selectedEmployee ||
                    !formData.bonusAmount ||
                    !formData.reason
                  }
                >
                  Award
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {isConfirmOpen && confirmData && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Confirm Transfer</h2>
            <p className="mb-6">
              Are you sure you want to transfer ₦
              {confirmData.amount.toLocaleString()} to{" "}
              {confirmData.employeeName}'s account ({confirmData.bankAccount},{" "}
              {confirmData.bankCode})
              {confirmData.type === "payroll"
                ? `for ${confirmData.month}?`
                : `for reason: ${confirmData.reason}?`}
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsConfirmOpen(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg"
              >
                No
              </button>
              <button
                onClick={handleConfirmYes}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Payroll;
