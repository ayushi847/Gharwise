



import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Home,
  Eye,
  EyeOff,
  UserPlus,
  Building2,
  User,
  ArrowLeft,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'TENANT' as 'TENANT' | 'OWNER',
  });

  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    setLoading(true);

    try {
      await register(form);
      toast.success('Account created successfully!');

      if (form.role === 'TENANT') {
        navigate('/dashboard/tenant');
      } else {
        navigate('/dashboard/owner');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#dce6d7] px-4 py-6 sm:py-8">

      {/* Back to Landing Page */}
      <button
        type="button"
        onClick={() => navigate('/')}
        aria-label="Back to home"
        className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-xl border border-[#cbd8c5] bg-white text-[#315b3e] transition hover:bg-[#e9f0e5] sm:left-6 sm:top-6"
      >
        <ArrowLeft size={20} />
      </button>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-[430px]"
      >
        {/* Brand */}
        <div className="mb-5 text-center">
          <Link to="/" className="mb-3 inline-flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#315b3e] text-white">
              <Home size={21} />
            </span>

            <span className="text-2xl font-bold tracking-tight text-[#315b3e]">
              Gharwise
            </span>
          </Link>

          <h1 className="text-2xl font-bold text-[#293b2e]">
            Create your account
          </h1>

          <p className="mt-1 text-sm text-[#626f60]">
            Find your place or list your property.
          </p>
        </div>

        {/* Registration Card */}
        <div className="rounded-2xl border border-[#d0dccb] bg-white p-5 sm:p-7">

          {/* Role Selection */}
          <p className="mb-3 text-sm font-semibold text-[#354438]">
            I want to...
          </p>

          <div className="mb-5 grid grid-cols-2 gap-3">
            {([
              ['TENANT', 'Find a home', User, 'Looking for a place'],
              ['OWNER', 'List property', Building2, 'I have a property'],
            ] as const).map(([role, label, Icon, sublabel]) => (
              <motion.button
                whileTap={{ scale: 0.98 }}
                key={role}
                id={`role-${role.toLowerCase()}-btn`}
                type="button"
                onClick={() => setForm((f) => ({ ...f, role }))}
                className={`flex flex-col items-center gap-2 rounded-xl border p-3.5 transition ${
                  form.role === role
                    ? 'border-[#315b3e] bg-[#e9f0e5] text-[#315b3e]'
                    : 'border-[#dce3d7] bg-white text-[#657061] hover:border-[#9db49a]'
                }`}
              >
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                    form.role === role
                      ? 'bg-[#315b3e] text-white'
                      : 'bg-[#f2f6ef] text-[#657d61]'
                  }`}
                >
                  <Icon size={19} />
                </span>

                <span className="text-center">
                  <span className="block text-sm font-bold">{label}</span>
                  <span className="mt-0.5 block text-[11px] text-[#7b8477]">
                    {sublabel}
                  </span>
                </span>
              </motion.button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Full Name */}
            <div>
              <label
                htmlFor="name-input"
                className="mb-1.5 block text-sm font-semibold text-[#354438]"
              >
                Full name
              </label>

              <input
                id="name-input"
                type="text"
                autoComplete="name"
                placeholder="Enter your full name"
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                className="w-full rounded-lg border border-[#d5e0d1] bg-[#f2f6ef] px-3.5 py-3 text-sm text-[#293b2e] outline-none transition placeholder:text-[#929d8e] focus:border-[#527a59] focus:bg-white focus:ring-2 focus:ring-[#315b3e]/10"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="register-email-input"
                className="mb-1.5 block text-sm font-semibold text-[#354438]"
              >
                Email address
              </label>

              <input
                id="register-email-input"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) =>
                  setForm((f) => ({ ...f, email: e.target.value }))
                }
                className="w-full rounded-lg border border-[#d5e0d1] bg-[#f2f6ef] px-3.5 py-3 text-sm text-[#293b2e] outline-none transition placeholder:text-[#929d8e] focus:border-[#527a59] focus:bg-white focus:ring-2 focus:ring-[#315b3e]/10"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="register-password-input"
                className="mb-1.5 block text-sm font-semibold text-[#354438]"
              >
                Password
              </label>

              <div className="relative">
                <input
                  id="register-password-input"
                  type={showPass ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="At least 8 characters"
                  value={form.password}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, password: e.target.value }))
                  }
                  className="w-full rounded-lg border border-[#d5e0d1] bg-[#f2f6ef] py-3 pl-3.5 pr-11 text-sm text-[#293b2e] outline-none transition placeholder:text-[#929d8e] focus:border-[#527a59] focus:bg-white focus:ring-2 focus:ring-[#315b3e]/10"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPass((prev) => !prev)}
                  aria-label={showPass ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#788b75] transition hover:text-[#315b3e]"
                >
                  {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>

              {form.password.length > 0 && form.password.length < 8 && (
                <p className="mt-1.5 text-xs text-red-600">
                  Password must be at least 8 characters.
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              id="register-submit-btn"
              type="submit"
              disabled={loading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-[#315b3e] py-3 text-sm font-semibold text-white transition hover:bg-[#264a31] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Creating account...
                </>
              ) : (
                <>
                  <UserPlus size={17} />
                  Create {form.role === 'TENANT' ? 'Tenant' : 'Owner'} Account
                </>
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-5 border-t border-[#edf0e9] pt-4 text-center">
            <p className="text-sm text-[#737d70]">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-semibold text-[#315b3e] hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

