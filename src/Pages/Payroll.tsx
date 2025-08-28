import { LuDollarSign } from "react-icons/lu";
const Payroll = () => {
  return (
    <section className="px-4 sm:px-6 lg:px-[100px] max-w-[1240px] mx-auto">
      <div className=" flex mb-4 items-center text-center bg-gradient-to-r from-indigo-800 to bg-indigo-600 text-white text-3xl px-6 py-8 rounded-full w-fit mx-auto">
        <span>
          <LuDollarSign />
        </span>
        <h1>Payroll Management</h1>
      </div>
      <p className="text-gray-700 mb-6 text-sm sm:text-base text-center">
        View and manage monthly salary details for employees.
      </p>

      {/* Table wrapper for responsiveness */}
      <div className="rounded-3xl overflow-x-auto">
        <table className="min-w-[600px] w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-sm sm:text-base">
              <th className="text-left px-3 sm:px-4 py-2">Employee</th>
              <th className="text-left px-3 sm:px-4 py-2">Position</th>
              <th className="text-right px-3 sm:px-4 py-2">Basic Salary (₦)</th>
              <th className="text-right px-3 sm:px-4 py-2">Bonus (₦)</th>
              <th className="text-right px-3 sm:px-4 py-2">Deduction (₦)</th>
              <th className="text-right px-3 sm:px-4 py-2">Net Pay (₦)</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="px-3 sm:px-4 py-3">Joy Yakubu</td>
              <td className="px-3 sm:px-4 py-3">Software Engineer</td>
              <td className="px-3 sm:px-4 py-3 text-right">₦1,000,000</td>
              <td className="px-3 sm:px-4 py-3 text-right text-green-600">
                + ₦100,000
              </td>
              <td className="px-3 sm:px-4 py-3 text-right text-red-600">
                - ₦45,000
              </td>
              <td className="px-3 sm:px-4 py-3 text-right">₦1,055,000</td>
            </tr>
            <tr className="border-b">
              <td className="px-3 sm:px-4 py-3">Antonia Ijeoma</td>
              <td className="px-3 sm:px-4 py-3">Product Manager</td>
              <td className="px-3 sm:px-4 py-3 text-right">₦900,000</td>
              <td className="px-3 sm:px-4 py-3 text-right text-green-600">
                + ₦70,000
              </td>
              <td className="px-3 sm:px-4 py-3 text-right text-red-600">
                - ₦35,000
              </td>
              <td className="px-3 sm:px-4 py-3 text-right">₦935,000</td>
            </tr>
            <tr className="border-b">
              <td className="px-3 sm:px-4 py-3">John Wick</td>
              <td className="px-3 sm:px-4 py-3">UI/UX Designer</td>
              <td className="px-3 sm:px-4 py-3 text-right">₦500,000</td>
              <td className="px-3 sm:px-4 py-3 text-right text-green-600">
                + ₦50,000
              </td>
              <td className="px-3 sm:px-4 py-3 text-right text-red-600">
                - ₦45,000
              </td>
              <td className="px-3 sm:px-4 py-3 text-right">₦505,000</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Total payroll */}
      <div className="flex justify-between items-center rounded-[15px] mt-6 px-4 py-4 text-sm sm:text-base bg-gray-100">
        <h2 className="font-bold">Total Payroll Cost</h2>
        <h2>₦3,495,000</h2>
      </div>
    </section>
  );
};

export default Payroll;
