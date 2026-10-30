




// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import {
//   Home,
//   Building2,
//   LogOut,
//   ArrowUpRight,
//   Sun,
//   Moon,
//   Menu,
//   X,
// } from 'lucide-react';
// import { useAuth } from '../contexts/AuthContext';

// interface NavbarProps {
//   currentView?: string;
//   onNavigate?: (view: string) => void;
// }

// type Theme = 'light' | 'dark';

// const Navbar: React.FC<NavbarProps> = ({
//   currentView,
//   onNavigate,
// }) => {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();

//   const [theme, setTheme] = useState<Theme>('light');
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

//   // Restore the saved theme and apply it to the whole website.
//   useEffect(() => {
//     const savedTheme = localStorage.getItem('gharwise-theme');
//     const initialTheme: Theme =
//       savedTheme === 'dark' ? 'dark' : 'light';

//     setTheme(initialTheme);

//     document.documentElement.classList.toggle(
//       'dark',
//       initialTheme === 'dark'
//     );
//     document.documentElement.style.colorScheme = initialTheme;
//   }, []);

//   const toggleTheme = () => {
//     const nextTheme: Theme =
//       theme === 'light' ? 'dark' : 'light';

//     setTheme(nextTheme);

//     document.documentElement.classList.toggle(
//       'dark',
//       nextTheme === 'dark'
//     );
//     document.documentElement.style.colorScheme = nextTheme;

//     localStorage.setItem('gharwise-theme', nextTheme);
//   };

//   const handleHomeClick = () => {
//     setMobileMenuOpen(false);

//     if (onNavigate) {
//       onNavigate('list');
//       return;
//     }

//     if (user?.role === 'TENANT') {
//       navigate('/dashboard/tenant');
//     } else if (user?.role === 'OWNER') {
//       navigate('/dashboard/owner');
//     } else if (user?.role === 'ADMIN') {
//       navigate('/dashboard/admin');
//     } else {
//       navigate('/');
//     }
//   };

//   const handleLogout = () => {
//     setMobileMenuOpen(false);
//     logout();
//     navigate('/login');
//   };

//   const isHomeActive = currentView === 'list' || !currentView;

//   const navButton =
//     'inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#00A884]/20 sm:px-4';

//   return (
//     <nav className="sticky top-0 z-50 w-full border-b border-[#E2EAE1] bg-white/95 text-[#24352C] shadow-sm backdrop-blur-xl transition-colors duration-300 dark:border-dark-800 dark:bg-dark-950/95 dark:text-dark-100">
//       <div className="mx-auto flex min-h-[72px] w-full max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">

//         {/* Brand */}
//         <button
//           type="button"
//           onClick={() => navigate('/')}
//           className="flex min-w-0 shrink-0 items-center gap-2.5 rounded-xl text-left transition-opacity hover:opacity-80 sm:gap-3"
//           aria-label="Gharwise home"
//         >
//           <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#00A884] to-[#087965] text-white shadow-sm shadow-[#087965]/20">
//             <Building2 size={22} strokeWidth={2.2} />
//           </span>

//           <span className="flex min-w-0 flex-col">
//             <span className="text-lg font-extrabold tracking-tight text-[#285541] dark:text-[#B9D9BE] sm:text-xl">
//               Gharwise
//             </span>
//             <span className="hidden text-[11px] font-medium tracking-wide text-[#7A8B7D] dark:text-dark-400 sm:block">
//               Ghar ki talaash, ab aasaan.
//             </span>
//           </span>
//         </button>

//         {/* Desktop navigation */}
//         <div className="hidden items-center gap-1.5 md:flex lg:gap-2">
//           <button
//             type="button"
//             onClick={handleHomeClick}
//             aria-current={isHomeActive ? 'page' : undefined}
//             className={`${navButton} ${
//               isHomeActive
//                 ? 'bg-[#EAF4E9] text-[#285541] dark:bg-[#285541]/35 dark:text-[#C4E5C9]'
//                 : 'text-[#5F7163] hover:bg-[#F0F5EE] hover:text-[#285541] dark:text-dark-300 dark:hover:bg-dark-800 dark:hover:text-dark-100'
//             }`}
//           >
//             <Home size={17} />
//             <span>Home</span>
//           </button>

//           {user?.role === 'OWNER' && (
//             <button
//               type="button"
//               onClick={() => navigate('/dashboard/owner')}
//               className={`${navButton} text-[#5F7163] hover:bg-[#F0F5EE] hover:text-[#285541] dark:text-dark-300 dark:hover:bg-dark-800 dark:hover:text-dark-100`}
//             >
//               <Building2 size={17} />
//               <span>My Properties</span>
//             </button>
//           )}
//         </div>

//         {/* Right side actions */}
//         <div className="flex shrink-0 items-center gap-2">

//           {/* Global theme toggle */}
//           <button
//             type="button"
//             onClick={toggleTheme}
//             aria-label={
//               theme === 'light'
//                 ? 'Switch to dark mode'
//                 : 'Switch to light mode'
//             }
//             title={
//               theme === 'light'
//                 ? 'Switch to dark mode'
//                 : 'Switch to light mode'
//             }
//             className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#DDE8DA] bg-[#F5F8F2] text-[#477A5D] transition-all duration-200 hover:border-[#9EBB9E] hover:bg-[#E7F0E7] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#00A884]/20 dark:border-dark-700 dark:bg-dark-800 dark:text-[#D7E9B8] dark:hover:bg-dark-700"
//           >
//             {theme === 'light' ? (
//               <Moon size={18} />
//             ) : (
//               <Sun size={19} />
//             )}
//           </button>

//           {user ? (
//             <>
//               <button
//                 type="button"
//                 onClick={handleLogout}
//                 className="hidden items-center gap-2 rounded-xl border border-[#DDE5D9] bg-white px-3.5 py-2.5 text-sm font-semibold text-[#526557] transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-600 focus:outline-none focus-visible:ring-4 focus-visible:ring-red-500/10 dark:border-dark-700 dark:bg-dark-900 dark:text-dark-200 dark:hover:border-red-900 dark:hover:bg-red-950/30 dark:hover:text-red-300 sm:inline-flex"
//               >
//                 <LogOut size={16} />
//                 <span>Logout</span>
//               </button>
//             </>
//           ) : (
//             <div className="hidden items-center gap-2 sm:flex">
//               <button
//                 type="button"
//                 onClick={() => navigate('/login')}
//                 className="rounded-xl px-3.5 py-2.5 text-sm font-semibold text-[#526557] transition-colors hover:bg-[#F0F5EE] hover:text-[#285541] dark:text-dark-300 dark:hover:bg-dark-800"
//               >
//                 Sign in
//               </button>

//               <button
//                 type="button"
//                 onClick={() => navigate('/login')}
//                 className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#00A884] to-[#087965] px-4 py-2.5 text-sm font-bold text-white shadow-sm shadow-[#087965]/15 transition-all hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-4 focus-visible:ring-[#00A884]/25"
//               >
//                 Get Started
//                 <ArrowUpRight size={16} />
//               </button>
//             </div>
//           )}

//           {/* Mobile menu button */}
//           <button
//             type="button"
//             onClick={() =>
//               setMobileMenuOpen((open) => !open)
//             }
//             aria-label={
//               mobileMenuOpen ? 'Close menu' : 'Open menu'
//             }
//             aria-expanded={mobileMenuOpen}
//             className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#DDE8DA] text-[#477A5D] transition-colors hover:bg-[#EAF4E9] dark:border-dark-700 dark:text-dark-200 dark:hover:bg-dark-800 md:hidden"
//           >
//             {mobileMenuOpen ? (
//               <X size={20} />
//             ) : (
//               <Menu size={20} />
//             )}
//           </button>
//         </div>
//       </div>

//       {/* Mobile navigation */}
//       {mobileMenuOpen && (
//         <div className="border-t border-[#E2EAE1] bg-white px-4 py-4 dark:border-dark-800 dark:bg-dark-950 md:hidden">
//           <div className="mx-auto flex max-w-7xl flex-col gap-2">
//             <button
//               type="button"
//               onClick={handleHomeClick}
//               className={`${navButton} w-full justify-start ${
//                 isHomeActive
//                   ? 'bg-[#EAF4E9] text-[#285541] dark:bg-[#285541]/35 dark:text-[#C4E5C9]'
//                   : 'text-[#5F7163] hover:bg-[#F0F5EE] dark:text-dark-300 dark:hover:bg-dark-800'
//               }`}
//             >
//               <Home size={17} />
//               Home
//             </button>

//             {user?.role === 'OWNER' && (
//               <button
//                 type="button"
//                 onClick={() => {
//                   navigate('/dashboard/owner');
//                   setMobileMenuOpen(false);
//                 }}
//                 className={`${navButton} w-full justify-start text-[#5F7163] hover:bg-[#F0F5EE] dark:text-dark-300 dark:hover:bg-dark-800`}
//               >
//                 <Building2 size={17} />
//                 My Properties
//               </button>
//             )}

//             {!user ? (
//               <>
//                 <button
//                   type="button"
//                   onClick={() => {
//                     navigate('/login');
//                     setMobileMenuOpen(false);
//                   }}
//                   className={`${navButton} w-full justify-start text-[#5F7163] hover:bg-[#F0F5EE] dark:text-dark-300 dark:hover:bg-dark-800`}
//                 >
//                   Sign in
//                 </button>

//                 <button
//                   type="button"
//                   onClick={() => {
//                     navigate('/login');
//                     setMobileMenuOpen(false);
//                   }}
//                   className={`${navButton} w-full justify-center bg-gradient-to-r from-[#00A884] to-[#087965] text-white`}
//                 >
//                   Get Started
//                   <ArrowUpRight size={16} />
//                 </button>
//               </>
//             ) : (
//               <button
//                 type="button"
//                 onClick={handleLogout}
//                 className={`${navButton} w-full justify-start text-red-600 hover:bg-red-50 dark:text-red-300 dark:hover:bg-red-950/30`}
//               >
//                 <LogOut size={17} />
//                 Logout
//               </button>
//             )}
//           </div>
//         </div>
//       )}
//     </nav>
//   );
// };

// export default Navbar;












import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Building2, LogOut, ArrowUpRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface NavbarProps {
  currentView?: string;
  onNavigate?: (view: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleHomeClick = () => {
    if (onNavigate) {
      onNavigate('list');
      return;
    }

    if (user?.role === 'TENANT') {
      navigate('/dashboard/tenant');
    } else if (user?.role === 'OWNER') {
      navigate('/dashboard/owner');
    } else if (user?.role === 'ADMIN') {
      navigate('/dashboard/admin');
    } else {
      navigate('/');
    }
  };

  const isHomeActive = currentView === 'list' || !currentView;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/15 bg-[#315b3e] text-white shadow-md">
      <div className="mx-auto flex min-h-[72px] w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">

        {/* Brand */}
        <button
          type="button"
          onClick={() => navigate('/')}
          className="flex shrink-0 items-center gap-3 rounded-lg text-left transition hover:opacity-90"
          aria-label="Gharwise home"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
            <Building2 size={23} strokeWidth={2} />
          </span>

          <span className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-white">
              Gharwise
            </span>
            <span className="hidden text-xs text-white/75 sm:block">
              Ghar ki talaash, ab aasaan.
            </span>
          </span>
        </button>

        {/* Navigation */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={handleHomeClick}
            className={`inline-flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold transition sm:px-4 ${
              isHomeActive
                ? 'bg-white text-[#315b3e] shadow-sm'
                : 'text-white hover:bg-white/15'
            }`}
          >
            <Home size={18} />
            <span>Home</span>
          </button>

          {user ? (
            <>
              {user.role === 'OWNER' && (
                <button
                  type="button"
                  onClick={() => navigate('/dashboard/owner')}
                  className="hidden items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-white transition hover:bg-white/15 sm:inline-flex"
                >
                  <Building2 size={18} />
                  <span>My Properties</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                className="inline-flex items-center gap-2 rounded-lg border border-white/25 px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10 sm:px-4"
              >
                <LogOut size={17} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="rounded-lg px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-white/15 sm:px-4"
              >
                Sign in
              </button>

              <button
                type="button"
                onClick={() => navigate('/login')}
                className="inline-flex items-center gap-2 rounded-lg bg-[#e9f0e5] px-3 py-2.5 text-sm font-bold text-[#315b3e] shadow-sm transition hover:bg-white sm:px-4"
              >
                <span>Get Started</span>
                <ArrowUpRight size={17} />
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;