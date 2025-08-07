const students = [
  {
    id: 'KC2023001',
    name: 'Aisha Bello',
    faculty: 'Engineering',
    program: 'Computer Engineering',
    year: 1,
    email: 'aisha.bello@kaabo.edu.ng',
    phone: '08123456789',
    status: 'active',
    lastScanned: '2025-07-15T10:25:00Z',
    qrCode: undefined,
    qrStatus: undefined
  },
  {
    id: 'KC2023002',
    name: 'Chukwuemeka Obi',
    faculty: 'Arts',
    program: 'Fine Arts',
    year: 1,
    email: 'chukwu.obi@kaabo.edu.ng',
    phone: '08099887766',
    status: 'suspended',
    qrCode: undefined,
    qrStatus: undefined
  },
  {
    id: 'KC2023003',
    name: 'Fatima Ibrahim',
    faculty: 'Science',
    program: 'Biochemistry',
    year: 2,
    email: 'fatima.ibrahim@kaabo.edu.ng',
    phone: '08111222333',
    status: 'active',
    lastScanned: '2025-07-16T09:15:00Z',
    qrCode: undefined,
    qrStatus: undefined
  },
  {
    id: 'KC2023004',
    name: 'John Doe',
    faculty: 'Engineering',
    program: 'Mechanical Engineering',
    year: 5,
    email: 'john.doe@kaabo.edu.ng',
    phone: '08033445566',
    status: 'graduated',
    qrCode: undefined,
    qrStatus: undefined
  },
  {
    id: 'KC2023005',
    name: 'Ngozi Nwosu',
    faculty: 'Technology',
    program: 'Information Systems',
    year: 1,
    email: 'ngozi.nwosu@kaabo.edu.ng',
    phone: '08155667788',
    status: 'active',
    lastScanned: '2025-07-17T11:05:00Z',
    qrCode: undefined,
    qrStatus: undefined
  },
  {
    id: 'KC2023006',
    name: 'Ibrahim Musa',
    faculty: 'Engineering',
    program: 'Electrical Engineering',
    year: 3,
    email: 'ibrahim.musa@kaabo.edu.ng',
    phone: '08076543210',
    status: 'expelled',
    qrCode: undefined,
    qrStatus: undefined
  },
  {
    id: 'KC2023007',
    name: 'Adaeze Okafor',
    faculty: 'Science',
    program: 'Physics',
    year: 2,
    email: 'ada.okafor@kaabo.edu.ng',
    phone: '08022334455',
    status: 'active',
    qrCode: undefined,
    qrStatus: undefined
  },
  {
    id: 'KC2023008',
    name: 'David Mark',
    faculty: 'Arts',
    program: 'Creative Writing',
    year: 1,
    email: 'david.mark@kaabo.edu.ng',
    phone: '08123445678',
    status: 'withdrawn',
    qrCode: undefined,
    qrStatus: undefined
  }
];



const getInitials = name =>
  name
    .split(' ')
    .map(part => part[0].toUpperCase())
    .join('');


const getTimestamp = () => {
  const now = new Date();
  return now
    .toISOString()
    .replace(/[-:T.Z]/g, '') 
    .slice(0, 8);
};

students.forEach(student => {
  const initials = getInitials(student.name);
  const timestamp = getTimestamp();
  student.qrCode = `QR-${initials}${student.id}${timestamp}`;
  student.qrStatus = (student.year === 1 || student.year === 2) && student.status === 'active';
});

const findStudentById = id => students.find(student => student.id === id);


const updateQRStatus = (id, status) => {
  const student = findStudentById(id);
  if (student) {
    student.qrStatus = status;
  }
};


const activeStudents = students.filter(s => s.qrStatus);
const inactiveStudents = students.filter(s => !s.qrStatus);


const summary = {
  total: students.length,
  active: activeStudents.length,
  inactive: inactiveStudents.length,
  
};


console.table(students);


console.log("Summary Report:");
console.log(`Total students: ${summary.total}`);
console.log(`Active passes: ${summary.active}`);
console.log(`Inactive passes: ${summary.inactive}`);


const simpleTable = {
simplifiedList: students.map(({ id, name, qrStatus }) => ({
    id,
    name,
    qrStatus
  }))
};
console.table(simpleTable.simplifiedList);