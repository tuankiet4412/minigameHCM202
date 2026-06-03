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
      title: 'Sinh ra Nguyễn Sinh Cung',
      description: 'Nguyễn Sinh Cung sinh tại làng Kim Liên, huyện Nam Đàn, tỉnh Nghệ An.',
      details: 'Sinh ra trong một gia đình nho giáo yêu nước, chàng thanh niên Nguyễn Sinh Cung lớn lên khi chứng kiến sự áp bức của thực dân Pháp. Cha Người là Nguyễn Sinh Sắc, một nhà nho kiên quyết không hợp tác với chế độ thực dân, đã truyền bá những giá trị yêu nước từ sớm.',
      image_url: '/images/ideology/culture.jpg',
      sort_order: 1,
    },
    {
      year: 1911,
      title: 'Rời Việt Nam tìm đường cứu nước',
      description: 'Hồ Chí Minh rời Sài Gòn trên con tàu Amiral Latouche-Tréville, bắt đầu hành trình 30 năm bôn ba ở nước ngoài.',
      details: 'Ở tuổi 21, với tên gọi Văn Ba, Người làm phụ bếp trên một con tàu của Pháp. Sự ra đi này đánh dấu sự khởi đầu cho công cuộc tìm kiếm con đường giải phóng Việt Nam khỏi ách thống trị của thực dân. Người đã không trở về nước cho đến tận năm 1941.',
      image_url: '/images/ideology/hero-portrait.jpg',
      sort_order: 2,
    },
    {
      year: 1919,
      title: 'Hội nghị Hòa bình Versailles',
      description: 'Trình Bản Yêu sách 8 điểm đòi quyền tự do dân chủ cho nhân dân Việt Nam tại Hội nghị Hòa bình Paris.',
      details: 'Dưới bí danh Nguyễn Ái Quốc, Người đã đưa ra các yêu sách về dân quyền, tự do báo chí, tự do hội họp. Mặc dù bị các cường quốc phương Tây phớt lờ, tiếng vang của bản yêu sách đã thu hút sự chú ý của quốc tế đối với sự nghiệp của Việt Nam.',
      image_url: '/images/ideology/role-of-patriotism.jpg',
      sort_order: 3,
    },
    {
      year: 1920,
      title: "Đọc Luận cương của Lênin về vấn đề dân tộc và thuộc địa",
      description: 'Khoảnh khắc mang tính bước ngoặt tại Đại hội Tours của Đảng Xã hội Pháp, nơi Người tiếp cận được với luận cương của Lênin.',
      details: 'Đọc tác phẩm của Lênin đã chỉ cho Người thấy giải phóng dân tộc và giải phóng xã hội có mối liên hệ chặt chẽ với nhau. Người tham gia sáng lập Đảng Cộng sản Pháp, với niềm tin rằng chủ nghĩa Mác-Lênin chính là con đường đúng đắn.',
      image_url: '/images/ideology/why-socialism.jpg',
      sort_order: 4,
    },
    {
      year: 1925,
      title: 'Thành lập Hội Việt Nam Cách mạng Thanh niên',
      description: 'Thành lập Hội Việt Nam Cách mạng Thanh niên tại Quảng Châu, Trung Quốc.',
      details: 'Hội Việt Nam Cách mạng Thanh niên đã đào tạo những thế hệ cán bộ nòng cốt đầu tiên của cách mạng Việt Nam. Các ấn phẩm như báo "Thanh Niên" đã truyền bá tư tưởng cách mạng vào trong nước.',
      image_url: '/images/ideology/national-independence-socialism.jpg',
      sort_order: 5,
    },
    {
      year: 1930,
      title: 'Thành lập Đảng Cộng sản Việt Nam',
      description: 'Hội nghị hợp nhất các tổ chức cộng sản thành Đảng Cộng sản Việt Nam (ĐCSVN) tại Hồng Kông.',
      details: 'Tại hội nghị Hương Cảng (Hồng Kông), Hồ Chí Minh đã chủ trì việc sáp nhập các nhóm cộng sản thành một đảng duy nhất. Việc thành lập ĐCSVN là bước ngoặt vĩ đại, cung cấp nền tảng tổ chức cho cách mạng Việt Nam đi đến đỉnh cao là Cách mạng tháng Tám 1945.',
      image_url: '/images/ideology/preparation-cpv.jpg',
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
    { country: 'Vietnam', country_code: 'VN', lat: 16.0544, lng: 108.2022, period: '1890–1911', description: 'Nơi sinh và những năm tháng tuổi trẻ tại Nghệ An, Huế, Phan Thiết và Sài Gòn. Tận mắt chứng kiến sự áp bức của thực dân trước khi ra đi năm 1911.', image_url: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=600' },
    { country: 'France', country_code: 'FR', lat: 48.8566, lng: 2.3522, period: '1911–1923', description: 'Làm nhiều công việc khác nhau, hoạt động chính trị, trình bản yêu sách năm 1919 tại Versailles và tham gia sáng lập Đảng Cộng sản Pháp năm 1920.', image_url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600' },
    { country: 'England', country_code: 'GB', lat: 51.5074, lng: -0.1278, period: '1913–1914', description: 'Làm phụ bếp tại Khách sạn Carlton, Luân Đôn. Tìm hiểu thực tiễn phong trào công nhân và sự bóc lột của chủ nghĩa tư bản.', image_url: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600' },
    { country: 'USA', country_code: 'US', lat: 40.7128, lng: -74.006, period: '1912–1913', description: 'Làm việc tại New York và Boston. Quan sát đời sống cộng đồng người da đen và chứng kiến sự phân biệt chủng tộc tàn bạo.', image_url: 'https://images.unsplash.com/photo-1496442227894-110d5b1c4b9a?w=600' },
    { country: 'Soviet Union', country_code: 'RU', lat: 55.7558, lng: 37.6173, period: '1923–1924', description: 'Học tại Trường Đại học Phương Đông ở Moscow. Nghiên cứu sâu sắc chủ nghĩa Mác-Lênin và vạch ra chiến lược cách mạng giải phóng dân tộc.', image_url: 'https://images.unsplash.com/photo-1520106215286-2e6a309a4ad2?w=600' },
    { country: 'China', country_code: 'CN', lat: 23.1291, lng: 113.2644, period: '1924–1930', description: 'Thành lập Hội Việt Nam Cách mạng Thanh niên tại Quảng Châu. Đào tạo cán bộ và chuẩn bị các điều kiện thành lập Đảng Cộng sản Việt Nam tại Hồng Kông.', image_url: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=600' },
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
      title: 'Vì sao Hồ Chí Minh chọn Chủ nghĩa Xã hội',
      summary: 'Tìm hiểu hành trình tư tưởng đưa Nguyễn Ái Quốc đến với Chủ nghĩa Mác-Lênin như là con đường giải phóng dân tộc.',
      key_points: ['Sự bóc lột của thực dân đòi hỏi sự thay đổi mang tính hệ thống', 'Luận cương của Lênin gắn kết giải phóng dân tộc và giải phóng xã hội', 'Chủ nghĩa xã hội hứa hẹn sự bình đẳng cho mọi giai cấp', 'Trải nghiệm ở Pháp và Liên Xô khẳng định lý luận này'],
      historical_context: 'Sau nhiều thập kỷ tìm kiếm sự giúp đỡ từ các cường quốc dân chủ mà không thành công, Hồ Chí Minh kết luận rằng chỉ có một cuộc cách mạng biến đổi xã hội mới có thể đạt được nền độc lập thực sự.',
      content: 'Việc Hồ Chí Minh lựa chọn chủ nghĩa xã hội không phải là giáo điều tư tưởng mà là một kết luận thực tiễn rút ra từ kinh nghiệm...',
      image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
    },
    {
      slug: 'national-independence-socialism',
      title: 'Độc lập Dân tộc và Chủ nghĩa Xã hội',
      summary: 'Cách Hồ Chí Minh thống nhất mục tiêu giải phóng dân tộc với cách mạng xã hội thành một chiến lược cách mạng chặt chẽ.',
      key_points: ['Độc lập mà không có công bằng xã hội là không trọn vẹn', 'Chủ nghĩa thực dân và chủ nghĩa tư bản là những hệ thống gắn kết nhau', 'Giai cấp công nhân lãnh đạo cuộc đấu tranh giải phóng dân tộc', 'Cải cách ruộng đất đi theo sau độc lập chính trị'],
      historical_context: 'Việt Nam dưới thời Pháp thuộc phải chịu đựng cả sự khuất phục về mặt quốc gia và sự bóc lột công nhân, nông dân, đòi hỏi một cuộc đấu tranh giải phóng kép.',
      content: 'Đối với Hồ Chí Minh, độc lập dân tộc và chủ nghĩa xã hội là hai mục tiêu không thể tách rời...',
      image_url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800',
    },
    {
      slug: 'role-of-patriotism',
      title: 'Vai trò của Chủ nghĩa Yêu nước',
      summary: 'Chủ nghĩa yêu nước là nền tảng tình cảm và đạo đức cho cam kết cách mạng của Hồ Chí Minh.',
      key_points: ['Lòng yêu nước thôi thúc quyết định ra đi năm 1911', 'Chủ nghĩa yêu nước truyền cảm hứng hy sinh cho những người làm cách mạng', 'Văn hóa dân tộc phải được bảo tồn và phát triển', 'Đoàn kết quốc tế bổ sung cho chủ nghĩa yêu nước'],
      historical_context: 'Lớn lên trong một gia đình nho giáo yêu nước giữa lúc thực dân Pháp cai trị khốc liệt, chàng thanh niên Nguyễn Sinh Cung đã thấm nhuần tình yêu sâu sắc đối với Việt Nam và lòng căm thù sự áp bức.',
      content: 'Chủ nghĩa yêu nước là linh hồn của cuộc cách mạng của Hồ Chí Minh...',
      image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
    },
    {
      slug: 'preparation-cpv',
      title: 'Chuẩn bị thành lập Đảng Cộng sản Việt Nam',
      summary: 'Công tác tổ chức từ năm 1925 đến 1930 đã đặt nền móng cho đảng cách mạng của Việt Nam.',
      key_points: ['Hội Việt Nam Cách mạng Thanh niên đào tạo các nhà lãnh đạo tương lai', 'Ba nhóm cộng sản hợp nhất vào năm 1930', 'Hội nghị Hồng Kông thành lập ĐCSVN', 'Đường lối chính trị kết hợp chủ nghĩa yêu nước với chủ nghĩa Mác'],
      historical_context: 'Giữa việc thành lập Hội Việt Nam Cách mạng Thanh niên năm 1925 và ĐCSVN năm 1930, Hồ Chí Minh đã xây dựng cơ sở hạ tầng tổ chức cho cách mạng.',
      content: 'Việc thành lập ĐCSVN năm 1930 là đỉnh cao của gần hai thập kỷ chuẩn bị...',
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
    { title: 'Làng Kim Liên', desc: 'Nơi sinh của Hồ Chí Minh tại Nghệ An', url: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=600', year: 1890 },
    { title: 'Bến cảng Sài Gòn 1911', desc: 'Điểm khởi hành cho chuyến đi ra nước ngoài', url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600', year: 1911 },
    { title: 'Hội nghị Hòa bình Paris', desc: 'Versailles 1919 - Đệ trình bản yêu sách', url: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=600', year: 1919 },
    { title: 'Ấn phẩm Cách mạng', desc: 'Báo Thanh Niên và các tài liệu cách mạng', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600', year: 1925 },
    { title: 'Đào tạo tại Quảng Châu', desc: 'Trụ sở Hội Việt Nam Cách mạng Thanh niên', url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600', year: 1925 },
    { title: 'Hội nghị Hồng Kông 1930', desc: 'Thành lập Đảng Cộng sản Việt Nam', url: 'https://images.unsplash.com/photo-1518005020951-eccb994ad75d?w=600', year: 1930 },
    { title: 'Việt Nam thời thuộc địa', desc: 'Cuộc sống dưới ách cai trị của thực dân Pháp', url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600', year: 1900 },
    { title: 'Cán bộ Cách mạng', desc: 'Đào tạo thế hệ lãnh đạo tiếp theo', url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600', year: 1928 },
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
