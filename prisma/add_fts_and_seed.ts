import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
async function main() {
  await prisma.$executeRawUnsafe(`
  CREATE VIRTUAL TABLE IF NOT EXISTS video_search
  USING FTS5(id, title, author, original_upload_year);
  `);

  const data: {
    author: string;
    id: string;
    original_upload_date: string;
    title: string;
    views: number;
  }[] = [
    {
      title: 'How to be Ninja',
      author: 'nigahiga',
      id: 'JdLCEwEFCMU',
      original_upload_date: '2007-07-25',
      views: 56403917,
    },
    {
      title: 'How to be Gangster',
      author: 'LE SSERAFIM',
      id: 'khFhF64P3VQ',
      original_upload_date: '2007-11-04',
      views: 47628100,
    },
  ];

  for (let i = 0; i < data.length; i++) {
    await prisma.videos.create({
      data: {
        author: data[i].author,
        id: data[i].id,
        original_upload_date: data[i].original_upload_date,
        title: data[i].title,
        views: data[i].views,
        added_on: new Date(),
      },
    });
  }

  const insertIntoSearchQuery = `
  INSERT INTO video_search ( author, id, title, original_upload_year)
    VALUES
    ${data
      .map(e => {
        return `('${e.author.replaceAll("'", "''").replaceAll('"', '""')}', '${
          e.id
        }', '${e.title
          .replaceAll("'", "''")
          .replaceAll('"', '""')}', '${e.original_upload_date.slice(0, 4)}')`;
      })
      .join(',\n')}
  `;
  console.log(insertIntoSearchQuery);

  await prisma.$executeRawUnsafe(insertIntoSearchQuery);
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async e => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

