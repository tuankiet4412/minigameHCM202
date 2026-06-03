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

  // Quiz questions (tiếng Việt)
  const questions = [
    { q: 'Hồ Chí Minh rời Việt Nam tìm đường cứu nước vào năm nào?', opts: ['1905', '1911', '1919', '1920'], ans: 1, exp: 'Người rời Sài Gòn năm 1911 trên con tàu Pháp.' },
    { q: 'Tại Hội nghị Versailles 1919, Người dùng bút danh nào?', opts: ['Hồ Chí Minh', 'Nguyễn Tất Thành', 'Nguyễn Ái Quốc', 'Văn Ba'], ans: 2, exp: 'Nguyễn Ái Quốc nghĩa là «người yêu nước».' },
    { q: 'Tác phẩm nào thuyết phục Người theo chủ nghĩa Mác-Lênin?', opts: ['Tuyên ngôn Đảng Cộng sản', 'Luận cương về vấn đề dân tộc và thuộc địa của Lênin', 'Tư bản luận', 'Nhà nước và cách mạng'], ans: 1, exp: 'Người đọc tại Đại hội Tours năm 1920.' },
    { q: 'Hội Việt Nam Cách mạng Thanh niên được thành lập ở đâu?', opts: ['Paris', 'Moskva', 'Quảng Châu', 'Sài Gòn'], ans: 2, exp: 'Thành lập tại Quảng Châu, Trung Quốc năm 1925.' },
    { q: 'Đảng Cộng sản Việt Nam được thành lập năm nào?', opts: ['1925', '1927', '1930', '1945'], ans: 2, exp: 'Thành lập tại Hồng Kông năm 1930.' },
    { q: 'Tên khai sinh của Hồ Chí Minh là gì?', opts: ['Nguyễn Ái Quốc', 'Nguyễn Sinh Cung', 'Nguyễn Tất Thành', 'Hồ Chí Minh'], ans: 1, exp: 'Sinh năm 1890 với tên Nguyễn Sinh Cung.' },
    { q: 'Trong hành trình, Người KHÔNG đến quốc gia nào?', opts: ['Pháp', 'Anh', 'Nhật Bản', 'Hoa Kỳ'], ans: 2, exp: 'Người đã đi Pháp, Anh, Hoa Kỳ, Liên Xô và Trung Quốc.' },
    { q: 'Yêu sách Versailles 1919 chủ yếu đòi hỏi điều gì?', opts: ['Quyền thương mại', 'Độc lập cho Việt Nam', 'Cải cách thuộc địa', 'Liên minh quân sự'], ans: 1, exp: 'Đòi độc lập và quyền dân sự cho nhân dân Việt Nam.' },
    { q: 'Năm 1920, Người gia nhập đảng nào?', opts: ['Đảng Xã hội Pháp', 'Đảng Cộng sản Pháp', 'Việt Nam Quốc dân Đảng', 'Đảng Lao động'], ans: 1, exp: 'Gia nhập sau khi Đại hội Tours chia tách Đảng Xã hội.' },
    { q: 'Động lực khiến Người ra đi năm 1911 là gì?', opts: ['Đi du học', 'Tìm đường cứu nước', 'Việc kinh doanh gia đình', 'Hành hương tôn giáo'], ans: 1, exp: 'Ra đi để tìm cách giải phóng Tổ quốc.' },
    { q: 'Hội Thanh niên Cách mạng xuất bản báo nào?', opts: ['Nhân Dân', 'Thanh Niên', 'Lao Động', 'Quân đội Nhân dân'], ans: 1, exp: '«Thanh Niên» nghĩa là thanh niên.' },
    { q: 'Người học tại trường nào ở Moskva?', opts: ['Đại học Quốc gia Moskva', 'Đại học Cộng sản phương Đông', 'Đại học Leningrad', 'Đại học Lumumba'], ans: 1, exp: 'Học tại đó năm 1923–1924.' },
    { q: 'Huyện Bình Khê — nơi cha Nguyễn Sinh Sắc làm huyện lệnh — thuộc tỉnh nào?', opts: ['Quảng Nam', 'Quảng Ngãi', 'Bình Định', 'Phan Thiết'], ans: 2, exp: 'Nguyễn Sinh Sắc làm huyện lệnh Bình Khê, tỉnh Bình Định.' },
    { q: 'Mẹ Hoàng Thị Loan có mấy người con?', opts: ['Một', 'Hai', 'Ba', 'Bốn'], ans: 2, exp: 'Bà có ba người con, trong đó có Nguyễn Sinh Cung (Hồ Chí Minh).' },
    { q: 'Nguyễn Ái Quốc gia nhập Đảng Xã hội Pháp năm nào?', opts: ['1917', '1918', '1919', '1920'], ans: 2, exp: 'Gia nhập đầu năm 1919.' },
    { q: 'Nguyễn Ái Quốc trình «Yêu sách của nhân dân An Nam» tại Versailles ngày nào?', opts: ['18/6/1917', '18/6/1918', '18/6/1919', '18/6/1920'], ans: 2, exp: 'Trình ngày 18 tháng 6 năm 1919 tại Hội nghị Hoà bình Versailles.' },
    { q: 'Nguyễn Sinh Cung đổi tên thành Nguyễn Tất Thành năm nào?', opts: ['1901', '1905', '1911', '1917'], ans: 0, exp: 'Lấy tên Nguyễn Tất Thành năm 1901.' },
    { q: 'Người bắt đầu dùng tên Nguyễn Ái Quốc khi nào?', opts: ['Khi rời bến Nhà Rồng 1911', 'Tại Versailles 1919', 'Khi thành lập Đảng Cộng sản Pháp 1920', 'Khi sang Liên Xô 1923'], ans: 1, exp: 'Lần đầu dùng tên này khi trình yêu sách tại Versailles năm 1919.' },
    { q: 'Nguyễn Ái Quốc thành lập Hội Việt Nam Cách mạng Thanh niên khi nào, ở đâu?', opts: ['Tháng 6/1924, Hồng Kông', 'Tháng 6/1925, Quảng Châu', 'Tháng 6/1926, Thượng Hải', 'Tháng 6/1927, Cao Bằng'], ans: 1, exp: 'Thành lập tháng 6/1925 tại Quảng Châu, Trung Quốc.' },
    { q: 'Ẩn dụ «con đỉa hai đầu hút» lấy từ tác phẩm nào?', opts: ['Con Rồng tre', 'Chế độ thực dân Pháp nướng đối xử', 'Lênin và các dân tộc phương Đông', 'Đường Kách mệnh'], ans: 1, exp: 'Ẩn dụ có trong «Chế độ thực dân Pháp nướng đối xử».' },
    { q: '«Tiếng khóc đầu tiên là lúc Bác cười» (Chế Lan Viên) ám chỉ điều gì?', opts: ['Bác ra đi tìm đường cứu nước', 'Bác đọc Tuyên ngôn Độc lập', 'Bác đọc Luận cương Lênin', 'Bác trình yêu sách Versailles'], ans: 2, exp: 'Ám chỉ lúc Bác đọc Luận cương Lênin tháng 7/1920.' },
    { q: 'Sự kiện nào đánh dấu Người tìm được con đường cứu nước đúng đắn?', opts: ['Trình yêu sách Versailles', 'Đồng sáng lập Đảng Cộng sản Pháp', 'Đọc Luận cương Lênin (7/1920)', 'Thành lập Hội Thanh niên'], ans: 2, exp: 'Đọc luận cương Lênin tháng 7/1920 mở ra con đường cách mạng đúng cho Việt Nam.' },
    { q: 'Trích dẫn nào được viết đúng trong Di chúc của Bác?', opts: ['Chỉ câu thứ nhất', 'Chỉ câu thứ hai', 'Kết hợp cả hai câu', 'Trích dẫn không đầy đủ'], ans: 2, exp: 'Di chúc kết hợp đúng cả hai câu về Đảng cần có lí luận làm nền tảng.' },
    { q: 'Thành tựu 55 năm thực hiện Di chúc là gì?', opts: ['Giải phóng miền Nam, thống nhất đất nước', 'Đổi mới và phồn vinh', 'Xây dựng Đảng vững mạnh', 'Tất cả các ý trên'], ans: 3, exp: 'Đạt thống nhất, đổi mới, phồn vinh và Đảng vững mạnh.' },
    { q: 'Nguyện vọng cuối cùng của Hồ Chí Minh là gì?', opts: ['Xây dựng VN hoà bình, thống nhất, độc lập, dân chủ, giàu mạnh và góp phần cách mạng thế giới', 'VN hoà bình, độc lập', 'Góp phần cách mạng thế giới', 'VN giàu mạnh'], ans: 0, exp: 'Nguyện vọng bao trùm xây dựng đất nước và đóng góp cho cách mạng thế giới.' },
    { q: 'Vì sao Nguyễn Ái Quốc được coi là chuẩn bị trực tiếp nền tảng cho Đảng?', opts: ['Tìm được con đường cách mạng vô sản đúng cho Việt Nam', 'Trình bày quan điểm tại Đại hội Quốc tế Cộng sản lần 5', 'Đưa Mác-Lênin vào Việt Nam', 'Hiểu đế quốc qua kinh nghiệm ở nước ngoài'], ans: 0, exp: 'Chuẩn bị nền tảng nhờ tìm con đường cách mạng vô sản đúng đắn.' },
    { q: 'Nguyễn Ái Quốc trình bày quan điểm về vị trí chiến lược cách mạng thuộc địa tại đâu?', opts: ['Hội nghị nông dân quốc tế', 'Đại hội Quốc tế Cộng sản lần 5 (1924)', 'Đại hội Tours', 'Hội nghị nông dân 1923'], ans: 1, exp: 'Trình bày tại Đại hội Quốc tế Cộng sản lần 5 năm 1924.' },
    { q: 'Sự kiện nào được Người ví «chim én báo xuân»?', opts: ['Cách mạng tháng Mười', 'Thành lập Đảng Cộng sản Pháp', 'Phạm Hồng Thái ám sát Toàn quyền Merlin', 'Thành lập Hội Thanh niên'], ans: 2, exp: 'Vụ ám sát năm 1924 được ví như «chim én báo xuân».' },
    { q: 'Di chúc của Hồ Chí Minh được công bố năm nào?', opts: ['1967', '1968', '1969', '1965'], ans: 2, exp: 'Công bố năm 1969, sau khi Bác qua đời.' },
    { q: 'Sau thắng lợi chống Mỹ, Bác muốn đi khắp Bắc Nam để:', opts: ['Chúc mừng nhân dân và bộ đội', 'Thăm người già, thanh niên, thiếu nhi', 'Cảm ơn các nước XHCN và bạn bè', 'Tất cả các ý trên'], ans: 3, exp: 'Muốn chúc mừng, thăm mọi thế hệ và cảm ơn các nước bạn.' },
    { q: 'Về đoàn kết, đảng viên cần:', opts: ['Giữ đoàn kết Đảng như con ngươi mắt', 'Tăng cường đoàn kết, anh em', 'Cả hai ý trên', 'Không ý nào'], ans: 2, exp: 'Phải giữ đoàn kết và tăng cường tinh thần anh em.' },
    { q: '«Họ» trong câu «rèn luyện họ thành người kế cận vừa đỏ vừa chuyên» (Di chúc) chỉ ai?', opts: ['Đoàn viên Phụ nữ', 'Công chức', 'Đoàn viên Thanh niên', 'Hội viên Cựu chiến binh'], ans: 2, exp: '«Họ» là đoàn viên Thanh niên cần được rèn luyện.' },
    { q: 'Phát triển kinh tế, văn hoá để cải thiện đời sống nhân dân liên quan đến:', opts: ['Nhân dân lao động', 'Lực lượng vũ trang', 'Giai cấp công nhân', 'Công chức'], ans: 0, exp: 'Di chúc nhấn mạnh cải thiện đời sống nhân dân lao động.' },
    { q: 'Di chúc của Bác mở đầu bằng vấn đề gì?', opts: ['Xây dựng và chỉnh đốn Đảng', 'Phát triển kinh tế, văn hoá', 'Công tác thanh niên', 'Quốc phòng, an ninh'], ans: 0, exp: 'Mở đầu bằng xây dựng và chỉnh đốn Đảng.' },
    { q: 'Ý nghĩa Di chúc của Hồ Chí Minh là:', opts: ['Tài liệu lịch sử quý báu', 'Lời dặn trọn tình, trọn nghĩa', 'Chương trình hành động của dân tộc', 'Tất cả các ý trên'], ans: 3, exp: 'Vừa là tài liệu lịch sử, lời dặn và chương trình hành động.' },
    { q: 'Bác bắt đầu viết Di chúc ngày nào?', opts: ['15/5/1965', '15/5/1966', '19/5/1965', '19/5/1966'], ans: 2, exp: 'Bắt đầu viết ngày 19 tháng 5 năm 1965.' },
    { q: 'Tại Pác Bó, Bác dịch cuốn sách nào sang tiếng Việt để đào tạo cán bộ?', opts: ['Lịch sử Đảng Cộng sản Pháp', 'Lịch sử Đảng Cộng sản Nga', 'Lịch sử Đảng Cộng sản Cuba', 'Lịch sử Đảng Cộng sản Trung Quốc'], ans: 1, exp: 'Dịch «Lịch sử Đảng Cộng sản Nga» phục vụ đào tạo cán bộ.' },
    { q: 'Khi về Cao Bằng, Nguyễn Ái Quốc dùng bí danh gì?', opts: ['Ông Ké', 'Già Thu', 'Lin', 'Vương'], ans: 0, exp: 'Dùng bí danh Ông Ké khi về Cao Bằng.' },
    { q: 'Núi Marx và Suối Lenin nằm ở đâu?', opts: ['Hà Quảng, Cao Bằng', 'Hà Giang, Cao Bằng', 'Hà Quảng, Tuyên Quang', 'Hà Quảng, Lạng Sơn'], ans: 0, exp: 'Nằm tại Hà Quảng, tỉnh Cao Bằng.' },
    { q: 'Mặt trận Việt Minh được thành lập khi nào?', opts: ['19/5/1940', '15/5/1941', '19/5/1941', '15/5/1940'], ans: 2, exp: 'Thành lập ngày 19 tháng 5 năm 1941.' },
    { q: 'Giá trị truyền thống quý báu nhất Hồ Chí Minh kế thừa và phát huy là:', opts: ['Nhân ái', 'Yêu nước', 'Hiếu học', 'Cần cù'], ans: 1, exp: 'Yêu nước là giá trị truyền thống quý báu nhất.' },
    { q: 'Đảng chính thức dùng thuật ngữ «Tư tưởng Hồ Chí Minh» năm nào?', opts: ['1969', '1986', '1990', '1991'], ans: 3, exp: 'Chính thức tại Đại hội VII năm 1991.' },
    { q: 'Tư tưởng Hồ Chí Minh hình thành từ:', opts: ['Giá trị truyền thống Việt Nam', 'Thành tựu văn hoá nhân loại, gồm Mác-Lênin', 'Phẩm chất cá nhân của Bác', 'Tất cả các ý trên'], ans: 3, exp: 'Kết hợp truyền thống dân tộc, văn hoá nhân loại và phẩm chất Bác.' },
    { q: 'Bác bắt đầu viết Di chúc lịch sử vào năm nào?', opts: ['1960', '1965', '1968', '1969'], ans: 1, exp: 'Bắt đầu viết năm 1965.' },
    { q: 'Đại hội nào lần đầu nêu Mác-Lênin và Tư tưởng Hồ Chí Minh là nền tảng tư tưởng?', opts: ['Đại hội V', 'Đại hội VI', 'Đại hội VII', 'Đại hội VIII'], ans: 2, exp: 'Đại hội VII (1991) lần đầu nêu rõ.' },
    { q: 'Câu «Đảng cần có lí luận làm nền tảng» trích từ:', opts: ['Tuyên ngôn Độc lập', 'Đường Kách mệnh', 'Điều lệ tóm tắt', 'Lý luận chính trị'], ans: 1, exp: 'Trích từ «Đường Kách mệnh».' },
    { q: 'Nguyễn Tất Thành gia nhập Đảng Xã hội Pháp khi nào?', opts: ['Đầu 1917', 'Đầu 1918', 'Đầu 1919', 'Đầu 1920'], ans: 2, exp: 'Gia nhập đầu năm 1919.' },
    { q: 'Theo Hồ Chí Minh, đức tính lớn nhất của Nho giáo là:', opts: ['Tinh thần hiếu học', 'Dùng đạo đức trị xã hội', 'Tu dưỡng đạo đức cá nhân', 'Tôn trọng văn hoá, nghi lễ'], ans: 0, exp: 'Bác cho rằng tinh thần hiếu học là đức tính lớn nhất.' },
    { q: 'Sự kiện nào đánh dấu tên Nguyễn Ái Quốc xuất hiện trên trường quốc tế?', opts: ['Trình yêu sách Versailles (18/6/1919)', 'Đồng sáng lập Đảng Cộng sản Pháp', 'Viết Đường Kách mệnh', 'Tham dự Đại hội Tours'], ans: 0, exp: 'Tên xuất hiện quốc tế với yêu sách Versailles 18/6/1919.' },
    { q: 'Nhận thức «chỉ có kẻ bóc lột và người bị bóc lột» hình thành trong giai đoạn:', opts: ['1911–1915', '1911–1917', '1911–1919', '1911–1920'], ans: 2, exp: 'Hình thành qua kinh nghiệm từ 1911 đến 1919.' },
    { q: 'Kết luận «không có con đường nào khác ngoài cách mạng vô sản» rút ra từ:', opts: ['Phong trào công nhân, yêu nước và Mác-Lênin', 'Yêu nước, đoàn kết và Mác-Lênin', 'Mác-Lênin, vô sản và yêu nước', 'Mác-Lênin, yêu nước và đường lối lãnh đạo'], ans: 0, exp: 'Rút ra từ phong trào công nhân, yêu nước và Mác-Lênin.' },
    { q: 'Nguyễn Tất Thành đến cảng Marseille, Pháp ngày nào?', opts: ['02/6/1911', '04/9/1911', '06/7/1911'], ans: 1, exp: 'Đến Marseille ngày 4 tháng 9 năm 1911.' },
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
