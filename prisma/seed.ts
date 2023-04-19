import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const data: {
    added_on: string;
    author: string;
    id: string;
    original_upload_date: string;
    title: string;
    views: number;
  }[] = [
    {
      added_on: '2023-01-01',
      title:
        'Youth With You《青春有你2》初评级舞台纯享：张钰、王清《爱的主打歌》 YuZhang， YvonneWang《Theme Song of Love》',
      author: 'Youth with You',
      id: 'aL9jgZaxMWM',
      original_upload_date: '2020-01-01',
      views: 999999,
    },
    {
      added_on: '2023-01-01',
      title: '[COVER] KIM CHAEWON - First Love (원곡 : Hikaru Utada)',
      author: 'LE SSERAFIM',
      id: 'rboiHxBqdZk',
      original_upload_date: '2020-01-01',
      views: 999999,
    },
    {
      added_on: '2023-01-01',
      title:
        "[입덕직캠] 르세라핌 김채원 직캠 4K 'ANTIFRAGILE' (LE SSERAFIM KIM CHAEWON FanCam) | LE SSERAFIM COMEBACK SHOW",
      author: 'M2',
      id: 'yLupcG_eFag',
      original_upload_date: '2020-01-01',
      views: 999999,
    },
    {
      added_on: '2023-01-01',
      title:
        "[MPD직캠] 에스파 지젤 직캠 4K 'Next Level' (aespa GISELLE FanCam) | @MCOUNTDOWN_2021.6.3",
      author: 'M2',
      id: 'HKCxqzMYhto',
      original_upload_date: '2020-01-01',
      views: 999999,
    },
    {
      added_on: '2023-01-01',
      title: 'When the rune sparkles in September / Eurobeat Remix',
      author: 'Not Deoxide',
      id: '5YLrgUeOhGU',
      original_upload_date: '2020-01-01',
      views: 999999,
    },
    {
      added_on: '2023-01-01',
      title:
        "[MPD직캠] 뉴진스 다니엘 직캠 4K 'Hype Boy' (NewJeans DANIELLE FanCam) | @MCOUNTDOWN_2022.8.4When the rune sparkles in September / Eurobeat Remix",
      author: 'M2',
      id: 'v5UH3wTPbzw',
      original_upload_date: '2020-01-01',
      views: 999999,
    },
  ];

  const insertQuery = `
  INSERT INTO videos (added_on, author, id, original_upload_date, title, views)
     VALUES
     ${data
       .map(e => {
         return `('${e.added_on}', '${e.author
           .replaceAll("'", "''")
           .replaceAll('"', '""')}', '${e.id}', '${
           e.original_upload_date
         }', '${e.title.replaceAll("'", "''").replaceAll('"', '""')}', ${
           e.views
         })`;
       })
       .join(',\n')}
 `;
  console.log(insertQuery);

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

  await prisma.$transaction([
    prisma.$executeRawUnsafe(insertQuery),
    prisma.$executeRawUnsafe(insertIntoSearchQuery),
  ]);
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

