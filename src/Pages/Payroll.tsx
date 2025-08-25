
const Payroll = () => {
  return (
    <section className="px-[30px] max-w-[1240px] mx-auto tablet:px-[100px]">
      <h1 className="text-[25px] font-bold mb-[20px] ">Payroll Management</h1>
      <p className="text-gray-700 mb-[25px]">View and manage monthly salary details for employees.</p>
      <div className="rounded-3xl">
      <table>
       <tr className="bg-gray-100">
        <th className="text-left px-4 py-2">Employee</th>
        <th className="text-left px-4 py-2">Position</th>
        <th className="text-right px-4 py-2">Basic Salary (₦)</th>
        <th className="text-right px-4 py-2">Bonus (₦) </th>
        <th className="text-right px-4 py-2">Deduction (₦)</th>
        <th className="">Net Pay (₦)</th>
       </tr>
       
       <tr className="border-b-1 border-black">
        <td className="text-left px-4 py-5">Joy Yakubu </td>
        <td className="text-left px-4 py-5">Software Engineer </td>
        <td className="text-left px-4 py-5">₦1,000,000 </td>
        <td className="text-left px-4 py-5"> <span className="text-green-600">+ ₦100,000</span> </td>
        <td className="text-left px-4 py-5"><span className="text-red-600">- ₦45,000</span> </td>
        <td className="text-left px-4 py-5">₦1,055,000 </td>
        <hr />
       </tr>
       <tr className="border-b-1 border-black">
       <td className="text-left px-4 py-5">Antonia Ijeoma </td>
        <td className="text-left px-4 py-5">Product Manager </td>
        <td className="text-left px-4 py-5">₦900,000 </td>
        <td className="text-left px-4 py-5"><span className="text-green-600">+ ₦70,000</span> </td>
        <td className="text-left px-4 py-5"><span className="text-red-600">- ₦35,000</span> </td>
        <td className="text-left px-4 py-5">₦935,000 </td>
       </tr>

       <tr className="border-b-1 border-black">
       <td className="text-left px-4 py-5">John Wick </td>
        <td className="text-left px-4 py-5">UI/UX Designer </td>
        <td className="text-left px-4 py-5">₦500,000 </td>
        <td className="text-left px-4 py-5"><span className="text-green-600">+ ₦50,000</span> </td>
        <td className="text-left px-4 py-5"><span className="text-red-600">- ₦45,000</span> </td>
        <td className="text-left px-4 py-5">₦505,000 </td>
       </tr>
      </table>
      </div>
      <div className="flex items-center gap-[570px] rounded-[15px] mt-[35px] px-4 py-5 text-left bg-gray-100">
        <h2 className="font-bold">Total Payroll Cost</h2>
        <h2>₦3,495,000</h2>
      </div>
    </section>
  );
};

export default Payroll;
