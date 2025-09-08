import { useState, useEffect } from "react";
import { LuDollarSign, LuGift } from "react-icons/lu";
import Select from "react-select";
import io from "socket.io-client";
import Api from "../Components/Reuseable/Api";

// Define interfaces for Payroll, Bonus, and User
interface Payroll {
  id: string;
  userId: string;
  amount: number;
  month: string;
  transactionId?: string;
  recipientCode?: string;
  status: "pending" | "success" | "failed";
  createdAt: string;
  updatedAt?: string;
  employee: {
    id: string;
    name: string;
    email?: string;
    role?: string;
  } | null;
}

interface Bonus {
  id: string;
  employeeId: string;
  amount: number;
  reason: string;
  awardedBy: {
    id: string;
    name: string;
    email?: string;
    role?: string;
  };
  transactionId?: string;
  recipientCode?: string;
  status: "pending" | "success" | "failed";
  createdAt: string;
  updatedAt?: string;
  employee: {
    id: string;
    name: string;
    email?: string;
    role?: string;
  } | null;
}

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  profile: {
    bankAccount?: string;
    bankCode?: string;
  };
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

// Initialize Socket.IO client
const socket = io("https://zyrahr-backend.onrender.com");

const Payroll: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"payroll" | "bonus">("payroll");
  const [payrolls, setPayrolls] = useState<Payroll[]>([]);
  const [bonuses, setBonuses] = useState<Bonus[]>([]);
  const [employees, setEmployees] = useState<User[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<User | null>(null);
  const [loadingPayrolls, setLoadingPayrolls] = useState<boolean>(false);
  const [loadingBonuses, setLoadingBonuses] = useState<boolean>(false);
  const [loadingEmployees, setLoadingEmployees] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
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
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState<boolean>(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState<boolean>(false);
  const [confirmData, setConfirmData] = useState<ConfirmData | null>(null);

  // Fetch employees for dropdown
  const fetchEmployees = async (): Promise<void> => {
    try {
      setLoadingEmployees(true);
      const response = await Api.get<User[]>("/api/v1/users/all");
      const data = Array.isArray(response.data) ? response.data : [];
      console.log("Fetched Employees:", data);
      setEmployees(data);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to fetch employees";
      console.error("Fetch Employees Error:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });
      setError(errorMessage);
      setEmployees([]);
      setIsErrorModalOpen(true);
    } finally {
      setLoadingEmployees(false);
    }
  };

  // Fetch all payrolls (HR view)
  const fetchPayrolls = async (): Promise<void> => {
    try {
      setLoadingPayrolls(true);
      const response = await Api.get<{
        message: string;
        count: number;
        payrolls: any[];
      }>("/api/v1/payroll/all");
      const data = (
        Array.isArray(response.data.payrolls) ? response.data.payrolls : []
      ).map((p: any) => ({
        id: p.id || p._id || `temp-${Date.now()}`,
        userId: p.employee?.id || p.userId || "",
        amount: Number(p.amount) || 0,
        month: p.month || "Unknown",
        transactionId: p.transactionId,
        recipientCode: p.recipientCode,
        status: p.status || "pending",
        createdAt: p.createdAt || new Date().toISOString(),
        updatedAt: p.updatedAt,
        employee: p.employee
          ? {
              id: p.employee.id || "",
              name: p.employee.name || "Unknown",
              email: p.employee.email,
              role: p.employee.role,
            }
          : null,
      }));
      setPayrolls(data);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.details ||
        err.message ||
        "Failed to fetch payrolls";
      console.error("Fetch Payrolls Error:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });
      setError(errorMessage);
      setPayrolls([]);
      setIsErrorModalOpen(true);
    } finally {
      setLoadingPayrolls(false);
    }
  };

  // Fetch all bonuses (HR view)
  const fetchBonuses = async (): Promise<void> => {
    try {
      setLoadingBonuses(true);
      const response = await Api.get<{
        message: string;
        count: number;
        bonuses: any[];
      }>("/api/v1/bonus/all");
      const data = (
        Array.isArray(response.data.bonuses) ? response.data.bonuses : []
      ).map((b: any) => ({
        id: b.id || b._id || `temp-${Date.now()}`,
        employeeId: b.employee?.id || b.employeeId || "",
        amount: Number(b.amount) || 0,
        reason: b.reason || "No reason provided",
        awardedBy: {
          id: b.awardedBy?.id || b.awardedBy?._id || "",
          name:
            b.awardedBy?.name ||
            `${b.awardedBy?.firstName || "Unknown"} ${
              b.awardedBy?.lastName || ""
            }`,
          email: b.awardedBy?.email,
          role: b.awardedBy?.role,
        },
        transactionId: b.transactionId,
        recipientCode: b.recipientCode,
        status: b.status || "pending",
        createdAt: b.createdAt || new Date().toISOString(),
        updatedAt: b.updatedAt,
        employee: b.employee
          ? {
              id: b.employee.id || "",
              name: b.employee.name || "Unknown",
              email: b.employee.email,
              role: b.employee.role,
            }
          : null,
      }));
      setBonuses(data);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.details ||
        err.message ||
        "Failed to fetch bonuses";
      console.error("Fetch Bonuses Error:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });
      setError(errorMessage);
      setBonuses([]);
      setIsErrorModalOpen(true);
    } finally {
      setLoadingBonuses(false);
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
    if (employee) {
      console.log("Selected Employee:", {
        id: employee._id,
        name: `${employee.firstName} ${employee.lastName}`,
        bankAccount: employee.profile?.bankAccount || "Not set",
        bankCode: employee.profile?.bankCode || "Not set",
      });
    }
  };

  // Open confirmation modal for payroll or bonus
  const openConfirm = (type: "payroll" | "bonus") => {
    if (!selectedEmployee) {
      setError("Please select an employee");
      setIsErrorModalOpen(true);
      return;
    }
    const amount = parseFloat(
      type === "payroll" ? formData.amount : formData.bonusAmount
    );
    if (isNaN(amount) || amount <= 0) {
      setError("Please enter a valid amount");
      setIsErrorModalOpen(true);
      return;
    }
    if (
      type === "payroll" &&
      (!selectedEmployee.profile?.bankAccount ||
        !selectedEmployee.profile?.bankCode)
    ) {
      setError(
        "Selected employee has no bank details. Please update their profile."
      );
      setIsErrorModalOpen(true);
      return;
    }
    if (type === "bonus" && !formData.reason) {
      setError("Please provide a reason for the bonus");
      setIsErrorModalOpen(true);
      return;
    }
    setConfirmData({
      type,
      employeeName: `${selectedEmployee.firstName} ${selectedEmployee.lastName}`,
      amount,
      bankAccount: selectedEmployee.profile?.bankAccount || "",
      bankCode: selectedEmployee.profile?.bankCode || "",
      month: type === "payroll" ? formData.month : undefined,
      reason: type === "bonus" ? formData.reason : undefined,
    });
    setIsConfirmOpen(true);
  };

  // Handle confirmation yes
  const handleConfirmYes = async (): Promise<void> => {
    if (!confirmData) return;
    try {
      setLoadingPayrolls(confirmData.type === "payroll");
      setLoadingBonuses(confirmData.type === "bonus");
      setError(null);
      if (confirmData.type === "payroll") {
        const payload = {
          userId: formData.userId,
          amount: confirmData.amount,
          month: confirmData.month,
          bankAccount: confirmData.bankAccount,
          bankCode: confirmData.bankCode,
        };
        console.log("Sending Payroll Payload:", payload);
        await Api.post("/api/v1/payroll", payload);
        setFormData((prev) => ({ ...prev, userId: "", amount: "", month: "" }));
        setIsPayrollModalOpen(false);
        setSuccessMessage(
          `Payroll of ₦${confirmData.amount.toLocaleString()} processed successfully for ${
            confirmData.employeeName
          }!`
        );
      } else {
        const payload = {
          employeeId: formData.employeeId,
          amount: confirmData.amount,
          reason: confirmData.reason,
        };
        console.log("Sending Bonus Payload:", payload);
        await Api.post("/api/v1/bonus", payload);
        setFormData((prev) => ({
          ...prev,
          employeeId: "",
          bonusAmount: "",
          reason: "",
        }));
        setIsBonusModalOpen(false);
        setSuccessMessage(
          `Bonus of ₦${confirmData.amount.toLocaleString()} awarded successfully to ${
            confirmData.employeeName
          }!`
        );
      }
      setSelectedEmployee(null);
      setIsSuccessModalOpen(true);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.details ||
        `Failed to process ${confirmData.type}. Please check the input data.`;
      console.error(`Process ${confirmData.type} Error:`, {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });
      setError(errorMessage);
      setIsErrorModalOpen(true);
    } finally {
      setLoadingPayrolls(false);
      setLoadingBonuses(false);
      setIsConfirmOpen(false);
      setConfirmData(null);
    }
  };

  // Socket.IO listeners for real-time updates
  useEffect(() => {
    socket.on("payrollProcessed", () => {
      if (activeTab === "payroll") {
        fetchPayrolls();
      }
    });
    socket.on("bonusAwarded", () => {
      if (activeTab === "bonus") {
        fetchBonuses();
      }
    });
    return () => {
      socket.off("payrollProcessed");
      socket.off("bonusAwarded");
    };
  }, [activeTab]);

  // Fetch initial data
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

  // Get employee name by ID or from payroll/bonus employee field
  const getEmployeeName = (payrollOrBonus: Payroll | Bonus): string => {
    if (payrollOrBonus.employee?.name) {
      return payrollOrBonus.employee.name;
    }
    const employee = employees.find(
      (emp) =>
        emp._id === (payrollOrBonus as any).userId ||
        emp._id === (payrollOrBonus as any).employeeId
    );
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
        <h2>
          {activeTab === "payroll" && "Payroll Management"}
          {activeTab === "bonus" && "Bonus Awards"}
        </h2>
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

      {/* Error Message (Page-level) */}
      {error && !isErrorModalOpen && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6 text-center">
          {error}
        </div>
      )}

      {/* Payroll Tab */}
      {activeTab === "payroll" && (
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
            {loadingPayrolls ? (
              <div className="text-center py-6">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
              </div>
            ) : payrolls.length === 0 ? (
              <p className="text-center py-6 text-gray-600">
                No payroll records available.
              </p>
            ) : (
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-sm sm:text-base">
                    <th className="text-left px-4 py-3">Employee</th>
                    <th className="text-left px-4 py-3">Month</th>
                    <th className="text-right px-4 py-3">Amount (₦)</th>
                    <th className="text-right px-4 py-3">Status</th>
                    <th className="text-right px-4 py-3">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {payrolls.map((payroll) => (
                    <tr key={payroll.id} className="border-b">
                      <td className="px-4 py-3">{getEmployeeName(payroll)}</td>
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
                      <td className="px-4 py-3 text-right">
                        {new Date(payroll.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* Bonus Tab */}
      {activeTab === "bonus" && (
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
            {loadingBonuses ? (
              <div className="text-center py-6">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
              </div>
            ) : bonuses.length === 0 ? (
              <p className="text-center py-6 text-gray-600">
                No bonus records available.
              </p>
            ) : (
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-sm sm:text-base">
                    <th className="text-left px-4 py-3">Employee</th>
                    <th className="text-left px-4 py-3">Reason</th>
                    <th className="text-right px-4 py-3">Amount (₦)</th>
                    <th className="text-left px-4 py-3">Awarded By</th>
                    <th className="text-right px-4 py-3">Status</th>
                    <th className="text-right px-4 py-3">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {bonuses.map((bonus) => (
                    <tr key={bonus.id} className="border-b">
                      <td className="px-4 py-3">{getEmployeeName(bonus)}</td>
                      <td className="px-4 py-3">{bonus.reason}</td>
                      <td className="px-4 py-3 text-right">
                        ₦{bonus.amount.toLocaleString()}
                      </td>
                      <td className="px-4 py-3">{bonus.awardedBy.name}</td>
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
                      <td className="px-4 py-3 text-right">
                        {new Date(bonus.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* Payroll Modal */}
      {isPayrollModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-30 z-50">
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
                isLoading={loadingEmployees}
                required
              />
              <input
                type="text"
                value={selectedEmployee?.profile?.bankAccount || ""}
                placeholder="Bank Account"
                className="border p-3 rounded-lg w-full bg-gray-100"
                disabled
              />
              <input
                type="text"
                value={selectedEmployee?.profile?.bankCode || ""}
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
                  onClick={() => {
                    setIsPayrollModalOpen(false);
                    setSelectedEmployee(null);
                    setFormData((prev) => ({
                      ...prev,
                      userId: "",
                      amount: "",
                      month: "",
                    }));
                  }}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={() => openConfirm("payroll")}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                  disabled={
                    !selectedEmployee ||
                    !formData.amount ||
                    !formData.month ||
                    !selectedEmployee?.profile?.bankAccount ||
                    !selectedEmployee?.profile?.bankCode
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
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-30 z-50">
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
                isLoading={loadingEmployees}
                required
              />
              <input
                type="text"
                value={selectedEmployee?.profile?.bankAccount || ""}
                placeholder="Bank Account"
                className="border p-3 rounded-lg w-full bg-gray-100"
                disabled
              />
              <input
                type="text"
                value={selectedEmployee?.profile?.bankCode || ""}
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
                  onClick={() => {
                    setIsBonusModalOpen(false);
                    setSelectedEmployee(null);
                    setFormData((prev) => ({
                      ...prev,
                      employeeId: "",
                      bonusAmount: "",
                      reason: "",
                    }));
                  }}
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
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-30 z-50">
          <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Confirm Transfer</h2>
            <p className="mb-6">
              Are you sure you want to transfer ₦
              {confirmData.amount.toLocaleString()} to{" "}
              {confirmData.employeeName}'s account ({confirmData.bankAccount},{" "}
              {confirmData.bankCode})
              {confirmData.type === "payroll"
                ? ` for ${confirmData.month}?`
                : ` for reason: ${confirmData.reason}?`}
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

      {/* Success Modal */}
      {isSuccessModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-30 z-50">
          <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4 text-green-600">
              Success
            </h2>
            <p className="mb-6">{successMessage}</p>
            <div className="flex justify-end">
              <button
                onClick={() => setIsSuccessModalOpen(false)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {isErrorModalOpen && error && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-30 z-50">
          <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4 text-red-600">Error</h2>
            <p className="mb-6">{error}</p>
            <div className="flex justify-end">
              <button
                onClick={() => setIsErrorModalOpen(false)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Payroll;
