import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const main = async () => {
  console.log('Seeder Roles ...');
  await prisma.roles.createMany({
    data: [
      {
        code: 'ADMIN',
        name: 'Administrator',
      },
      {
        code: 'EXECUTIVE',
        name: 'Executive',
      },
      {
        code: 'STAFF',
        name: 'Staff',
      },
      {
        code: 'INTERNSHIP',
        name: 'Internship',
      },
    ],
  });

  console.log('Seeder Positions ...');
  await prisma.positions.createMany({
    data: [
      {
        code: 'FE',
        name: 'Front-End Developer',
      },
      {
        code: 'BE',
        name: 'Back-End Developer',
      },
      {
        code: 'FS',
        name: 'Full-Stack Developer',
      },
      {
        code: 'MOBILE',
        name: 'Mobile Developer',
      },
      {
        code: 'UI/UX',
        name: 'UI/UX Designer',
      },
      {
        code: 'QA',
        name: 'Quality Ansurance Tester',
      },
      {
        code: 'PM',
        name: 'Project Manager',
      },
      {
        code: 'PO',
        name: 'Project Owner',
      },
      {
        code: 'DE',
        name: 'Database Engineer',
      },
      {
        code: 'SA',
        name: 'System Analyst',
      },
    ],
  });
};

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
