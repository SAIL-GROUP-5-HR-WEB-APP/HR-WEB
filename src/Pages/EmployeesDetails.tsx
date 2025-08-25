import { useParams, Link } from "react-router-dom";
import { LuArrowLeft, LuMail, LuUser } from "react-icons/lu";

// Dummy data (can be imported from the DepartmentsDashboard file or a central data source)
const departmentsData = [
  {
    id: 1,
    name: "Engineering",
    employees: [
      { id: 101, name: "Alice Johnson", title: "Software Engineer", email: "alice@example.com" },
      { id: 102, name: "Bob Smith", title: "Senior Developer", email: "bob@example.com" },
      { id: 103, name: "Charlie Brown", title: "QA Engineer", email: "charlie@example.com" },
      { id: 104, name: "Diana Prince", title: "Frontend Engineer", email: "diana@example.com" },
      { id: 105, name: "Ethan Hunt", title: "Backend Engineer", email: "ethan@example.com" },
    ],
  },
  {
    id: 2,
    name: "Marketing",
    employees: [
      { id: 201, name: "Fiona Gale", title: "Marketing Manager", email: "fiona@example.com" },
      { id: 202, name: "George Costanza", title: "Digital Marketer", email: "george@example.com" },
      { id: 203, name: "Hannah Montana", title: "Content Creator", email: "hannah@example.com" },
      { id: 204, name: "Ivan Drago", title: "SEO Specialist", email: "ivan@example.com" },
    ],
  },
  {
    id: 3,
    name: "Human Resources",
    employees: [
      { id: 301, name: "Jessica Jones", title: "HR Manager", email: "jessica@example.com" },
      { id: 302, name: "Kevin Hart", title: "Recruitment Specialist", email: "kevin@example.com" },
      { id: 303, name: "Laura Croft", title: "HR Generalist", email: "laura@example.com" },
    ],
  },
  {
    id: 4,
    name: "Sales",
    employees: [
      { id: 401, name: "Michael Scott", title: "Sales Director", email: "michael@example.com" },
      { id: 402, name: "Pam Beesly", title: "Sales Representative", email: "pam@example.com" },
      { id: 403, name: "Dwight Schrute", title: "Regional Manager", email: "dwight@example.com" },
    ],
  },
];

const EmployeesDetails = () => {
  const { departmentId } = useParams();
  const department = departmentsData.find(
    (dept) => dept.id === parseInt(departmentId as string)
  );

  if (!department) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="bg-red-500/10 text-red-400 p-8 rounded-xl border border-red-500/20 text-center">
          <h1 className="text-2xl font-bold mb-4">Department Not Found</h1>
          <p>The department you are looking for does not exist.</p>
          <Link
            to="/departments"
            className="mt-4 inline-flex items-center space-x-2 text-red-500 hover:underline"
          >
            <LuArrowLeft />
            <span>Go back to Departments</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <Link
          to="/departments"
          className="inline-flex items-center space-x-2 text-gray-500 hover:text-gray-700 transition-colors mb-6"
        >
          <LuArrowLeft size={20} />
          <span>Back to Dashboard</span>
        </Link>
        <div className="bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/20 mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-700 text-shadow">
            {department.name} Department
          </h1>
          <p className="text-gray-500 mt-2">
            Details for all employees in the {department.name} department.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {department.employees.map((employee) => (
            <div
              key={employee.id}
              className="p-6 rounded-2xl bg-white/5 border border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(124,58,237,0.5)] transition-all duration-300"
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className="h-12 w-12 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center text-xl font-bold text-white">
                  {employee.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{employee.name}</h3>
                  <p className="text-sm text-white/80">{employee.title}</p>
                </div>
              </div>
              <div className="space-y-2 text-gray-300">
                <p className="flex items-center space-x-2 text-sm">
                  <LuMail size={16} className="text-purple-400" />
                  <span>{employee.email}</span>
                </p>
                <p className="flex items-center space-x-2 text-sm">
                  <LuUser size={16} className="text-purple-400" />
                  <span>ID: {employee.id}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmployeesDetails;