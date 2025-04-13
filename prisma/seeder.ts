import {
  ActivityCategory,
  MemberResponsibility,
  PrismaClient,
  ProjectStatus,
  UserStatus,
} from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Hapus data existing (opsional, uncomment jika diperlukan)
  await prisma.activities.deleteMany();
  await prisma.members.deleteMany();
  await prisma.projects.deleteMany();
  await prisma.employees.deleteMany();
  await prisma.users.deleteMany();
  await prisma.positions.deleteMany();
  await prisma.roles.deleteMany();

  // 1. Seed Roles
  await Promise.all([
    prisma.roles.create({
      data: {
        id: 'role1',
        code: 'ADMIN',
        name: 'Administrator',
        description: 'Manages system',
      },
    }),
    prisma.roles.create({
      data: {
        id: 'role2',
        code: 'STAFF',
        name: 'Staff',
        description: 'Staff Developers',
      },
    }),
    prisma.roles.create({
      data: {
        id: 'role3',
        code: 'PROJECT_MANAGER',
        name: 'Project Manager',
        description: 'Manages projects',
      },
    }),
  ]);

  // 2. Seed Positions
  await Promise.all([
    prisma.positions.create({
      data: {
        id: 'pos1',
        code: 'FE',
        name: 'Front-End Developer',
        description: 'UI development',
      },
    }),
    prisma.positions.create({
      data: {
        id: 'pos2',
        code: 'BE',
        name: 'Back-End Developer',
        description: 'Server-side logic',
      },
    }),
    prisma.positions.create({
      data: {
        id: 'pos3',
        code: 'FS',
        name: 'Full-Stack Developer',
        description: 'End-to-end development',
      },
    }),
    prisma.positions.create({
      data: {
        id: 'pos4',
        code: 'PM',
        name: 'Project Manager',
        description: 'Project oversight',
      },
    }),
    prisma.positions.create({
      data: {
        id: 'pos5',
        code: 'QA',
        name: 'QA Tester',
        description: 'Quality assurance',
      },
    }),
  ]);

  // 3. Seed Users
  await Promise.all([
    prisma.users.create({
      data: {
        id: 'user0',
        role_id: 'role1',
        username: 'administrator',
        password:
          '$2b$10$pe.ZV5IJMLzSu74FX4YRI.l0vwBAJCz01BwE0AgazJTNw/kwG2eou',
        status: UserStatus.ONLINE,
      },
    }),
    prisma.users.create({
      data: {
        id: 'user1',
        role_id: 'role2',
        username: 'user1',
        password:
          '$2b$10$pe.ZV5IJMLzSu74FX4YRI.l0vwBAJCz01BwE0AgazJTNw/kwG2eou',
        status: UserStatus.ONLINE,
      },
    }),
    prisma.users.create({
      data: {
        id: 'user2',
        role_id: 'role2',
        username: 'user2',
        password:
          '$2b$10$pe.ZV5IJMLzSu74FX4YRI.l0vwBAJCz01BwE0AgazJTNw/kwG2eou',
        status: UserStatus.OFFLINE,
      },
    }),
    prisma.users.create({
      data: {
        id: 'user3',
        role_id: 'role2',
        username: 'user3',
        password:
          '$2b$10$pe.ZV5IJMLzSu74FX4YRI.l0vwBAJCz01BwE0AgazJTNw/kwG2eou',
        status: UserStatus.ONLINE,
      },
    }),
    prisma.users.create({
      data: {
        id: 'user4',
        role_id: 'role2',
        username: 'user4',
        password:
          '$2b$10$pe.ZV5IJMLzSu74FX4YRI.l0vwBAJCz01BwE0AgazJTNw/kwG2eou',
        status: UserStatus.AWAY,
      },
    }),
    prisma.users.create({
      data: {
        id: 'user5',
        role_id: 'role2',
        username: 'user5',
        password:
          '$2b$10$pe.ZV5IJMLzSu74FX4YRI.l0vwBAJCz01BwE0AgazJTNw/kwG2eou',
        status: UserStatus.ONLINE,
      },
    }),
    prisma.users.create({
      data: {
        id: 'user6',
        role_id: 'role2',
        username: 'user6',
        password:
          '$2b$10$pe.ZV5IJMLzSu74FX4YRI.l0vwBAJCz01BwE0AgazJTNw/kwG2eou',
        status: UserStatus.OFFLINE,
      },
    }),
    prisma.users.create({
      data: {
        id: 'user7',
        role_id: 'role2',
        username: 'user7',
        password:
          '$2b$10$pe.ZV5IJMLzSu74FX4YRI.l0vwBAJCz01BwE0AgazJTNw/kwG2eou',
        status: UserStatus.ONLINE,
      },
    }),
    prisma.users.create({
      data: {
        id: 'user8',
        role_id: 'role2',
        username: 'user8',
        password:
          '$2b$10$pe.ZV5IJMLzSu74FX4YRI.l0vwBAJCz01BwE0AgazJTNw/kwG2eou',
        status: UserStatus.AWAY,
      },
    }),
    prisma.users.create({
      data: {
        id: 'user9',
        role_id: 'role3',
        username: 'user9',
        password:
          '$2b$10$pe.ZV5IJMLzSu74FX4YRI.l0vwBAJCz01BwE0AgazJTNw/kwG2eou',
        status: UserStatus.ONLINE,
      },
    }),
    prisma.users.create({
      data: {
        id: 'user10',
        role_id: 'role3',
        username: 'user10',
        password:
          '$2b$10$pe.ZV5IJMLzSu74FX4YRI.l0vwBAJCz01BwE0AgazJTNw/kwG2eou',
        status: UserStatus.OFFLINE,
      },
    }),
  ]);

  // 4. Seed Employees
  await Promise.all([
    prisma.employees.create({
      data: {
        id: 'emp1',
        user_id: 'user1',
        position_id: 'pos1',
        code: 'EMP001',
        fullname: 'John Doe',
        email: 'john.doe@company.com',
        phone_number: '+6281234567890',
        address: 'Jakarta',
        is_active: true,
      },
    }),
    prisma.employees.create({
      data: {
        id: 'emp2',
        user_id: 'user2',
        position_id: 'pos2',
        code: 'EMP002',
        fullname: 'Jane Doe',
        email: 'jane.doe@company.com',
        phone_number: '+6280987654321',
        address: 'Bandung',
        is_active: true,
      },
    }),
    prisma.employees.create({
      data: {
        id: 'emp3',
        user_id: 'user3',
        position_id: 'pos3',
        code: 'EMP003',
        fullname: 'Bob Smith',
        email: 'bob.smith@company.com',
        phone_number: '+6281122334455',
        address: 'Surabaya',
        is_active: true,
      },
    }),
    prisma.employees.create({
      data: {
        id: 'emp4',
        user_id: 'user4',
        position_id: 'pos1',
        code: 'EMP004',
        fullname: 'Alice Jones',
        email: 'alice.jones@company.com',
        phone_number: '+6281234432112',
        address: 'Yogyakarta',
        is_active: true,
      },
    }),
    prisma.employees.create({
      data: {
        id: 'emp5',
        user_id: 'user5',
        position_id: 'pos2',
        code: 'EMP005',
        fullname: 'Charlie Brown',
        email: 'charlie.brown@company.com',
        phone_number: '+6281234567891',
        address: 'Jakarta',
        is_active: true,
      },
    }),
    prisma.employees.create({
      data: {
        id: 'emp6',
        user_id: 'user6',
        position_id: 'pos5',
        code: 'EMP006',
        fullname: 'Diana White',
        email: 'diana.white@company.com',
        phone_number: '+6281234567892',
        address: 'Bali',
        is_active: true,
      },
    }),
    prisma.employees.create({
      data: {
        id: 'emp7',
        user_id: 'user7',
        position_id: 'pos1',
        code: 'EMP007',
        fullname: 'Emma Green',
        email: 'emma.green@company.com',
        phone_number: '+6281234567893',
        address: 'Medan',
        is_active: true,
      },
    }),
    prisma.employees.create({
      data: {
        id: 'emp8',
        user_id: 'user8',
        position_id: 'pos2',
        code: 'EMP008',
        fullname: 'Frank Black',
        email: 'frank.black@company.com',
        phone_number: '+6281234567894',
        address: 'Makassar',
        is_active: true,
      },
    }),
    prisma.employees.create({
      data: {
        id: 'emp9',
        user_id: 'user9',
        position_id: 'pos4',
        code: 'EMP009',
        fullname: 'Grace Lee',
        email: 'grace.lee@company.com',
        phone_number: '+6281234567895',
        address: 'Jakarta',
        is_active: true,
      },
    }),
    prisma.employees.create({
      data: {
        id: 'emp10',
        user_id: 'user10',
        position_id: 'pos4',
        code: 'EMP010',
        fullname: 'Henry Kim',
        email: 'henry.kim@company.com',
        phone_number: '+6281234567896',
        address: 'Bandung',
        is_active: true,
      },
    }),
  ]);

  // 5. Seed Projects
  await Promise.all([
    prisma.projects.create({
      data: {
        id: 'proj1',
        code: 'PRJ001',
        name: 'E-Commerce Platform',
        description: 'Online shopping platform',
        start_date: new Date('2023-01-01'),
        end_date: new Date('2023-10-31'),
        status: ProjectStatus.DEVELOPMENT, // Terlambat: end_date < 2024-01-31
      },
    }),
    prisma.projects.create({
      data: {
        id: 'proj2',
        code: 'PRJ002',
        name: 'Internal Dashboard',
        description: 'Dashboard for internal use',
        start_date: new Date('2023-02-01'),
        end_date: new Date('2023-12-31'),
        status: ProjectStatus.TESTING, // Terlambat: end_date < 2024-01-31
      },
    }),
    prisma.projects.create({
      data: {
        id: 'proj3',
        code: 'PRJ003',
        name: 'Mobile Banking App',
        description: 'Banking app for mobile users',
        start_date: new Date('2023-03-01'),
        end_date: new Date('2024-03-31'),
        status: ProjectStatus.DEVELOPMENT,
      },
    }),
    prisma.projects.create({
      data: {
        id: 'proj4',
        code: 'PRJ004',
        name: 'Inventory System',
        description: 'System for inventory management',
        start_date: new Date('2023-04-01'),
        end_date: new Date('2024-02-29'),
        status: ProjectStatus.PLANNING,
      },
    }),
    prisma.projects.create({
      data: {
        id: 'proj5',
        code: 'PRJ005',
        name: 'HR Portal',
        description: 'Portal for HR management',
        start_date: new Date('2023-05-01'),
        end_date: new Date('2024-04-30'),
        status: ProjectStatus.INITIATION,
      },
    }),
  ]);

  // 6. Seed Members
  await Promise.all([
    // John Doe (emp1, Front-End, overwork: proj1, proj2, proj3, proj4)
    prisma.members.create({
      data: {
        id: 'mem1',
        employee_id: 'emp1',
        project_id: 'proj1',
        responsibility: MemberResponsibility.FRONT_END,
        description: 'UI development',
        is_captain: false,
        is_active: true,
      },
    }),
    prisma.members.create({
      data: {
        id: 'mem2',
        employee_id: 'emp1',
        project_id: 'proj2',
        responsibility: MemberResponsibility.FRONT_END,
        description: 'Dashboard UI',
        is_captain: false,
        is_active: true,
      },
    }),
    prisma.members.create({
      data: {
        id: 'mem3',
        employee_id: 'emp1',
        project_id: 'proj3',
        responsibility: MemberResponsibility.FRONT_END,
        description: 'Mobile UI',
        is_captain: false,
        is_active: true,
      },
    }),
    prisma.members.create({
      data: {
        id: 'mem4',
        employee_id: 'emp1',
        project_id: 'proj4',
        responsibility: MemberResponsibility.FRONT_END,
        description: 'Inventory UI',
        is_captain: false,
        is_active: true,
      },
    }),
    // Jane Doe (emp2, Back-End, normal: proj1, proj3)
    prisma.members.create({
      data: {
        id: 'mem5',
        employee_id: 'emp2',
        project_id: 'proj1',
        responsibility: MemberResponsibility.BACK_END,
        description: 'API development',
        is_captain: false,
        is_active: true,
      },
    }),
    prisma.members.create({
      data: {
        id: 'mem6',
        employee_id: 'emp2',
        project_id: 'proj3',
        responsibility: MemberResponsibility.BACK_END,
        description: 'API for mobile',
        is_captain: false,
        is_active: true,
      },
    }),
    // Bob Smith (emp3, Full-Stack, overwork: proj1, proj2, proj3, proj5)
    prisma.members.create({
      data: {
        id: 'mem7',
        employee_id: 'emp3',
        project_id: 'proj1',
        responsibility: MemberResponsibility.FULL_STACK,
        description: 'End-to-end features',
        is_captain: false,
        is_active: true,
      },
    }),
    prisma.members.create({
      data: {
        id: 'mem8',
        employee_id: 'emp3',
        project_id: 'proj2',
        responsibility: MemberResponsibility.FULL_STACK,
        description: 'Dashboard features',
        is_captain: false,
        is_active: true,
      },
    }),
    prisma.members.create({
      data: {
        id: 'mem9',
        employee_id: 'emp3',
        project_id: 'proj3',
        responsibility: MemberResponsibility.FULL_STACK,
        description: 'Mobile features',
        is_captain: false,
        is_active: true,
      },
    }),
    prisma.members.create({
      data: {
        id: 'mem10',
        employee_id: 'emp3',
        project_id: 'proj5',
        responsibility: MemberResponsibility.FULL_STACK,
        description: 'HR portal features',
        is_captain: false,
        is_active: true,
      },
    }),
    // Alice Jones (emp4, Front-End, normal: proj2, proj4)
    prisma.members.create({
      data: {
        id: 'mem11',
        employee_id: 'emp4',
        project_id: 'proj2',
        responsibility: MemberResponsibility.FRONT_END,
        description: 'UI components',
        is_captain: false,
        is_active: true,
      },
    }),
    prisma.members.create({
      data: {
        id: 'mem12',
        employee_id: 'emp4',
        project_id: 'proj4',
        responsibility: MemberResponsibility.FRONT_END,
        description: 'Inventory UI',
        is_captain: false,
        is_active: true,
      },
    }),
    // Charlie Brown (emp5, Back-End, normal: proj2, proj5)
    prisma.members.create({
      data: {
        id: 'mem13',
        employee_id: 'emp5',
        project_id: 'proj2',
        responsibility: MemberResponsibility.BACK_END,
        description: 'API for dashboard',
        is_captain: false,
        is_active: true,
      },
    }),
    prisma.members.create({
      data: {
        id: 'mem14',
        employee_id: 'emp5',
        project_id: 'proj5',
        responsibility: MemberResponsibility.BACK_END,
        description: 'API for HR portal',
        is_captain: false,
        is_active: true,
      },
    }),
    // Diana White (emp6, QA Tester, normal: proj1, proj3)
    prisma.members.create({
      data: {
        id: 'mem15',
        employee_id: 'emp6',
        project_id: 'proj1',
        responsibility: MemberResponsibility.QA_TESTER,
        description: 'Testing e-commerce features',
        is_captain: false,
        is_active: true,
      },
    }),
    prisma.members.create({
      data: {
        id: 'mem16',
        employee_id: 'emp6',
        project_id: 'proj3',
        responsibility: MemberResponsibility.QA_TESTER,
        description: 'Testing mobile app',
        is_captain: false,
        is_active: true,
      },
    }),
    // Emma Green (emp7, Front-End, normal: proj3, proj5)
    prisma.members.create({
      data: {
        id: 'mem17',
        employee_id: 'emp7',
        project_id: 'proj3',
        responsibility: MemberResponsibility.FRONT_END,
        description: 'Mobile UI',
        is_captain: false,
        is_active: true,
      },
    }),
    prisma.members.create({
      data: {
        id: 'mem18',
        employee_id: 'emp7',
        project_id: 'proj5',
        responsibility: MemberResponsibility.FRONT_END,
        description: 'HR portal UI',
        is_captain: false,
        is_active: true,
      },
    }),
    // Frank Black (emp8, Back-End, normal: proj4)
    prisma.members.create({
      data: {
        id: 'mem19',
        employee_id: 'emp8',
        project_id: 'proj4',
        responsibility: MemberResponsibility.BACK_END,
        description: 'Inventory API',
        is_captain: false,
        is_active: true,
      },
    }),
    // Grace Lee (emp9, Project Manager, normal: proj1, proj2)
    prisma.members.create({
      data: {
        id: 'mem20',
        employee_id: 'emp9',
        project_id: 'proj1',
        responsibility: MemberResponsibility.PROJECT_LEAD,
        description: 'Managing e-commerce project',
        is_captain: true,
        is_active: true,
      },
    }),
    prisma.members.create({
      data: {
        id: 'mem21',
        employee_id: 'emp9',
        project_id: 'proj2',
        responsibility: MemberResponsibility.PROJECT_LEAD,
        description: 'Managing dashboard project',
        is_captain: true,
        is_active: true,
      },
    }),
    // Henry Kim (emp10, Project Manager, normal: proj3, proj4, proj5)
    prisma.members.create({
      data: {
        id: 'mem22',
        employee_id: 'emp10',
        project_id: 'proj3',
        responsibility: MemberResponsibility.PROJECT_LEAD,
        description: 'Managing mobile app project',
        is_captain: true,
        is_active: true,
      },
    }),
    prisma.members.create({
      data: {
        id: 'mem23',
        employee_id: 'emp10',
        project_id: 'proj4',
        responsibility: MemberResponsibility.PROJECT_LEAD,
        description: 'Managing inventory project',
        is_captain: true,
        is_active: true,
      },
    }),
    prisma.members.create({
      data: {
        id: 'mem24',
        employee_id: 'emp10',
        project_id: 'proj5',
        responsibility: MemberResponsibility.PROJECT_LEAD,
        description: 'Managing HR portal project',
        is_captain: true,
        is_active: true,
      },
    }),
  ]);

  // 7. Seed Activities
  // Daftar hari libur nasional 2023
  const holidays2023 = [
    '2023-01-01',
    '2023-01-22',
    '2023-01-23',
    '2023-02-18',
    '2023-03-22',
    '2023-03-23',
    '2023-04-07',
    '2023-04-19',
    '2023-04-20',
    '2023-04-21',
    '2023-04-22',
    '2023-04-23',
    '2023-04-24',
    '2023-04-25',
    '2023-05-01',
    '2023-05-18',
    '2023-06-01',
    '2023-06-02',
    '2023-06-29',
    '2023-06-30',
    '2023-07-01',
    '2023-07-02',
    '2023-07-19',
    '2023-08-17',
    '2023-09-28',
    '2023-12-25',
    '2023-12-26',
  ];

  // Fungsi untuk mengecek hari kerja
  function isWorkday(date) {
    const day = date.getDay();
    const dateStr = date.toISOString().split('T')[0];
    return day !== 0 && day !== 6 && !holidays2023.includes(dateStr);
  }

  // Dapatkan semua hari kerja
  function getWorkdays(start, end) {
    const workdays = [];
    const current = new Date(start);
    while (current <= end) {
      if (isWorkday(current)) {
        workdays.push(new Date(current));
      }
      current.setDate(current.getDate() + 1);
    }
    return workdays;
  }

  // Definisikan aktivitas per karyawan berdasarkan member_id
  const activityTemplates = [
    // John Doe (emp1, Front-End, overwork: proj1, proj2, proj3, proj4)
    {
      member_id: 'mem1',
      project: 'proj1',
      category: 'TASK',
      description: 'Developing product listing UI',
      time_spent: 3.5,
      note: 'Implemented responsive product cards',
    },
    {
      member_id: 'mem1',
      project: 'proj1',
      category: 'BUG_FIXING',
      description: 'Fixing UI alignment issues',
      time_spent: 2.0,
      note: 'Resolved CSS conflicts',
    },
    {
      member_id: 'mem2',
      project: 'proj2',
      category: 'TASK',
      description: 'Designing dashboard layout',
      time_spent: 3.0,
      note: 'Created interactive prototypes',
    },
    {
      member_id: 'mem2',
      project: 'proj2',
      category: 'RESEARCH',
      description: 'Evaluating UI frameworks',
      time_spent: 1.5,
      note: 'Recommended Tailwind for scalability',
    },
    {
      member_id: 'mem3',
      project: 'proj3',
      category: 'MEETING_INTERNAL',
      description: 'Sprint planning for mobile UI',
      time_spent: 1.5,
      note: 'Defined UI component priorities',
    },
    {
      member_id: 'mem3',
      project: 'proj3',
      category: 'TASK',
      description: 'Implementing mobile navigation',
      time_spent: 2.5,
      note: 'Added swipe gestures',
    },
    {
      member_id: 'mem4',
      project: 'proj4',
      category: 'TASK',
      description: 'Building inventory UI components',
      time_spent: 3.0,
      note: 'Completed input forms',
    },
    {
      member_id: 'mem4',
      project: 'proj4',
      category: 'CODE_REVIEW',
      description: 'Reviewing front-end code',
      time_spent: 1.0,
      note: 'Suggested refactoring for modularity',
    },

    // Jane Doe (emp2, Back-End, normal: proj1, proj3)
    {
      member_id: 'mem5',
      project: 'proj1',
      category: 'TASK',
      description: 'Implementing product APIs',
      time_spent: 4.0,
      note: 'Completed REST endpoints',
    },
    {
      member_id: 'mem5',
      project: 'proj1',
      category: 'BUG_FIXING',
      description: 'Fixing API authentication',
      time_spent: 2.0,
      note: 'Resolved token expiration issue',
    },
    {
      member_id: 'mem5',
      project: 'proj1',
      category: 'DOCUMENTATION',
      description: 'Writing API documentation',
      time_spent: 1.5,
      note: 'Updated Swagger specs',
    },
    {
      member_id: 'mem6',
      project: 'proj3',
      category: 'TASK',
      description: 'Developing mobile banking APIs',
      time_spent: 3.5,
      note: 'Added payment endpoints',
    },
    {
      member_id: 'mem6',
      project: 'proj3',
      category: 'MEETING_INTERNAL',
      description: 'API design review',
      time_spent: 1.5,
      note: 'Aligned with front-end team',
    },

    // Bob Smith (emp3, Full-Stack, overwork: proj1, proj2, proj3, proj5)
    {
      member_id: 'mem7',
      project: 'proj1',
      category: 'TASK',
      description: 'Integrating front-end and back-end',
      time_spent: 3.5,
      note: 'Completed checkout flow integration',
    },
    {
      member_id: 'mem7',
      project: 'proj1',
      category: 'CODE_REVIEW',
      description: 'Reviewing integration code',
      time_spent: 1.5,
      note: 'Optimized API calls',
    },
    {
      member_id: 'mem8',
      project: 'proj2',
      category: 'TASK',
      description: 'Building dashboard APIs',
      time_spent: 3.0,
      note: 'Implemented data aggregation',
    },
    {
      member_id: 'mem8',
      project: 'proj2',
      category: 'BUG_FIXING',
      description: 'Fixing dashboard data issues',
      time_spent: 2.0,
      note: 'Corrected query logic',
    },
    {
      member_id: 'mem9',
      project: 'proj3',
      category: 'TASK',
      description: 'Developing mobile banking features',
      time_spent: 2.5,
      note: 'Added transaction history',
    },
    {
      member_id: 'mem9',
      project: 'proj3',
      category: 'RESEARCH',
      description: 'Exploring mobile security protocols',
      time_spent: 1.5,
      note: 'Recommended OAuth 2.0',
    },
    {
      member_id: 'mem10',
      project: 'proj5',
      category: 'TASK',
      description: 'Setting up HR portal backend',
      time_spent: 3.0,
      note: 'Configured database schema',
    },
    {
      member_id: 'mem10',
      project: 'proj5',
      category: 'DOCUMENTATION',
      description: 'Documenting HR portal APIs',
      time_spent: 1.5,
      note: 'Drafted endpoint specs',
    },

    // Alice Jones (emp4, Front-End, normal: proj2, proj4)
    {
      member_id: 'mem11',
      project: 'proj2',
      category: 'TASK',
      description: 'Designing dashboard widgets',
      time_spent: 4.0,
      note: 'Completed chart components',
    },
    {
      member_id: 'mem11',
      project: 'proj2',
      category: 'MEETING_INTERNAL',
      description: 'UI design feedback session',
      time_spent: 1.5,
      note: 'Incorporated team suggestions',
    },
    {
      member_id: 'mem12',
      project: 'proj4',
      category: 'TASK',
      description: 'Updating inventory UI',
      time_spent: 3.5,
      note: 'Improved table layout',
    },
    {
      member_id: 'mem12',
      project: 'proj4',
      category: 'BUG_FIXING',
      description: 'Fixing inventory form validation',
      time_spent: 1.5,
      note: 'Resolved input errors',
    },

    // Charlie Brown (emp5, Back-End, normal: proj2, proj5)
    {
      member_id: 'mem13',
      project: 'proj2',
      category: 'TASK',
      description: 'Developing dashboard APIs',
      time_spent: 4.5,
      note: 'Added analytics endpoints',
    },
    {
      member_id: 'mem13',
      project: 'proj2',
      category: 'CODE_REVIEW',
      description: 'Reviewing API code',
      time_spent: 1.5,
      note: 'Suggested performance tweaks',
    },
    {
      member_id: 'mem14',
      project: 'proj5',
      category: 'TASK',
      description: 'Building HR portal APIs',
      time_spent: 3.5,
      note: 'Implemented user endpoints',
    },
    {
      member_id: 'mem14',
      project: 'proj5',
      category: 'BUG_FIXING',
      description: 'Fixing HR portal API errors',
      time_spent: 2.0,
      note: 'Corrected response formats',
    },

    // Diana White (emp6, QA Tester, normal: proj1, proj3)
    {
      member_id: 'mem15',
      project: 'proj1',
      category: 'TASK',
      description: 'Testing e-commerce checkout flow',
      time_spent: 4.0,
      note: 'Identified 3 critical bugs',
    },
    {
      member_id: 'mem15',
      project: 'proj1',
      category: 'DOCUMENTATION',
      description: 'Writing test cases',
      time_spent: 2.0,
      note: 'Added payment scenarios',
    },
    {
      member_id: 'mem16',
      project: 'proj3',
      category: 'TASK',
      description: 'Testing mobile banking features',
      time_spent: 3.5,
      note: 'Reported UI inconsistencies',
    },
    {
      member_id: 'mem16',
      project: 'proj3',
      category: 'MEETING_INTERNAL',
      description: 'Bug triage meeting',
      time_spent: 1.5,
      note: 'Prioritized fixes',
    },

    // Emma Green (emp7, Front-End, normal: proj3, proj5)
    {
      member_id: 'mem17',
      project: 'proj3',
      category: 'TASK',
      description: 'Designing mobile banking UI',
      time_spent: 4.0,
      note: 'Updated transaction screens',
    },
    {
      member_id: 'mem17',
      project: 'proj3',
      category: 'RESEARCH',
      description: 'Exploring mobile UI libraries',
      time_spent: 1.5,
      note: 'Tested React Native components',
    },
    {
      member_id: 'mem18',
      project: 'proj5',
      category: 'TASK',
      description: 'Designing HR portal UI',
      time_spent: 3.5,
      note: 'Created dashboard layout',
    },
    {
      member_id: 'mem18',
      project: 'proj5',
      category: 'MEETING_INTERNAL',
      description: 'UI requirements discussion',
      time_spent: 1.5,
      note: 'Clarified design specs',
    },

    // Frank Black (emp8, Back-End, normal: proj4)
    {
      member_id: 'mem19',
      project: 'proj4',
      category: 'TASK',
      description: 'Developing inventory APIs',
      time_spent: 4.5,
      note: 'Added stock endpoints',
    },
    {
      member_id: 'mem19',
      project: 'proj4',
      category: 'BUG_FIXING',
      description: 'Fixing inventory API performance',
      time_spent: 2.0,
      note: 'Optimized database queries',
    },
    {
      member_id: 'mem19',
      project: 'proj4',
      category: 'DOCUMENTATION',
      description: 'Documenting inventory APIs',
      time_spent: 1.5,
      note: 'Updated API reference',
    },

    // Grace Lee (emp9, Project Manager, normal: proj1, proj2)
    {
      member_id: 'mem20',
      project: 'proj1',
      category: 'MEETING_INTERNAL',
      description: 'Sprint planning for e-commerce',
      time_spent: 2.0,
      note: 'Set sprint deliverables',
    },
    {
      member_id: 'mem20',
      project: 'proj1',
      category: 'DAILY_REPORT',
      description: 'Preparing e-commerce progress report',
      time_spent: 1.5,
      note: 'Shared with stakeholders',
    },
    {
      member_id: 'mem20',
      project: 'proj1',
      category: 'MEETING_EXTERNAL',
      description: 'Client sync for e-commerce',
      time_spent: 2.0,
      note: 'Gathered new requirements',
    },
    {
      member_id: 'mem21',
      project: 'proj2',
      category: 'MEETING_INTERNAL',
      description: 'Dashboard project review',
      time_spent: 2.0,
      note: 'Assessed milestones',
    },
    {
      member_id: 'mem21',
      project: 'proj2',
      category: 'DAILY_REPORT',
      description: 'Compiling dashboard status update',
      time_spent: 1.5,
      note: 'Highlighted risks',
    },

    // Henry Kim (emp10, Project Manager, normal: proj3, proj4, proj5)
    {
      member_id: 'mem22',
      project: 'proj3',
      category: 'MEETING_EXTERNAL',
      description: 'Client meeting for mobile banking',
      time_spent: 2.5,
      note: 'Finalized feature list',
    },
    {
      member_id: 'mem22',
      project: 'proj3',
      category: 'DAILY_REPORT',
      description: 'Updating mobile banking timeline',
      time_spent: 1.5,
      note: 'Adjusted milestones',
    },
    {
      member_id: 'mem23',
      project: 'proj4',
      category: 'MEETING_INTERNAL',
      description: 'Inventory project kickoff',
      time_spent: 2.0,
      note: 'Defined team roles',
    },
    {
      member_id: 'mem23',
      project: 'proj4',
      category: 'DAILY_REPORT',
      description: 'Drafting inventory project plan',
      time_spent: 1.5,
      note: 'Sent for approval',
    },
    {
      member_id: 'mem24',
      project: 'proj5',
      category: 'MEETING_INTERNAL',
      description: 'HR portal scope discussion',
      time_spent: 2.0,
      note: 'Clarified deliverables',
    },
    {
      member_id: 'mem24',
      project: 'proj5',
      category: 'TRAINING',
      description: 'Training team on project tools',
      time_spent: 1.5,
      note: 'Introduced Jira workflows',
    },
  ];

  // Generate activities
  const startDate = new Date('2023-01-02');
  const endDate = new Date('2024-01-31');
  const workdays = getWorkdays(startDate, endDate);
  const activities = [];

  let activityId = 1;
  for (const workday of workdays) {
    const dateStr = workday.toISOString().split('T')[0];
    for (const template of activityTemplates) {
      activities.push({
        id: `act${activityId}`,
        member_id: template.member_id,
        code: `ACT${String(activityId).padStart(3, '0')}`,
        date_at: new Date(dateStr),
        category: template.category as ActivityCategory,
        description: `${template.description} (${template.project}) on ${dateStr}`,
        time_spent: template.time_spent,
        note: template.note,
      });
      activityId++;
    }
  }

  await prisma.activities.createMany({
    data: activities,
  });

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
