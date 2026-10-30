





import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Home,
  Eye,
  EyeOff,
  Mail,
  LockKeyhole,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(form.email, form.password);
      toast.success('Welcome back to Gharwise!');

      const user = JSON.parse(localStorage.getItem('user') || '{}');

      if (user.role === 'TENANT') {
        navigate('/dashboard/tenant');
      } else if (user.role === 'OWNER') {
        navigate('/dashboard/owner');
      } else if (user.role === 'ADMIN') {
        navigate('/dashboard/admin');
      } else {
        navigate('/');
      }
    } catch (err: any) {
      toast.error(
        err.response?.data?.error || 'Login failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#dce6d7] px-4 py-6 sm:py-8">

      {/* Back Arrow */}
      <button
        type="button"
        onClick={() => navigate('/')}
        aria-label="Back to home"
        className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#315b3e] shadow-sm transition hover:bg-[#f2f6ef] hover:shadow-md sm:left-6 sm:top-6"
      >
        <ArrowLeft size={21} />
      </button>

      <div className="w-full max-w-[400px]">

        {/* Brand */}
        <div className="mb-6 text-center">
          <Link to="/" className="mb-4 inline-flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#315b3e] text-white">
              <Home size={21} />
            </span>

            <span className="text-2xl font-bold tracking-tight text-[#315b3e]">
              Gharwise
            </span>
          </Link>

          <h1 className="text-2xl font-bold text-[#293b2e]">
            Welcome back!
          </h1>

          <p className="mt-1.5 text-sm text-[#626f60]">
            Sign in to continue to your account
          </p>
        </div>

        {/* Login Form Card */}
        <div className="rounded-2xl border border-[#d0dccb] bg-white p-6 sm:p-7">

          <div className="mb-6">
            <h2 className="text-lg font-bold text-[#293b2e]">
              Sign in to Gharwise
            </h2>

            <p className="mt-1 text-sm text-[#7b8477]">
              Enter your details below to get started.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <div>
              <label
                htmlFor="email-input"
                className="mb-2 block text-sm font-semibold text-[#354438]"
              >
                Email address
              </label>

              <div className="relative">
                <Mail
                  size={17}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#788b75]"
                />

                <input
                  id="email-input"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      email: e.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-[#d5e0d1] bg-[#f2f6ef] py-3 pl-10 pr-3 text-sm text-[#293b2e] outline-none transition placeholder:text-[#929d8e] focus:border-[#527a59] focus:bg-white focus:ring-2 focus:ring-[#315b3e]/10"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password-input"
                className="mb-2 block text-sm font-semibold text-[#354438]"
              >
                Password
              </label>

              <div className="relative">
                <LockKeyhole
                  size={17}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#788b75]"
                />

                <input
                  id="password-input"
                  type={showPass ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      password: e.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-[#d5e0d1] bg-[#f2f6ef] py-3 pl-10 pr-11 text-sm text-[#293b2e] outline-none transition placeholder:text-[#929d8e] focus:border-[#527a59] focus:bg-white focus:ring-2 focus:ring-[#315b3e]/10"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPass((prev) => !prev)}
                  aria-label={showPass ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#788b75] transition hover:text-[#315b3e]"
                >
                  {showPass ? (
                    <EyeOff size={17} />
                  ) : (
                    <Eye size={17} />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              id="login-submit-btn"
              type="submit"
              disabled={loading}
              className="group flex w-full items-center justify-center gap-2 rounded-lg bg-[#315b3e] py-3 text-sm font-semibold text-white transition hover:bg-[#264a31] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight
                    size={17}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </>
              )}
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-5 border-t border-[#edf0e9] pt-5 text-center">
            <p className="text-sm text-[#737d70]">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="font-semibold text-[#315b3e] hover:underline"
              >
                Create one
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-5 text-center text-xs text-[#626f60]">
          Find a place to call home.
        </p>

      </div>
    </div>
  );
}