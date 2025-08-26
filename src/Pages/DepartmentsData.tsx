interface Employee {
  id: number;
  name: string;
  title: string;
  email: string;
}

interface Department {
  id: number;
  name: string;
  employeeCount: number;
  openPositions: number;
  employees: Employee[];
}

// Dummy data for the departments
const departmentsData: Department[] = [
  {
    id: 1,
    name: "Engineering",
    employeeCount: 45,
    openPositions: 8,
    employees: [
      {
        id: 101,
        name: "Alice Johnson",
        title: "Software Engineer",
        email: "alice@example.com",
      },
      {
        id: 102,
        name: "Bob Smith",
        title: "Senior Developer",
        email: "bob@example.com",
      },
      {
        id: 103,
        name: "Charlie Brown",
        title: "QA Engineer",
        email: "charlie@example.com",
      },
      {
        id: 104,
        name: "Diana Prince",
        title: "Frontend Engineer",
        email: "diana@example.com",
      },
      {
        id: 105,
        name: "Ethan Hunt",
        title: "Backend Engineer",
        email: "ethan@example.com",
      },
      {
        id: 106,
        name: "Frank Miller",
        title: "DevOps Engineer",
        email: "frank@example.com",
      },
      {
        id: 107,
        name: "Grace Davis",
        title: "Mobile Developer",
        email: "grace@example.com",
      },
    ],
  },
  {
    id: 2,
    name: "Marketing",
    employeeCount: 22,
    openPositions: 3,
    employees: [
      {
        id: 201,
        name: "Fiona Gale",
        title: "Marketing Manager",
        email: "fiona@example.com",
      },
      {
        id: 202,
        name: "George Costanza",
        title: "Digital Marketer",
        email: "george@example.com",
      },
      {
        id: 203,
        name: "Hannah Montana",
        title: "Content Creator",
        email: "hannah@example.com",
      },
      {
        id: 204,
        name: "Ivan Drago",
        title: "SEO Specialist",
        email: "ivan@example.com",
      },
    ],
  },
  {
    id: 3,
    name: "Human Resources",
    employeeCount: 15,
    openPositions: 1,
    employees: [
      {
        id: 301,
        name: "Jessica Jones",
        title: "HR Manager",
        email: "jessica@example.com",
      },
      {
        id: 302,
        name: "Kevin Hart",
        title: "Recruitment Specialist",
        email: "kevin@example.com",
      },
      {
        id: 303,
        name: "Laura Croft",
        title: "HR Generalist",
        email: "laura@example.com",
      },
    ],
  },
  {
    id: 4,
    name: "Sales",
    employeeCount: 30,
    openPositions: 5,
    employees: [
      {
        id: 401,
        name: "Michael Scott",
        title: "Sales Director",
        email: "michael@example.com",
      },
      {
        id: 402,
        name: "Pam Beesly",
        title: "Sales Representative",
        email: "pam@example.com",
      },
      {
        id: 403,
        name: "Dwight Schrute",
        title: "Regional Manager",
        email: "dwight@example.com",
      },
    ],
  },
];

export default departmentsData;
