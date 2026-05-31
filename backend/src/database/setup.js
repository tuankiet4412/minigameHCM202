import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import pool from '../config/db.js';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function setup() {
  try {
    console.log('Running database schema...');
    const schemaPath = path.join(__dirname, '../../../database/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    await pool.query(schema);
    console.log('Schema applied successfully.');

    console.log('Seeding sample data...');
    await seedData();
    console.log('Database setup complete!');
    process.exit(0);
  } catch (err) {
    console.error('Setup failed:', err);
    process.exit(1);
  }
}

async function seedData() {
  // Timeline events
  const timelineEvents = [
    {
      year: 1890,
      title: 'Birth of Ho Chi Minh',
      description: 'Nguyen Sinh Cung was born in Kim Lien village, Nam Dan district, Nghe An province.',
      details: 'Born into a patriotic scholar family, young Nguyen Sinh Cung grew up witnessing French colonial oppression. His father Nguyen Sinh Sac was a Confucian scholar who refused to collaborate with the colonial regime, instilling early patriotic values.',
      image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
      sort_order: 1,
    },
    {
      year: 1911,
      title: 'Left Vietnam to Find a Path for National Salvation',
      description: 'Ho Chi Minh departed from Saigon aboard the ship Amiral Latouche-Tréville, beginning his 30-year journey abroad.',
      details: 'At age 21, using the name Van Ba, he worked as a kitchen helper on a French ship. This departure marked the beginning of his quest to find a way to liberate Vietnam from colonial rule. He would not return until 1941.',
      image_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800',
      sort_order: 2,
    },
    {
      year: 1919,
      title: 'Versailles Peace Conference',
      description: 'Submitted the 8-point petition demanding independence for Vietnam at the Paris Peace Conference.',
      details: 'Under the pseudonym Nguyen Ai Quoc (Nguyen the Patriot), he presented demands for civil rights, freedom of press, assembly, and Vietnamese independence. Though ignored by Western powers, this act brought Vietnam\'s cause to international attention.',
      image_url: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800',
      sort_order: 3,
    },
    {
      year: 1920,
      title: "Read Lenin's Thesis on National and Colonial Questions",
      description: 'A pivotal moment at the Tours Congress of the French Socialist Party where he discovered Lenin\'s thesis.',
      details: 'Reading Lenin\'s work convinced him that national liberation and social liberation were interconnected. He joined the French Communist Party, believing Marxism-Leninism offered the path to both independence and social justice for colonized peoples.',
      image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
      sort_order: 4,
    },
    {
      year: 1925,
      title: 'Founded Vietnam Revolutionary Youth League',
      description: 'Established the Thanh Nien Cach Mang Dong Chi Hoi in Guangzhou, China.',
      details: 'The Revolutionary Youth League trained cadres who would become leaders of the Vietnamese revolution. Publications like "Thanh Nien" (Youth) spread revolutionary ideas among Vietnamese workers and students abroad.',
      image_url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800',
      sort_order: 5,
    },
    {
      year: 1930,
      title: 'Founded Communist Party of Vietnam',
      description: 'Unification of communist organizations into the Communist Party of Vietnam (CPV) in Hong Kong.',
      details: 'At the Hong Kong conference, Ho Chi Minh presided over the merger of three communist groups into a unified party. The founding of the CPV provided the organizational foundation for the Vietnamese revolution that would culminate in independence in 1945.',
      image_url: 'https://images.unsplash.com/photo-1518005020951-eccb994ad75d?w=800',
      sort_order: 6,
    },
  ];

  await pool.query('DELETE FROM timeline_events');
  for (const event of timelineEvents) {
    await pool.query(
      `INSERT INTO timeline_events (year, title, description, details, image_url, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [event.year, event.title, event.description, event.details, event.image_url, event.sort_order]
    );
  }

  // Journey locations
  const locations = [
    { country: 'Vietnam', country_code: 'VN', lat: 16.0544, lng: 108.2022, period: '1890–1911', description: 'Birthplace and early life in Nghe An. Witnessed colonial oppression firsthand before departing in 1911.', image_url: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=600' },
    { country: 'France', country_code: 'FR', lat: 48.8566, lng: 2.3522, period: '1911–1923', description: 'Worked various jobs, studied politics, submitted the 1919 petition at Versailles, and joined the French Communist Party in 1920.', image_url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600' },
    { country: 'England', country_code: 'GB', lat: 51.5074, lng: -0.1278, period: '1913–1914', description: 'Worked as a pastry chef at the Carlton Hotel in London. Observed British colonialism and labor movements.', image_url: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600' },
    { country: 'USA', country_code: 'US', lat: 40.7128, lng: -74.006, period: '1912–1913', description: 'Worked in Harlem, New York. Met African American communities and witnessed racial discrimination parallel to colonial oppression.', image_url: 'https://images.unsplash.com/photo-1496442227894-110d5b1c4b9a?w=600' },
    { country: 'Soviet Union', country_code: 'RU', lat: 55.7558, lng: 37.6173, period: '1923–1924', description: 'Studied at the Communist University of the Toilers of the East in Moscow. Deepened Marxist-Leninist theory and revolutionary strategy.', image_url: 'https://images.unsplash.com/photo-1520106215286-2e6a309a4ad2?w=600' },
    { country: 'China', country_code: 'CN', lat: 23.1291, lng: 113.2644, period: '1924–1930', description: 'Founded the Revolutionary Youth League in Guangzhou. Trained cadres and organized revolutionary activities before founding the CPV in Hong Kong.', image_url: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=600' },
  ];

  await pool.query('DELETE FROM journey_locations');
  let order = 1;
  for (const loc of locations) {
    await pool.query(
      `INSERT INTO journey_locations (country, country_code, latitude, longitude, description, period, image_url, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [loc.country, loc.country_code, loc.lat, loc.lng, loc.description, loc.period, loc.image_url, order++]
    );
  }

  // Articles
  const articles = [
    {
      slug: 'why-socialism',
      title: 'Why Ho Chi Minh Chose Socialism',
      summary: 'Understanding the ideological journey that led Nguyen Ai Quoc to embrace Marxism-Leninism as the path to national liberation.',
      key_points: ['Colonial exploitation required systemic change', 'Lenin\'s thesis linked national and social liberation', 'Socialism promised equality for all classes', 'Experience in France and USSR confirmed the theory'],
      historical_context: 'After decades of seeking help from democratic powers without success, Ho Chi Minh concluded that only a revolutionary transformation of society could achieve true independence.',
      content: 'Ho Chi Minh\'s embrace of socialism was not ideological dogma but a practical conclusion drawn from experience...',
      image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
    },
    {
      slug: 'national-independence-socialism',
      title: 'National Independence and Socialism',
      summary: 'How Ho Chi Minh unified the goals of national liberation with social revolution into a coherent revolutionary strategy.',
      key_points: ['Independence without social justice is incomplete', 'Colonialism and capitalism are interconnected systems', 'The working class leads the national liberation struggle', 'Land reform follows political independence'],
      historical_context: 'Vietnam under French rule suffered both national subjugation and exploitation of workers and peasants, requiring a dual liberation struggle.',
      content: 'For Ho Chi Minh, national independence and socialism were inseparable goals...',
      image_url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800',
    },
    {
      slug: 'role-of-patriotism',
      title: 'The Role of Patriotism',
      summary: 'Patriotism as the emotional and moral foundation of Ho Chi Minh\'s revolutionary commitment.',
      key_points: ['Love of country motivated the 1911 departure', 'Patriotism inspired sacrifice among revolutionaries', 'National culture must be preserved and developed', 'International solidarity complements patriotism'],
      historical_context: 'Growing up in a patriotic scholar family during the height of French colonial rule, young Nguyen Sinh Cung absorbed deep love for Vietnam and hatred of oppression.',
      content: 'Patriotism was the soul of Ho Chi Minh\'s revolution...',
      image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
    },
    {
      slug: 'preparation-cpv',
      title: 'Preparation for the Communist Party of Vietnam',
      summary: 'The organizational work from 1925 to 1930 that laid the foundation for Vietnam\'s revolutionary party.',
      key_points: ['Revolutionary Youth League trained future leaders', 'Three communist groups unified in 1930', 'Hong Kong conference established the CPV', 'Political line combined patriotism with Marxism'],
      historical_context: 'Between founding the Revolutionary Youth League in 1925 and the CPV in 1930, Ho Chi Minh built the organizational infrastructure for revolution.',
      content: 'The founding of the CPV in 1930 was the culmination of nearly two decades of preparation...',
      image_url: 'https://images.unsplash.com/photo-1518005020951-eccb994ad75d?w=800',
    },
  ];

  await pool.query('DELETE FROM articles');
  for (const article of articles) {
    await pool.query(
      `INSERT INTO articles (slug, title, summary, content, key_points, historical_context, image_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [article.slug, article.title, article.summary, article.content,
       JSON.stringify(article.key_points), article.historical_context, article.image_url]
    );
  }

  // Quiz questions
  const questions = [
    { q: 'In what year did Ho Chi Minh leave Vietnam to find a path for national salvation?', opts: ['1905', '1911', '1919', '1920'], ans: 1, exp: 'He departed from Saigon in 1911 aboard a French ship.' },
    { q: 'What pseudonym did Ho Chi Minh use when submitting the petition at Versailles?', opts: ['Ho Chi Minh', 'Nguyen Tat Thanh', 'Nguyen Ai Quoc', 'Van Ba'], ans: 2, exp: 'Nguyen Ai Quoc means "Nguyen the Patriot."' },
    { q: 'Which work convinced Ho Chi Minh to embrace Marxism-Leninism?', opts: ['The Communist Manifesto', "Lenin's Thesis on National and Colonial Questions", 'Das Kapital', 'State and Revolution'], ans: 1, exp: 'He read this at the 1920 Tours Congress.' },
    { q: 'Where was the Vietnam Revolutionary Youth League founded?', opts: ['Paris', 'Moscow', 'Guangzhou', 'Saigon'], ans: 2, exp: 'Founded in Guangzhou, China in 1925.' },
    { q: 'In what year was the Communist Party of Vietnam founded?', opts: ['1925', '1927', '1930', '1945'], ans: 2, exp: 'The CPV was founded in Hong Kong in 1930.' },
    { q: 'What was Ho Chi Minh\'s birth name?', opts: ['Nguyen Ai Quoc', 'Nguyen Sinh Cung', 'Nguyen Tat Thanh', 'Ho Chi Minh'], ans: 1, exp: 'Born as Nguyen Sinh Cung in 1890.' },
    { q: 'Which country did Ho Chi Minh NOT visit during his journey?', opts: ['France', 'England', 'Japan', 'USA'], ans: 2, exp: 'He traveled to France, England, USA, USSR, and China.' },
    { q: 'What was the main demand of the 1919 Versailles petition?', opts: ['Trade rights', 'Vietnamese independence', 'Colonial reforms', 'Military alliance'], ans: 1, exp: 'The petition demanded independence and civil rights for Vietnam.' },
    { q: 'Ho Chi Minh joined which political party in 1920?', opts: ['French Socialist Party', 'French Communist Party', 'Vietnamese Nationalist Party', 'Labour Party'], ans: 1, exp: 'He joined after the Tours Congress split the Socialist Party.' },
    { q: 'What motivated Ho Chi Minh\'s 1911 departure from Vietnam?', opts: ['Education abroad', 'Finding a path for national salvation', 'Family business', 'Religious pilgrimage'], ans: 1, exp: 'He left specifically to find how to liberate his homeland.' },
    { q: 'The Revolutionary Youth League published which newspaper?', opts: ['Nhan Dan', 'Thanh Nien', 'Lao Dong', 'Quan Doi Nhan Dan'], ans: 1, exp: '"Thanh Nien" means "Youth."' },
    { q: 'Ho Chi Minh studied at which university in Moscow?', opts: ['Moscow State University', 'Communist University of the Toilers of the East', 'Leningrad University', 'Patrice Lumumba University'], ans: 1, exp: 'He studied there in 1923-1924.' },
    { q: 'In which province was Bình Khê District, where Nguyễn Sinh Sắc (Hồ Chí Minh\'s father) served as district chief?', opts: ['Quảng Nam', 'Quảng Ngãi', 'Bình Định', 'Phan Thiết'], ans: 2, exp: 'Nguyễn Sinh Sắc served as district chief of Bình Khê in Bình Định province.' },
    { q: 'Hồ Chí Minh\'s mother was Hoàng Thị Loan. How many children did she have?', opts: ['One', 'Two', 'Three', 'Four'], ans: 2, exp: 'Hoàng Thị Loan had three children, including Nguyễn Sinh Cung (Hồ Chí Minh).' },
    { q: 'In which year did Nguyễn Ái Quốc join the French Socialist Party?', opts: ['1917', '1918', '1919', '1920'], ans: 2, exp: 'Nguyễn Ái Quốc joined the French Socialist Party in early 1919.' },
    { q: 'When did Nguyễn Ái Quốc submit the "Claims of the Annamese People" to the Versailles Conference?', opts: ['18/6/1917', '18/6/1918', '18/6/1919', '18/6/1920'], ans: 2, exp: 'The petition was submitted on 18 June 1919 at the Versailles Peace Conference.' },
    { q: 'In which year did Nguyễn Sinh Cung change his name to Nguyễn Tất Thành?', opts: ['1901', '1905', '1911', '1917'], ans: 0, exp: 'Nguyễn Sinh Cung adopted the name Nguyễn Tất Thành in 1901.' },
    { q: 'When did Nguyễn Tất Thành adopt the name Nguyễn Ái Quốc?', opts: ['When he left Nhà Rồng Wharf in 1911', 'At the Versailles Conference in 1919', 'When he co-founded the French Communist Party in 1920', 'When he went to the Soviet Union in 1923'], ans: 1, exp: 'He first used the name Nguyễn Ái Quốc when submitting the petition at Versailles in 1919.' },
    { q: 'When and where did Nguyễn Ái Quốc establish the Vietnamese Revolutionary Youth League?', opts: ['June 1924, Hong Kong', 'June 1925, Guangzhou, China', 'June 1926, Shanghai, China', 'June 1927, Cao Bằng, Vietnam'], ans: 1, exp: 'The Revolutionary Youth League was founded in June 1925 in Guangzhou, China.' },
    { q: 'The metaphor of capitalism as "a leech with two suckers" was taken from which work?', opts: ['The Bamboo Dragon', 'The French Colonial Regime on Trial', 'Lenin and the Eastern Peoples', 'Revolutionary Path'], ans: 1, exp: 'This metaphor appears in "The French Colonial Regime on Trial."' },
    { q: 'Chế Lan Viên wrote: "The first moment of crying was the moment Uncle Hồ smiled." What does this refer to?', opts: ['Hồ Chí Minh leaving to find a way to save the nation', 'Hồ Chí Minh reading the Declaration of Independence', 'Hồ Chí Minh reading Lenin\'s Thesis on National and Colonial Questions', 'Hồ Chí Minh presenting the petition at Versailles'], ans: 2, exp: 'The poem refers to the moment Hồ Chí Minh read Lenin\'s Thesis on National and Colonial Questions in July 1920.' },
    { q: 'Which event marked Nguyễn Ái Quốc\'s initial discovery of the correct path for national liberation?', opts: ['Submitting the petition at Versailles', 'Co-founding the French Communist Party', 'Reading Lenin\'s Thesis on National and Colonial Questions (July 1920)', 'Founding the Revolutionary Youth League'], ans: 2, exp: 'Reading Lenin\'s thesis in July 1920 showed him the correct revolutionary path for Vietnam.' },
    { q: 'Which quotation is correctly written in Hồ Chí Minh\'s Testament?', opts: ['First sentence only', 'Second sentence only', 'Combination of both sentences', 'Incomplete quotation'], ans: 2, exp: 'The Testament correctly combines both sentences of the quotation about the Party needing ideology as its foundation.' },
    { q: 'What is the achievement of 55 years implementing the Testament?', opts: ['Liberation of the South and national reunification', 'Pursuing renewal and prosperity', 'Building a strong Party', 'All of the above'], ans: 3, exp: '55 years of implementing the Testament achieved reunification, renewal, prosperity, and a strong Party.' },
    { q: 'What was Hồ Chí Minh\'s final wish?', opts: ['To build a peaceful, unified, independent, democratic, and prosperous Vietnam and contribute to world revolution', 'Peaceful and independent Vietnam', 'Contributing to world revolution', 'A strong and prosperous Vietnam'], ans: 0, exp: 'His final wish encompassed building a peaceful, unified, independent, democratic, prosperous Vietnam and contributing to world revolution.' },
    { q: 'Why is Nguyễn Ái Quốc considered to have directly prepared the political, ideological, and organizational foundations for the Communist Party of Vietnam?', opts: ['He found the correct revolutionary path for Vietnam—the proletarian revolution', 'Presented views at the Fifth Comintern Congress', 'Introduced Marxism-Leninism to Vietnam', 'Understood imperialism through overseas experiences'], ans: 0, exp: 'He prepared the CPV\'s foundations by finding the correct proletarian revolutionary path for Vietnam.' },
    { q: 'Where did Nguyễn Ái Quốc present his views on the strategic position of colonial revolutions?', opts: ['International Peasants\' Conference', 'Fifth Congress of the Communist International (1924)', 'Tours Congress', 'International Peasants\' Congress 1923'], ans: 1, exp: 'He presented his views on colonial revolutions at the Fifth Comintern Congress in 1924.' },
    { q: 'Which event did Nguyễn Ái Quốc describe as "a little swallow heralding spring"?', opts: ['October Revolution', 'Formation of the French Communist Party', 'Phạm Hồng Thái\'s assassination attempt on Governor-General Merlin', 'Founding of the Revolutionary Youth League'], ans: 2, exp: 'He described Phạm Hồng Thái\'s 1924 assassination attempt on Governor-General Merlin as "a little swallow heralding spring."' },
    { q: 'In which year was Hồ Chí Minh\'s Testament published?', opts: ['1967', '1968', '1969', '1965'], ans: 2, exp: 'Hồ Chí Minh\'s Testament was published in 1969, after his passing.' },
    { q: 'After victory against the U.S., Hồ Chí Minh wished to travel throughout North and South Vietnam to:', opts: ['Congratulate the people and soldiers', 'Visit the elderly, youth, and children', 'Thank socialist and friendly countries', 'All of the above'], ans: 3, exp: 'He wished to congratulate people and soldiers, visit all generations, and thank socialist and friendly countries.' },
    { q: 'Regarding unity, Party members should:', opts: ['Preserve Party unity as the apple of their eye', 'Strengthen solidarity and comradeship', 'Both A and B', 'Neither A nor B'], ans: 2, exp: 'Party members must both preserve unity as the apple of their eye and strengthen solidarity and comradeship.' },
    { q: 'In the Testament, who does "them" refer to in the phrase "train them into successors who are both red and expert"?', opts: ['Women\'s Union members', 'Civil servants', 'Youth Union members', 'Veterans Association members'], ans: 2, exp: '"Them" refers to Youth Union members whom the Party must train as red and expert successors.' },
    { q: 'The statement about developing the economy and culture to improve people\'s lives concerns:', opts: ['Working people', 'Armed forces', 'Working class', 'Public employees'], ans: 0, exp: 'The Testament emphasizes developing economy and culture to improve the lives of working people.' },
    { q: 'Hồ Chí Minh\'s Testament first addresses:', opts: ['Party building and rectification', 'Economic and cultural development', 'Youth affairs', 'National defense and security'], ans: 0, exp: 'The Testament opens with instructions on Party building and rectification.' },
    { q: 'The significance of Hồ Chí Minh\'s Testament is:', opts: ['An invaluable historical document', 'His heartfelt instructions and trust', 'A program of action for the nation', 'All of the above'], ans: 3, exp: 'The Testament is a historical document, heartfelt instructions, and a national program of action.' },
    { q: 'When did Hồ Chí Minh begin writing his Testament?', opts: ['15/5/1965', '15/5/1966', '19/5/1965', '19/5/1966'], ans: 2, exp: 'Hồ Chí Minh began writing his Testament on 19 May 1965.' },
    { q: 'At Pác Bó, which book did Hồ Chí Minh translate into Vietnamese for cadre training?', opts: ['History of the French Communist Party', 'History of the Russian Communist Party', 'History of the Cuban Communist Party', 'History of the Chinese Communist Party'], ans: 1, exp: 'At Pác Bó he translated the History of the Russian Communist Party for cadre training.' },
    { q: 'Upon returning to Cao Bằng, which alias did Nguyễn Ái Quốc use?', opts: ['Ông Ké', 'Già Thu', 'Lin', 'Vương'], ans: 0, exp: 'When returning to Cao Bằng, Nguyễn Ái Quốc used the alias Ông Ké.' },
    { q: 'Marx Mountain and Lenin Stream are located in:', opts: ['Hà Quảng, Cao Bằng', 'Hà Giang, Cao Bằng', 'Hà Quảng, Tuyên Quang', 'Hà Quảng, Lạng Sơn'], ans: 0, exp: 'Marx Mountain (Núi Marx) and Lenin Stream (Suối Lenin) are in Hà Quảng, Cao Bằng.' },
    { q: 'When was the Việt Minh (League for the Independence of Vietnam) established?', opts: ['19/5/1940', '15/5/1941', '19/5/1941', '15/5/1940'], ans: 2, exp: 'The Việt Minh was established on 19 May 1941.' },
    { q: 'What is the most valuable traditional value inherited and developed by Hồ Chí Minh?', opts: ['Compassion', 'Patriotism', 'Love of learning', 'Diligence'], ans: 1, exp: 'Patriotism is the most valuable traditional value that Hồ Chí Minh inherited and developed.' },
    { q: 'When did the Communist Party officially adopt the term "Hồ Chí Minh Thought"?', opts: ['1969', '1986', '1990', '1991'], ans: 3, exp: 'The Party officially adopted "Hồ Chí Minh Thought" at the 7th National Congress in 1991.' },
    { q: 'Hồ Chí Minh Thought was formed from:', opts: ['Vietnamese traditional values', 'Human cultural achievements, including Marxism-Leninism', 'Hồ Chí Minh\'s personal qualities', 'All of the above'], ans: 3, exp: 'Hồ Chí Minh Thought combines Vietnamese traditions, human cultural achievements, and his personal qualities.' },
    { q: 'When did Hồ Chí Minh begin writing his historic Testament?', opts: ['1960', '1965', '1968', '1969'], ans: 1, exp: 'Hồ Chí Minh began writing his historic Testament in 1965.' },
    { q: 'At which National Congress did the Party first state that Marxism-Leninism and Hồ Chí Minh Thought are its ideological foundation?', opts: ['5th Congress', '6th Congress', '7th Congress', '8th Congress'], ans: 2, exp: 'The 7th National Congress (1991) first stated Marxism-Leninism and Hồ Chí Minh Thought as the ideological foundation.' },
    { q: 'The quote about the Party needing ideology as its foundation comes from:', opts: ['Declaration of Independence', 'Revolutionary Path (Đường Kách Mệnh)', 'Brief Party Statutes', 'Political Knowledge'], ans: 1, exp: 'This quote comes from Revolutionary Path (Đường Kách Mệnh).' },
    { q: 'When did Nguyễn Tất Thành join the French Socialist Party?', opts: ['Early 1917', 'Early 1918', 'Early 1919', 'Early 1920'], ans: 2, exp: 'Nguyễn Tất Thành joined the French Socialist Party in early 1919.' },
    { q: 'According to Hồ Chí Minh, what is the greatest merit of Confucianism?', opts: ['The spirit of learning', 'Governing society through morality', 'Personal moral cultivation', 'Respect for culture and rituals'], ans: 0, exp: 'Hồ Chí Minh considered the spirit of learning the greatest merit of Confucianism.' },
    { q: 'Which event marked the appearance of the name Nguyễn Ái Quốc on the international stage?', opts: ['Submission of the Claims of the Annamese People at Versailles (18/6/1919)', 'Co-founding the French Communist Party', 'Writing Revolutionary Path', 'Participating in the Tours Congress'], ans: 0, exp: 'The name Nguyễn Ái Quốc first appeared internationally with the Versailles petition on 18/6/1919.' },
    { q: 'The statement about only two kinds of people—exploiters and the exploited—was realized during:', opts: ['1911–1915', '1911–1917', '1911–1919', '1911–1920'], ans: 2, exp: 'Through his experiences from 1911 to 1919, he realized society consists of exploiters and the exploited.' },
    { q: 'The conclusion that "there is no other path to save the nation except the proletarian revolution" was drawn from:', opts: ['The workers\' movement, patriotic movement, and Marxism-Leninism', 'Patriotism, unity, and Marxism-Leninism', 'Marxism-Leninism, proletarian movement, and patriotism', 'Marxism-Leninism, patriotism, and leadership line'], ans: 0, exp: 'This conclusion came from the workers\' movement, patriotic movement, and Marxism-Leninism.' },
    { q: 'On what date did Nguyễn Tất Thành arrive at the port of Marseille, France?', opts: ['02/6/1911', '04/9/1911', '06/7/1911'], ans: 1, exp: 'Nguyễn Tất Thành arrived at Marseille on 4 September 1911.' },
  ];

  await pool.query('DELETE FROM quiz_questions');
  for (const q of questions) {
    await pool.query(
      `INSERT INTO quiz_questions (question, options, correct_answer, explanation)
       VALUES ($1, $2, $3, $4)`,
      [q.q, JSON.stringify(q.opts), q.ans, q.exp]
    );
  }

  // Gallery
  const gallery = [
    { title: 'Kim Lien Village', desc: 'Birthplace of Ho Chi Minh in Nghe An', url: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=600', year: 1890 },
    { title: 'Saigon Harbor 1911', desc: 'Departure point for the journey abroad', url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600', year: 1911 },
    { title: 'Paris Peace Conference', desc: 'Versailles 1919 - petition submission', url: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=600', year: 1919 },
    { title: 'Revolutionary Publications', desc: 'Thanh Nien newspaper and revolutionary materials', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600', year: 1925 },
    { title: 'Guangzhou Training', desc: 'Revolutionary Youth League headquarters', url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600', year: 1925 },
    { title: 'Hong Kong Conference 1930', desc: 'Founding of the Communist Party of Vietnam', url: 'https://images.unsplash.com/photo-1518005020951-eccb994ad75d?w=600', year: 1930 },
    { title: 'Colonial Vietnam', desc: 'Life under French colonial rule', url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600', year: 1900 },
    { title: 'Revolutionary Cadres', desc: 'Training the next generation of leaders', url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600', year: 1928 },
  ];

  await pool.query('DELETE FROM gallery_images');
  order = 1;
  for (const img of gallery) {
    await pool.query(
      `INSERT INTO gallery_images (title, description, image_url, year, sort_order)
       VALUES ($1, $2, $3, $4, $5)`,
      [img.title, img.desc, img.url, img.year, order++]
    );
  }
}

setup();
