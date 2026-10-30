

// // import { useState, useEffect } from 'react';
// // import { Link } from 'react-router-dom';
// // import { motion, AnimatePresence } from 'framer-motion';
// // import {
// //   MessageCircle, Clock, CheckCircle, XCircle,
// //   User, Home, Zap, Send, IndianRupee, MapPin, Calendar, Sparkles, Filter
// // } from 'lucide-react';
// // import { useQuery, useQueryClient } from '@tanstack/react-query';
// // import { listingsAPI, interestsAPI, profilesAPI } from '../../lib/api';
// // import { useAuth } from '../../contexts/AuthContext';
// // import Navbar from '../../components/Navbar';
// // import ListingCard, { ListingCardSkeleton } from '../../components/ListingCard';
// // import Pagination from '../../components/Pagination';
// // import { Listing, Interest } from '../../types';
// // import toast from 'react-hot-toast';
// // import { format } from 'date-fns';

// // const statusIcon: Record<string, React.ReactNode> = {
// //   PENDING: <Clock size={14} className="text-amber-500" />,
// //   ACCEPTED: <CheckCircle size={14} className="text-emerald-500" />,
// //   DECLINED: <XCircle size={14} className="text-red-500" />,
// // };
// // const statusClass: Record<string, string> = {
// //   PENDING: 'badge-yellow',
// //   ACCEPTED: 'badge-green',
// //   DECLINED: 'badge-red',
// // };

// // export default function TenantDashboard() {
// //   const { user } = useAuth();
// //   const queryClient = useQueryClient();
// //   const [tab, setTab] = useState<'browse' | 'interests' | 'profile'>('browse');
// //   const [filters, setFilters] = useState({ location: '', minBudget: '', maxBudget: '' });
// //   const [page, setPage] = useState(1);
// //   const [sendingInterest, setSendingInterest] = useState<string | null>(null);
// //   const [interestMessage, setInterestMessage] = useState('');
// //   const [showInterestModal, setShowInterestModal] = useState<Listing | null>(null);

// //   // Profile form
// //   const [profileForm, setProfileForm] = useState({
// //     preferredLocation: '',
// //     budgetMin: '',
// //     budgetMax: '',
// //     moveInDate: '',
// //     bio: '',
// //     preferences: '',
// //   });
// //   const [savingProfile, setSavingProfile] = useState(false);

// //   const { data: listingsData, isLoading: listingsLoading } = useQuery({
// //     queryKey: ['listings', filters, page],
// //     queryFn: () => listingsAPI.getAll({ ...filters, page, limit: 9 }).then(r => r.data),
// //   });

// //   const { data: myProfile } = useQuery({
// //     queryKey: ['tenantProfile'],
// //     queryFn: () => profilesAPI.getTenant().then(r => r.data),
// //     enabled: !!user,
// //   });

// //   const { data: myInterests } = useQuery({
// //     queryKey: ['myInterests'],
// //     queryFn: () => interestsAPI.getMy().then(r => r.data),
// //     enabled: !!user,
// //   });

// //   useEffect(() => {
// //     if (myProfile) {
// //       setProfileForm({
// //         preferredLocation: myProfile.preferredLocation || '',
// //         budgetMin: String(myProfile.budgetMin || ''),
// //         budgetMax: String(myProfile.budgetMax || ''),
// //         moveInDate: myProfile.moveInDate ? myProfile.moveInDate.split('T')[0] : '',
// //         bio: myProfile.bio || '',
// //         preferences: myProfile.preferences || '',
// //       });
// //     }
// //   }, [myProfile]);

// //   const listings: Listing[] = listingsData?.listings || listingsData || [];
// //   const totalPages = listingsData?.totalPages || 1;
// //   const interests: Interest[] = myInterests || [];

// //   const handleSendInterest = async (listing: Listing) => {
// //     setSendingInterest(listing.id);
// //     try {
// //       await interestsAPI.send({ listingId: listing.id, message: interestMessage });
// //       toast.success('Interest expressed successfully!');
// //       queryClient.invalidateQueries({ queryKey: ['myInterests'] });
// //       setShowInterestModal(null);
// //       setInterestMessage('');
// //     } catch (err: any) {
// //       toast.error(err.response?.data?.error || 'Failed to send interest');
// //     } finally {
// //       setSendingInterest(null);
// //     }
// //   };

// //   const handleDeleteInterest = async (id: string, status: string) => {
// //     const isPending = status === 'PENDING';
// //     const confirmMessage = isPending 
// //       ? "Are you sure you want to withdraw your interest request?" 
// //       : "Are you sure you want to delete this request record? This will permanently close the chat room and allow you to express interest in this listing again.";
    
// //     if (!window.confirm(confirmMessage)) return;

// //     try {
// //       await interestsAPI.withdraw(id);
// //       toast.success(isPending ? 'Interest request withdrawn!' : 'Request record deleted!');
// //       queryClient.invalidateQueries({ queryKey: ['myInterests'] });
// //       queryClient.invalidateQueries({ queryKey: ['listings'] });
// //     } catch {
// //       toast.error('Failed to update request');
// //     }
// //   };

// //   const handleSaveProfile = async (e: React.FormEvent) => {
// //     e.preventDefault();
// //     setSavingProfile(true);
// //     try {
// //       await profilesAPI.saveTenant({
// //         preferredLocation: profileForm.preferredLocation,
// //         budgetMin: Number(profileForm.budgetMin),
// //         budgetMax: Number(profileForm.budgetMax),
// //         moveInDate: profileForm.moveInDate,
// //         bio: profileForm.bio,
// //         preferences: profileForm.preferences,
// //       });
// //       toast.success('Profile updated successfully!');
// //       queryClient.invalidateQueries({ queryKey: ['tenantProfile'] });
// //       queryClient.invalidateQueries({ queryKey: ['listings'] });
// //     } catch (err: any) {
// //       toast.error(err.response?.data?.error || 'Failed to save profile');
// //     } finally {
// //       setSavingProfile(false);
// //     }
// //   };

// //   const alreadySentInterest = (listingId: string) =>
// //     interests.some(i => i.listingId === listingId);

// //   const tabs = [
// //     { id: 'browse', label: 'Browse Rooms', icon: Home },
// //     { id: 'interests', label: 'My Interests', icon: Zap, count: interests.filter(i => i.status === 'PENDING').length },
// //     { id: 'profile', label: 'My Preferences', icon: User },
// //   ];

// //   return (
// //     <div className="min-h-screen bg-white dark:bg-dark-950 transition-colors duration-300">
// //       <Navbar currentView={tab === 'browse' ? 'list' : tab} onNavigate={(view) => setTab(view === 'list' ? 'browse' : (view as any))} />

// //       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
// //         {/* Header Block (Premium Mesh Banner) */}
// //         <div className="relative overflow-hidden rounded-3xl p-8 mb-8 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white shadow-xl shadow-indigo-500/10">
// //           <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
// //           <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
// //             <div>
// //               <h1 className="text-3xl font-extrabold tracking-tight mb-2">
// //                 Find Your Match, {user?.name}! 👋
// //               </h1>
// //               <p className="text-indigo-100 max-w-xl text-sm leading-relaxed">
// //                 {!myProfile 
// //                   ? 'Complete your preferences to unlock compatibility matching scores powered by our AI engine.' 
// //                   : 'Compare rooms with custom compatibility ratings and start chatting instantly.'}
// //               </p>
// //             </div>
// //             {!myProfile && (
// //               <motion.button 
// //                 whileHover={{ scale: 1.05 }}
// //                 whileTap={{ scale: 0.95 }}
// //                 onClick={() => setTab('profile')} 
// //                 className="bg-white text-indigo-700 font-bold px-6 py-3 rounded-xl hover:bg-indigo-50 transition-colors flex items-center gap-2 shadow-lg shadow-black/10 text-sm whitespace-nowrap align-self-start"
// //               >
// //                 <Sparkles size={16} className="text-indigo-600 animate-pulse" /> Complete Profile
// //               </motion.button>
// //             )}
// //           </div>
// //         </div>

// //         {/* Tab Switcher */}
// //         <div className="flex gap-1 bg-dark-50 dark:bg-dark-900 border border-dark-200 dark:border-dark-800/80 p-1.5 rounded-2xl mb-8 overflow-x-auto">
// //           {tabs.map(t => (
// //             <button
// //               key={t.id}
// //               onClick={() => setTab(t.id as any)}
// //               className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all whitespace-nowrap relative ${
// //                 tab === t.id
// //                   ? 'bg-white dark:bg-dark-800 text-indigo-600 dark:text-indigo-400 shadow-sm border border-dark-100 dark:border-dark-700'
// //                   : 'text-dark-500 hover:text-dark-700 dark:hover:text-dark-300'
// //               }`}
// //             >
// //               <t.icon size={15} />
// //               <span>{t.label}</span>
// //               {t.count ? (
// //                 <span className="bg-pink-500 text-white text-[10px] font-black rounded-full px-2 py-0.5 min-w-[20px] text-center shadow-sm">
// //                   {t.count}
// //                 </span>
// //               ) : null}
// //             </button>
// //           ))}
// //         </div>

// //         {/* Tab Contents with Transitions */}
// //         <AnimatePresence mode="wait">
// //           {tab === 'browse' && (
// //             <motion.div
// //               key="browse"
// //               initial={{ opacity: 0, y: 15 }}
// //               animate={{ opacity: 1, y: 0 }}
// //               exit={{ opacity: 0, y: -15 }}
// //               transition={{ duration: 0.3 }}
// //             >
// //               {/* Filter Area */}
// //               <div className="card p-5 mb-8 border border-dark-200 dark:border-dark-850 shadow-md">
// //                 <div className="flex items-center gap-2 font-bold text-sm text-dark-800 dark:text-dark-200 mb-4">
// //                   <Filter size={16} className="text-indigo-500" />
// //                   <span>Filter Options</span>
// //                 </div>
// //                 <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
// //                   <div className="flex-1 flex items-center gap-2 bg-dark-50 dark:bg-dark-800 border border-dark-200 dark:border-dark-700 rounded-xl px-3 py-1.5 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent transition-all">
// //                     <MapPin size={16} className="text-dark-400 shrink-0" />
// //                     <input
// //                       type="text"
// //                       placeholder="Search location (e.g., Mumbai)..."
// //                       className="w-full bg-transparent border-none outline-none text-sm text-dark-900 dark:text-dark-100 placeholder:text-dark-400 py-1"
// //                       value={filters.location}
// //                       onChange={e => { setFilters(f => ({ ...f, location: e.target.value })); setPage(1); }}
// //                     />
// //                   </div>
                  
// //                   <div className="flex items-center gap-3">
// //                     <div className="flex items-center gap-2 bg-dark-50 dark:bg-dark-800 border border-dark-200 dark:border-dark-700 rounded-xl px-3 py-1.5 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent transition-all w-32">
// //                       <IndianRupee size={15} className="text-dark-400 shrink-0" />
// //                       <input
// //                         type="number"
// //                         placeholder="Min"
// //                         className="w-full bg-transparent border-none outline-none text-sm text-dark-900 dark:text-dark-100 py-1"
// //                         value={filters.minBudget}
// //                         onChange={e => { setFilters(f => ({ ...f, minBudget: e.target.value })); setPage(1); }}
// //                       />
// //                     </div>
// //                     <span className="text-dark-400 font-semibold">—</span>
// //                     <div className="flex items-center gap-2 bg-dark-50 dark:bg-dark-800 border border-dark-200 dark:border-dark-700 rounded-xl px-3 py-1.5 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent transition-all w-32">
// //                       <IndianRupee size={15} className="text-dark-400 shrink-0" />
// //                       <input
// //                         type="number"
// //                         placeholder="Max"
// //                         className="w-full bg-transparent border-none outline-none text-sm text-dark-900 dark:text-dark-100 py-1"
// //                         value={filters.maxBudget}
// //                         onChange={e => { setFilters(f => ({ ...f, maxBudget: e.target.value })); setPage(1); }}
// //                       />
// //                     </div>
// //                   </div>

// //                   <button
// //                     onClick={() => { setFilters({ location: '', minBudget: '', maxBudget: '' }); setPage(1); }}
// //                     className="btn-secondary py-2.5 px-5 text-sm font-semibold border border-dark-200 dark:border-dark-750 hover:bg-dark-100 dark:hover:bg-dark-800 transition-colors"
// //                   >
// //                     Reset Filters
// //                   </button>
// //                 </div>
// //               </div>

// //               {/* Grid block */}
// //               {listingsLoading ? (
// //                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 animate-fade-in">
// //                   {[...Array(6)].map((_, i) => <ListingCardSkeleton key={i} />)}
// //                 </div>
// //               ) : listings.length === 0 ? (
// //                 <div className="text-center py-20 card border border-dashed border-dark-200 dark:border-dark-800 p-12">
// //                   <Home size={48} className="mx-auto text-dark-300 dark:text-dark-600 mb-4" />
// //                   <h3 className="font-bold text-lg mb-2">No listings match your search</h3>
// //                   <p className="text-dark-400 text-sm max-w-sm mx-auto">Try broadening your budget limits or entering a simpler location filter.</p>
// //                 </div>
// //               ) : (
// //                 <motion.div 
// //                   layout
// //                   className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
// //                 >
// //                   {listings.map(listing => (
// //                     <motion.div 
// //                       layout
// //                       initial={{ opacity: 0, scale: 0.95 }}
// //                       animate={{ opacity: 1, scale: 1 }}
// //                       transition={{ duration: 0.3 }}
// //                       key={listing.id} 
// //                       className="relative"
// //                     >
// //                       <ListingCard listing={listing} compatibilityScore={listing.compatibilityScore} showScore={!!myProfile} />
// //                       <div className="absolute bottom-4 right-4 z-10">
// //                         {!alreadySentInterest(listing.id) ? (
// //                           <button
// //                             onClick={e => { e.preventDefault(); e.stopPropagation(); setShowInterestModal(listing); }}
// //                             className="btn-primary py-1.5 px-3.5 text-xs flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-750 shadow-md shadow-indigo-650/20 glow-btn"
// //                             id={`express-interest-${listing.id}`}
// //                           >
// //                             <Send size={11} /> Express Interest
// //                           </button>
// //                         ) : (
// //                           <div className="badge bg-emerald-500 text-white font-bold px-3 py-1.5 rounded-full text-xs shadow-md shadow-emerald-500/10 flex items-center gap-1.5 border-none">
// //                             <CheckCircle size={12} /> Interest Sent
// //                           </div>
// //                         )}
// //                       </div>
// //                     </motion.div>
// //                   ))}
// //                 </motion.div>
// //               )}

// //               <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
// //             </motion.div>
// //           )}

// //           {tab === 'interests' && (
// //             <motion.div
// //               key="interests"
// //               initial={{ opacity: 0, y: 15 }}
// //               animate={{ opacity: 1, y: 0 }}
// //               exit={{ opacity: 0, y: -15 }}
// //               className="space-y-4"
// //             >
// //               {interests.length === 0 ? (
// //                 <div className="text-center py-20 card border border-dashed border-dark-200 dark:border-dark-800 p-12">
// //                   <Zap size={48} className="mx-auto text-dark-300 dark:text-dark-600 mb-4 animate-pulse" />
// //                   <h3 className="font-bold text-lg mb-2">No interest requests yet</h3>
// //                   <p className="text-dark-400 text-sm max-w-sm mx-auto mb-6">Browse room listings and let owners know you're interested.</p>
// //                   <button onClick={() => setTab('browse')} className="btn-primary bg-indigo-600 hover:bg-indigo-750">Browse Rooms</button>
// //                 </div>
// //               ) : (
// //                 interests.map(interest => (
// //                   <div key={interest.id} className="card p-6 border border-dark-200 dark:border-dark-850 bg-white dark:bg-dark-900 shadow-md hover:shadow-lg transition-all">
// //                     <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
// //                       <div className="flex-1">
// //                         <div className="flex items-center gap-3 mb-2.5">
// //                           <h3 className="font-bold text-lg text-dark-900 dark:text-dark-50">{interest.listing?.title || 'Listing'}</h3>
// //                           <span className={`badge ${statusClass[interest.status]} px-3 py-1 font-bold text-xs`}>
// //                             {statusIcon[interest.status]} <span className="ml-1 uppercase tracking-wider">{interest.status}</span>
// //                           </span>
// //                         </div>
// //                         <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-dark-500 dark:text-dark-400">
// //                           <span className="flex items-center gap-1"><MapPin size={13} className="text-dark-400" /> {interest.listing?.location}</span>
// //                           <span className="flex items-center gap-1 font-semibold text-indigo-600 dark:text-indigo-400"><IndianRupee size={13} />{interest.listing?.rent?.toLocaleString()}/mo</span>
// //                           <span className="flex items-center gap-1"><Calendar size={13} className="text-dark-400" /> Sent: {format(new Date(interest.createdAt), 'dd MMM yyyy')}</span>
// //                         </div>
// //                         {interest.message && (
// //                           <div className="mt-3 p-3 bg-dark-50 dark:bg-dark-900/50 rounded-lg border border-dark-100 dark:border-dark-850 text-sm text-dark-600 dark:text-dark-300 italic">
// //                             "{interest.message}"
// //                           </div>
// //                         )}
// //                       </div>
// //                       <div className="flex items-center gap-2 self-start sm:self-center">
// //                         {interest.status === 'ACCEPTED' && interest.chatRoom && (
// //                           <Link
// //                             to={`/chat/${interest.chatRoom.id}`}
// //                             className="btn-primary py-2.5 px-5 text-sm flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-500/10 glow-btn"
// //                             id={`chat-room-${interest.chatRoom.id}`}
// //                           >
// //                             <MessageCircle size={15} /> Open Live Chat
// //                           </Link>
// //                         )}
// //                         <Link to={`/listings/${interest.listingId}`} className="btn-secondary py-2.5 px-5 text-sm font-semibold border border-dark-200 dark:border-dark-750">
// //                           View details
// //                         </Link>
// //                         <button
// //                           onClick={() => handleDeleteInterest(interest.id, interest.status)}
// //                           className="btn-danger py-2.5 px-5 text-sm font-semibold border border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/10 text-rose-600 dark:text-rose-450 rounded-xl transition-all"
// //                         >
// //                           {interest.status === 'PENDING' ? 'Withdraw' : 'Delete'}
// //                         </button>
// //                       </div>
// //                     </div>
// //                   </div>
// //                 ))
// //               )}
// //             </motion.div>
// //           )}

// //           {tab === 'profile' && (
// //             <motion.div
// //               key="profile"
// //               initial={{ opacity: 0, y: 15 }}
// //               animate={{ opacity: 1, y: 0 }}
// //               exit={{ opacity: 0, y: -15 }}
// //               className="max-w-2xl mx-auto"
// //             >
// //               <div className="card p-8 border border-dark-200 dark:border-dark-850 shadow-xl bg-white dark:bg-dark-900">
// //                 <div className="flex items-center gap-4 mb-8 pb-4 border-b border-dark-100 dark:border-dark-800">
// //                   <div className="w-14 h-14 bg-gradient-to-tr from-indigo-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/25">
// //                     <User size={24} className="text-white animate-pulse" />
// //                   </div>
// //                   <div>
// //                     <h2 className="font-extrabold text-xl">Matching Parameters</h2>
// //                     <p className="text-sm text-dark-500 dark:text-dark-400">Configure your target preferences for AI Compatibility scoring</p>
// //                   </div>
// //                 </div>

// //                 <form onSubmit={handleSaveProfile} className="space-y-6">
// //                   <div>
// //                     <label className="label">Preferred Location</label>
// //                     <input
// //                       type="text"
// //                       className="input"
// //                       placeholder="e.g., Indiranagar, Bangalore"
// //                       value={profileForm.preferredLocation}
// //                       onChange={e => setProfileForm(f => ({ ...f, preferredLocation: e.target.value }))}
// //                       required
// //                     />
// //                   </div>
                  
// //                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //                     <div>
// //                       <label className="label">Minimum Budget Target (₹/mo)</label>
// //                       <input
// //                         type="number"
// //                         className="input"
// //                         placeholder="5000"
// //                         value={profileForm.budgetMin}
// //                         onChange={e => setProfileForm(f => ({ ...f, budgetMin: e.target.value }))}
// //                         required
// //                       />
// //                     </div>
// //                     <div>
// //                       <label className="label">Maximum Budget Limit (₹/mo)</label>
// //                       <input
// //                         type="number"
// //                         className="input"
// //                         placeholder="20000"
// //                         value={profileForm.budgetMax}
// //                         onChange={e => setProfileForm(f => ({ ...f, budgetMax: e.target.value }))}
// //                         required
// //                       />
// //                     </div>
// //                   </div>
                  
// //                   <div>
// //                     <label className="label">Target Move-in Date</label>
// //                     <input
// //                       type="date"
// //                       className="input"
// //                       value={profileForm.moveInDate}
// //                       onChange={e => setProfileForm(f => ({ ...f, moveInDate: e.target.value }))}
// //                       required
// //                     />
// //                   </div>
                  
// //                   <div>
// //                     <label className="label">Bio (Introduce yourself to owners)</label>
// //                     <textarea
// //                       className="input resize-none h-28"
// //                       placeholder="Hi, I am a software dev working in HSR. I like clean environments..."
// //                       value={profileForm.bio}
// //                       onChange={e => setProfileForm(f => ({ ...f, bio: e.target.value }))}
// //                     />
// //                   </div>
                  
// //                   <div>
// //                     <label className="label">Special Habits & Preferences</label>
// //                     <textarea
// //                       className="input resize-none h-28"
// //                       placeholder="e.g. Vegetarian, non-smoker, quiet environment during work hours."
// //                       value={profileForm.preferences}
// //                       onChange={e => setProfileForm(f => ({ ...f, preferences: e.target.value }))}
// //                     />
// //                   </div>
                  
// //                   <button 
// //                     type="submit" 
// //                     className="btn-primary w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-750 py-3 font-bold shadow-lg shadow-indigo-600/10 glow-btn" 
// //                     disabled={savingProfile}
// //                   >
// //                     {savingProfile && <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
// //                     {savingProfile ? 'Saving updates...' : 'Save and Calculate Compatibility'}
// //                   </button>
// //                 </form>
// //               </div>
// //             </motion.div>
// //           )}
// //         </AnimatePresence>
// //       </div>

// //       {/* Modal with AnimatePresence */}
// //       <AnimatePresence>
// //         {showInterestModal && (
// //           <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
// //             <motion.div 
// //               initial={{ opacity: 0, scale: 0.95 }}
// //               animate={{ opacity: 1, scale: 1 }}
// //               exit={{ opacity: 0, scale: 0.95 }}
// //               className="card max-w-md w-full p-6 bg-white dark:bg-dark-900 border border-dark-200 dark:border-dark-800 shadow-2xl relative overflow-hidden"
// //             >
// //               <h3 className="font-extrabold text-xl mb-2 flex items-center gap-2">
// //                 <Sparkles size={20} className="text-indigo-500 animate-pulse" /> Express Interest
// //               </h3>
// //               <p className="text-sm text-dark-500 dark:text-dark-400 mb-4 leading-relaxed">
// //                 Send a quick introduction to the owner of <strong>{showInterestModal.title}</strong>. This initiates a live room.
// //               </p>
              
// //               <textarea
// //                 className="input resize-none h-32 mb-5"
// //                 placeholder="Introduce yourself (profession, move-in flexibility, or key details that make you a great flatmate)..."
// //                 value={interestMessage}
// //                 onChange={e => setInterestMessage(e.target.value)}
// //               />
              
// //               <div className="flex gap-3">
// //                 <button 
// //                   onClick={() => { setShowInterestModal(null); setInterestMessage(''); }} 
// //                   className="btn-secondary flex-1 border border-dark-200 dark:border-dark-750 text-sm font-semibold"
// //                 >
// //                   Cancel
// //                 </button>
// //                 <button
// //                   onClick={() => handleSendInterest(showInterestModal)}
// //                   disabled={!!sendingInterest}
// //                   className="btn-primary flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-750 text-sm font-bold shadow-lg shadow-indigo-600/10 glow-btn"
// //                 >
// //                   {sendingInterest ? (
// //                     <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
// //                   ) : (
// //                     <Send size={13} />
// //                   )}
// //                   {sendingInterest ? 'Sending...' : 'Send Request'}
// //                 </button>
// //               </div>
// //             </motion.div>
// //           </div>
// //         )}
// //       </AnimatePresence>
// //     </div>
// //   );
// // }




// import { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { motion, AnimatePresence } from 'framer-motion';
// import {
//   MessageCircle,
//   Clock,
//   CheckCircle,
//   XCircle,
//   User,
//   Home,
//   Zap,
//   Send,
//   IndianRupee,
//   MapPin,
//   Calendar,
//   Sparkles,
//   Filter,
// } from 'lucide-react';
// import { useQuery, useQueryClient } from '@tanstack/react-query';
// import {
//   listingsAPI,
//   interestsAPI,
//   profilesAPI,
// } from '../../lib/api';
// import { useAuth } from '../../contexts/AuthContext';
// import Navbar from '../../components/Navbar';
// import ListingCard, {
//   ListingCardSkeleton,
// } from '../../components/ListingCard';
// import Pagination from '../../components/Pagination';
// import { Listing, Interest } from '../../types';
// import toast from 'react-hot-toast';
// import { format } from 'date-fns';

// const statusIcon: Record<string, React.ReactNode> = {
//   PENDING: <Clock size={14} className="text-amber-500" />,
//   ACCEPTED: <CheckCircle size={14} className="text-emerald-600" />,
//   DECLINED: <XCircle size={14} className="text-red-500" />,
// };

// const statusClass: Record<string, string> = {
//   PENDING: 'badge-yellow',
//   ACCEPTED: 'badge-green',
//   DECLINED: 'badge-red',
// };

// const inputClass =
//   'w-full rounded-xl border border-[#DDE5D9] bg-white px-4 py-3 text-sm text-[#24352C] placeholder:text-[#9AA89B] outline-none transition-all focus:border-[#6F9B7B] focus:ring-4 focus:ring-[#6F9B7B]/15 dark:border-dark-700 dark:bg-dark-800 dark:text-dark-100';

// const primaryButtonClass =
//   'inline-flex items-center justify-center gap-2 rounded-xl bg-[#285541] px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#1E4231] focus:outline-none focus:ring-4 focus:ring-[#6F9B7B]/25 disabled:cursor-not-allowed disabled:opacity-60';

// const secondaryButtonClass =
//   'inline-flex items-center justify-center gap-2 rounded-xl border border-[#DDE5D9] bg-white px-5 py-3 text-sm font-semibold text-[#385344] transition-all hover:bg-[#F0F5EE] focus:outline-none focus:ring-4 focus:ring-[#6F9B7B]/15 dark:border-dark-700 dark:bg-dark-800 dark:text-dark-100 dark:hover:bg-dark-700';

// export default function TenantDashboard() {
//   const { user } = useAuth();
//   const queryClient = useQueryClient();

//   const [tab, setTab] = useState<
//     'browse' | 'interests' | 'profile'
//   >('browse');

//   const [filters, setFilters] = useState({
//     location: '',
//     minBudget: '',
//     maxBudget: '',
//   });

//   const [page, setPage] = useState(1);
//   const [sendingInterest, setSendingInterest] =
//     useState<string | null>(null);
//   const [interestMessage, setInterestMessage] = useState('');
//   const [showInterestModal, setShowInterestModal] =
//     useState<Listing | null>(null);

//   const [profileForm, setProfileForm] = useState({
//     preferredLocation: '',
//     budgetMin: '',
//     budgetMax: '',
//     moveInDate: '',
//     bio: '',
//     preferences: '',
//   });

//   const [savingProfile, setSavingProfile] = useState(false);

//   const { data: listingsData, isLoading: listingsLoading } =
//     useQuery({
//       queryKey: ['listings', filters, page],
//       queryFn: () =>
//         listingsAPI
//           .getAll({ ...filters, page, limit: 9 })
//           .then((r) => r.data),
//     });

//   const { data: myProfile } = useQuery({
//     queryKey: ['tenantProfile'],
//     queryFn: () => profilesAPI.getTenant().then((r) => r.data),
//     enabled: !!user,
//   });

//   const { data: myInterests } = useQuery({
//     queryKey: ['myInterests'],
//     queryFn: () => interestsAPI.getMy().then((r) => r.data),
//     enabled: !!user,
//   });

//   useEffect(() => {
//     if (myProfile) {
//       setProfileForm({
//         preferredLocation: myProfile.preferredLocation || '',
//         budgetMin:
//           myProfile.budgetMin != null
//             ? String(myProfile.budgetMin)
//             : '',
//         budgetMax:
//           myProfile.budgetMax != null
//             ? String(myProfile.budgetMax)
//             : '',
//         moveInDate: myProfile.moveInDate
//           ? myProfile.moveInDate.split('T')[0]
//           : '',
//         bio: myProfile.bio || '',
//         preferences: myProfile.preferences || '',
//       });
//     }
//   }, [myProfile]);

//   const listings: Listing[] =
//     listingsData?.listings || listingsData || [];

//   const totalPages = listingsData?.totalPages || 1;
//   const interests: Interest[] = myInterests || [];

//   const handleSendInterest = async (listing: Listing) => {
//     setSendingInterest(listing.id);

//     try {
//       await interestsAPI.send({
//         listingId: listing.id,
//         message: interestMessage.trim(),
//       });

//       toast.success('Interest sent successfully!');

//       await queryClient.invalidateQueries({
//         queryKey: ['myInterests'],
//       });

//       await queryClient.invalidateQueries({
//         queryKey: ['listings'],
//       });

//       setShowInterestModal(null);
//       setInterestMessage('');
//     } catch (err: any) {
//       toast.error(
//         err.response?.data?.error ||
//           'Failed to send interest. Please try again.'
//       );
//     } finally {
//       setSendingInterest(null);
//     }
//   };

//   const handleDeleteInterest = async (
//     id: string,
//     status: string
//   ) => {
//     const isPending = status === 'PENDING';

//     const confirmMessage = isPending
//       ? 'Are you sure you want to withdraw your interest request?'
//       : 'Are you sure you want to delete this request record?';

//     if (!window.confirm(confirmMessage)) return;

//     try {
//       await interestsAPI.withdraw(id);

//       toast.success(
//         isPending
//           ? 'Interest request withdrawn!'
//           : 'Request record deleted!'
//       );

//       await queryClient.invalidateQueries({
//         queryKey: ['myInterests'],
//       });

//       await queryClient.invalidateQueries({
//         queryKey: ['listings'],
//       });
//     } catch (err: any) {
//       toast.error(
//         err.response?.data?.error ||
//           'Failed to update request.'
//       );
//     }
//   };

//   const handleSaveProfile = async (
//     e: React.FormEvent<HTMLFormElement>
//   ) => {
//     e.preventDefault();

//     const minBudget = Number(profileForm.budgetMin);
//     const maxBudget = Number(profileForm.budgetMax);

//     if (
//       profileForm.budgetMin === '' ||
//       profileForm.budgetMax === '' ||
//       minBudget < 0 ||
//       maxBudget < minBudget
//     ) {
//       toast.error(
//         'Maximum budget must be greater than or equal to minimum budget.'
//       );
//       return;
//     }

//     setSavingProfile(true);

//     try {
//       await profilesAPI.saveTenant({
//         preferredLocation:
//           profileForm.preferredLocation.trim(),
//         budgetMin: minBudget,
//         budgetMax: maxBudget,
//         moveInDate: profileForm.moveInDate,
//         bio: profileForm.bio.trim(),
//         preferences: profileForm.preferences.trim(),
//       });

//       toast.success('Your preferences have been saved!');

//       await queryClient.invalidateQueries({
//         queryKey: ['tenantProfile'],
//       });

//       await queryClient.invalidateQueries({
//         queryKey: ['listings'],
//       });
//     } catch (err: any) {
//       toast.error(
//         err.response?.data?.error ||
//           'Failed to save preferences.'
//       );
//     } finally {
//       setSavingProfile(false);
//     }
//   };

//   const alreadySentInterest = (listingId: string) =>
//     interests.some(
//       (interest) => interest.listingId === listingId
//     );

//   const resetFilters = () => {
//     setFilters({
//       location: '',
//       minBudget: '',
//       maxBudget: '',
//     });
//     setPage(1);
//   };

//   const tabs = [
//     {
//       id: 'browse',
//       label: 'Browse Homes',
//       icon: Home,
//     },
//     {
//       id: 'interests',
//       label: 'My Interests',
//       icon: Zap,
//       count: interests.filter(
//         (interest) => interest.status === 'PENDING'
//       ).length,
//     },
//     {
//       id: 'profile',
//       label: 'My Preferences',
//       icon: User,
//     },
//   ];

//   return (
//     <div className="min-h-screen bg-[#F7F8F4] text-[#24352C] transition-colors duration-300 dark:bg-dark-950 dark:text-dark-100">
//       <Navbar
//         currentView={tab === 'browse' ? 'list' : tab}
//         onNavigate={(view) =>
//           setTab(
//             view === 'list'
//               ? 'browse'
//               : (view as 'interests' | 'profile')
//           )
//         }
//       />

//       <main className="mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-7 lg:px-8">
//         {/* Compact, professional welcome banner */}
//         <section className="relative mb-6 overflow-hidden rounded-[26px] bg-gradient-to-r from-[#00A884] via-[#078B76] to-[#087965] px-5 py-5 text-white shadow-md shadow-[#087965]/10 sm:px-7 sm:py-6 lg:px-9">
//           <div className="pointer-events-none absolute -right-10 -top-16 h-44 w-44 rounded-full bg-white/[0.08] blur-2xl" />

//           <div className="pointer-events-none absolute bottom-[-5rem] right-[28%] h-40 w-40 rounded-full bg-[#CDEFE2]/10 blur-2xl" />

//           <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
//             <div className="min-w-0 max-w-2xl">
//               <div className="mb-2 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[#D9FFF3]">
//                 <Home size={14} />
//                 Your rental dashboard
//               </div>

//               <h1 className="mb-2 text-2xl font-bold tracking-tight sm:text-[28px]">
//                 Hello, {user?.name || 'there'}!{' '}
//                 <span aria-hidden="true">👋</span>
//               </h1>

//               <p className="max-w-2xl text-sm leading-6 text-white/90 sm:text-[15px]">
//                 {!myProfile
//                   ? 'Discover homes that fit your budget, preferred location and lifestyle.'
//                   : 'Browse available homes, compare compatibility scores and contact owners when you find the right fit.'}
//               </p>
//             </div>

//             {!myProfile && (
//               <motion.button
//                 whileHover={{ y: -1 }}
//                 whileTap={{ scale: 0.98 }}
//                 onClick={() => setTab('profile')}
//                 className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-[#087965] shadow-sm transition-colors hover:bg-[#EFFBF6] focus:outline-none focus:ring-4 focus:ring-white/25 sm:w-auto"
//               >
//                 <Sparkles size={17} />
//                 Set preferences
//               </motion.button>
//             )}
//           </div>
//         </section>


//                 {/* Dashboard tabs */}
//         <nav
//           aria-label="Tenant dashboard sections"
//           className="mb-6 flex gap-1.5 overflow-x-auto rounded-2xl border border-[#DDE5D9] bg-[#EEF2EB] p-1.5 shadow-sm dark:border-dark-800 dark:bg-dark-900"
//         >
//           {tabs.map((item) => {
//             const Icon = item.icon;
//             const active = tab === item.id;

//             return (
//               <button
//                 key={item.id}
//                 type="button"
//                 onClick={() =>
//                   setTab(
//                     item.id as
//                       | 'browse'
//                       | 'interests'
//                       | 'profile'
//                   )
//                 }
//                 aria-current={active ? 'page' : undefined}
//                 className={`relative inline-flex shrink-0 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-all sm:flex-1 sm:px-5 ${
//                   active
//                     ? 'bg-white text-[#285541] shadow-sm ring-1 ring-[#DDE5D9] dark:bg-dark-800 dark:text-[#A5D1AF] dark:ring-dark-700'
//                     : 'text-[#657468] hover:bg-white/60 hover:text-[#285541] dark:text-dark-400 dark:hover:bg-dark-800 dark:hover:text-dark-100'
//                 }`}
//               >
//                 <Icon size={16} />
//                 <span>{item.label}</span>

//                 {!!item.count && (
//                   <span className="inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-[#477A5D] px-1.5 text-[11px] font-bold text-white">
//                     {item.count}
//                   </span>
//                 )}
//               </button>
//             );
//           })}
//         </nav>

//         <AnimatePresence mode="wait">
//           {/* Browse homes */}
//           {tab === 'browse' && (
//             <motion.section
//               key="browse"
//               initial={{ opacity: 0, y: 12 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -8 }}
//               transition={{ duration: 0.22 }}
//             >
//               {/* Filters */}
//               <div className="mb-8 rounded-2xl border border-[#DDE5D9] bg-white p-5 shadow-sm dark:border-dark-800 dark:bg-dark-900 sm:p-6">
//                 <div className="mb-5 flex items-center gap-3">
//                   <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E7F0E7] text-[#285541] dark:bg-[#285541]/30 dark:text-[#A5D1AF]">
//                     <Filter size={18} />
//                   </div>

//                   <div>
//                     <h2 className="font-bold text-[#24352C] dark:text-dark-100">
//                       Find your place
//                     </h2>
//                     <p className="mt-0.5 text-xs text-[#788579] dark:text-dark-400">
//                       Narrow down homes by location and monthly rent.
//                     </p>
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(260px,0.8fr)_auto]">
//                   {/* Location */}
//                   <label className="flex min-w-0 items-center gap-3 rounded-xl border border-[#DDE5D9] bg-[#F9FAF7] px-3.5 transition-all focus-within:border-[#6F9B7B] focus-within:ring-4 focus-within:ring-[#6F9B7B]/15 dark:border-dark-700 dark:bg-dark-800">
//                     <MapPin
//                       size={17}
//                       className="shrink-0 text-[#6F9278]"
//                     />
//                     <input
//                       type="text"
//                       aria-label="Search location"
//                       placeholder="City or locality"
//                       className="w-full min-w-0 bg-transparent py-3 text-sm text-[#24352C] outline-none placeholder:text-[#9AA89B] dark:text-dark-100"
//                       value={filters.location}
//                       onChange={(e) => {
//                         setFilters((current) => ({
//                           ...current,
//                           location: e.target.value,
//                         }));
//                         setPage(1);
//                       }}
//                     />
//                   </label>

//                   {/* Budget */}
//                   <div className="grid grid-cols-2 gap-3">
//                     <label className="flex min-w-0 items-center gap-2 rounded-xl border border-[#DDE5D9] bg-[#F9FAF7] px-3 transition-all focus-within:border-[#6F9B7B] focus-within:ring-4 focus-within:ring-[#6F9B7B]/15 dark:border-dark-700 dark:bg-dark-800">
//                       <IndianRupee
//                         size={15}
//                         className="shrink-0 text-[#6F9278]"
//                       />
//                       <input
//                         type="number"
//                         aria-label="Minimum monthly rent"
//                         min="0"
//                         placeholder="Min rent"
//                         className="w-full min-w-0 bg-transparent py-3 text-sm outline-none placeholder:text-[#9AA89B] dark:text-dark-100"
//                         value={filters.minBudget}
//                         onChange={(e) => {
//                           setFilters((current) => ({
//                             ...current,
//                             minBudget: e.target.value,
//                           }));
//                           setPage(1);
//                         }}
//                       />
//                     </label>

//                     <label className="flex min-w-0 items-center gap-2 rounded-xl border border-[#DDE5D9] bg-[#F9FAF7] px-3 transition-all focus-within:border-[#6F9B7B] focus-within:ring-4 focus-within:ring-[#6F9B7B]/15 dark:border-dark-700 dark:bg-dark-800">
//                       <IndianRupee
//                         size={15}
//                         className="shrink-0 text-[#6F9278]"
//                       />
//                       <input
//                         type="number"
//                         aria-label="Maximum monthly rent"
//                         min={filters.minBudget || 0}
//                         placeholder="Max rent"
//                         className="w-full min-w-0 bg-transparent py-3 text-sm outline-none placeholder:text-[#9AA89B] dark:text-dark-100"
//                         value={filters.maxBudget}
//                         onChange={(e) => {
//                           setFilters((current) => ({
//                             ...current,
//                             maxBudget: e.target.value,
//                           }));
//                           setPage(1);
//                         }}
//                       />
//                     </label>
//                   </div>

//                   <button
//                     type="button"
//                     onClick={resetFilters}
//                     className={secondaryButtonClass}
//                   >
//                     Reset filters
//                   </button>
//                 </div>
//               </div>

//               {/* Listing results */}
//               {listingsLoading ? (
//                 <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
//                   {Array.from({ length: 6 }).map((_, index) => (
//                     <ListingCardSkeleton key={index} />
//                   ))}
//                 </div>
//               ) : listings.length === 0 ? (
//                 <div className="rounded-3xl border border-dashed border-[#CFDCCB] bg-white px-6 py-16 text-center dark:border-dark-700 dark:bg-dark-900 sm:px-12">
//                   <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#E7F0E7] text-[#477A5D] dark:bg-[#285541]/30 dark:text-[#A5D1AF]">
//                     <Home size={29} />
//                   </div>

//                   <h3 className="mb-2 text-lg font-bold text-[#24352C] dark:text-dark-100">
//                     No homes found
//                   </h3>

//                   <p className="mx-auto mb-6 max-w-sm text-sm leading-6 text-[#788579] dark:text-dark-400">
//                     Try another location or adjust your rent range to see more available properties.
//                   </p>

//                   <button
//                     type="button"
//                     onClick={resetFilters}
//                     className={primaryButtonClass}
//                   >
//                     Clear all filters
//                   </button>
//                 </div>
//               ) : (
//                 <motion.div
//                   layout
//                   className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
//                 >
//                   {listings.map((listing) => (
//                     <motion.div
//                       layout
//                       initial={{ opacity: 0, y: 10 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       transition={{ duration: 0.22 }}
//                       key={listing.id}
//                       className="relative rounded-2xl"
//                     >
//                       <ListingCard
//                         listing={listing}
//                         compatibilityScore={listing.compatibilityScore}
//                         showScore={!!myProfile}
//                       />

//                       <div className="absolute bottom-4 right-4 z-10">
//                         {!alreadySentInterest(listing.id) ? (
//                           <button
//                             type="button"
//                             onClick={(e) => {
//                               e.preventDefault();
//                               e.stopPropagation();
//                               setShowInterestModal(listing);
//                             }}
//                             className="inline-flex items-center gap-1.5 rounded-xl bg-[#285541] px-3.5 py-2.5 text-xs font-semibold text-white shadow-md transition-all hover:bg-[#1E4231] focus:outline-none focus:ring-4 focus:ring-[#6F9B7B]/30"
//                             id={`express-interest-${listing.id}`}
//                           >
//                             <Send size={13} />
//                             Express interest
//                           </button>
//                         ) : (
//                           <span className="inline-flex items-center gap-1.5 rounded-full border border-[#C8DDC8] bg-[#EDF5EC] px-3 py-2 text-xs font-semibold text-[#285541] shadow-sm dark:border-[#477A5D] dark:bg-[#285541]/40 dark:text-[#D2E9D4]">
//                             <CheckCircle size={13} />
//                             Interest sent
//                           </span>
//                         )}
//                       </div>
//                     </motion.div>
//                   ))}
//                 </motion.div>
//               )}

//               {listings.length > 0 && (
//                 <Pagination
//                   page={page}
//                   totalPages={totalPages}
//                   onPageChange={setPage}
//                 />
//               )}
//             </motion.section>
//           )}

//           {/* My interests */}
//           {tab === 'interests' && (
//             <motion.section
//               key="interests"
//               initial={{ opacity: 0, y: 12 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -8 }}
//               transition={{ duration: 0.22 }}
//               className="space-y-4"
//             >
//               <div className="mb-5">
//                 <h2 className="text-xl font-extrabold text-[#24352C] dark:text-dark-100">
//                   Your interest requests
//                 </h2>
//                 <p className="mt-1 text-sm text-[#788579] dark:text-dark-400">
//                   Keep track of your requests and conversations with property owners.
//                 </p>
//               </div>


//                             {interests.length === 0 ? (
//                 <div className="rounded-3xl border border-dashed border-[#CFDCCB] bg-white px-6 py-16 text-center dark:border-dark-700 dark:bg-dark-900 sm:px-12">
//                   <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#E7F0E7] text-[#477A5D] dark:bg-[#285541]/30 dark:text-[#A5D1AF]">
//                     <Zap size={28} />
//                   </div>

//                   <h3 className="mb-2 text-lg font-bold text-[#24352C] dark:text-dark-100">
//                     No interest requests yet
//                   </h3>

//                   <p className="mx-auto mb-6 max-w-sm text-sm leading-6 text-[#788579] dark:text-dark-400">
//                     Found a place you like? Send an interest request to start a conversation with its owner.
//                   </p>

//                   <button
//                     type="button"
//                     onClick={() => setTab('browse')}
//                     className={primaryButtonClass}
//                   >
//                     <Home size={16} />
//                     Browse homes
//                   </button>
//                 </div>
//               ) : (
//                 interests.map((interest) => (
//                   <article
//                     key={interest.id}
//                     className="rounded-2xl border border-[#DDE5D9] bg-white p-5 shadow-sm transition-all hover:border-[#BED2BD] hover:shadow-md dark:border-dark-800 dark:bg-dark-900 sm:p-6"
//                   >
//                     <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
//                       <div className="min-w-0 flex-1">
//                         <div className="mb-3 flex flex-wrap items-center gap-3">
//                           <h3 className="text-lg font-bold text-[#24352C] dark:text-dark-100">
//                             {interest.listing?.title || 'Property listing'}
//                           </h3>

//                           <span
//                             className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide ${statusClass[interest.status]}`}
//                           >
//                             {statusIcon[interest.status]}
//                             {interest.status}
//                           </span>
//                         </div>

//                         <div className="flex flex-wrap items-center gap-x-5 gap-y-3 text-xs text-[#788579] dark:text-dark-400 sm:text-sm">
//                           <span className="inline-flex items-center gap-1.5">
//                             <MapPin
//                               size={14}
//                               className="text-[#6F9278]"
//                             />
//                             {interest.listing?.location || 'Location not specified'}
//                           </span>

//                           <span className="inline-flex items-center gap-1 font-semibold text-[#285541] dark:text-[#A5D1AF]">
//                             <IndianRupee size={14} />
//                             {interest.listing?.rent?.toLocaleString() || '—'}
//                             /month
//                           </span>

//                           <span className="inline-flex items-center gap-1.5">
//                             <Calendar
//                               size={14}
//                               className="text-[#6F9278]"
//                             />
//                             Sent{' '}
//                             {format(
//                               new Date(interest.createdAt),
//                               'dd MMM yyyy'
//                             )}
//                           </span>
//                         </div>

//                         {interest.message && (
//                           <div className="mt-4 rounded-xl border border-[#E0E8DD] bg-[#F5F8F2] p-4 text-sm leading-6 text-[#526557] dark:border-dark-700 dark:bg-dark-800 dark:text-dark-300">
//                             <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[#78917C]">
//                               Your message
//                             </p>
//                             <p className="break-words">
//                               “{interest.message}”
//                             </p>
//                           </div>
//                         )}
//                       </div>

//                       <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap lg:justify-end">
//                         {interest.status === 'ACCEPTED' &&
//                           interest.chatRoom && (
//                             <Link
//                               to={`/chat/${interest.chatRoom.id}`}
//                               className={primaryButtonClass}
//                               id={`chat-room-${interest.chatRoom.id}`}
//                             >
//                               <MessageCircle size={16} />
//                               Open chat
//                             </Link>
//                           )}

//                         <Link
//                           to={`/listings/${interest.listingId}`}
//                           className={secondaryButtonClass}
//                         >
//                           View details
//                         </Link>

//                         <button
//                           type="button"
//                           onClick={() =>
//                             handleDeleteInterest(
//                               interest.id,
//                               interest.status
//                             )
//                           }
//                           className="inline-flex items-center justify-center rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 transition-colors hover:bg-red-100 focus:outline-none focus:ring-4 focus:ring-red-500/10 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300 dark:hover:bg-red-950/60"
//                         >
//                           {interest.status === 'PENDING'
//                             ? 'Withdraw'
//                             : 'Delete'}
//                         </button>
//                       </div>
//                     </div>
//                   </article>
//                 ))
//               )}
//             </motion.section>
//           )}

//           {/* Preferences form */}
//           {tab === 'profile' && (
//             <motion.section
//               key="profile"
//               initial={{ opacity: 0, y: 12 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -8 }}
//               transition={{ duration: 0.22 }}
//               className="mx-auto max-w-3xl"
//             >
//               <div className="overflow-hidden rounded-3xl border border-[#DDE5D9] bg-white shadow-sm dark:border-dark-800 dark:bg-dark-900">
//                 <div className="border-b border-[#E5EAE1] bg-gradient-to-r from-[#F0F5EE] to-white p-6 dark:border-dark-800 dark:from-dark-800 dark:to-dark-900 sm:p-8">
//                   <div className="flex items-start gap-4">
//                     <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#285541] text-white shadow-md shadow-[#285541]/15">
//                       <User size={23} />
//                     </div>

//                     <div>
//                       <h2 className="text-xl font-extrabold text-[#24352C] dark:text-dark-100 sm:text-2xl">
//                         Your rental preferences
//                       </h2>
//                       <p className="mt-2 max-w-xl text-sm leading-6 text-[#788579] dark:text-dark-400">
//                         Share your location, budget and move-in plans to help find properties that suit your needs.
//                       </p>
//                     </div>
//                   </div>
//                 </div>

//                 <form
//                   onSubmit={handleSaveProfile}
//                   className="space-y-6 p-6 sm:p-8"
//                 >
//                   {/* Location */}
//                   <div>
//                     <label
//                       htmlFor="preferredLocation"
//                       className="mb-2 block text-sm font-semibold text-[#35483A] dark:text-dark-200"
//                     >
//                       Preferred location
//                     </label>

//                     <div className="relative">
//                       <MapPin
//                         size={17}
//                         className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#6F9278]"
//                       />
//                       <input
//                         id="preferredLocation"
//                         type="text"
//                         className={`${inputClass} pl-11`}
//                         placeholder="e.g. Indiranagar, Bengaluru"
//                         value={profileForm.preferredLocation}
//                         onChange={(e) =>
//                           setProfileForm((current) => ({
//                             ...current,
//                             preferredLocation: e.target.value,
//                           }))
//                         }
//                         required
//                       />
//                     </div>

//                     <p className="mt-2 text-xs text-[#8A988C] dark:text-dark-400">
//                       Enter the city or locality where you want to live.
//                     </p>
//                   </div>

//                   {/* Budget */}
//                   <div>
//                     <div className="mb-2">
//                       <h3 className="text-sm font-semibold text-[#35483A] dark:text-dark-200">
//                         Monthly rental budget
//                       </h3>
//                       <p className="mt-1 text-xs text-[#8A988C] dark:text-dark-400">
//                         Set a comfortable rent range in Indian rupees.
//                       </p>
//                     </div>

//                     <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//                       <div>
//                         <label
//                           htmlFor="budgetMin"
//                           className="mb-2 block text-xs font-medium text-[#788579] dark:text-dark-400"
//                         >
//                           Minimum budget (₹)
//                         </label>

//                         <div className="relative">
//                           <IndianRupee
//                             size={16}
//                             className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#6F9278]"
//                           />
//                           <input
//                             id="budgetMin"
//                             type="number"
//                             min="0"
//                             step="1"
//                             className={`${inputClass} pl-10`}
//                             placeholder="5000"
//                             value={profileForm.budgetMin}
//                             onChange={(e) =>
//                               setProfileForm((current) => ({
//                                 ...current,
//                                 budgetMin: e.target.value,
//                               }))
//                             }
//                             required
//                           />
//                         </div>
//                       </div>

//                       <div>
//                         <label
//                           htmlFor="budgetMax"
//                           className="mb-2 block text-xs font-medium text-[#788579] dark:text-dark-400"
//                         >
//                           Maximum budget (₹)
//                         </label>

//                         <div className="relative">
//                           <IndianRupee
//                             size={16}
//                             className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#6F9278]"
//                           />
//                           <input
//                             id="budgetMax"
//                             type="number"
//                             min={profileForm.budgetMin || 0}
//                             step="1"
//                             className={`${inputClass} pl-10`}
//                             placeholder="20000"
//                             value={profileForm.budgetMax}
//                             onChange={(e) =>
//                               setProfileForm((current) => ({
//                                 ...current,
//                                 budgetMax: e.target.value,
//                               }))
//                             }
//                             required
//                           />
//                         </div>
//                       </div>
//                     </div>
//                   </div>


//                                     {/* Move-in date */}
//                   <div>
//                     <label
//                       htmlFor="moveInDate"
//                       className="mb-2 block text-sm font-semibold text-[#35483A] dark:text-dark-200"
//                     >
//                       Preferred move-in date
//                     </label>

//                     <div className="relative">
//                       <Calendar
//                         size={17}
//                         className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#6F9278]"
//                       />
//                       <input
//                         id="moveInDate"
//                         type="date"
//                         className={`${inputClass} pl-11`}
//                         min={new Date().toISOString().split('T')[0]}
//                         value={profileForm.moveInDate}
//                         onChange={(e) =>
//                           setProfileForm((current) => ({
//                             ...current,
//                             moveInDate: e.target.value,
//                           }))
//                         }
//                         required
//                       />
//                     </div>
//                   </div>

//                   {/* Bio */}
//                   <div>
//                     <div className="mb-2 flex items-center justify-between gap-3">
//                       <label
//                         htmlFor="bio"
//                         className="text-sm font-semibold text-[#35483A] dark:text-dark-200"
//                       >
//                         A little about you
//                       </label>
//                       <span className="text-xs text-[#8A988C] dark:text-dark-400">
//                         {profileForm.bio.length}/500
//                       </span>
//                     </div>

//                     <textarea
//                       id="bio"
//                       className={`${inputClass} min-h-28 resize-y`}
//                       placeholder="Tell owners a little about yourself, your work or studies, and what you are looking for."
//                       value={profileForm.bio}
//                       maxLength={500}
//                       onChange={(e) =>
//                         setProfileForm((current) => ({
//                           ...current,
//                           bio: e.target.value,
//                         }))
//                       }
//                     />
//                   </div>

//                   {/* Preferences */}
//                   <div>
//                     <div className="mb-2 flex items-center justify-between gap-3">
//                       <label
//                         htmlFor="preferences"
//                         className="text-sm font-semibold text-[#35483A] dark:text-dark-200"
//                       >
//                         Lifestyle and preferences
//                       </label>
//                       <span className="text-xs text-[#8A988C] dark:text-dark-400">
//                         {profileForm.preferences.length}/500
//                       </span>
//                     </div>

//                     <textarea
//                       id="preferences"
//                       className={`${inputClass} min-h-28 resize-y`}
//                       placeholder="e.g. vegetarian, non-smoker, quiet environment, preferred amenities..."
//                       value={profileForm.preferences}
//                       maxLength={500}
//                       onChange={(e) =>
//                         setProfileForm((current) => ({
//                           ...current,
//                           preferences: e.target.value,
//                         }))
//                       }
//                     />
//                   </div>

//                   <div className="rounded-xl border border-[#DDE8D9] bg-[#F3F7F0] p-4 dark:border-dark-700 dark:bg-dark-800">
//                     <div className="flex items-start gap-3">
//                       <Sparkles
//                         size={18}
//                         className="mt-0.5 shrink-0 text-[#477A5D]"
//                       />
//                       <div>
//                         <p className="text-sm font-semibold text-[#355541] dark:text-[#B9D9BE]">
//                           Better preferences, better matches
//                         </p>
//                         <p className="mt-1 text-xs leading-5 text-[#718273] dark:text-dark-400">
//                           Keep your details accurate so the available compatibility score can help you compare suitable listings.
//                         </p>
//                       </div>
//                     </div>
//                   </div>

//                   <button
//                     type="submit"
//                     className={`${primaryButtonClass} w-full py-3.5`}
//                     disabled={savingProfile}
//                   >
//                     {savingProfile ? (
//                       <>
//                         <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
//                         Saving preferences...
//                       </>
//                     ) : (
//                       <>
//                         <CheckCircle size={17} />
//                         Save my preferences
//                       </>
//                     )}
//                   </button>
//                 </form>
//               </div>
//             </motion.section>
//           )}
//         </AnimatePresence>
//       </main>

//       {/* Express interest modal */}
//       <AnimatePresence>
//         {showInterestModal && (
//           <motion.div
//             className="fixed inset-0 z-50 flex items-center justify-center bg-[#17271D]/55 p-4 backdrop-blur-sm"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             onClick={() => {
//               if (!sendingInterest) {
//                 setShowInterestModal(null);
//                 setInterestMessage('');
//               }
//             }}
//           >
//             <motion.div
//               role="dialog"
//               aria-modal="true"
//               aria-labelledby="interest-modal-title"
//               initial={{ opacity: 0, y: 12, scale: 0.97 }}
//               animate={{ opacity: 1, y: 0, scale: 1 }}
//               exit={{ opacity: 0, y: 8, scale: 0.97 }}
//               transition={{ duration: 0.18 }}
//               className="w-full max-w-lg overflow-hidden rounded-3xl border border-[#DDE5D9] bg-white shadow-2xl dark:border-dark-700 dark:bg-dark-900"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <div className="bg-gradient-to-r from-[#F0F5EE] to-white p-6 dark:from-dark-800 dark:to-dark-900 sm:p-7">
//                 <div className="mb-4 flex items-start justify-between gap-4">
//                   <div className="flex items-center gap-3">
//                     <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#285541] text-white">
//                       <MessageCircle size={21} />
//                     </div>

//                     <div>
//                       <h3
//                         id="interest-modal-title"
//                         className="text-xl font-extrabold text-[#24352C] dark:text-dark-100"
//                       >
//                         Express interest
//                       </h3>
//                       <p className="mt-1 text-xs text-[#788579] dark:text-dark-400">
//                         Introduce yourself to the property owner.
//                       </p>
//                     </div>
//                   </div>

//                   <button
//                     type="button"
//                     aria-label="Close dialog"
//                     disabled={!!sendingInterest}
//                     onClick={() => {
//                       setShowInterestModal(null);
//                       setInterestMessage('');
//                     }}
//                     className="rounded-lg p-2 text-[#788579] transition-colors hover:bg-[#E7F0E7] hover:text-[#285541] disabled:opacity-50 dark:hover:bg-dark-700"
//                   >
//                     <XCircle size={19} />
//                   </button>
//                 </div>

//                 <p className="text-sm leading-6 text-[#657468] dark:text-dark-300">
//                   You are interested in{' '}
//                   <strong className="text-[#285541] dark:text-[#B9D9BE]">
//                     {showInterestModal.title}
//                   </strong>
//                   . Add a short message to help the owner get to know you.
//                 </p>
//               </div>

//               <div className="p-6 sm:p-7">
//                 <label
//                   htmlFor="interestMessage"
//                   className="mb-2 block text-sm font-semibold text-[#35483A] dark:text-dark-200"
//                 >
//                   Your introduction{' '}
//                   <span className="font-normal text-[#8A988C]">
//                     (optional)
//                   </span>
//                 </label>

//                 <textarea
//                   id="interestMessage"
//                   className={`${inputClass} min-h-32 resize-y`}
//                   placeholder="Hi! I'm interested in this property. I'd be happy to share more about my move-in plans..."
//                   value={interestMessage}
//                   maxLength={500}
//                   onChange={(e) =>
//                     setInterestMessage(e.target.value)
//                   }
//                   disabled={!!sendingInterest}
//                 />

//                 <div className="mt-2 flex items-center justify-between gap-3">
//                   <p className="text-xs text-[#8A988C] dark:text-dark-400">
//                     Keep it friendly and clear.
//                   </p>
//                   <span className="text-xs tabular-nums text-[#8A988C] dark:text-dark-400">
//                     {interestMessage.length}/500
//                   </span>
//                 </div>

//                 <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row">
//                   <button
//                     type="button"
//                     onClick={() => {
//                       setShowInterestModal(null);
//                       setInterestMessage('');
//                     }}
//                     disabled={!!sendingInterest}
//                     className={`${secondaryButtonClass} flex-1`}
//                   >
//                     Cancel
//                   </button>

//                   <button
//                     type="button"
//                     onClick={() =>
//                       handleSendInterest(showInterestModal)
//                     }
//                     disabled={!!sendingInterest}
//                     className={`${primaryButtonClass} flex-1`}
//                   >
//                     {sendingInterest ? (
//                       <>
//                         <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
//                         Sending request...
//                       </>
//                     ) : (
//                       <>
//                         <Send size={15} />
//                         Send request
//                       </>
//                     )}
//                   </button>
//                 </div>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }















import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle,
  Clock,
  CheckCircle,
  XCircle,
  User,
  Home,
  Zap,
  Send,
  IndianRupee,
  MapPin,
  Calendar,
  Sparkles,
  Filter,
} from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  listingsAPI,
  interestsAPI,
  profilesAPI,
} from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';
import Navbar from '../../components/Navbar';
import ListingCard, {
  ListingCardSkeleton,
} from '../../components/ListingCard';
import Pagination from '../../components/Pagination';
import { Listing, Interest } from '../../types';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const statusIcon: Record<string, React.ReactNode> = {
  PENDING: <Clock size={14} className="text-amber-500" />,
  ACCEPTED: <CheckCircle size={14} className="text-emerald-600" />,
  DECLINED: <XCircle size={14} className="text-red-500" />,
};

const statusClass: Record<string, string> = {
  PENDING: 'badge-yellow',
  ACCEPTED: 'badge-green',
  DECLINED: 'badge-red',
};

const inputClass =
  'w-full rounded-xl border border-[#DDE5D9] bg-white px-4 py-3 text-sm text-[#24352C] placeholder:text-[#9AA89B] outline-none transition-all focus:border-[#6F9B7B] focus:ring-4 focus:ring-[#6F9B7B]/15 dark:border-dark-700 dark:bg-dark-800 dark:text-dark-100';

const primaryButtonClass =
  'inline-flex items-center justify-center gap-2 rounded-xl bg-[#285541] px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#1E4231] focus:outline-none focus:ring-4 focus:ring-[#6F9B7B]/25 disabled:cursor-not-allowed disabled:opacity-60';

const secondaryButtonClass =
  'inline-flex items-center justify-center gap-2 rounded-xl border border-[#DDE5D9] bg-white px-5 py-3 text-sm font-semibold text-[#385344] transition-all hover:bg-[#F0F5EE] focus:outline-none focus:ring-4 focus:ring-[#6F9B7B]/15 dark:border-dark-700 dark:bg-dark-800 dark:text-dark-100 dark:hover:bg-dark-700';

export default function TenantDashboard() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [tab, setTab] = useState<
    'browse' | 'interests' | 'profile'
  >('browse');

  const [filters, setFilters] = useState({
    location: '',
    minBudget: '',
    maxBudget: '',
  });

  const [page, setPage] = useState(1);
  const [sendingInterest, setSendingInterest] =
    useState<string | null>(null);
  const [interestMessage, setInterestMessage] = useState('');
  const [showInterestModal, setShowInterestModal] =
    useState<Listing | null>(null);

  const [profileForm, setProfileForm] = useState({
    preferredLocation: '',
    budgetMin: '',
    budgetMax: '',
    moveInDate: '',
    bio: '',
    preferences: '',
  });

  const [savingProfile, setSavingProfile] = useState(false);

  const { data: listingsData, isLoading: listingsLoading } =
    useQuery({
      queryKey: ['listings', filters, page],
      queryFn: () =>
        listingsAPI
          .getAll({ ...filters, page, limit: 9 })
          .then((r) => r.data),
    });

  const { data: myProfile } = useQuery({
    queryKey: ['tenantProfile'],
    queryFn: () => profilesAPI.getTenant().then((r) => r.data),
    enabled: !!user,
  });

  const { data: myInterests } = useQuery({
    queryKey: ['myInterests'],
    queryFn: () => interestsAPI.getMy().then((r) => r.data),
    enabled: !!user,
  });

  useEffect(() => {
    if (myProfile) {
      setProfileForm({
        preferredLocation: myProfile.preferredLocation || '',
        budgetMin:
          myProfile.budgetMin != null
            ? String(myProfile.budgetMin)
            : '',
        budgetMax:
          myProfile.budgetMax != null
            ? String(myProfile.budgetMax)
            : '',
        moveInDate: myProfile.moveInDate
          ? myProfile.moveInDate.split('T')[0]
          : '',
        bio: myProfile.bio || '',
        preferences: myProfile.preferences || '',
      });
    }
  }, [myProfile]);

  const listings: Listing[] =
    listingsData?.listings || listingsData || [];

  const totalPages = listingsData?.totalPages || 1;
  const interests: Interest[] = myInterests || [];

  const handleSendInterest = async (listing: Listing) => {
    setSendingInterest(listing.id);

    try {
      await interestsAPI.send({
        listingId: listing.id,
        message: interestMessage.trim(),
      });

      toast.success('Interest sent successfully!');

      await queryClient.invalidateQueries({
        queryKey: ['myInterests'],
      });

      await queryClient.invalidateQueries({
        queryKey: ['listings'],
      });

      setShowInterestModal(null);
      setInterestMessage('');
    } catch (err: any) {
      toast.error(
        err.response?.data?.error ||
          'Failed to send interest. Please try again.'
      );
    } finally {
      setSendingInterest(null);
    }
  };

  const handleDeleteInterest = async (
    id: string,
    status: string
  ) => {
    const isPending = status === 'PENDING';

    const confirmMessage = isPending
      ? 'Are you sure you want to withdraw your interest request?'
      : 'Are you sure you want to delete this request record?';

    if (!window.confirm(confirmMessage)) return;

    try {
      await interestsAPI.withdraw(id);

      toast.success(
        isPending
          ? 'Interest request withdrawn!'
          : 'Request record deleted!'
      );

      await queryClient.invalidateQueries({
        queryKey: ['myInterests'],
      });

      await queryClient.invalidateQueries({
        queryKey: ['listings'],
      });
    } catch (err: any) {
      toast.error(
        err.response?.data?.error ||
          'Failed to update request.'
      );
    }
  };

  const handleSaveProfile = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const minBudget = Number(profileForm.budgetMin);
    const maxBudget = Number(profileForm.budgetMax);

    if (
      profileForm.budgetMin === '' ||
      profileForm.budgetMax === '' ||
      minBudget < 0 ||
      maxBudget < minBudget
    ) {
      toast.error(
        'Maximum budget must be greater than or equal to minimum budget.'
      );
      return;
    }

    setSavingProfile(true);

    try {
      await profilesAPI.saveTenant({
        preferredLocation:
          profileForm.preferredLocation.trim(),
        budgetMin: minBudget,
        budgetMax: maxBudget,
        moveInDate: profileForm.moveInDate,
        bio: profileForm.bio.trim(),
        preferences: profileForm.preferences.trim(),
      });

      toast.success('Your preferences have been saved!');

      await queryClient.invalidateQueries({
        queryKey: ['tenantProfile'],
      });

      await queryClient.invalidateQueries({
        queryKey: ['listings'],
      });
    } catch (err: any) {
      toast.error(
        err.response?.data?.error ||
          'Failed to save preferences.'
      );
    } finally {
      setSavingProfile(false);
    }
  };

  const alreadySentInterest = (listingId: string) =>
    interests.some(
      (interest) => interest.listingId === listingId
    );

  const resetFilters = () => {
    setFilters({
      location: '',
      minBudget: '',
      maxBudget: '',
    });
    setPage(1);
  };

  const tabs = [
    {
      id: 'browse',
      label: 'Browse Homes',
      icon: Home,
    },
    {
      id: 'interests',
      label: 'My Interests',
      icon: Zap,
      count: interests.filter(
        (interest) => interest.status === 'PENDING'
      ).length,
    },
    {
      id: 'profile',
      label: 'My Preferences',
      icon: User,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F7F8F4] text-[#24352C] transition-colors duration-300 dark:bg-dark-950 dark:text-dark-100">
      <Navbar
        currentView={tab === 'browse' ? 'list' : tab}
        onNavigate={(view) =>
          setTab(
            view === 'list'
              ? 'browse'
              : (view as 'interests' | 'profile')
          )
        }
      />

      <main className="mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-7 lg:px-8">

        {/* Updated professional greenish-white greeting banner */}
        <section className="relative mb-6 overflow-hidden rounded-[26px] border border-[#DCE8D8] bg-gradient-to-br from-[#F0F5EC] via-[#E8F0E4] to-[#DDEBDD] px-5 py-6 text-[#24352C] shadow-sm transition-colors duration-300 dark:border-dark-700 dark:bg-gradient-to-br dark:from-dark-900 dark:via-dark-900 dark:to-dark-800 dark:text-dark-100 sm:px-7 sm:py-7 lg:px-9">

          <div className="pointer-events-none absolute -right-10 -top-16 h-48 w-48 rounded-full bg-[#A8C8A8]/20 blur-3xl dark:bg-[#477A5D]/10" />

          <div className="pointer-events-none absolute -bottom-20 right-[25%] h-40 w-40 rounded-full bg-white/50 blur-3xl dark:bg-white/[0.03]" />

          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

            <div className="min-w-0 max-w-2xl">

              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#CDDFCA] bg-white/70 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-[#477657] dark:border-dark-700 dark:bg-dark-800/80 dark:text-[#A5D1AF]">
                <Home size={14} />
                Your rental dashboard
              </div>

              <h1 className="mb-3 text-2xl font-semibold leading-snug tracking-tight text-[#24352C] dark:text-dark-100 sm:text-3xl lg:text-[32px]">
                Hello, {user?.name || 'there'}!{' '}
                <span aria-hidden="true">👋</span>
              </h1>

              <p className="max-w-2xl text-sm leading-7 text-[#617565] dark:text-dark-300 sm:text-[15px]">
                {!myProfile
                  ? 'Discover homes that fit your budget, preferred location and lifestyle.'
                  : 'Browse available homes, compare compatibility scores and contact owners when you find the right fit.'}
              </p>
            </div>

            {!myProfile && (
              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setTab('profile')}
                className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-[#285541] px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#1E4231] focus:outline-none focus:ring-4 focus:ring-[#6F9B7B]/25 sm:w-auto"
              >
                <Sparkles size={17} />
                Set preferences
              </motion.button>
            )}
          </div>
        </section>

        {/* Dashboard tabs */}
        <nav
          aria-label="Tenant dashboard sections"
          className="mb-6 flex gap-1.5 overflow-x-auto rounded-2xl border border-[#DDE5D9] bg-[#EEF2EB] p-1.5 shadow-sm dark:border-dark-800 dark:bg-dark-900"
        >
          {tabs.map((item) => {
            const Icon = item.icon;
            const active = tab === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() =>
                  setTab(
                    item.id as
                      | 'browse'
                      | 'interests'
                      | 'profile'
                  )
                }
                aria-current={active ? 'page' : undefined}
                className={`relative inline-flex shrink-0 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-all sm:flex-1 sm:px-5 ${
                  active
                    ? 'bg-white text-[#285541] shadow-sm ring-1 ring-[#DDE5D9] dark:bg-dark-800 dark:text-[#A5D1AF] dark:ring-dark-700'
                    : 'text-[#657468] hover:bg-white/60 hover:text-[#285541] dark:text-dark-400 dark:hover:bg-dark-800 dark:hover:text-dark-100'
                }`}
              >
                <Icon size={16} />
                <span>{item.label}</span>

                {!!item.count && (
                  <span className="inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-[#477A5D] px-1.5 text-[11px] font-bold text-white">
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <AnimatePresence mode="wait">
          {/* Browse homes */}
          {tab === 'browse' && (
            <motion.section
              key="browse"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22 }}
            >
              {/* Filters */}
              <div className="mb-8 rounded-2xl border border-[#DDE5D9] bg-white p-5 shadow-sm dark:border-dark-800 dark:bg-dark-900 sm:p-6">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E7F0E7] text-[#285541] dark:bg-[#285541]/30 dark:text-[#A5D1AF]">
                    <Filter size={18} />
                  </div>

                  <div>
                    <h2 className="font-bold text-[#24352C] dark:text-dark-100">
                      Find your place
                    </h2>
                    <p className="mt-0.5 text-xs text-[#788579] dark:text-dark-400">
                      Narrow down homes by location and monthly rent.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(260px,0.8fr)_auto]">
                  {/* Location */}
                  <label className="flex min-w-0 items-center gap-3 rounded-xl border border-[#DDE5D9] bg-[#F9FAF7] px-3.5 transition-all focus-within:border-[#6F9B7B] focus-within:ring-4 focus-within:ring-[#6F9B7B]/15 dark:border-dark-700 dark:bg-dark-800">
                    <MapPin
                      size={17}
                      className="shrink-0 text-[#6F9278]"
                    />
                    <input
                      type="text"
                      aria-label="Search location"
                      placeholder="City or locality"
                      className="w-full min-w-0 bg-transparent py-3 text-sm text-[#24352C] outline-none placeholder:text-[#9AA89B] dark:text-dark-100"
                      value={filters.location}
                      onChange={(e) => {
                        setFilters((current) => ({
                          ...current,
                          location: e.target.value,
                        }));
                        setPage(1);
                      }}
                    />
                  </label>

                  {/* Budget */}
                  <div className="grid grid-cols-2 gap-3">
                    <label className="flex min-w-0 items-center gap-2 rounded-xl border border-[#DDE5D9] bg-[#F9FAF7] px-3 transition-all focus-within:border-[#6F9B7B] focus-within:ring-4 focus-within:ring-[#6F9B7B]/15 dark:border-dark-700 dark:bg-dark-800">
                      <IndianRupee
                        size={15}
                        className="shrink-0 text-[#6F9278]"
                      />
                      <input
                        type="number"
                        aria-label="Minimum monthly rent"
                        min="0"
                        placeholder="Min rent"
                        className="w-full min-w-0 bg-transparent py-3 text-sm outline-none placeholder:text-[#9AA89B] dark:text-dark-100"
                        value={filters.minBudget}
                        onChange={(e) => {
                          setFilters((current) => ({
                            ...current,
                            minBudget: e.target.value,
                          }));
                          setPage(1);
                        }}
                      />
                    </label>

                    <label className="flex min-w-0 items-center gap-2 rounded-xl border border-[#DDE5D9] bg-[#F9FAF7] px-3 transition-all focus-within:border-[#6F9B7B] focus-within:ring-4 focus-within:ring-[#6F9B7B]/15 dark:border-dark-700 dark:bg-dark-800">
                      <IndianRupee
                        size={15}
                        className="shrink-0 text-[#6F9278]"
                      />
                      <input
                        type="number"
                        aria-label="Maximum monthly rent"
                        min={filters.minBudget || 0}
                        placeholder="Max rent"
                        className="w-full min-w-0 bg-transparent py-3 text-sm outline-none placeholder:text-[#9AA89B] dark:text-dark-100"
                        value={filters.maxBudget}
                        onChange={(e) => {
                          setFilters((current) => ({
                            ...current,
                            maxBudget: e.target.value,
                          }));
                          setPage(1);
                        }}
                      />
                    </label>
                  </div>

                  <button
                    type="button"
                    onClick={resetFilters}
                    className={secondaryButtonClass}
                  >
                    Reset filters
                  </button>
                </div>
              </div>

              {/* Listing results */}
              {listingsLoading ? (
                <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <ListingCardSkeleton key={index} />
                  ))}
                </div>
              ) : listings.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-[#CFDCCB] bg-white px-6 py-16 text-center dark:border-dark-700 dark:bg-dark-900 sm:px-12">
                  <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#E7F0E7] text-[#477A5D] dark:bg-[#285541]/30 dark:text-[#A5D1AF]">
                    <Home size={29} />
                  </div>

                  <h3 className="mb-2 text-lg font-bold text-[#24352C] dark:text-dark-100">
                    No homes found
                  </h3>

                  <p className="mx-auto mb-6 max-w-sm text-sm leading-6 text-[#788579] dark:text-dark-400">
                    Try another location or adjust your rent range to see more available properties.
                  </p>

                  <button
                    type="button"
                    onClick={resetFilters}
                    className={primaryButtonClass}
                  >
                    Clear all filters
                  </button>
                </div>
              ) : (
                <motion.div
                  layout
                  className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
                >
                  {listings.map((listing) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.22 }}
                      key={listing.id}
                      className="relative rounded-2xl"
                    >
                      <ListingCard
                        listing={listing}
                        compatibilityScore={listing.compatibilityScore}
                        showScore={!!myProfile}
                      />

                      <div className="absolute bottom-4 right-4 z-10">
                        {!alreadySentInterest(listing.id) ? (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setShowInterestModal(listing);
                            }}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-[#285541] px-3.5 py-2.5 text-xs font-semibold text-white shadow-md transition-all hover:bg-[#1E4231] focus:outline-none focus:ring-4 focus:ring-[#6F9B7B]/30"
                            id={`express-interest-${listing.id}`}
                          >
                            <Send size={13} />
                            Express interest
                          </button>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#C8DDC8] bg-[#EDF5EC] px-3 py-2 text-xs font-semibold text-[#285541] shadow-sm dark:border-[#477A5D] dark:bg-[#285541]/40 dark:text-[#D2E9D4]">
                            <CheckCircle size={13} />
                            Interest sent
                          </span>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {listings.length > 0 && (
                <Pagination
                  page={page}
                  totalPages={totalPages}
                  onPageChange={setPage}
                />
              )}
            </motion.section>
          )}

          {/* My interests */}
          {tab === 'interests' && (
            <motion.section
              key="interests"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22 }}
              className="space-y-4"
            >
              <div className="mb-5">
                <h2 className="text-xl font-extrabold text-[#24352C] dark:text-dark-100">
                  Your interest requests
                </h2>
                <p className="mt-1 text-sm text-[#788579] dark:text-dark-400">
                  Keep track of your requests and conversations with property owners.
                </p>
              </div>

              {interests.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-[#CFDCCB] bg-white px-6 py-16 text-center dark:border-dark-700 dark:bg-dark-900 sm:px-12">
                  <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#E7F0E7] text-[#477A5D] dark:bg-[#285541]/30 dark:text-[#A5D1AF]">
                    <Zap size={28} />
                  </div>

                  <h3 className="mb-2 text-lg font-bold text-[#24352C] dark:text-dark-100">
                    No interest requests yet
                  </h3>

                  <p className="mx-auto mb-6 max-w-sm text-sm leading-6 text-[#788579] dark:text-dark-400">
                    Found a place you like? Send an interest request to start a conversation with its owner.
                  </p>

                  <button
                    type="button"
                    onClick={() => setTab('browse')}
                    className={primaryButtonClass}
                  >
                    <Home size={16} />
                    Browse homes
                  </button>
                </div>
              ) : (
                interests.map((interest) => (
                  <article
                    key={interest.id}
                    className="rounded-2xl border border-[#DDE5D9] bg-white p-5 shadow-sm transition-all hover:border-[#BED2BD] hover:shadow-md dark:border-dark-800 dark:bg-dark-900 sm:p-6"
                  >
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="mb-3 flex flex-wrap items-center gap-3">
                          <h3 className="text-lg font-bold text-[#24352C] dark:text-dark-100">
                            {interest.listing?.title || 'Property listing'}
                          </h3>

                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide ${statusClass[interest.status]}`}
                          >
                            {statusIcon[interest.status]}
                            {interest.status}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-5 gap-y-3 text-xs text-[#788579] dark:text-dark-400 sm:text-sm">
                          <span className="inline-flex items-center gap-1.5">
                            <MapPin
                              size={14}
                              className="text-[#6F9278]"
                            />
                            {interest.listing?.location || 'Location not specified'}
                          </span>

                          <span className="inline-flex items-center gap-1 font-semibold text-[#285541] dark:text-[#A5D1AF]">
                            <IndianRupee size={14} />
                            {interest.listing?.rent?.toLocaleString() || '—'}
                            /month
                          </span>

                          <span className="inline-flex items-center gap-1.5">
                            <Calendar
                              size={14}
                              className="text-[#6F9278]"
                            />
                            Sent{' '}
                            {format(
                              new Date(interest.createdAt),
                              'dd MMM yyyy'
                            )}
                          </span>
                        </div>

                        {interest.message && (
                          <div className="mt-4 rounded-xl border border-[#E0E8DD] bg-[#F5F8F2] p-4 text-sm leading-6 text-[#526557] dark:border-dark-700 dark:bg-dark-800 dark:text-dark-300">
                            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[#78917C]">
                              Your message
                            </p>
                            <p className="break-words">
                              “{interest.message}”
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap lg:justify-end">
                        {interest.status === 'ACCEPTED' &&
                          interest.chatRoom && (
                            <Link
                              to={`/chat/${interest.chatRoom.id}`}
                              className={primaryButtonClass}
                              id={`chat-room-${interest.chatRoom.id}`}
                            >
                              <MessageCircle size={16} />
                              Open chat
                            </Link>
                          )}

                        <Link
                          to={`/listings/${interest.listingId}`}
                          className={secondaryButtonClass}
                        >
                          View details
                        </Link>

                        <button
                          type="button"
                          onClick={() =>
                            handleDeleteInterest(
                              interest.id,
                              interest.status
                            )
                          }
                          className="inline-flex items-center justify-center rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 transition-colors hover:bg-red-100 focus:outline-none focus:ring-4 focus:ring-red-500/10 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300 dark:hover:bg-red-950/60"
                        >
                          {interest.status === 'PENDING'
                            ? 'Withdraw'
                            : 'Delete'}
                        </button>
                      </div>
                    </div>
                  </article>
                ))
              )}
            </motion.section>
          )}

          {/* Preferences form */}
          {tab === 'profile' && (
            <motion.section
              key="profile"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22 }}
              className="mx-auto max-w-3xl"
            >
              <div className="overflow-hidden rounded-3xl border border-[#DDE5D9] bg-white shadow-sm dark:border-dark-800 dark:bg-dark-900">
                <div className="border-b border-[#E5EAE1] bg-gradient-to-r from-[#F0F5EE] to-white p-6 dark:border-dark-800 dark:from-dark-800 dark:to-dark-900 sm:p-8">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#285541] text-white shadow-md shadow-[#285541]/15">
                      <User size={23} />
                    </div>

                    <div>
                      <h2 className="text-xl font-extrabold text-[#24352C] dark:text-dark-100 sm:text-2xl">
                        Your rental preferences
                      </h2>
                      <p className="mt-2 max-w-xl text-sm leading-6 text-[#788579] dark:text-dark-400">
                        Share your location, budget and move-in plans to help find properties that suit your needs.
                      </p>
                    </div>
                  </div>
                </div>

                <form
                  onSubmit={handleSaveProfile}
                  className="space-y-6 p-6 sm:p-8"
                >
                  {/* Location */}
                  <div>
                    <label
                      htmlFor="preferredLocation"
                      className="mb-2 block text-sm font-semibold text-[#35483A] dark:text-dark-200"
                    >
                      Preferred location
                    </label>

                    <div className="relative">
                      <MapPin
                        size={17}
                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#6F9278]"
                      />
                      <input
                        id="preferredLocation"
                        type="text"
                        className={`${inputClass} pl-11`}
                        placeholder="e.g. Indiranagar, Bengaluru"
                        value={profileForm.preferredLocation}
                        onChange={(e) =>
                          setProfileForm((current) => ({
                            ...current,
                            preferredLocation: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>

                    <p className="mt-2 text-xs text-[#8A988C] dark:text-dark-400">
                      Enter the city or locality where you want to live.
                    </p>
                  </div>

                  {/* Budget */}
                  <div>
                    <div className="mb-2">
                      <h3 className="text-sm font-semibold text-[#35483A] dark:text-dark-200">
                        Monthly rental budget
                      </h3>
                      <p className="mt-1 text-xs text-[#8A988C] dark:text-dark-400">
                        Set a comfortable rent range in Indian rupees.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor="budgetMin"
                          className="mb-2 block text-xs font-medium text-[#788579] dark:text-dark-400"
                        >
                          Minimum budget (₹)
                        </label>

                        <div className="relative">
                          <IndianRupee
                            size={16}
                            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#6F9278]"
                          />
                          <input
                            id="budgetMin"
                            type="number"
                            min="0"
                            step="1"
                            className={`${inputClass} pl-10`}
                            placeholder="5000"
                            value={profileForm.budgetMin}
                            onChange={(e) =>
                              setProfileForm((current) => ({
                                ...current,
                                budgetMin: e.target.value,
                              }))
                            }
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="budgetMax"
                          className="mb-2 block text-xs font-medium text-[#788579] dark:text-dark-400"
                        >
                          Maximum budget (₹)
                        </label>

                        <div className="relative">
                          <IndianRupee
                            size={16}
                            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#6F9278]"
                          />
                          <input
                            id="budgetMax"
                            type="number"
                            min={profileForm.budgetMin || 0}
                            step="1"
                            className={`${inputClass} pl-10`}
                            placeholder="20000"
                            value={profileForm.budgetMax}
                            onChange={(e) =>
                              setProfileForm((current) => ({
                                ...current,
                                budgetMax: e.target.value,
                              }))
                            }
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Move-in date */}
                  <div>
                    <label
                      htmlFor="moveInDate"
                      className="mb-2 block text-sm font-semibold text-[#35483A] dark:text-dark-200"
                    >
                      Preferred move-in date
                    </label>

                    <div className="relative">
                      <Calendar
                        size={17}
                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#6F9278]"
                      />
                      <input
                        id="moveInDate"
                        type="date"
                        className={`${inputClass} pl-11`}
                        min={new Date().toISOString().split('T')[0]}
                        value={profileForm.moveInDate}
                        onChange={(e) =>
                          setProfileForm((current) => ({
                            ...current,
                            moveInDate: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>
                  </div>

                  {/* Bio */}
                  <div>
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <label
                        htmlFor="bio"
                        className="text-sm font-semibold text-[#35483A] dark:text-dark-200"
                      >
                        A little about you
                      </label>
                      <span className="text-xs text-[#8A988C] dark:text-dark-400">
                        {profileForm.bio.length}/500
                      </span>
                    </div>

                    <textarea
                      id="bio"
                      className={`${inputClass} min-h-28 resize-y`}
                      placeholder="Tell owners a little about yourself, your work or studies, and what you are looking for."
                      value={profileForm.bio}
                      maxLength={500}
                      onChange={(e) =>
                        setProfileForm((current) => ({
                          ...current,
                          bio: e.target.value,
                        }))
                      }
                    />
                  </div>

                  {/* Preferences */}
                  <div>
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <label
                        htmlFor="preferences"
                        className="text-sm font-semibold text-[#35483A] dark:text-dark-200"
                      >
                        Lifestyle and preferences
                      </label>
                      <span className="text-xs text-[#8A988C] dark:text-dark-400">
                        {profileForm.preferences.length}/500
                      </span>
                    </div>

                    <textarea
                      id="preferences"
                      className={`${inputClass} min-h-28 resize-y`}
                      placeholder="e.g. vegetarian, non-smoker, quiet environment, preferred amenities..."
                      value={profileForm.preferences}
                      maxLength={500}
                      onChange={(e) =>
                        setProfileForm((current) => ({
                          ...current,
                          preferences: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="rounded-xl border border-[#DDE8D9] bg-[#F3F7F0] p-4 dark:border-dark-700 dark:bg-dark-800">
                    <div className="flex items-start gap-3">
                      <Sparkles
                        size={18}
                        className="mt-0.5 shrink-0 text-[#477A5D]"
                      />
                      <div>
                        <p className="text-sm font-semibold text-[#355541] dark:text-[#B9D9BE]">
                          Better preferences, better matches
                        </p>
                        <p className="mt-1 text-xs leading-5 text-[#718273] dark:text-dark-400">
                          Keep your details accurate so the available compatibility score can help you compare suitable listings.
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className={`${primaryButtonClass} w-full py-3.5`}
                    disabled={savingProfile}
                  >
                    {savingProfile ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                        Saving preferences...
                      </>
                    ) : (
                      <>
                        <CheckCircle size={17} />
                        Save my preferences
                      </>
                    )}
                  </button>
                </form>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </main>

      {/* Express interest modal */}
      <AnimatePresence>
        {showInterestModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#17271D]/55 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              if (!sendingInterest) {
                setShowInterestModal(null);
                setInterestMessage('');
              }
            }}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="interest-modal-title"
              initial={{ opacity: 0, y: 12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.97 }}
              transition={{ duration: 0.18 }}
              className="w-full max-w-lg overflow-hidden rounded-3xl border border-[#DDE5D9] bg-white shadow-2xl dark:border-dark-700 dark:bg-dark-900"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-gradient-to-r from-[#F0F5EE] to-white p-6 dark:from-dark-800 dark:to-dark-900 sm:p-7">
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#285541] text-white">
                      <MessageCircle size={21} />
                    </div>

                    <div>
                      <h3
                        id="interest-modal-title"
                        className="text-xl font-extrabold text-[#24352C] dark:text-dark-100"
                      >
                        Express interest
                      </h3>
                      <p className="mt-1 text-xs text-[#788579] dark:text-dark-400">
                        Introduce yourself to the property owner.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    aria-label="Close dialog"
                    disabled={!!sendingInterest}
                    onClick={() => {
                      setShowInterestModal(null);
                      setInterestMessage('');
                    }}
                    className="rounded-lg p-2 text-[#788579] transition-colors hover:bg-[#E7F0E7] hover:text-[#285541] disabled:opacity-50 dark:hover:bg-dark-700"
                  >
                    <XCircle size={19} />
                  </button>
                </div>

                <p className="text-sm leading-6 text-[#657468] dark:text-dark-300">
                  You are interested in{' '}
                  <strong className="text-[#285541] dark:text-[#B9D9BE]">
                    {showInterestModal.title}
                  </strong>
                  . Add a short message to help the owner get to know you.
                </p>
              </div>

              <div className="p-6 sm:p-7">
                <label
                  htmlFor="interestMessage"
                  className="mb-2 block text-sm font-semibold text-[#35483A] dark:text-dark-200"
                >
                  Your introduction{' '}
                  <span className="font-normal text-[#8A988C]">
                    (optional)
                  </span>
                </label>

                <textarea
                  id="interestMessage"
                  className={`${inputClass} min-h-32 resize-y`}
                  placeholder="Hi! I'm interested in this property. I'd be happy to share more about my move-in plans..."
                  value={interestMessage}
                  maxLength={500}
                  onChange={(e) =>
                    setInterestMessage(e.target.value)
                  }
                  disabled={!!sendingInterest}
                />

                <div className="mt-2 flex items-center justify-between gap-3">
                  <p className="text-xs text-[#8A988C] dark:text-dark-400">
                    Keep it friendly and clear.
                  </p>
                  <span className="text-xs tabular-nums text-[#8A988C] dark:text-dark-400">
                    {interestMessage.length}/500
                  </span>
                </div>

                <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => {
                      setShowInterestModal(null);
                      setInterestMessage('');
                    }}
                    disabled={!!sendingInterest}
                    className={`${secondaryButtonClass} flex-1`}
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleSendInterest(showInterestModal)
                    }
                    disabled={!!sendingInterest}
                    className={`${primaryButtonClass} flex-1`}
                  >
                    {sendingInterest ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                        Sending request...
                      </>
                    ) : (
                      <>
                        <Send size={15} />
                        Send request
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}