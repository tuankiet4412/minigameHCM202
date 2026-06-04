'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Star, RotateCcw, Volume2, VolumeX, Flag } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

// Lazy-load to avoid SSR issues with Three.js
const VietnamMap3D = dynamic(
  () => import('./VietnamMap3D').then((m) => m.VietnamMap3D),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-full">
        <div className="flex gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    ),
  }
);

// ── Types ─────────────────────────────────────────────────────────────────────
type Question = { question: string; options: string[]; correctIndex: number; explanation: string };
type GamePhase = 'intro' | 'playing' | 'win' | 'lose';

// ── Milestones (with real Vietnamese coordinates & history lessons) ───────────
const MILESTONES = [
  { 
    name: 'Pác Bó', icon: '⛰️', lat: 22.9772, lng: 106.0505, color: '#10b981',
    lessonTitle: 'Hang Pác Bó (Cao Bằng) - Nơi khơi nguồn cách mạng',
    lessonDate: '28/01/1941',
    lessonContent: 'Sau 30 năm bôn ba tìm đường cứu nước, lãnh tụ Nguyễn Ái Quốc (Hồ Chí Minh) đã vượt cột mốc 108 trở về Tổ quốc. Tại hang Pác Bó, Người đã chủ trì Hội nghị Trung ương Đảng lần thứ 8, thành lập Mặt trận Việt Minh, trực tiếp lãnh đạo phong trào cách mạng giải phóng dân tộc.'
  },
  { 
    name: 'Tân Trào', icon: '🌳', lat: 21.7825, lng: 105.5392, color: '#3b82f6',
    lessonTitle: 'Khu di tích Tân Trào (Tuyên Quang) - Thủ đô kháng chiến',
    lessonDate: '16/08/1945',
    lessonContent: 'Diễn ra Quốc dân Đại hội Tân Trào. Đại hội tán thành chủ trương Tổng khởi nghĩa, thông qua 10 chính sách lớn của Việt Minh, cử ra Ủy ban Dân tộc Giải phóng do Hồ Chí Minh làm Chủ tịch. Chiều cùng ngày, Võ Nguyên Giáp đọc Quân lệnh số 1, xuất quân tiến về Hà Nội.'
  },
  { 
    name: 'Hà Nội', icon: '🏛️', lat: 21.0368, lng: 105.8335, color: '#ef4444',
    lessonTitle: 'Quảng trường Ba Đình (Hà Nội) - Khai sinh đất nước',
    lessonDate: '02/09/1945',
    lessonContent: 'Chủ tịch Hồ Chí Minh đọc bản Tuyên ngôn Độc lập, chính thức khai sinh ra nước Việt Nam Dân chủ Cộng hòa, đánh dấu thắng lợi rực rỡ của Cách mạng tháng Tám.'
  },
  { 
    name: 'Bến Hải', icon: '🌉', lat: 17.0016, lng: 107.0545, color: '#f59e0b',
    lessonTitle: 'Cầu Hiền Lương, Sông Bến Hải - Biểu tượng chia cắt',
    lessonDate: '1954 - 1975',
    lessonContent: 'Theo Hiệp định Geneva, vĩ tuyến 17 trở thành ranh giới quân sự tạm thời chia cắt hai miền Nam - Bắc. Trong hơn 20 năm, nơi đây là tuyến đầu của miền Bắc XHCN, biểu tượng của tinh thần đấu tranh và khát vọng thống nhất.'
  },
  { 
    name: 'Trường Sơn', icon: '🛤️', lat: 16.5161, lng: 106.8407, color: '#8b5cf6',
    lessonTitle: 'Tuyến đường Trường Sơn - Huyết mạch chi viện',
    lessonDate: '1959 - 1975',
    lessonContent: 'Đường vận tải chiến lược Trường Sơn chính thức mở ngày 19/5/1959. Đây là mạng lưới giao thông khổng lồ kéo dài dọc dãy Trường Sơn, vận chuyển sức người, vũ khí từ hậu phương miền Bắc chi viện cho tiền tuyến lớn miền Nam.'
  },
  { 
    name: 'B.M Thuột', icon: '⚔️', lat: 12.6667, lng: 108.0383, color: '#ec4899',
    lessonTitle: 'Buôn Ma Thuột (Đắk Lắk) - Đòn điểm huyệt',
    lessonDate: '10/03/1975',
    lessonContent: 'Quân Giải phóng bất ngờ tấn công giải phóng thị xã Buôn Ma Thuột, mở màn Chiến dịch Tây Nguyên. Chiến thắng vang dội này làm rung chuyển hệ thống phòng ngự VNCH, mở đầu cuộc Tổng tiến công mùa Xuân 1975.'
  },
  { 
    name: 'Xuân Lộc', icon: '🛡️', lat: 10.9325, lng: 107.2411, color: '#f97316',
    lessonTitle: 'Thị xã Xuân Lộc (Đồng Nai) - Cánh cửa thép',
    lessonDate: '09/04 - 21/04/1975',
    lessonContent: 'Chiến dịch Xuân Lộc vô cùng ác liệt. Bằng quyết tâm, quân ta đã đập tan phòng tuyến Xuân Lộc – "cánh cửa thép" bảo vệ ngõ phía Đông Sài Gòn, mở toang đường tiến quân cho các cánh quân chủ lực.'
  },
  { 
    name: 'Sài Gòn', icon: '🚩', lat: 10.7770, lng: 106.6953, color: '#C41E3A',
    lessonTitle: 'Dinh Độc Lập (Sài Gòn) - Ngày toàn thắng',
    lessonDate: '30/04/1975',
    lessonContent: 'Đúng 11h30 phút, chiếc xe tăng mang số hiệu 390 của quân Giải phóng đã húc đổ cổng chính, tiến vào sân Dinh Độc Lập. Chiến dịch Hồ Chí Minh toàn thắng, đất nước chính thức thống nhất.'
  },
];

// ── Question bank — 53 câu hỏi từ database (setup.js) ────────────────────────
const ALL_QUESTIONS: Question[] = [
  { question: 'Hồ Chí Minh rời Việt Nam tìm đường cứu nước vào năm nào?', options: ['1905', '1911', '1919', '1920'], correctIndex: 1, explanation: 'Người rời Sài Gòn năm 1911 trên con tàu Pháp.' },
  { question: 'Tại Hội nghị Versailles 1919, Người dùng bút danh nào?', options: ['Hồ Chí Minh', 'Nguyễn Tất Thành', 'Nguyễn Ái Quốc', 'Văn Ba'], correctIndex: 2, explanation: 'Nguyễn Ái Quốc nghĩa là «người yêu nước».' },
  { question: 'Tác phẩm nào thuyết phục Người theo chủ nghĩa Mác-Lênin?', options: ['Tuyên ngôn Đảng Cộng sản', 'Luận cương về vấn đề dân tộc và thuộc địa của Lênin', 'Tư bản luận', 'Nhà nước và cách mạng'], correctIndex: 1, explanation: 'Người đọc tại Đại hội Tours năm 1920.' },
  { question: 'Hội Việt Nam Cách mạng Thanh niên được thành lập ở đâu?', options: ['Paris', 'Moskva', 'Quảng Châu', 'Sài Gòn'], correctIndex: 2, explanation: 'Thành lập tại Quảng Châu, Trung Quốc năm 1925.' },
  { question: 'Đảng Cộng sản Việt Nam được thành lập năm nào?', options: ['1925', '1927', '1930', '1945'], correctIndex: 2, explanation: 'Thành lập tại Hồng Kông năm 1930.' },
  { question: 'Tên khai sinh của Hồ Chí Minh là gì?', options: ['Nguyễn Ái Quốc', 'Nguyễn Sinh Cung', 'Nguyễn Tất Thành', 'Hồ Chí Minh'], correctIndex: 1, explanation: 'Sinh năm 1890 với tên Nguyễn Sinh Cung.' },
  { question: 'Trong hành trình, Người KHÔNG đến quốc gia nào?', options: ['Pháp', 'Anh', 'Nhật Bản', 'Hoa Kỳ'], correctIndex: 2, explanation: 'Người đã đi Pháp, Anh, Hoa Kỳ, Liên Xô và Trung Quốc.' },
  { question: 'Yêu sách Versailles 1919 chủ yếu đòi hỏi điều gì?', options: ['Quyền thương mại', 'Độc lập cho Việt Nam', 'Cải cách thuộc địa', 'Liên minh quân sự'], correctIndex: 1, explanation: 'Đòi độc lập và quyền dân sự cho nhân dân Việt Nam.' },
  { question: 'Năm 1920, Người gia nhập đảng nào?', options: ['Đảng Xã hội Pháp', 'Đảng Cộng sản Pháp', 'Việt Nam Quốc dân Đảng', 'Đảng Lao động'], correctIndex: 1, explanation: 'Gia nhập sau khi Đại hội Tours chia tách Đảng Xã hội.' },
  { question: 'Động lực khiến Người ra đi năm 1911 là gì?', options: ['Đi du học', 'Tìm đường cứu nước', 'Việc kinh doanh gia đình', 'Hành hương tôn giáo'], correctIndex: 1, explanation: 'Ra đi để tìm cách giải phóng Tổ quốc.' },
  { question: 'Hội Thanh niên Cách mạng xuất bản báo nào?', options: ['Nhân Dân', 'Thanh Niên', 'Lao Động', 'Quân đội Nhân dân'], correctIndex: 1, explanation: '«Thanh Niên» nghĩa là thanh niên.' },
  { question: 'Người học tại trường nào ở Moskva?', options: ['Đại học Quốc gia Moskva', 'Đại học Cộng sản phương Đông', 'Đại học Leningrad', 'Đại học Lumumba'], correctIndex: 1, explanation: 'Học tại đó năm 1923–1924.' },
  { question: 'Huyện Bình Khê — nơi cha Nguyễn Sinh Sắc làm huyện lệnh — thuộc tỉnh nào?', options: ['Quảng Nam', 'Quảng Ngãi', 'Bình Định', 'Phan Thiết'], correctIndex: 2, explanation: 'Nguyễn Sinh Sắc làm huyện lệnh Bình Khê, tỉnh Bình Định.' },
  { question: 'Mẹ Hoàng Thị Loan có mấy người con?', options: ['Một', 'Hai', 'Ba', 'Bốn'], correctIndex: 2, explanation: 'Bà có ba người con, trong đó có Nguyễn Sinh Cung (Hồ Chí Minh).' },
  { question: 'Nguyễn Ái Quốc gia nhập Đảng Xã hội Pháp năm nào?', options: ['1917', '1918', '1919', '1920'], correctIndex: 2, explanation: 'Gia nhập đầu năm 1919.' },
  { question: 'Nguyễn Ái Quốc trình «Yêu sách của nhân dân An Nam» tại Versailles ngày nào?', options: ['18/6/1917', '18/6/1918', '18/6/1919', '18/6/1920'], correctIndex: 2, explanation: 'Trình ngày 18 tháng 6 năm 1919 tại Hội nghị Hoà bình Versailles.' },
  { question: 'Nguyễn Sinh Cung đổi tên thành Nguyễn Tất Thành năm nào?', options: ['1901', '1905', '1911', '1917'], correctIndex: 0, explanation: 'Lấy tên Nguyễn Tất Thành năm 1901.' },
  { question: 'Người bắt đầu dùng tên Nguyễn Ái Quốc khi nào?', options: ['Khi rời bến Nhà Rồng 1911', 'Tại Versailles 1919', 'Khi thành lập Đảng Cộng sản Pháp 1920', 'Khi sang Liên Xô 1923'], correctIndex: 1, explanation: 'Lần đầu dùng tên này khi trình yêu sách tại Versailles năm 1919.' },
  { question: 'Nguyễn Ái Quốc thành lập Hội Việt Nam Cách mạng Thanh niên khi nào, ở đâu?', options: ['Tháng 6/1924, Hồng Kông', 'Tháng 6/1925, Quảng Châu', 'Tháng 6/1926, Thượng Hải', 'Tháng 6/1927, Cao Bằng'], correctIndex: 1, explanation: 'Thành lập tháng 6/1925 tại Quảng Châu, Trung Quốc.' },
  { question: 'Ẩn dụ «con đỉa hai đầu hút» lấy từ tác phẩm nào?', options: ['Con Rồng tre', 'Chế độ thực dân Pháp nướng đối xử', 'Lênin và các dân tộc phương Đông', 'Đường Kách mệnh'], correctIndex: 1, explanation: 'Ẩn dụ có trong «Chế độ thực dân Pháp nướng đối xử».' },
  { question: '«Tiếng khóc đầu tiên là lúc Bác cười» (Chế Lan Viên) ám chỉ điều gì?', options: ['Bác ra đi tìm đường cứu nước', 'Bác đọc Tuyên ngôn Độc lập', 'Bác đọc Luận cương Lênin', 'Bác trình yêu sách Versailles'], correctIndex: 2, explanation: 'Ám chỉ lúc Bác đọc Luận cương Lênin tháng 7/1920.' },
  { question: 'Sự kiện nào đánh dấu Người tìm được con đường cứu nước đúng đắn?', options: ['Trình yêu sách Versailles', 'Đồng sáng lập Đảng Cộng sản Pháp', 'Đọc Luận cương Lênin (7/1920)', 'Thành lập Hội Thanh niên'], correctIndex: 2, explanation: 'Đọc luận cương Lênin tháng 7/1920 mở ra con đường cách mạng đúng cho Việt Nam.' },
  { question: 'Thành tựu 55 năm thực hiện Di chúc là gì?', options: ['Giải phóng miền Nam, thống nhất đất nước', 'Đổi mới và phồn vinh', 'Xây dựng Đảng vững mạnh', 'Tất cả các ý trên'], correctIndex: 3, explanation: 'Đạt thống nhất, đổi mới, phồn vinh và Đảng vững mạnh.' },
  { question: 'Nguyện vọng cuối cùng của Hồ Chí Minh là gì?', options: ['Xây dựng VN hoà bình, thống nhất, độc lập, dân chủ, giàu mạnh và góp phần cách mạng thế giới', 'VN hoà bình, độc lập', 'Góp phần cách mạng thế giới', 'VN giàu mạnh'], correctIndex: 0, explanation: 'Nguyện vọng bao trùm xây dựng đất nước và đóng góp cho cách mạng thế giới.' },
  { question: 'Vì sao Nguyễn Ái Quốc được coi là chuẩn bị trực tiếp nền tảng cho Đảng?', options: ['Tìm được con đường cách mạng vô sản đúng cho Việt Nam', 'Trình bày quan điểm tại Đại hội Quốc tế Cộng sản lần 5', 'Đưa Mác-Lênin vào Việt Nam', 'Hiểu đế quốc qua kinh nghiệm ở nước ngoài'], correctIndex: 0, explanation: 'Chuẩn bị nền tảng nhờ tìm con đường cách mạng vô sản đúng đắn.' },
  { question: 'Nguyễn Ái Quốc trình bày quan điểm về vị trí chiến lược cách mạng thuộc địa tại đâu?', options: ['Hội nghị nông dân quốc tế', 'Đại hội Quốc tế Cộng sản lần 5 (1924)', 'Đại hội Tours', 'Hội nghị nông dân 1923'], correctIndex: 1, explanation: 'Trình bày tại Đại hội Quốc tế Cộng sản lần 5 năm 1924.' },
  { question: 'Sự kiện nào được Người ví «chim én báo xuân»?', options: ['Cách mạng tháng Mười', 'Thành lập Đảng Cộng sản Pháp', 'Phạm Hồng Thái ám sát Toàn quyền Merlin', 'Thành lập Hội Thanh niên'], correctIndex: 2, explanation: 'Vụ ám sát năm 1924 được ví như «chim én báo xuân».' },
  { question: 'Di chúc của Hồ Chí Minh được công bố năm nào?', options: ['1967', '1968', '1969', '1965'], correctIndex: 2, explanation: 'Công bố năm 1969, sau khi Bác qua đời.' },
  { question: 'Sau thắng lợi chống Mỹ, Bác muốn đi khắp Bắc Nam để:', options: ['Chúc mừng nhân dân và bộ đội', 'Thăm người già, thanh niên, thiếu nhi', 'Cảm ơn các nước XHCN và bạn bè', 'Tất cả các ý trên'], correctIndex: 3, explanation: 'Muốn chúc mừng, thăm mọi thế hệ và cảm ơn các nước bạn.' },
  { question: 'Về đoàn kết, đảng viên cần:', options: ['Giữ đoàn kết Đảng như con ngươi mắt', 'Tăng cường đoàn kết, anh em', 'Cả hai ý trên', 'Không ý nào'], correctIndex: 2, explanation: 'Phải giữ đoàn kết và tăng cường tinh thần anh em.' },
  { question: '«Họ» trong câu «rèn luyện họ thành người kế cận vừa đỏ vừa chuyên» (Di chúc) chỉ ai?', options: ['Đoàn viên Phụ nữ', 'Công chức', 'Đoàn viên Thanh niên', 'Hội viên Cựu chiến binh'], correctIndex: 2, explanation: '«Họ» là đoàn viên Thanh niên cần được rèn luyện.' },
  { question: 'Phát triển kinh tế, văn hoá để cải thiện đời sống nhân dân liên quan đến:', options: ['Nhân dân lao động', 'Lực lượng vũ trang', 'Giai cấp công nhân', 'Công chức'], correctIndex: 0, explanation: 'Di chúc nhấn mạnh cải thiện đời sống nhân dân lao động.' },
  { question: 'Di chúc của Bác mở đầu bằng vấn đề gì?', options: ['Xây dựng và chỉnh đốn Đảng', 'Phát triển kinh tế, văn hoá', 'Công tác thanh niên', 'Quốc phòng, an ninh'], correctIndex: 0, explanation: 'Mở đầu bằng xây dựng và chỉnh đốn Đảng.' },
  { question: 'Ý nghĩa Di chúc của Hồ Chí Minh là:', options: ['Tài liệu lịch sử quý báu', 'Lời dặn trọn tình, trọn nghĩa', 'Chương trình hành động của dân tộc', 'Tất cả các ý trên'], correctIndex: 3, explanation: 'Vừa là tài liệu lịch sử, lời dặn và chương trình hành động.' },
  { question: 'Bác bắt đầu viết Di chúc ngày nào?', options: ['15/5/1965', '15/5/1966', '19/5/1965', '19/5/1966'], correctIndex: 2, explanation: 'Bắt đầu viết ngày 19 tháng 5 năm 1965.' },
  { question: 'Tại Pác Bó, Bác dịch cuốn sách nào sang tiếng Việt để đào tạo cán bộ?', options: ['Lịch sử Đảng Cộng sản Pháp', 'Lịch sử Đảng Cộng sản Nga', 'Lịch sử Đảng Cộng sản Cuba', 'Lịch sử Đảng Cộng sản Trung Quốc'], correctIndex: 1, explanation: 'Dịch «Lịch sử Đảng Cộng sản Nga» phục vụ đào tạo cán bộ.' },
  { question: 'Khi về Cao Bằng, Nguyễn Ái Quốc dùng bí danh gì?', options: ['Ông Ké', 'Già Thu', 'Lin', 'Vương'], correctIndex: 0, explanation: 'Dùng bí danh Ông Ké khi về Cao Bằng.' },
  { question: 'Núi Marx và Suối Lenin nằm ở đâu?', options: ['Hà Quảng, Cao Bằng', 'Hà Giang, Cao Bằng', 'Hà Quảng, Tuyên Quang', 'Hà Quảng, Lạng Sơn'], correctIndex: 0, explanation: 'Nằm tại Hà Quảng, tỉnh Cao Bằng.' },
  { question: 'Mặt trận Việt Minh được thành lập khi nào?', options: ['19/5/1940', '15/5/1941', '19/5/1941', '15/5/1940'], correctIndex: 2, explanation: 'Thành lập ngày 19 tháng 5 năm 1941.' },
  { question: 'Giá trị truyền thống quý báu nhất Hồ Chí Minh kế thừa và phát huy là:', options: ['Nhân ái', 'Yêu nước', 'Hiếu học', 'Cần cù'], correctIndex: 1, explanation: 'Yêu nước là giá trị truyền thống quý báu nhất.' },
  { question: 'Đảng chính thức dùng thuật ngữ «Tư tưởng Hồ Chí Minh» năm nào?', options: ['1969', '1986', '1990', '1991'], correctIndex: 3, explanation: 'Chính thức tại Đại hội VII năm 1991.' },
  { question: 'Tư tưởng Hồ Chí Minh hình thành từ:', options: ['Giá trị truyền thống Việt Nam', 'Thành tựu văn hoá nhân loại, gồm Mác-Lênin', 'Phẩm chất cá nhân của Bác', 'Tất cả các ý trên'], correctIndex: 3, explanation: 'Kết hợp truyền thống dân tộc, văn hoá nhân loại và phẩm chất Bác.' },
  { question: 'Bác bắt đầu viết Di chúc lịch sử vào năm nào?', options: ['1960', '1965', '1968', '1969'], correctIndex: 1, explanation: 'Bắt đầu viết năm 1965.' },
  { question: 'Đại hội nào lần đầu nêu Mác-Lênin và Tư tưởng Hồ Chí Minh là nền tảng tư tưởng?', options: ['Đại hội V', 'Đại hội VI', 'Đại hội VII', 'Đại hội VIII'], correctIndex: 2, explanation: 'Đại hội VII (1991) lần đầu nêu rõ.' },
  { question: 'Câu «Đảng cần có lí luận làm nền tảng» trích từ:', options: ['Tuyên ngôn Độc lập', 'Đường Kách mệnh', 'Điều lệ tóm tắt', 'Lý luận chính trị'], correctIndex: 1, explanation: 'Trích từ «Đường Kách mệnh».' },
  { question: 'Nguyễn Tất Thành gia nhập Đảng Xã hội Pháp khi nào?', options: ['Đầu 1917', 'Đầu 1918', 'Đầu 1919', 'Đầu 1920'], correctIndex: 2, explanation: 'Gia nhập đầu năm 1919.' },
  { question: 'Theo Hồ Chí Minh, đức tính lớn nhất của Nho giáo là:', options: ['Tinh thần hiếu học', 'Dùng đạo đức trị xã hội', 'Tu dưỡng đạo đức cá nhân', 'Tôn trọng văn hoá, nghi lễ'], correctIndex: 0, explanation: 'Bác cho rằng tinh thần hiếu học là đức tính lớn nhất.' },
  { question: 'Sự kiện nào đánh dấu tên Nguyễn Ái Quốc xuất hiện trên trường quốc tế?', options: ['Trình yêu sách Versailles (18/6/1919)', 'Đồng sáng lập Đảng Cộng sản Pháp', 'Viết Đường Kách mệnh', 'Tham dự Đại hội Tours'], correctIndex: 0, explanation: 'Tên xuất hiện quốc tế với yêu sách Versailles 18/6/1919.' },
  { question: 'Nhận thức «chỉ có kẻ bóc lột và người bị bóc lột» hình thành trong giai đoạn:', options: ['1911–1915', '1911–1917', '1911–1919', '1911–1920'], correctIndex: 2, explanation: 'Hình thành qua kinh nghiệm từ 1911 đến 1919.' },
  { question: 'Kết luận «không có con đường nào khác ngoài cách mạng vô sản» rút ra từ:', options: ['Phong trào công nhân, yêu nước và Mác-Lênin', 'Yêu nước, đoàn kết và Mác-Lênin', 'Mác-Lênin, vô sản và yêu nước', 'Mác-Lênin, yêu nước và đường lối lãnh đạo'], correctIndex: 0, explanation: 'Rút ra từ phong trào công nhân, yêu nước và Mác-Lênin.' },
  { question: 'Nguyễn Tất Thành đến cảng Marseille, Pháp ngày nào?', options: ['02/6/1911', '04/9/1911', '06/7/1911', '15/9/1911'], correctIndex: 1, explanation: 'Đến Marseille ngày 4 tháng 9 năm 1911.' },
  { question: 'Chiến dịch Hồ Chí Minh lịch sử bắt đầu vào ngày nào?', options: ['26/4/1975', '28/4/1975', '30/4/1975', '1/5/1975'], correctIndex: 0, explanation: 'Chiến dịch Hồ Chí Minh bắt đầu ngày 26/4/1975 và kết thúc thắng lợi vào 30/4/1975.' },
  { question: 'Xe tăng nào húc đổ cổng chính Dinh Độc Lập vào ngày 30/4/1975?', options: ['Xe tăng số 843', 'Xe tăng số 390', 'Xe tăng số 100', 'Xe tăng số 555'], correctIndex: 1, explanation: 'Xe tăng số 390 (Quân đoàn 2) húc đổ cổng chính Dinh Độc Lập lúc 11:30 ngày 30/4/1975.' },
  { question: 'Tổng thống cuối cùng của Việt Nam Cộng hòa tuyên bố đầu hàng là ai?', options: ['Nguyễn Văn Thiệu', 'Trần Văn Hương', 'Dương Văn Minh', 'Nguyễn Cao Kỳ'], correctIndex: 2, explanation: 'Dương Văn Minh tuyên bố đầu hàng vô điều kiện lúc 10:24 ngày 30/4/1975.' },
  { question: 'Lá cờ được cắm lên Dinh Độc Lập lúc mấy giờ ngày 30/4/1975?', options: ['9:30', '10:45', '11:30', '12:00'], correctIndex: 2, explanation: 'Lúc 11:30 ngày 30/4/1975, lá cờ Mặt trận Giải phóng được cắm lên nóc Dinh Độc Lập.' },
];


function pickQuestions(n: number): Question[] {
  return [...ALL_QUESTIONS].sort(() => Math.random() - 0.5).slice(0, n);
}

// ── Fireworks ─────────────────────────────────────────────────────────────────
function Fireworks() {
  const particles = Array.from({ length: 18 }, (_, i) => ({
    angle: (i / 18) * 360,
    color: ['#EF4444', '#FCD34D', '#10B981', '#3B82F6', '#F97316'][i % 5],
    delay: Math.random() * 0.5,
  }));
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
      {[{ cx: '15%', cy: '20%' }, { cx: '80%', cy: '15%' }, { cx: '50%', cy: '8%' }, { cx: '88%', cy: '45%' }].map(
        (pos, fi) =>
          particles.map((p, i) => (
            <motion.div
              key={`${fi}-${i}`}
              className="absolute w-2 h-2 rounded-full"
              style={{ left: pos.cx, top: pos.cy, backgroundColor: p.color }}
              initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
              animate={{
                scale: [0, 1, 0],
                x: Math.cos((p.angle * Math.PI) / 180) * (60 + fi * 18),
                y: Math.sin((p.angle * Math.PI) / 180) * (60 + fi * 18),
                opacity: [1, 1, 0],
              }}
              transition={{ delay: fi * 0.25 + p.delay, duration: 1, ease: 'easeOut' }}
            />
          ))
      )}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function TankGamePage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();

  const [phase, setPhase] = useState<GamePhase>('intro');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [milestone, setMilestone] = useState(0);
  const [lives, setLives] = useState(3);
  const [locked, setLocked] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showHistoricalPopup, setShowHistoricalPopup] = useState(false);
  const [tankFrom, setTankFrom] = useState(0);
  const [tankTo, setTankTo] = useState(0);
  const [tankPhase, setTankPhase] = useState<'idle' | 'moving'>('idle');
  const [showBurst, setShowBurst] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // ── Sound ──
  const tone = (freq: number, dur = 0.18, type: OscillatorType = 'square') => {
    if (!soundOn || typeof window === 'undefined') return;
    try {
      if (!audioCtxRef.current) audioCtxRef.current = new AudioContext();
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.07, ctx.currentTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
      osc.start(); osc.stop(ctx.currentTime + dur + 0.01);
    } catch { /* ignore */ }
  };

  const playCorrect = () => { tone(440, 0.12); setTimeout(() => tone(660, 0.15), 130); };
  const playWrong = () => tone(180, 0.25, 'sawtooth');
  const playVictory = () => [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => tone(f, 0.22, 'triangle'), i * 160));

  // ── Start ──
  const startGame = () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    
    const qs = pickQuestions(MILESTONES.length - 1);
    setQuestions(qs);
    setCurrentQ(0);
    setMilestone(0);
    setLives(3);
    setLocked(true); // Locked while showing popup
    setSelectedAnswer(null);
    setShowExplanation(false);
    setShowHistoricalPopup(true); // Show first lesson immediately
    setTankFrom(0);
    setTankTo(0);
    setTankPhase('idle');
    setShowBurst(false);
    setPhase('playing');
  };

  // ── Tank arrived callback ──
  const onTankArrived = () => {
    const next = tankTo;
    setMilestone(next);
    setTankFrom(next);
    setTankPhase('idle');
    setShowBurst(true);
    setTimeout(() => setShowBurst(false), 1200);

    setShowExplanation(false);
    setSelectedAnswer(null);
    
    // Show lesson for the new milestone
    setShowHistoricalPopup(true);
    setLocked(true);
  };

  const closePopup = () => {
    setShowHistoricalPopup(false);
    if (milestone >= MILESTONES.length - 1) {
      playVictory();
      setTimeout(() => setPhase('win'), 800);
    } else {
      if (milestone > 0) {
        setCurrentQ((q) => q + 1);
      }
      setLocked(false);
    }
  };

  // ── Answer ──
  const handleAnswer = (idx: number) => {
    if (locked || phase !== 'playing') return;
    setLocked(true);
    setSelectedAnswer(idx);
    const correct = idx === questions[currentQ].correctIndex;

    if (correct) {
      playCorrect();
      setShowExplanation(true);
      // Start tank moving
      const nextIdx = milestone + 1;
      setTankFrom(milestone);
      setTankTo(nextIdx);
      setTankPhase('moving');
      // onTankArrived handles the rest
    } else {
      playWrong();
      setShowExplanation(true);
      const newLives = lives - 1;
      setLives(newLives);
      setTimeout(() => {
        setShowExplanation(false);
        setSelectedAnswer(null);
        if (newLives <= 0) setPhase('lose');
        else setLocked(false);
      }, 2200);
    }
  };

  const q = questions[currentQ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#050d1a] via-[#0a1628] to-[#050d1a] py-6 px-4">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div className="text-center mb-5">
          <motion.div
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full bg-red-900/30 border border-red-700/40 px-4 py-1.5 mb-2"
          >
            <span className="text-heritage-gold text-xs font-bold tracking-widest uppercase">
              30/4/1975 · Đại Thắng Mùa Xuân
            </span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="font-display text-3xl md:text-4xl font-bold text-white"
          >
            🪖 Xe Tăng Giải Phóng
          </motion.h1>
        </div>

        <AnimatePresence mode="wait">

          {/* ══ INTRO ══ */}
          {phase === 'intro' && (
            <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="grid md:grid-cols-2 gap-5 items-stretch"
            >
              {/* 3D map preview */}
              <div className="relative h-[420px] rounded-2xl overflow-hidden border border-green-900/40 bg-[#050d1a]">
                <VietnamMap3D
                  milestones={MILESTONES}
                  currentMilestone={0}
                  tankFrom={0} tankTo={0}
                  tankPhase="idle"
                  gamePhase="intro"
                  className="h-full w-full"
                />
                <div className="absolute bottom-3 left-0 right-0 text-center pointer-events-none">
                  <span className="text-green-400/70 text-[10px] font-medium tracking-wider uppercase">
                    Bản đồ 3D Việt Nam · Hover vào điểm để xem tên
                  </span>
                </div>
              </div>

              {/* Instructions */}
              <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-7 flex flex-col justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-heritage-gold mb-1">Cách chơi</h2>
                  <p className="text-[10px] text-gray-500 mb-4 italic">Hành trình 8 mốc lịch sử — từ Pác Bó đến Dinh Độc Lập</p>
                  <div className="space-y-2 text-sm text-gray-300">
                    {[
                      { icon: '🗺️', title: 'Hành trình', desc: 'Xuất phát từ Pác Bó (1941) → Tân Trào → Hà Nội → Bến Hải → Trường Sơn → Buôn Ma Thuột → Xuân Lộc → Dinh Độc Lập (1975)' },
                      { icon: '📜', title: 'Bài học lịch sử', desc: 'Mỗi địa điểm một sự kiện lịch sử hiện ra — đọc kỹ trước khi tiếp tục!' },
                      { icon: '❓', title: 'Câu hỏi', desc: 'Trả lời đúng câu hỏi về Tư tưởng Hồ Chí Minh để xe tăng tiến lên' },
                      { icon: '✅', title: 'Đúng', desc: 'Xe tăng 3D di chuyển đến địa điểm tiếp theo, camera tự động zoom theo' },
                      { icon: '❌', title: 'Sai', desc: 'Mất 1 mạng (có 3 mạng). Hết mạng = thua' },
                      { icon: '🚩', title: 'Chiến thắng', desc: 'Tới Dinh Độc Lập → Xe tăng số 390 húc đổ cổng — Đất nước thống nhất!' },
                    ].map((item) => (
                      <div key={item.title} className="flex gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                        <span className="text-xl flex-shrink-0">{item.icon}</span>
                        <div>
                          <strong className="text-white text-xs uppercase tracking-wider">{item.title}</strong>
                          <p className="text-gray-400 mt-0.5 text-xs">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <motion.button
                  whileHover={authLoading ? {} : { scale: 1.04 }} 
                  whileTap={authLoading ? {} : { scale: 0.97 }}
                  onClick={startGame}
                  disabled={authLoading}
                  className={`w-full text-center text-base py-4 mt-6 ${
                    authLoading ? 'bg-gray-700 text-gray-400 cursor-not-allowed rounded-xl font-bold' : 'heritage-btn'
                  }`}
                >
                  {authLoading ? 'Đang tải...' : '🚀 Xuất phát!'}
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* ══ PLAYING ══ */}
          {phase === 'playing' && q && (
            <motion.div key="playing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="grid md:grid-cols-5 gap-4">

                {/* Left: 3D map + info */}
                <div className="md:col-span-2 flex flex-col gap-3">
                  {/* 3D Vietnam map */}
                  <div className="relative h-[300px] md:h-[340px] rounded-2xl overflow-hidden border border-green-900/40 bg-[#050d1a]">
                    <VietnamMap3D
                      milestones={MILESTONES}
                      currentMilestone={milestone}
                      tankFrom={tankFrom}
                      tankTo={tankTo}
                      tankPhase={tankPhase}
                      gamePhase={phase}
                      onTankArrived={onTankArrived}
                      showBurst={showBurst}
                      className="h-full w-full"
                    />

                    {/* Moving indicator */}
                    <AnimatePresence>
                      {tankPhase === 'moving' && (
                        <motion.div
                          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                          className="absolute top-3 left-0 right-0 flex justify-center"
                        >
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-heritage-gold/90 px-3 py-1 text-xs font-bold text-black">
                            🪖 Đang tiến...
                          </span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Route progress strip */}
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center justify-between relative mb-3">
                      {/* Track */}
                      <div className="absolute left-3 right-3 top-3.5 h-0.5 bg-gray-700 z-0" />
                      <motion.div
                        className="absolute left-3 top-3.5 h-0.5 bg-gradient-to-r from-blue-500 to-heritage-red z-0"
                        animate={{ width: `${(milestone / (MILESTONES.length - 1)) * 86}%` }}
                        transition={{ duration: 0.8, ease: 'easeInOut' }}
                      />
                      {MILESTONES.map((ms, i) => (
                        <div key={ms.name} className="relative z-10 flex flex-col items-center gap-1">
                          <motion.div
                            animate={{ scale: i === milestone ? 1.35 : 1, backgroundColor: i <= milestone ? ms.color : '#374151' }}
                            transition={{ duration: 0.4 }}
                            className="w-7 h-7 rounded-full flex items-center justify-center text-xs shadow-lg border-2"
                            style={{ borderColor: i <= milestone ? ms.color : '#4b5563' }}
                          >
                            {i < milestone ? '✓' : ms.icon}
                          </motion.div>
                          <span className="text-[8px] text-gray-500 whitespace-nowrap font-medium">{ms.name}</span>
                        </div>
                      ))}
                    </div>

                    {/* Lives + sound */}
                    <div className="flex items-center gap-1.5 pt-2 border-t border-white/10">
                      {Array.from({ length: 3 }, (_, i) => (
                        <motion.div key={i} animate={{ scale: i < lives ? 1 : 0.65 }}>
                          <Heart className={`h-5 w-5 ${i < lives ? 'fill-rose-500 text-rose-500' : 'text-gray-700'}`} />
                        </motion.div>
                      ))}
                      <span className="text-gray-400 text-xs ml-1">{lives} mạng</span>
                      <button
                        onClick={() => setSoundOn((s) => !s)}
                        className="ml-auto rounded-full border border-white/10 p-1.5 text-gray-500 hover:text-white hover:bg-white/10 transition-colors"
                      >
                        {soundOn ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right: Question */}
                <div className="md:col-span-3 flex flex-col gap-3">
                  {/* Current leg indicator */}
                  <div className="flex items-center gap-3 rounded-xl bg-red-900/30 border border-red-700/30 px-4 py-2.5">
                    <div className="w-7 h-7 rounded-full bg-heritage-red/40 flex items-center justify-center flex-shrink-0">
                      <span className="text-heritage-gold text-xs font-bold">{currentQ + 1}</span>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">
                        Chặng {milestone + 1}/{MILESTONES.length - 1} &nbsp;·&nbsp;
                        {MILESTONES[milestone]?.icon} {MILESTONES[milestone]?.name}
                        {MILESTONES[milestone + 1] && ` → ${MILESTONES[milestone + 1].icon} ${MILESTONES[milestone + 1].name}`}
                      </p>
                    </div>
                  </div>

                  {/* Question card OR Historical Popup */}
                  <AnimatePresence mode="wait">
                    {showHistoricalPopup ? (
                      <motion.div
                        key="popup"
                        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                        className="rounded-2xl border border-heritage-gold/50 bg-gradient-to-b from-heritage-gold/20 to-black/60 backdrop-blur-md p-6 md:p-8 flex-1 flex flex-col items-center justify-center text-center shadow-[0_0_40px_rgba(251,191,36,0.15)]"
                      >
                        <div className="w-14 h-14 bg-heritage-gold/20 rounded-full flex items-center justify-center mb-4 border border-heritage-gold/40">
                          <span className="text-3xl">{MILESTONES[milestone].icon}</span>
                        </div>
                        <h2 className="text-white font-display text-xl md:text-2xl font-bold mb-2 text-balance leading-snug">
                          {MILESTONES[milestone].lessonTitle}
                        </h2>
                        <div className="inline-flex items-center gap-2 rounded-full bg-red-900/40 border border-red-700/50 px-3 py-1 mb-5">
                          <span className="text-heritage-gold text-xs font-bold tracking-widest">{MILESTONES[milestone].lessonDate}</span>
                        </div>
                        <p className="text-gray-200 text-sm md:text-base leading-relaxed mb-8 max-w-lg text-pretty">
                          {MILESTONES[milestone].lessonContent}
                        </p>
                        <motion.button
                          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                          onClick={closePopup}
                          className="heritage-btn px-8 py-3 w-full max-w-xs shadow-lg shadow-red-900/20"
                        >
                          {milestone >= MILESTONES.length - 1 ? '🎉 Chiến thắng!' : 'Tiếp tục hành trình 🚀'}
                        </motion.button>
                      </motion.div>
                    ) : (
                      <motion.div
                        key={`q-${currentQ}`}
                        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                        className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 flex-1"
                      >
                        <h2 className="text-white font-semibold text-base md:text-lg leading-snug mb-5">{q.question}</h2>

                        <div className="grid gap-2.5">
                          {q.options.map((opt, i) => {
                            const isSel = selectedAnswer === i;
                            const isCorr = i === q.correctIndex;
                            let cls = 'w-full rounded-xl border p-3.5 text-left text-sm font-medium transition-all duration-200 ';
                            if (showExplanation) {
                              if (isCorr) cls += 'border-emerald-500 bg-emerald-500/20 text-emerald-300';
                              else if (isSel) cls += 'border-rose-500 bg-rose-500/20 text-rose-300';
                              else cls += 'border-white/10 bg-transparent text-gray-600 cursor-not-allowed';
                            } else {
                              cls += 'border-white/15 bg-white/5 text-gray-200 hover:border-heritage-gold/50 hover:bg-heritage-gold/10 cursor-pointer';
                            }
                            return (
                              <motion.button
                                key={i}
                                whileHover={!locked ? { scale: 1.01 } : {}}
                                whileTap={!locked ? { scale: 0.99 } : {}}
                                onClick={() => handleAnswer(i)}
                                disabled={locked}
                                className={cls}
                              >
                                <span className="mr-2 text-heritage-gold/80 font-bold">{String.fromCharCode(65 + i)}.</span>
                                {opt}
                              </motion.button>
                            );
                          })}
                        </div>

                        <AnimatePresence>
                          {showExplanation && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-4 rounded-xl border border-heritage-gold/30 bg-heritage-gold/10 p-3 overflow-hidden"
                            >
                              <p className="text-sm text-heritage-gold">
                                💡 <strong>Giải thích:</strong> {q.explanation}
                              </p>
                              {selectedAnswer === q.correctIndex && tankPhase === 'moving' && (
                                <p className="text-xs text-green-400 mt-1.5 font-medium">
                                  🪖 Xe tăng đang tiến về {MILESTONES[tankTo]?.name}...
                                </p>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}

          {/* ══ WIN ══ */}
          {phase === 'win' && (
            <motion.div key="win" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}
              className="relative rounded-2xl border border-heritage-gold/40 bg-gradient-to-b from-red-900/30 to-black/60 overflow-hidden"
            >
              <Fireworks />

              {/* Title */}
              <div className="relative z-10 text-center pt-8 pb-4 px-6">
                <motion.div
                  animate={{ rotate: [0, -6, 6, -3, 3, 0] }}
                  transition={{ repeat: Infinity, duration: 2, repeatDelay: 1.5 }}
                  className="text-5xl mb-2 inline-block"
                >🚩</motion.div>
                <h2 className="font-display text-2xl md:text-3xl font-bold text-heritage-gold">
                  Miền Nam Hoàn Toàn Giải Phóng!
                </h2>
                <p className="text-white font-semibold mt-1">🏛️ Xe tăng số 390 húc đổ cổng Dinh Độc Lập · 11:30 ngày 30/4/1975</p>
              </div>

              {/* Video + Info grid */}
              <div className="relative z-10 grid md:grid-cols-5 gap-5 px-6 pb-8">

                {/* Local Video — col-span-3 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="md:col-span-3 rounded-2xl overflow-hidden border-2 border-heritage-gold/50 shadow-[0_0_30px_rgba(251,191,36,0.2)] flex flex-col justify-center bg-black/40 relative"
                >
                  <video
                    src="/videos/304_victory.mp4"
                    autoPlay
                    loop
                    controls
                    className="w-full h-[400px] object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-3 py-2 text-center pointer-events-none">
                    <span className="text-heritage-gold text-xs font-bold tracking-wider">
                      🎬 Khoảnh khắc lịch sử 30/4/1975
                    </span>
                  </div>
                </motion.div>

                {/* Right info */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="md:col-span-2 flex flex-col justify-between gap-4"
                >
                  {/* Score badge */}
                  <div className="rounded-xl border border-heritage-gold/40 bg-heritage-gold/10 px-4 py-3 text-center">
                    <Flag className="h-5 w-5 text-heritage-gold mx-auto mb-1" />
                    <p className="text-heritage-gold font-bold text-sm">Còn {lives} mạng!</p>
                    <p className="text-gray-400 text-xs mt-0.5">
                      {lives === 3 ? 'Hoàn hảo! Không mất mạng nào' : lives === 2 ? 'Xuất sắc!' : 'Sống sót anh dũng!'}
                    </p>
                  </div>

                  {/* Quote */}
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4 flex-1">
                    <p className="text-heritage-gold text-xs font-bold mb-2">💬 Hồ Chí Minh:</p>
                    <p className="text-gray-300 text-xs italic leading-relaxed">
                      &quot;Không có gì quý hơn độc lập, tự do. Đến ngày thắng lợi, nhân dân ta sẽ xây dựng đất nước đàng hoàng hơn, to đẹp hơn.&quot;
                    </p>
                  </div>

                  {/* Historical facts */}
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <p className="text-white text-xs font-bold mb-2 uppercase tracking-wider">📜 Lịch sử</p>
                    <ul className="space-y-1.5 text-xs text-gray-400">
                      <li>• <span className="text-white">10:24</span> — Dương Văn Minh tuyên bố đầu hàng</li>
                      <li>• <span className="text-white">11:30</span> — Xe tăng 390 húc đổ cổng Dinh</li>
                      <li>• <span className="text-white">11:30</span> — Cờ Giải phóng cắm lên nóc Dinh</li>
                      <li>• <span className="text-white">21 năm</span> kháng chiến chống Mỹ kết thúc</li>
                    </ul>
                  </div>

                  {/* Replay button */}
                  <motion.button
                    whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                    onClick={startGame}
                    className="heritage-btn w-full inline-flex items-center justify-center gap-2 py-3"
                  >
                    <RotateCcw className="h-4 w-4" /> Chơi lại
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* ══ LOSE ══ */}
          {phase === 'lose' && (
            <motion.div key="lose" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              className="rounded-2xl border border-red-500/30 bg-gradient-to-b from-red-900/20 to-black/60 p-10 text-center"
            >
              <div className="text-6xl mb-4">💥</div>
              <h2 className="font-display text-3xl font-bold text-red-400 mb-2">Xe tăng bị bắn hạ!</h2>
              <p className="text-gray-400 text-sm mb-1">
                Dừng lại tại <span className="text-white font-bold">{MILESTONES[milestone]?.icon} {MILESTONES[milestone]?.name}</span>
              </p>
              <p className="text-gray-500 text-xs mb-8">Ôn lại Tư tưởng Hồ Chí Minh và thử lại!</p>
              <div className="flex justify-center gap-1 mb-8">
                {Array.from({ length: 3 }, (_, i) => <Star key={i} className="h-7 w-7 text-gray-700" />)}
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                onClick={startGame}
                className="heritage-btn inline-flex items-center gap-2 px-8 py-3"
              >
                <RotateCcw className="h-4 w-4" /> Thử lại
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
