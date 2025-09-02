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
    employeeCount: 1,
    openPositions: 0,
    employees: [
      {
        id: 101,
        name: "Tommy Hill",
        title: "Software Engineer",
        email: "tommolaoke@gmail.com",
      },
    ],
  },
  {
    id: 2,
    name: "Finance",
    employeeCount: 1,
    openPositions: 0,
    employees: [
      {
        id: 201,
        name: "Opayinka Ayodeji",
        title: "Accountant",
        email: "opayinkaayodejis@gmail.com",
      },
    ],
  },
];

export default departmentsData;
