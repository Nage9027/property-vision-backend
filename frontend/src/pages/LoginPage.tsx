import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { AppLayout } from '@/layouts/AppLayout';
import { Button } from '@/components/ui/button';
import { authStore } from '@/store/authStore';

export function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill all required fields.');
      return;
    }

    try {
      setLoading(true);
      await authStore.login(email, password);
      navigate('/admin', { replace: true });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      if (message.includes('Invalid login credentials')) {
        setError('Invalid email or password.');
      } else if (message.includes('rate limit')) {
        setError('Too many requests. Please try again later.');
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <section className="relative -mt-20 min-h-[calc(70vh+5rem)] bg-gradient-to-br from-[#081120] via-[#0a2540] to-[#0d9488] px-4 pb-16 pt-36">
        <div className="mx-auto max-w-md rounded-2xl border border-white/15 bg-white p-8 shadow-2xl">
          <h1
            className="text-3xl font-bold text-[#081120]"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Login to Post Property
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Login first, then submit your property details and video.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-gray-700">Email *</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition-all focus:border-[#c6a43f] focus:ring-2 focus:ring-[#c6a43f]/20"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-gray-700">Password *</span>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 pr-12 text-sm outline-none transition-all focus:border-[#c6a43f] focus:ring-2 focus:ring-[#c6a43f]/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-600"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </label>

            {error ? <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}

            <Button
              type="submit"
              disabled={loading}
              className="h-12 w-full bg-gradient-to-r from-[#c6a43f] to-[#f0c14b] font-semibold text-[#081120] hover:brightness-105"
            >
              {loading ? 'Please wait\u2026' : 'Login and continue'}
            </Button>
          </form>

          <p className="mt-5 text-center text-xs text-gray-500">
            Need help?{' '}
            <Link to="/contact" className="underline">
              Contact Property Vision
            </Link>
          </p>
        </div>
      </section>
    </AppLayout>
  );
}

