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
