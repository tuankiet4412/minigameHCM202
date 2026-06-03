'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register({ username, email, password });
      toast.success('Tạo tài khoản thành công!');
      router.push('/profile');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Đăng ký thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-12">
      <div className="museum-card w-full max-w-md p-8">
        <h1 className="font-display text-3xl font-bold text-heritage-red dark:text-heritage-gold text-center">Đăng ký</h1>
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium mb-1">Tên đăng nhập</label>
            <input id="username" required minLength={3} value={username} onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-lg border border-heritage-gold/30 px-4 py-2 dark:bg-heritage-charcoal" />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
            <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-heritage-gold/30 px-4 py-2 dark:bg-heritage-charcoal" />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">Mật khẩu</label>
            <input id="password" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-heritage-gold/30 px-4 py-2 dark:bg-heritage-charcoal" />
          </div>
          <button type="submit" disabled={loading} className="heritage-btn w-full">
            {loading ? 'Đang tạo tài khoản...' : 'Tạo tài khoản'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          Đã có tài khoản?{' '}
          <Link href="/login" className="text-heritage-red dark:text-heritage-gold font-medium hover:underline">Đăng nhập</Link>
        </p>
      </div>
    </div>
  );
}
