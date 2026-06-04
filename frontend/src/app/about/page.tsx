'use client';

import { motion } from 'framer-motion';
import { Users, Code, Sparkles, Cpu, BookOpen } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';

const teamMembers = [
  { name: 'Lê Dương Duy Minh', studentCode: 'SE183197' },
  { name: 'Lương Ngọc Diệp', studentCode: 'SE184192' },
  { name: 'Thân Trọng An', studentCode: 'SE184231' },
  { name: 'Phạm Minh Lộc', studentCode: 'SE184295' },
  { name: 'Trần Tiến Phát', studentCode: 'SE183080' },
  { name: 'Nguyễn Tuấn Kiệt', studentCode: 'SE183069' },
];

const aiTools = [
  { name: 'Antigravity', description: 'Trợ lý lập trình tự động hoá cao cấp, đồng hành phát triển và xây dựng nền tảng từ những ngày đầu.', icon: Sparkles },
  { name: 'Claude', description: 'Mô hình ngôn ngữ tiên tiến hỗ trợ phân tích dữ liệu lịch sử và sáng tạo nội dung văn bản.', icon: Cpu },
  { name: 'ChatGPT', description: 'Hỗ trợ lên ý tưởng, cấu trúc trò chơi và tối ưu hóa các thành phần tương tác trong dự án.', icon: Code },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-32 pb-16 px-4 md:px-8 max-w-7xl mx-auto relative overflow-hidden">
      {/* Background gradients */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-secondary/10 blur-[150px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-20"
      >
        <div className="inline-flex items-center justify-center p-3 mb-6 rounded-full bg-primary/10 text-primary">
          <BookOpen className="w-8 h-8" />
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold mb-6 text-foreground tracking-tight">
          Về Dự Án & Đội Ngũ
        </h1>
        <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto font-source leading-relaxed">
          Tìm hiểu về những con người và công nghệ đứng sau dự án Hành trình Hồ Chí Minh (1911–1930).
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
        {/* Team Section */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-6"
        >
          <div className="flex items-center gap-4 mb-8 pb-4 border-b border-border/50">
            <div className="p-3 bg-primary/10 rounded-xl">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-3xl font-playfair font-semibold">Đội Ngũ Phát Triển</h2>
          </div>
          
          <div className="grid gap-4">
            {teamMembers.map((member, idx) => (
              <GlassCard 
                key={idx} 
                className="p-5 flex justify-between items-center group cursor-default"
                hover={true}
                glow={true}
              >
                <span className="font-source text-lg font-medium text-foreground/90 group-hover:text-primary transition-colors">
                  {member.name}
                </span>
                <span className="font-source text-primary/80 font-mono bg-primary/10 px-4 py-1.5 rounded-full text-sm font-semibold tracking-wider">
                  {member.studentCode}
                </span>
              </GlassCard>
            ))}
          </div>
        </motion.div>

        {/* AI Tools Section */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="space-y-6"
        >
          <div className="flex items-center gap-4 mb-8 pb-4 border-b border-border/50">
            <div className="p-3 bg-secondary/10 rounded-xl">
              <Cpu className="w-6 h-6 text-secondary" />
            </div>
            <h2 className="text-3xl font-playfair font-semibold">Công Nghệ AI Hỗ Trợ</h2>
          </div>
          
          <div className="grid gap-5">
            {aiTools.map((tool, idx) => (
              <GlassCard 
                key={idx} 
                className="p-6 flex items-start gap-5 cursor-default"
                hover={true}
                glow={true}
              >
                <div className="bg-foreground/5 p-3.5 rounded-xl shrink-0 text-primary">
                  <tool.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold font-playfair mb-2 text-foreground/90">{tool.name}</h3>
                  <p className="text-muted-foreground font-source text-sm md:text-base leading-relaxed">
                    {tool.description}
                  </p>
                </div>
              </GlassCard>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
