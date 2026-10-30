




// import { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { motion, AnimatePresence } from 'framer-motion';
// import {
//   Home,
//   Plus,
//   Edit2,
//   Trash2,
//   CheckCircle,
//   Users,
//   LayoutGrid,
//   MessageCircle,
//   Eye,
//   IndianRupee,
//   MapPin,
//   Building2,
//   User,
// } from 'lucide-react';
// import { useQuery, useQueryClient } from '@tanstack/react-query';
// import {
//   listingsAPI,
//   interestsAPI,
//   profilesAPI,
// } from '../../lib/api';
// import { useAuth } from '../../contexts/AuthContext';
// import Navbar from '../../components/Navbar';
// import { Listing, Interest } from '../../types';
// import toast from 'react-hot-toast';
// import { format } from 'date-fns';

// const statusClass: Record<string, string> = {
//   PENDING: 'bg-amber-50 text-amber-700 border border-amber-200',
//   ACCEPTED: 'bg-green-50 text-green-700 border border-green-200',
//   DECLINED: 'bg-red-50 text-red-700 border border-red-200',
// };

// const listingStatusClass: Record<string, string> = {
//   ACTIVE: 'bg-green-50 text-green-700 border border-green-200',
//   FILLED: 'bg-blue-50 text-blue-700 border border-blue-200',
//   DELETED: 'bg-red-50 text-red-700 border border-red-200',
// };

// const inputClass =
//   'w-full rounded-xl border border-[#d8e4d4] bg-[#f7faf5] px-4 py-3 text-sm text-[#293b2e] outline-none transition placeholder:text-[#929d8e] focus:border-[#6d9670] focus:bg-white focus:ring-2 focus:ring-[#315b3e]/10';

// const labelClass =
//   'mb-2 block text-sm font-semibold text-[#354438]';

// const primaryButton =
//   'inline-flex items-center justify-center gap-2 rounded-xl bg-[#315b3e] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#264a31] disabled:cursor-not-allowed disabled:opacity-60';

// const secondaryButton =
//   'inline-flex items-center justify-center gap-2 rounded-xl border border-[#d8e4d4] bg-white px-4 py-2.5 text-sm font-semibold text-[#315b3e] transition hover:bg-[#f0f6ed]';

// export default function OwnerDashboard() {
//   const { user } = useAuth();
//   const queryClient = useQueryClient();

//   const [tab, setTab] = useState<
//     'listings' | 'interests' | 'profile'
//   >('listings');

//   const [showCreateForm, setShowCreateForm] = useState(false);
//   const [editingListing, setEditingListing] =
//     useState<Listing | null>(null);
//   const [savingProfile, setSavingProfile] = useState(false);
//   const [savingListing, setSavingListing] = useState(false);
//   const [images, setImages] = useState<string[]>([]);

//   const [profileForm, setProfileForm] = useState({
//     phone: '',
//     address: '',
//     bio: '',
//   });

//   const [listingForm, setListingForm] = useState({
//     title: '',
//     location: '',
//     rent: '',
//     availableFrom: '',
//     roomType: 'SINGLE',
//     furnishing: 'FURNISHED',
//     description: '',
//   });

//   useEffect(() => {
//     if (user?.ownerProfile) {
//       setProfileForm({
//         phone: user.ownerProfile.phone || '',
//         address: user.ownerProfile.address || '',
//         bio: user.ownerProfile.bio || '',
//       });
//     }
//   }, [user]);

//   const handleImageChange = (
//     e: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     if (!e.target.files) return;

//     const filesArray = Array.from(e.target.files);

//     const promises = filesArray.map(
//       (file) =>
//         new Promise<string>((resolve, reject) => {
//           const reader = new FileReader();
//           reader.readAsDataURL(file);
//           reader.onload = () =>
//             resolve(reader.result as string);
//           reader.onerror = reject;
//         })
//     );

//     Promise.all(promises)
//       .then((base64s) => {
//         setImages((prev) => [...prev, ...base64s]);
//       })
//       .catch(() => toast.error('Failed to read image files'));

//     e.target.value = '';
//   };

//   const {
//     data: myListings,
//     isLoading: listingsLoading,
//   } = useQuery({
//     queryKey: ['ownerListings'],
//     queryFn: () => listingsAPI.getMy().then((r) => r.data),
//     enabled: !!user,
//   });

//   const listings: Listing[] = myListings || [];

//   const interests: Interest[] = listings.flatMap((listing) =>
//     (listing.interests || []).map((interest: any) => ({
//       ...interest,
//       listing: {
//         id: listing.id,
//         title: listing.title,
//         location: listing.location,
//         rent: listing.rent,
//       },
//     }))
//   );

//   const pendingCount = interests.filter(
//     (interest) => interest.status === 'PENDING'
//   ).length;

//   const resetListingForm = () => {
//     setListingForm({
//       title: '',
//       location: '',
//       rent: '',
//       availableFrom: '',
//       roomType: 'SINGLE',
//       furnishing: 'FURNISHED',
//       description: '',
//     });

//     setImages([]);
//     setEditingListing(null);
//     setShowCreateForm(false);
//   };

//   const handleCreateOrUpdate = async (
//     e: React.FormEvent
//   ) => {
//     e.preventDefault();
//     setSavingListing(true);

//     try {
//       const data = {
//         ...listingForm,
//         rent: Number(listingForm.rent),
//         images,
//       };

//       if (editingListing) {
//         await listingsAPI.update(editingListing.id, data);
//         toast.success('Listing updated successfully!');
//       } else {
//         await listingsAPI.create(data);
//         toast.success('Listing created successfully!');
//       }

//       await queryClient.invalidateQueries({
//         queryKey: ['ownerListings'],
//       });

//       resetListingForm();
//     } catch (err: any) {
//       toast.error(
//         err.response?.data?.error || 'Failed to save listing'
//       );
//     } finally {
//       setSavingListing(false);
//     }
//   };

//   const handleDelete = async (id: string) => {
//     if (!window.confirm('Are you sure you want to delete this listing?')) {
//       return;
//     }

//     try {
//       await listingsAPI.delete(id);
//       toast.success('Listing deleted');

//       queryClient.invalidateQueries({
//         queryKey: ['ownerListings'],
//       });
//     } catch {
//       toast.error('Failed to delete listing');
//     }
//   };

//   const handleMarkFilled = async (id: string) => {
//     try {
//       await listingsAPI.markFilled(id);
//       toast.success('Listing marked as filled!');

//       queryClient.invalidateQueries({
//         queryKey: ['ownerListings'],
//       });
//     } catch {
//       toast.error('Failed to update listing');
//     }
//   };

//   const handleMarkActive = async (id: string) => {
//     try {
//       await listingsAPI.markActive(id);
//       toast.success('Listing marked as active!');

//       queryClient.invalidateQueries({
//         queryKey: ['ownerListings'],
//       });
//     } catch {
//       toast.error('Failed to update listing');
//     }
//   };

//   const handleDeleteInterest = async (id: string) => {
//     if (
//       !window.confirm(
//         'Delete this interest request? This will permanently close the chat room and allow the tenant to request again.'
//       )
//     ) {
//       return;
//     }

//     try {
//       await interestsAPI.withdraw(id);
//       toast.success('Interest request deleted successfully!');

//       queryClient.invalidateQueries({
//         queryKey: ['ownerListings'],
//       });
//     } catch {
//       toast.error('Failed to delete interest request');
//     }
//   };

//   const handleRespondInterest = async (
//     id: string,
//     status: 'ACCEPTED' | 'DECLINED'
//   ) => {
//     try {
//       await interestsAPI.respond(id, status);
//       toast.success(`Interest request ${status.toLowerCase()}!`);

//       queryClient.invalidateQueries({
//         queryKey: ['ownerListings'],
//       });
//     } catch {
//       toast.error('Failed to respond to request');
//     }
//   };

//   const handleEditListing = (listing: Listing) => {
//     setListingForm({
//       title: listing.title,
//       location: listing.location,
//       rent: String(listing.rent),
//       availableFrom: listing.availableFrom.split('T')[0],
//       roomType: listing.roomType,
//       furnishing: listing.furnishing,
//       description: listing.description,
//     });

//     setImages(
//       listing.images?.map((image: any) => image.url || image) || []
//     );

//     setEditingListing(listing);
//     setShowCreateForm(true);
//   };

//   const tabs = [
//     {
//       id: 'listings',
//       label: 'My Listings',
//       icon: LayoutGrid,
//       count: listings.length,
//     },
//     {
//       id: 'interests',
//       label: 'Tenant Requests',
//       icon: Users,
//       count: pendingCount,
//     },
//     {
//       id: 'profile',
//       label: 'Owner Profile',
//       icon: Home,
//     },
//   ];

//   return (
//     <div className="min-h-screen bg-[#f7f9f5] text-[#293b2e] transition-colors duration-300">
//       <Navbar
//         currentView={tab === 'listings' ? 'list' : tab}
//         onNavigate={(view) =>
//           setTab(
//             view === 'list'
//               ? 'listings'
//               : (view as 'interests' | 'profile')
//           )
//         }
//       />

//       <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
//         {/* Dashboard Header */}
//         <section className="relative mb-8 overflow-hidden rounded-3xl border border-[#dce8d6] bg-gradient-to-r from-[#e7f0e2] via-[#eff5eb] to-[#f7faf4] p-6 shadow-sm sm:p-8">
//           <div className="pointer-events-none absolute -right-12 -top-16 h-56 w-56 rounded-full bg-[#c9ddc1]/40 blur-3xl" />

//           <div className="relative flex flex-col justify-between gap-6 md:flex-row md:items-center">
//             <div>
//               <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#d2e1cc] bg-white/80 px-3 py-1.5 text-xs font-semibold text-[#426449]">
//                 <Home size={14} />
//                 GHARWISE OWNER SPACE
//               </div>

//               <h1 className="mb-2 text-2xl font-bold tracking-tight text-[#294b32] sm:text-3xl">
//                 Owner Dashboard
//               </h1>

//               <p className="mb-1 text-lg font-semibold text-[#45664a]">
//                 Welcome back, {user?.name || 'Owner'}
//               </p>

//               <p className="max-w-xl text-sm leading-relaxed text-[#657565]">
//                 Manage your properties, review tenant requests, and
//                 communicate with interested renters in one place.
//               </p>
//             </div>

//             {tab === 'listings' && (
//               <motion.button
//                 whileHover={{ scale: 1.02 }}
//                 whileTap={{ scale: 0.98 }}
//                 onClick={() => {
//                   setShowCreateForm(true);
//                   setEditingListing(null);
//                   setImages([]);
//                 }}
//                 className={`${primaryButton} shrink-0`}
//                 id="create-listing-btn"
//               >
//                 <Plus size={17} />
//                 Add New Listing
//               </motion.button>
//             )}
//           </div>
//         </section>

//         {/* Dashboard Statistics */}
//         <section className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
//           {[
//             {
//               label: 'Total Listings',
//               value: listings.length,
//               icon: Building2,
//             },
//             {
//               label: 'Active Listings',
//               value: listings.filter(
//                 (listing) => listing.status === 'ACTIVE'
//               ).length,
//               icon: CheckCircle,
//             },
//             {
//               label: 'Filled Properties',
//               value: listings.filter(
//                 (listing) => listing.status === 'FILLED'
//               ).length,
//               icon: Home,
//             },
//             {
//               label: 'Pending Requests',
//               value: pendingCount,
//               icon: Users,
//             },
//           ].map((stat, index) => (
//             <motion.div
//               key={stat.label}
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: index * 0.05 }}
//               className="rounded-2xl border border-[#e0e8dc] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
//             >
//               <div className="mb-4 flex items-center justify-between">
//                 <span className="text-xs font-semibold uppercase tracking-wide text-[#718071]">
//                   {stat.label}
//                 </span>

//                 <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#eaf2e6] text-[#41694a]">
//                   <stat.icon size={17} />
//                 </span>
//               </div>

//               <p className="text-3xl font-bold text-[#294b32]">
//                 {stat.value}
//               </p>
//             </motion.div>
//           ))}
//         </section>

//         {/* Navigation Tabs */}
//         <div className="mb-8 flex gap-2 overflow-x-auto rounded-2xl border border-[#e0e8dc] bg-[#edf3e9] p-1.5">
//           {tabs.map((item) => (
//             <button
//               key={item.id}
//               onClick={() => setTab(item.id as typeof tab)}
//               className={`relative flex shrink-0 items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition sm:px-5 ${
//                 tab === item.id
//                   ? 'border border-[#d8e5d2] bg-white text-[#315b3e] shadow-sm'
//                   : 'text-[#697967] hover:bg-white/60 hover:text-[#315b3e]'
//               }`}
//             >
//               <item.icon size={16} />
//               <span>{item.label}</span>

//               {item.count ? (
//                 <span className="min-w-5 rounded-full bg-[#dcebd5] px-1.5 py-0.5 text-center text-[10px] font-bold text-[#315b3e]">
//                   {item.count}
//                 </span>
//               ) : null}
//             </button>
//           ))}
//         </div>

//         <AnimatePresence mode="wait">
//           {/* MY LISTINGS */}
//           {tab === 'listings' && (
//             <motion.section
//               key="listings"
//               initial={{ opacity: 0, y: 12 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -12 }}
//               className="space-y-6"
//             >
//               {/* Create/Edit Listing Form */}
//               {showCreateForm && (
//                 <motion.div
//                   initial={{ opacity: 0, scale: 0.99 }}
//                   animate={{ opacity: 1, scale: 1 }}
//                   className="rounded-2xl border border-[#dce7d7] bg-white p-5 shadow-sm sm:p-8"
//                 >
//                   <div className="mb-6 flex items-start justify-between gap-4 border-b border-[#e8eee4] pb-5">
//                     <div>
//                       <h2 className="text-xl font-bold text-[#294b32]">
//                         {editingListing
//                           ? 'Edit Property Listing'
//                           : 'Create a New Listing'}
//                       </h2>

//                       <p className="mt-1 text-sm text-[#778475]">
//                         Add accurate details to help renters find your property.
//                       </p>
//                     </div>

//                     <button
//                       type="button"
//                       onClick={resetListingForm}
//                       className="rounded-lg px-3 py-2 text-sm font-medium text-[#697967] hover:bg-[#f0f5ed]"
//                     >
//                       Cancel
//                     </button>
//                   </div>

//                   <form
//                     onSubmit={handleCreateOrUpdate}
//                     className="space-y-5"
//                   >
//                     <div>
//                       <label className={labelClass}>
//                         Property Title
//                       </label>

//                       <input
//                         type="text"
//                         className={inputClass}
//                         placeholder="e.g. Spacious apartment with balcony"
//                         value={listingForm.title}
//                         onChange={(e) =>
//                           setListingForm((f) => ({
//                             ...f,
//                             title: e.target.value,
//                           }))
//                         }
//                         required
//                       />
//                     </div>

//                     <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
//                       <div>
//                         <label className={labelClass}>
//                           Location
//                         </label>

//                         <input
//                           type="text"
//                           className={inputClass}
//                           placeholder="e.g. Indrapuri, Bhopal"
//                           value={listingForm.location}
//                           onChange={(e) =>
//                             setListingForm((f) => ({
//                               ...f,
//                               location: e.target.value,
//                             }))
//                           }
//                           required
//                         />
//                       </div>

//                       <div>
//                         <label className={labelClass}>
//                           Monthly Rent (₹)
//                         </label>

//                         <input
//                           type="number"
//                           min="0"
//                           className={inputClass}
//                           placeholder="18000"
//                           value={listingForm.rent}
//                           onChange={(e) =>
//                             setListingForm((f) => ({
//                               ...f,
//                               rent: e.target.value,
//                             }))
//                           }
//                           required
//                         />
//                       </div>
//                     </div>

//                     <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
//                       <div>
//                         <label className={labelClass}>
//                           Available From
//                         </label>

//                         <input
//                           type="date"
//                           className={inputClass}
//                           value={listingForm.availableFrom}
//                           onChange={(e) =>
//                             setListingForm((f) => ({
//                               ...f,
//                               availableFrom: e.target.value,
//                             }))
//                           }
//                           required
//                         />
//                       </div>

//                       <div>
//                         <label className={labelClass}>
//                           Property Type
//                         </label>

//                         <select
//                           className={inputClass}
//                           value={listingForm.roomType}
//                           onChange={(e) =>
//                             setListingForm((f) => ({
//                               ...f,
//                               roomType: e.target.value,
//                             }))
//                           }
//                         >
//                           {[
//                             'SINGLE',
//                             'SHARED',
//                             'STUDIO',
//                             'APARTMENT',
//                             'PG',
//                           ].map((type) => (
//                             <option key={type} value={type}>
//                               {type.replace('_', ' ')}
//                             </option>
//                           ))}
//                         </select>
//                       </div>

//                       <div>
//                         <label className={labelClass}>
//                           Furnishing
//                         </label>

//                         <select
//                           className={inputClass}
//                           value={listingForm.furnishing}
//                           onChange={(e) =>
//                             setListingForm((f) => ({
//                               ...f,
//                               furnishing: e.target.value,
//                             }))
//                           }
//                         >
//                           {[
//                             'FURNISHED',
//                             'SEMI_FURNISHED',
//                             'UNFURNISHED',
//                           ].map((type) => (
//                             <option key={type} value={type}>
//                               {type.replace('_', ' ')}
//                             </option>
//                           ))}
//                         </select>
//                       </div>
//                     </div>

//                     <div>
//                       <label className={labelClass}>
//                         Property Description
//                       </label>

//                       <textarea
//                         className={`${inputClass} h-32 resize-none`}
//                         placeholder="Describe the property, facilities, deposit, utilities and house rules..."
//                         value={listingForm.description}
//                         onChange={(e) =>
//                           setListingForm((f) => ({
//                             ...f,
//                             description: e.target.value,
//                           }))
//                         }
//                         required
//                       />
//                     </div>

//                     <div>
//                       <label className={labelClass}>
//                         Property Images
//                       </label>

//                       <input
//                         type="file"
//                         accept="image/*"
//                         multiple
//                         className={`${inputClass} file:mr-3 file:rounded-lg file:border-0 file:bg-[#e6f0e1] file:px-3 file:py-2 file:text-xs file:font-semibold file:text-[#315b3e]`}
//                         onChange={handleImageChange}
//                       />

//                       <p className="mt-2 text-xs text-[#7b8878]">
//                         Select property photos in a supported image format.
//                       </p>

//                       {images.length > 0 && (
//                         <div className="mt-4 flex flex-wrap gap-3">
//                           {images.map((img, index) => (
//                             <div
//                               key={index}
//                               className="group relative h-24 w-24 overflow-hidden rounded-xl border border-[#dce7d7]"
//                             >
//                               <img
//                                 src={img}
//                                 alt={`Property preview ${index + 1}`}
//                                 className="h-full w-full object-cover"
//                               />

//                               <button
//                                 type="button"
//                                 onClick={() =>
//                                   setImages((prev) =>
//                                     prev.filter((_, i) => i !== index)
//                                   )
//                                 }
//                                 className="absolute inset-0 flex items-center justify-center bg-black/55 text-xs font-semibold text-white opacity-0 transition group-hover:opacity-100"
//                               >
//                                 <Trash2 size={15} className="mr-1" />
//                                 Remove
//                               </button>
//                             </div>
//                           ))}
//                         </div>
//                       )}
//                     </div>

//                     <div className="flex flex-col-reverse gap-3 border-t border-[#e8eee4] pt-5 sm:flex-row">
//                       <button
//                         type="button"
//                         onClick={resetListingForm}
//                         className={`${secondaryButton} flex-1`}
//                       >
//                         Cancel
//                       </button>

//                       <button
//                         type="submit"
//                         disabled={savingListing}
//                         className={`${primaryButton} flex-1`}
//                       >
//                         {savingListing && (
//                           <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
//                         )}

//                         {savingListing
//                           ? 'Saving...'
//                           : editingListing
//                             ? 'Update Listing'
//                             : 'Publish Listing'}
//                       </button>
//                     </div>
//                   </form>
//                 </motion.div>
//               )}

//               {/* Loading State */}
//               {listingsLoading ? (
//                 <div className="grid grid-cols-1 gap-4">
//                   {[0, 1, 2].map((item) => (
//                     <div
//                       key={item}
//                       className="h-32 animate-pulse rounded-2xl bg-[#e9efe5]"
//                     />
//                   ))}
//                 </div>
//               ) : listings.length === 0 ? (
//                 <div className="rounded-2xl border border-dashed border-[#d3e1cd] bg-white px-6 py-16 text-center">
//                   <span className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#eaf2e6] text-[#41694a]">
//                     <Building2 size={30} />
//                   </span>

//                   <h3 className="mb-2 text-lg font-bold text-[#294b32]">
//                     No properties listed yet
//                   </h3>

//                   <p className="mx-auto mb-6 max-w-sm text-sm leading-relaxed text-[#788475]">
//                     Create your first property listing to help renters
//                     discover their next home.
//                   </p>

//                   <button
//                     onClick={() => setShowCreateForm(true)}
//                     className={primaryButton}
//                   >
//                     <Plus size={16} />
//                     Add Your First Listing
//                   </button>
//                 </div>
//               ) : (
//                 <div className="space-y-4">
//                   {listings.map((listing) => (
//                     <article
//                       key={listing.id}
//                       className="rounded-2xl border border-[#e0e8dc] bg-white p-4 shadow-sm transition hover:shadow-md sm:p-5"
//                     >
//                       <div className="flex flex-col gap-5 md:flex-row">
//                         <div className="h-48 w-full shrink-0 overflow-hidden rounded-xl bg-[#edf3e9] sm:h-36 md:w-48">
//                           <img
//                             src={
//                               listing.images?.[0]?.url ||
//                               `https://picsum.photos/seed/${listing.id}/400/300`
//                             }
//                             alt={listing.title}
//                             className="h-full w-full object-cover"
//                           />
//                         </div>

//                         <div className="flex min-w-0 flex-1 flex-col justify-between">
//                           <div>
//                             <div className="mb-3 flex flex-wrap items-center gap-2">
//                               <h3 className="text-lg font-bold text-[#294b32]">
//                                 {listing.title}
//                               </h3>

//                               <span
//                                 className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${
//                                   listingStatusClass[listing.status]
//                                 }`}
//                               >
//                                 {listing.status}
//                               </span>
//                             </div>

//                             <div className="mb-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-[#718071]">
//                               <span className="flex items-center gap-1.5">
//                                 <MapPin size={15} />
//                                 {listing.location}
//                               </span>

//                               <span className="flex items-center gap-1 font-semibold text-[#315b3e]">
//                                 <IndianRupee size={14} />
//                                 {listing.rent.toLocaleString('en-IN')}/month
//                               </span>

//                               <span className="flex items-center gap-1.5">
//                                 <Users size={14} />
//                                 {listing._count?.interests || 0} requests
//                               </span>
//                             </div>
//                           </div>

//                           <div className="flex flex-wrap gap-2 border-t border-[#edf1e9] pt-4">
//                             <Link
//                               to={`/listings/${listing.id}`}
//                               className={secondaryButton}
//                             >
//                               <Eye size={14} />
//                               View
//                             </Link>

//                             <button
//                               onClick={() => handleEditListing(listing)}
//                               className={secondaryButton}
//                             >
//                               <Edit2 size={14} />
//                               Edit
//                             </button>

//                             {listing.status === 'ACTIVE' ? (
//                               <button
//                                 onClick={() =>
//                                   handleMarkFilled(listing.id)
//                                 }
//                                 className="inline-flex items-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-3 py-2.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
//                               >
//                                 <CheckCircle size={14} />
//                                 Mark Filled
//                               </button>
//                             ) : (
//                               <button
//                                 onClick={() =>
//                                   handleMarkActive(listing.id)
//                                 }
//                                 className="inline-flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-3 py-2.5 text-sm font-semibold text-green-700 transition hover:bg-green-100"
//                               >
//                                 <CheckCircle size={14} />
//                                 Mark Active
//                               </button>
//                             )}

//                             <button
//                               onClick={() => handleDelete(listing.id)}
//                               className="ml-auto inline-flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-3 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100"
//                             >
//                               <Trash2 size={14} />
//                               Delete
//                             </button>
//                           </div>
//                         </div>
//                       </div>
//                     </article>
//                   ))}
//                 </div>
//               )}
//             </motion.section>
//           )}

//           {/* TENANT REQUESTS */}
//           {tab === 'interests' && (
//             <motion.section
//               key="interests"
//               initial={{ opacity: 0, y: 12 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -12 }}
//               className="space-y-4"
//             >
//               <div className="mb-5">
//                 <h2 className="text-xl font-bold text-[#294b32]">
//                   Tenant Requests
//                 </h2>

//                 <p className="mt-1 text-sm text-[#778475]">
//                   Review inquiries and respond to people interested in your properties.
//                 </p>
//               </div>

//               {interests.length === 0 ? (
//                 <div className="rounded-2xl border border-dashed border-[#d3e1cd] bg-white px-6 py-16 text-center">
//                   <span className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#eaf2e6] text-[#41694a]">
//                     <Users size={30} />
//                   </span>

//                   <h3 className="mb-2 text-lg font-bold text-[#294b32]">
//                     No tenant requests yet
//                   </h3>

//                   <p className="mx-auto max-w-sm text-sm leading-relaxed text-[#788475]">
//                     When someone expresses interest in one of your listings,
//                     their request will appear here.
//                   </p>
//                 </div>
//               ) : (
//                 interests.map((interest) => (
//                   <article
//                     key={interest.id}
//                     className="rounded-2xl border border-[#e0e8dc] bg-white p-5 shadow-sm transition hover:shadow-md sm:p-6"
//                   >
//                     <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
//                       <div className="min-w-0 flex-1">
//                         {/* Tenant Identity */}
//                         <div className="mb-5 flex items-center gap-3">
//                           <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#d5e5ce] bg-[#e7f0e2] text-lg font-bold uppercase text-[#315b3e]">
//                             {interest.tenant?.name?.charAt(0) || '?'}
//                           </div>

//                           <div className="min-w-0 flex-1">
//                             <h3 className="truncate text-base font-bold text-[#294b32]">
//                               {interest.tenant?.name || 'Tenant'}
//                             </h3>

//                             <p className="break-all text-sm text-[#788475]">
//                               {interest.tenant?.email}
//                             </p>
//                           </div>

//                           <span
//                             className={`shrink-0 rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide ${
//                               statusClass[interest.status]
//                             }`}
//                           >
//                             {interest.status}
//                           </span>
//                         </div>

//                         {/* Property Details */}
//                         <div className="mb-4 rounded-xl border border-[#e4ecdf] bg-[#f7faf5] p-4">
//                           <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[#7b8878]">
//                             Interested Property
//                           </p>

//                           <p className="font-semibold text-[#315b3e]">
//                             {interest.listing?.title || 'Property listing'}
//                           </p>

//                           {interest.listing?.location && (
//                             <p className="mt-1 flex items-center gap-1.5 text-sm text-[#788475]">
//                               <MapPin size={14} />
//                               {interest.listing.location}
//                             </p>
//                           )}
//                         </div>

//                         {/* Tenant Message */}
//                         {interest.message && (
//                           <div className="mb-4 rounded-xl border border-[#e2e9de] bg-white p-4">
//                             <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#718071]">
//                               Message from tenant
//                             </p>

//                             <p className="text-sm leading-relaxed text-[#485849]">
//                               “{interest.message}”
//                             </p>
//                           </div>
//                         )}

//                         <p className="text-xs text-[#899486]">
//                           Received on{' '}
//                           {format(
//                             new Date(interest.createdAt),
//                             'dd MMM yyyy, hh:mm a'
//                           )}
//                         </p>
//                       </div>

//                       {/* Request Actions */}
//                       <div className="flex shrink-0 flex-row flex-wrap gap-2 sm:w-48 sm:flex-col">
//                         {interest.status === 'PENDING' && (
//                           <>
//                             <button
//                               onClick={() =>
//                                 handleRespondInterest(
//                                   interest.id,
//                                   'ACCEPTED'
//                                 )
//                               }
//                               className={`${primaryButton} flex-1 sm:w-full`}
//                               id={`accept-interest-${interest.id}`}
//                             >
//                               <CheckCircle size={15} />
//                               Accept Request
//                             </button>

//                             <button
//                               onClick={() =>
//                                 handleRespondInterest(
//                                   interest.id,
//                                   'DECLINED'
//                                 )
//                               }
//                               className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50"
//                               id={`decline-interest-${interest.id}`}
//                             >
//                               Decline
//                             </button>
//                           </>
//                         )}

//                         {interest.status === 'ACCEPTED' &&
//                           interest.chatRoom && (
//                             <Link
//                               to={`/chat/${interest.chatRoom.id}`}
//                               className={`${primaryButton} w-full`}
//                               id={`owner-chat-${interest.chatRoom.id}`}
//                             >
//                               <MessageCircle size={16} />
//                               Open Live Chat
//                             </Link>
//                           )}

//                         {interest.status !== 'PENDING' && (
//                           <button
//                             onClick={() =>
//                               handleDeleteInterest(interest.id)
//                             }
//                             className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-100"
//                           >
//                             <Trash2 size={14} />
//                             Delete Request
//                           </button>
//                         )}
//                       </div>
//                     </div>
//                   </article>
//                 ))
//               )}
//             </motion.section>
//           )}

//           {/* OWNER PROFILE */}
//           {tab === 'profile' && (
//             <motion.section
//               key="profile"
//               initial={{ opacity: 0, y: 12 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -12 }}
//               className="mx-auto max-w-2xl"
//             >
//               <div className="overflow-hidden rounded-2xl border border-[#dfe8db] bg-white shadow-sm">
//                 <div className="border-b border-[#e5ede0] bg-gradient-to-r from-[#e8f1e3] to-[#f5f8f2] p-6 sm:p-8">
//                   <div className="flex items-center gap-4">
//                     <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#d6e4cf] bg-white text-[#315b3e] shadow-sm">
//                       <User size={25} />
//                     </div>

//                     <div>
//                       <h2 className="text-xl font-bold text-[#294b32]">
//                         Owner Profile
//                       </h2>

//                       <p className="mt-1 text-sm text-[#718071]">
//                         Keep your contact details up to date.
//                       </p>
//                     </div>
//                   </div>
//                 </div>

//                 <form
//                   onSubmit={async (e) => {
//                     e.preventDefault();
//                     setSavingProfile(true);

//                     try {
//                       await profilesAPI.saveOwner(profileForm);
//                       toast.success('Profile updated successfully!');
//                       await queryClient.invalidateQueries();
//                     } catch {
//                       toast.error('Failed to save profile');
//                     } finally {
//                       setSavingProfile(false);
//                     }
//                   }}
//                   className="space-y-5 p-6 sm:p-8"
//                 >
//                   <div>
//                     <label className={labelClass}>
//                       Contact Phone Number
//                     </label>

//                     <input
//                       type="tel"
//                       className={inputClass}
//                       placeholder="+91 9876543210"
//                       value={profileForm.phone}
//                       onChange={(e) =>
//                         setProfileForm((f) => ({
//                           ...f,
//                           phone: e.target.value,
//                         }))
//                       }
//                     />
//                   </div>

//                   <div>
//                     <label className={labelClass}>
//                       Office or Main Address
//                     </label>

//                     <input
//                       type="text"
//                       className={inputClass}
//                       placeholder="Enter your address"
//                       value={profileForm.address}
//                       onChange={(e) =>
//                         setProfileForm((f) => ({
//                           ...f,
//                           address: e.target.value,
//                         }))
//                       }
//                     />
//                   </div>

//                   <div>
//                     <label className={labelClass}>
//                       About You
//                     </label>

//                     <textarea
//                       className={`${inputClass} h-32 resize-none`}
//                       placeholder="Tell renters about yourself, your properties or building policies..."
//                       value={profileForm.bio}
//                       onChange={(e) =>
//                         setProfileForm((f) => ({
//                           ...f,
//                           bio: e.target.value,
//                         }))
//                       }
//                     />
//                   </div>

//                   <button
//                     type="submit"
//                     disabled={savingProfile}
//                     className={`${primaryButton} w-full`}
//                   >
//                     {savingProfile && (
//                       <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
//                     )}

//                     {savingProfile
//                       ? 'Saving Changes...'
//                       : 'Save Profile'}
//                   </button>
//                 </form>
//               </div>
//             </motion.section>
//           )}
//         </AnimatePresence>
//       </main>
//     </div>
//   );
// }








import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  Users,
  LayoutGrid,
  MessageCircle,
  Eye,
  IndianRupee,
  MapPin,
  Building2,
  User,
} from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  listingsAPI,
  interestsAPI,
  profilesAPI,
} from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';
import Navbar from '../../components/Navbar';
import { Listing, Interest } from '../../types';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const statusClass: Record<string, string> = {
  PENDING: 'bg-amber-50 text-amber-700 border border-amber-200',
  ACCEPTED: 'bg-green-50 text-green-700 border border-green-200',
  DECLINED: 'bg-red-50 text-red-700 border border-red-200',
};

const listingStatusClass: Record<string, string> = {
  ACTIVE: 'bg-green-50 text-green-700 border border-green-200',
  FILLED: 'bg-blue-50 text-blue-700 border border-blue-200',
  DELETED: 'bg-red-50 text-red-700 border border-red-200',
};

const inputClass =
  'w-full rounded-xl border border-[#d8e4d4] bg-[#f7faf5] px-4 py-3 text-sm text-[#293b2e] outline-none transition placeholder:text-[#929d8e] focus:border-[#6d9670] focus:bg-white focus:ring-2 focus:ring-[#315b3e]/10';

const labelClass =
  'mb-2 block text-sm font-semibold text-[#354438]';

const primaryButton =
  'inline-flex items-center justify-center gap-2 rounded-xl bg-[#315b3e] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#264a31] disabled:cursor-not-allowed disabled:opacity-60';

const secondaryButton =
  'inline-flex items-center justify-center gap-2 rounded-xl border border-[#d8e4d4] bg-white px-4 py-2.5 text-sm font-semibold text-[#315b3e] transition hover:bg-[#f0f6ed]';

export default function OwnerDashboard() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [tab, setTab] = useState<
    'listings' | 'interests' | 'profile'
  >('listings');

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingListing, setEditingListing] =
    useState<Listing | null>(null);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingListing, setSavingListing] = useState(false);
  const [images, setImages] = useState<string[]>([]);

  const [profileForm, setProfileForm] = useState({
    phone: '',
    address: '',
    bio: '',
  });

  const [listingForm, setListingForm] = useState({
    title: '',
    location: '',
    rent: '',
    availableFrom: '',
    roomType: 'SINGLE',
    furnishing: 'FURNISHED',
    description: '',
    occupancyOptions: '',
    commonAmenities: '',
    foodAndKitchen: '',
    otherCharges: '',
    houseRules: '',
    neighbourhood: '',
    contactPhone: '',
    whatsappNumber: '',
  });

  useEffect(() => {
    if (user?.ownerProfile) {
      setProfileForm({
        phone: user.ownerProfile.phone || '',
        address: user.ownerProfile.address || '',
        bio: user.ownerProfile.bio || '',
      });
    }
  }, [user]);

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!e.target.files) return;

    const filesArray = Array.from(e.target.files);

    const promises = filesArray.map(
      (file) =>
        new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () =>
            resolve(reader.result as string);
          reader.onerror = reject;
        })
    );

    Promise.all(promises)
      .then((base64s) => {
        setImages((prev) => [...prev, ...base64s]);
      })
      .catch(() => toast.error('Failed to read image files'));

    e.target.value = '';
  };

  const {
    data: myListings,
    isLoading: listingsLoading,
  } = useQuery({
    queryKey: ['ownerListings'],
    queryFn: () => listingsAPI.getMy().then((r) => r.data),
    enabled: !!user,
  });

  const listings: Listing[] = myListings || [];

  const interests: Interest[] = listings.flatMap((listing) =>
    (listing.interests || []).map((interest: any) => ({
      ...interest,
      listing: {
        id: listing.id,
        title: listing.title,
        location: listing.location,
        rent: listing.rent,
      },
    }))
  );

  const pendingCount = interests.filter(
    (interest) => interest.status === 'PENDING'
  ).length;

  const resetListingForm = () => {
    setListingForm({
      title: '',
      location: '',
      rent: '',
      availableFrom: '',
      roomType: 'SINGLE',
      furnishing: 'FURNISHED',
      description: '',
      occupancyOptions: '',
      commonAmenities: '',
      foodAndKitchen: '',
      otherCharges: '',
      houseRules: '',
      neighbourhood: '',
      contactPhone: profileForm.phone,
      whatsappNumber: profileForm.phone,
    });

    setImages([]);
    setEditingListing(null);
    setShowCreateForm(false);
  };

  const handleCreateOrUpdate = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();
    setSavingListing(true);

    try {
      const data = {
        ...listingForm,
        rent: Number(listingForm.rent),
        images,
      };

      if (editingListing) {
        await listingsAPI.update(editingListing.id, data);
        toast.success('Listing updated successfully!');
      } else {
        await listingsAPI.create(data);
        toast.success('Listing created successfully!');
      }

      await queryClient.invalidateQueries({
        queryKey: ['ownerListings'],
      });

      resetListingForm();
    } catch (err: any) {
      toast.error(
        err.response?.data?.error || 'Failed to save listing'
      );
    } finally {
      setSavingListing(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) {
      return;
    }

    try {
      await listingsAPI.delete(id);
      toast.success('Listing deleted');

      queryClient.invalidateQueries({
        queryKey: ['ownerListings'],
      });
    } catch {
      toast.error('Failed to delete listing');
    }
  };

  const handleMarkFilled = async (id: string) => {
    try {
      await listingsAPI.markFilled(id);
      toast.success('Listing marked as filled!');

      queryClient.invalidateQueries({
        queryKey: ['ownerListings'],
      });
    } catch {
      toast.error('Failed to update listing');
    }
  };

  const handleMarkActive = async (id: string) => {
    try {
      await listingsAPI.markActive(id);
      toast.success('Listing marked as active!');

      queryClient.invalidateQueries({
        queryKey: ['ownerListings'],
      });
    } catch {
      toast.error('Failed to update listing');
    }
  };

  const handleDeleteInterest = async (id: string) => {
    if (
      !window.confirm(
        'Delete this interest request? This will permanently close the chat room and allow the tenant to request again.'
      )
    ) {
      return;
    }

    try {
      await interestsAPI.withdraw(id);
      toast.success('Interest request deleted successfully!');

      queryClient.invalidateQueries({
        queryKey: ['ownerListings'],
      });
    } catch {
      toast.error('Failed to delete interest request');
    }
  };

  const handleRespondInterest = async (
    id: string,
    status: 'ACCEPTED' | 'DECLINED'
  ) => {
    try {
      await interestsAPI.respond(id, status);
      toast.success(`Interest request ${status.toLowerCase()}!`);

      queryClient.invalidateQueries({
        queryKey: ['ownerListings'],
      });
    } catch {
      toast.error('Failed to respond to request');
    }
  };

  const handleEditListing = (listing: Listing) => {
    setListingForm({
      title: listing.title,
      location: listing.location,
      rent: String(listing.rent),
      availableFrom: listing.availableFrom.split('T')[0],
      roomType: listing.roomType,
      furnishing: listing.furnishing,
      description: listing.description,
      occupancyOptions: (listing as any).occupancyOptions || '',
      commonAmenities: (listing as any).commonAmenities || '',
      foodAndKitchen: (listing as any).foodAndKitchen || '',
      otherCharges: (listing as any).otherCharges || '',
      houseRules: (listing as any).houseRules || '',
      neighbourhood: (listing as any).neighbourhood || '',
      contactPhone: (listing as any).contactPhone || user?.ownerProfile?.phone || '',
      whatsappNumber: (listing as any).whatsappNumber || (listing as any).contactPhone || user?.ownerProfile?.phone || '',
    });

    setImages(
      listing.images?.map((image: any) => image.url || image) || []
    );

    setEditingListing(listing);
    setShowCreateForm(true);
  };

  const tabs = [
    {
      id: 'listings',
      label: 'My Listings',
      icon: LayoutGrid,
      count: listings.length,
    },
    {
      id: 'interests',
      label: 'Tenant Requests',
      icon: Users,
      count: pendingCount,
    },
    {
      id: 'profile',
      label: 'Owner Profile',
      icon: Home,
    },
  ];

  return (
    <div className="min-h-screen bg-[#f7f9f5] text-[#293b2e] transition-colors duration-300">
      <Navbar
        currentView={tab === 'listings' ? 'list' : tab}
        onNavigate={(view) =>
          setTab(
            view === 'list'
              ? 'listings'
              : (view as 'interests' | 'profile')
          )
        }
      />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Dashboard Header */}
        <section className="relative mb-8 overflow-hidden rounded-3xl border border-[#dce8d6] bg-gradient-to-r from-[#e7f0e2] via-[#eff5eb] to-[#f7faf4] p-6 shadow-sm sm:p-8">
          <div className="pointer-events-none absolute -right-12 -top-16 h-56 w-56 rounded-full bg-[#c9ddc1]/40 blur-3xl" />

          <div className="relative flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#d2e1cc] bg-white/80 px-3 py-1.5 text-xs font-semibold text-[#426449]">
                <Home size={14} />
                GHARWISE OWNER SPACE
              </div>

              <h1 className="mb-2 text-2xl font-bold tracking-tight text-[#294b32] sm:text-3xl">
                Owner Dashboard
              </h1>

              <p className="mb-1 text-lg font-semibold text-[#45664a]">
                Welcome back, {user?.name || 'Owner'}
              </p>

              <p className="max-w-xl text-sm leading-relaxed text-[#657565]">
                Manage your properties, review tenant requests, and
                communicate with interested renters in one place.
              </p>
            </div>

            {tab === 'listings' && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setShowCreateForm(true);
                  setEditingListing(null);
                  setImages([]);
                }}
                className={`${primaryButton} shrink-0`}
                id="create-listing-btn"
              >
                <Plus size={17} />
                Add New Listing
              </motion.button>
            )}
          </div>
        </section>

        {/* Dashboard Statistics */}
        <section className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            {
              label: 'Total Listings',
              value: listings.length,
              icon: Building2,
            },
            {
              label: 'Active Listings',
              value: listings.filter(
                (listing) => listing.status === 'ACTIVE'
              ).length,
              icon: CheckCircle,
            },
            {
              label: 'Filled Properties',
              value: listings.filter(
                (listing) => listing.status === 'FILLED'
              ).length,
              icon: Home,
            },
            {
              label: 'Pending Requests',
              value: pendingCount,
              icon: Users,
            },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="rounded-2xl border border-[#e0e8dc] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wide text-[#718071]">
                  {stat.label}
                </span>

                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#eaf2e6] text-[#41694a]">
                  <stat.icon size={17} />
                </span>
              </div>

              <p className="text-3xl font-bold text-[#294b32]">
                {stat.value}
              </p>
            </motion.div>
          ))}
        </section>

        {/* Navigation Tabs */}
        <div className="mb-8 flex gap-2 overflow-x-auto rounded-2xl border border-[#e0e8dc] bg-[#edf3e9] p-1.5">
          {tabs.map((item) => (
            <button
              key={item.id}
              onClick={() => setTab(item.id as typeof tab)}
              className={`relative flex shrink-0 items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition sm:px-5 ${
                tab === item.id
                  ? 'border border-[#d8e5d2] bg-white text-[#315b3e] shadow-sm'
                  : 'text-[#697967] hover:bg-white/60 hover:text-[#315b3e]'
              }`}
            >
              <item.icon size={16} />
              <span>{item.label}</span>

              {item.count ? (
                <span className="min-w-5 rounded-full bg-[#dcebd5] px-1.5 py-0.5 text-center text-[10px] font-bold text-[#315b3e]">
                  {item.count}
                </span>
              ) : null}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* MY LISTINGS */}
          {tab === 'listings' && (
            <motion.section
              key="listings"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="space-y-6"
            >
              {/* Create/Edit Listing Form */}
              {showCreateForm && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.99 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="rounded-2xl border border-[#dce7d7] bg-white p-5 shadow-sm sm:p-8"
                >
                  <div className="mb-6 flex items-start justify-between gap-4 border-b border-[#e8eee4] pb-5">
                    <div>
                      <h2 className="text-xl font-bold text-[#294b32]">
                        {editingListing
                          ? 'Edit Property Listing'
                          : 'Create a New Listing'}
                      </h2>

                      <p className="mt-1 text-sm text-[#778475]">
                        Add accurate details to help renters find your property.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={resetListingForm}
                      className="rounded-lg px-3 py-2 text-sm font-medium text-[#697967] hover:bg-[#f0f5ed]"
                    >
                      Cancel
                    </button>
                  </div>

                  <form
                    onSubmit={handleCreateOrUpdate}
                    className="space-y-5"
                  >
                    <div>
                      <label className={labelClass}>
                        Property Title
                      </label>

                      <input
                        type="text"
                        className={inputClass}
                        placeholder="e.g. Spacious apartment with balcony"
                        value={listingForm.title}
                        onChange={(e) =>
                          setListingForm((f) => ({
                            ...f,
                            title: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div>
                        <label className={labelClass}>
                          Location
                        </label>

                        <input
                          type="text"
                          className={inputClass}
                          placeholder="e.g. Indrapuri, Bhopal"
                          value={listingForm.location}
                          onChange={(e) =>
                            setListingForm((f) => ({
                              ...f,
                              location: e.target.value,
                            }))
                          }
                          required
                        />
                      </div>

                      <div>
                        <label className={labelClass}>
                          Monthly Rent (₹)
                        </label>

                        <input
                          type="number"
                          min="0"
                          className={inputClass}
                          placeholder="18000"
                          value={listingForm.rent}
                          onChange={(e) =>
                            setListingForm((f) => ({
                              ...f,
                              rent: e.target.value,
                            }))
                          }
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                      <div>
                        <label className={labelClass}>
                          Available From
                        </label>

                        <input
                          type="date"
                          className={inputClass}
                          value={listingForm.availableFrom}
                          onChange={(e) =>
                            setListingForm((f) => ({
                              ...f,
                              availableFrom: e.target.value,
                            }))
                          }
                          required
                        />
                      </div>

                      <div>
                        <label className={labelClass}>
                          Property Type
                        </label>

                        <select
                          className={inputClass}
                          value={listingForm.roomType}
                          onChange={(e) =>
                            setListingForm((f) => ({
                              ...f,
                              roomType: e.target.value,
                            }))
                          }
                        >
                          {[
                            'SINGLE',
                            'SHARED',
                            'STUDIO',
                            'APARTMENT',
                            'PG',
                          ].map((type) => (
                            <option key={type} value={type}>
                              {type.replace('_', ' ')}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className={labelClass}>
                          Furnishing
                        </label>

                        <select
                          className={inputClass}
                          value={listingForm.furnishing}
                          onChange={(e) =>
                            setListingForm((f) => ({
                              ...f,
                              furnishing: e.target.value,
                            }))
                          }
                        >
                          {[
                            'FURNISHED',
                            'SEMI_FURNISHED',
                            'UNFURNISHED',
                          ].map((type) => (
                            <option key={type} value={type}>
                              {type.replace('_', ' ')}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Occupancy Options */}
                    <section className="rounded-2xl border border-[#e0e9dc] bg-[#fbfdf9] p-4 sm:p-5">
                      <h3 className="mb-1 text-base font-bold text-[#294b32]">Occupancy Options</h3>
                      <p className="mb-4 text-sm text-[#788475]">Mention room-sharing options, capacity and who can rent this property.</p>
                      <label className={labelClass}>Occupancy details</label>
                      <textarea className={`${inputClass} min-h-24 resize-y`} placeholder="e.g. Single or double sharing, maximum 2 people, students and working professionals welcome" value={listingForm.occupancyOptions} onChange={(e) => setListingForm((f) => ({ ...f, occupancyOptions: e.target.value }))} />
                    </section>

                    {/* Common Amenities */}
                    <section className="rounded-2xl border border-[#e0e9dc] bg-[#fbfdf9] p-4 sm:p-5">
                      <h3 className="mb-1 text-base font-bold text-[#294b32]">Common Amenities</h3>
                      <p className="mb-4 text-sm text-[#788475]">List the facilities available at the property.</p>
                      <label className={labelClass}>Amenities</label>
                      <textarea className={`${inputClass} min-h-24 resize-y`} placeholder="e.g. Wi-Fi, parking, lift, security, washing machine, AC" value={listingForm.commonAmenities} onChange={(e) => setListingForm((f) => ({ ...f, commonAmenities: e.target.value }))} />
                    </section>

                    {/* Food and Kitchen */}
                    <section className="rounded-2xl border border-[#e0e9dc] bg-[#fbfdf9] p-4 sm:p-5">
                      <h3 className="mb-1 text-base font-bold text-[#294b32]">Food and Kitchen</h3>
                      <p className="mb-4 text-sm text-[#788475]">Share food availability and kitchen access information.</p>
                      <label className={labelClass}>Food and kitchen details</label>
                      <textarea className={`${inputClass} min-h-24 resize-y`} placeholder="e.g. Meals included/not included, veg food, shared kitchen, cooking allowed, meal timings" value={listingForm.foodAndKitchen} onChange={(e) => setListingForm((f) => ({ ...f, foodAndKitchen: e.target.value }))} />
                    </section>

                    {/* Other Charges */}
                    <section className="rounded-2xl border border-[#e0e9dc] bg-[#fbfdf9] p-4 sm:p-5">
                      <h3 className="mb-1 text-base font-bold text-[#294b32]">Other Charges</h3>
                      <p className="mb-4 text-sm text-[#788475]">Be transparent about additional costs.</p>
                      <label className={labelClass}>Deposit and other charges</label>
                      <textarea className={`${inputClass} min-h-24 resize-y`} placeholder="e.g. Security deposit ₹10,000, maintenance ₹500/month, electricity as per meter, no brokerage" value={listingForm.otherCharges} onChange={(e) => setListingForm((f) => ({ ...f, otherCharges: e.target.value }))} />
                    </section>

                    {/* House Rules */}
                    <section className="rounded-2xl border border-[#e0e9dc] bg-[#fbfdf9] p-4 sm:p-5">
                      <h3 className="mb-1 text-base font-bold text-[#294b32]">House Rules</h3>
                      <p className="mb-4 text-sm text-[#788475]">Explain the property's rules before tenants contact you.</p>
                      <label className={labelClass}>Rules and preferences</label>
                      <textarea className={`${inputClass} min-h-24 resize-y`} placeholder="e.g. Visitors allowed until 9 PM, no smoking, pets not allowed, one-month notice period" value={listingForm.houseRules} onChange={(e) => setListingForm((f) => ({ ...f, houseRules: e.target.value }))} />
                    </section>

                    {/* Neighbourhood */}
                    <section className="rounded-2xl border border-[#e0e9dc] bg-[#fbfdf9] p-4 sm:p-5">
                      <h3 className="mb-1 text-base font-bold text-[#294b32]">Explore Neighbourhood</h3>
                      <p className="mb-4 text-sm text-[#788475]">Help renters understand nearby transport and essentials.</p>
                      <label className={labelClass}>Nearby places</label>
                      <textarea className={`${inputClass} min-h-24 resize-y`} placeholder="e.g. 1 km from college, 500 m from bus stop, nearby market, hospital and grocery stores" value={listingForm.neighbourhood} onChange={(e) => setListingForm((f) => ({ ...f, neighbourhood: e.target.value }))} />
                    </section>

                    {/* Contact and WhatsApp */}
                    <section className="rounded-2xl border border-[#d8e7d3] bg-[#f1f7ee] p-4 sm:p-5">
                      <h3 className="mb-1 text-base font-bold text-[#294b32]">Contact & WhatsApp</h3>
                      <p className="mb-4 text-sm text-[#718071]">Use a number that prospective tenants can contact. WhatsApp number should include country code, e.g. 91 followed by your 10-digit number.</p>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <label className={labelClass}>Contact Phone Number</label>
                          <input type="tel" inputMode="tel" className={inputClass} placeholder="+91 9876543210" value={listingForm.contactPhone} onChange={(e) => setListingForm((f) => ({ ...f, contactPhone: e.target.value }))} />
                        </div>
                        <div>
                          <label className={labelClass}>WhatsApp Number</label>
                          <input type="tel" inputMode="tel" className={inputClass} placeholder="919876543210" value={listingForm.whatsappNumber} onChange={(e) => setListingForm((f) => ({ ...f, whatsappNumber: e.target.value }))} />
                        </div>
                      </div>
                    </section>

                    <div>
                      <label className={labelClass}>
                        Property Description
                      </label>

                      <textarea
                        className={`${inputClass} h-32 resize-none`}
                        placeholder="Describe the property, facilities, deposit, utilities and house rules..."
                        value={listingForm.description}
                        onChange={(e) =>
                          setListingForm((f) => ({
                            ...f,
                            description: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>

                    <div>
                      <label className={labelClass}>
                        Property Images
                      </label>

                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className={`${inputClass} file:mr-3 file:rounded-lg file:border-0 file:bg-[#e6f0e1] file:px-3 file:py-2 file:text-xs file:font-semibold file:text-[#315b3e]`}
                        onChange={handleImageChange}
                      />

                      <p className="mt-2 text-xs text-[#7b8878]">
                        Select property photos in a supported image format.
                      </p>

                      {images.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-3">
                          {images.map((img, index) => (
                            <div
                              key={index}
                              className="group relative h-24 w-24 overflow-hidden rounded-xl border border-[#dce7d7]"
                            >
                              <img
                                src={img}
                                alt={`Property preview ${index + 1}`}
                                className="h-full w-full object-cover"
                              />

                              <button
                                type="button"
                                onClick={() =>
                                  setImages((prev) =>
                                    prev.filter((_, i) => i !== index)
                                  )
                                }
                                className="absolute inset-0 flex items-center justify-center bg-black/55 text-xs font-semibold text-white opacity-0 transition group-hover:opacity-100"
                              >
                                <Trash2 size={15} className="mr-1" />
                                Remove
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col-reverse gap-3 border-t border-[#e8eee4] pt-5 sm:flex-row">
                      <button
                        type="button"
                        onClick={resetListingForm}
                        className={`${secondaryButton} flex-1`}
                      >
                        Cancel
                      </button>

                      <button
                        type="submit"
                        disabled={savingListing}
                        className={`${primaryButton} flex-1`}
                      >
                        {savingListing && (
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                        )}

                        {savingListing
                          ? 'Saving...'
                          : editingListing
                            ? 'Update Listing'
                            : 'Publish Listing'}
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* Loading State */}
              {listingsLoading ? (
                <div className="grid grid-cols-1 gap-4">
                  {[0, 1, 2].map((item) => (
                    <div
                      key={item}
                      className="h-32 animate-pulse rounded-2xl bg-[#e9efe5]"
                    />
                  ))}
                </div>
              ) : listings.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-[#d3e1cd] bg-white px-6 py-16 text-center">
                  <span className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#eaf2e6] text-[#41694a]">
                    <Building2 size={30} />
                  </span>

                  <h3 className="mb-2 text-lg font-bold text-[#294b32]">
                    No properties listed yet
                  </h3>

                  <p className="mx-auto mb-6 max-w-sm text-sm leading-relaxed text-[#788475]">
                    Create your first property listing to help renters
                    discover their next home.
                  </p>

                  <button
                    onClick={() => setShowCreateForm(true)}
                    className={primaryButton}
                  >
                    <Plus size={16} />
                    Add Your First Listing
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {listings.map((listing) => (
                    <article
                      key={listing.id}
                      className="rounded-2xl border border-[#e0e8dc] bg-white p-4 shadow-sm transition hover:shadow-md sm:p-5"
                    >
                      <div className="flex flex-col gap-5 md:flex-row">
                        <div className="h-48 w-full shrink-0 overflow-hidden rounded-xl bg-[#edf3e9] sm:h-36 md:w-48">
                          <img
                            src={
                              listing.images?.[0]?.url ||
                              `https://picsum.photos/seed/${listing.id}/400/300`
                            }
                            alt={listing.title}
                            className="h-full w-full object-cover"
                          />
                        </div>

                        <div className="flex min-w-0 flex-1 flex-col justify-between">
                          <div>
                            <div className="mb-3 flex flex-wrap items-center gap-2">
                              <h3 className="text-lg font-bold text-[#294b32]">
                                {listing.title}
                              </h3>

                              <span
                                className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${
                                  listingStatusClass[listing.status]
                                }`}
                              >
                                {listing.status}
                              </span>
                            </div>

                            <div className="mb-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-[#718071]">
                              <span className="flex items-center gap-1.5">
                                <MapPin size={15} />
                                {listing.location}
                              </span>

                              <span className="flex items-center gap-1 font-semibold text-[#315b3e]">
                                <IndianRupee size={14} />
                                {listing.rent.toLocaleString('en-IN')}/month
                              </span>

                              <span className="flex items-center gap-1.5">
                                <Users size={14} />
                                {listing._count?.interests || 0} requests
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2 border-t border-[#edf1e9] pt-4">
                            <Link
                              to={`/listings/${listing.id}`}
                              className={secondaryButton}
                            >
                              <Eye size={14} />
                              View
                            </Link>

                            <button
                              onClick={() => handleEditListing(listing)}
                              className={secondaryButton}
                            >
                              <Edit2 size={14} />
                              Edit
                            </button>

                            {listing.status === 'ACTIVE' ? (
                              <button
                                onClick={() =>
                                  handleMarkFilled(listing.id)
                                }
                                className="inline-flex items-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-3 py-2.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
                              >
                                <CheckCircle size={14} />
                                Mark Filled
                              </button>
                            ) : (
                              <button
                                onClick={() =>
                                  handleMarkActive(listing.id)
                                }
                                className="inline-flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-3 py-2.5 text-sm font-semibold text-green-700 transition hover:bg-green-100"
                              >
                                <CheckCircle size={14} />
                                Mark Active
                              </button>
                            )}

                            <button
                              onClick={() => handleDelete(listing.id)}
                              className="ml-auto inline-flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-3 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100"
                            >
                              <Trash2 size={14} />
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </motion.section>
          )}

          {/* TENANT REQUESTS */}
          {tab === 'interests' && (
            <motion.section
              key="interests"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="space-y-4"
            >
              <div className="mb-5">
                <h2 className="text-xl font-bold text-[#294b32]">
                  Tenant Requests
                </h2>

                <p className="mt-1 text-sm text-[#778475]">
                  Review inquiries and respond to people interested in your properties.
                </p>
              </div>

              {interests.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-[#d3e1cd] bg-white px-6 py-16 text-center">
                  <span className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#eaf2e6] text-[#41694a]">
                    <Users size={30} />
                  </span>

                  <h3 className="mb-2 text-lg font-bold text-[#294b32]">
                    No tenant requests yet
                  </h3>

                  <p className="mx-auto max-w-sm text-sm leading-relaxed text-[#788475]">
                    When someone expresses interest in one of your listings,
                    their request will appear here.
                  </p>
                </div>
              ) : (
                interests.map((interest) => (
                  <article
                    key={interest.id}
                    className="rounded-2xl border border-[#e0e8dc] bg-white p-5 shadow-sm transition hover:shadow-md sm:p-6"
                  >
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                      <div className="min-w-0 flex-1">
                        {/* Tenant Identity */}
                        <div className="mb-5 flex items-center gap-3">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#d5e5ce] bg-[#e7f0e2] text-lg font-bold uppercase text-[#315b3e]">
                            {interest.tenant?.name?.charAt(0) || '?'}
                          </div>

                          <div className="min-w-0 flex-1">
                            <h3 className="truncate text-base font-bold text-[#294b32]">
                              {interest.tenant?.name || 'Tenant'}
                            </h3>

                            <p className="break-all text-sm text-[#788475]">
                              {interest.tenant?.email}
                            </p>
                          </div>

                          <span
                            className={`shrink-0 rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide ${
                              statusClass[interest.status]
                            }`}
                          >
                            {interest.status}
                          </span>
                        </div>

                        {/* Property Details */}
                        <div className="mb-4 rounded-xl border border-[#e4ecdf] bg-[#f7faf5] p-4">
                          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[#7b8878]">
                            Interested Property
                          </p>

                          <p className="font-semibold text-[#315b3e]">
                            {interest.listing?.title || 'Property listing'}
                          </p>

                          {interest.listing?.location && (
                            <p className="mt-1 flex items-center gap-1.5 text-sm text-[#788475]">
                              <MapPin size={14} />
                              {interest.listing.location}
                            </p>
                          )}
                        </div>

                        {/* Tenant Message */}
                        {interest.message && (
                          <div className="mb-4 rounded-xl border border-[#e2e9de] bg-white p-4">
                            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#718071]">
                              Message from tenant
                            </p>

                            <p className="text-sm leading-relaxed text-[#485849]">
                              “{interest.message}”
                            </p>
                          </div>
                        )}

                        <p className="text-xs text-[#899486]">
                          Received on{' '}
                          {format(
                            new Date(interest.createdAt),
                            'dd MMM yyyy, hh:mm a'
                          )}
                        </p>
                      </div>

                      {/* Request Actions */}
                      <div className="flex shrink-0 flex-row flex-wrap gap-2 sm:w-48 sm:flex-col">
                        {interest.status === 'PENDING' && (
                          <>
                            <button
                              onClick={() =>
                                handleRespondInterest(
                                  interest.id,
                                  'ACCEPTED'
                                )
                              }
                              className={`${primaryButton} flex-1 sm:w-full`}
                              id={`accept-interest-${interest.id}`}
                            >
                              <CheckCircle size={15} />
                              Accept Request
                            </button>

                            <button
                              onClick={() =>
                                handleRespondInterest(
                                  interest.id,
                                  'DECLINED'
                                )
                              }
                              className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                              id={`decline-interest-${interest.id}`}
                            >
                              Decline
                            </button>
                          </>
                        )}

                        {interest.status === 'ACCEPTED' &&
                          interest.chatRoom && (
                            <Link
                              to={`/chat/${interest.chatRoom.id}`}
                              className={`${primaryButton} w-full`}
                              id={`owner-chat-${interest.chatRoom.id}`}
                            >
                              <MessageCircle size={16} />
                              Open Live Chat
                            </Link>
                          )}

                        {interest.status !== 'PENDING' && (
                          <button
                            onClick={() =>
                              handleDeleteInterest(interest.id)
                            }
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-100"
                          >
                            <Trash2 size={14} />
                            Delete Request
                          </button>
                        )}
                      </div>
                    </div>
                  </article>
                ))
              )}
            </motion.section>
          )}

          {/* OWNER PROFILE */}
          {tab === 'profile' && (
            <motion.section
              key="profile"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="mx-auto max-w-2xl"
            >
              <div className="overflow-hidden rounded-2xl border border-[#dfe8db] bg-white shadow-sm">
                <div className="border-b border-[#e5ede0] bg-gradient-to-r from-[#e8f1e3] to-[#f5f8f2] p-6 sm:p-8">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#d6e4cf] bg-white text-[#315b3e] shadow-sm">
                      <User size={25} />
                    </div>

                    <div>
                      <h2 className="text-xl font-bold text-[#294b32]">
                        Owner Profile
                      </h2>

                      <p className="mt-1 text-sm text-[#718071]">
                        Keep your contact details up to date.
                      </p>
                    </div>
                  </div>
                </div>

                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setSavingProfile(true);

                    try {
                      await profilesAPI.saveOwner(profileForm);
                      toast.success('Profile updated successfully!');
                      await queryClient.invalidateQueries();
                    } catch {
                      toast.error('Failed to save profile');
                    } finally {
                      setSavingProfile(false);
                    }
                  }}
                  className="space-y-5 p-6 sm:p-8"
                >
                  <div>
                    <label className={labelClass}>
                      Contact Phone Number
                    </label>

                    <input
                      type="tel"
                      className={inputClass}
                      placeholder="+91 9876543210"
                      value={profileForm.phone}
                      onChange={(e) =>
                        setProfileForm((f) => ({
                          ...f,
                          phone: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div>
                    <label className={labelClass}>
                      Office or Main Address
                    </label>

                    <input
                      type="text"
                      className={inputClass}
                      placeholder="Enter your address"
                      value={profileForm.address}
                      onChange={(e) =>
                        setProfileForm((f) => ({
                          ...f,
                          address: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div>
                    <label className={labelClass}>
                      About You
                    </label>

                    <textarea
                      className={`${inputClass} h-32 resize-none`}
                      placeholder="Tell renters about yourself, your properties or building policies..."
                      value={profileForm.bio}
                      onChange={(e) =>
                        setProfileForm((f) => ({
                          ...f,
                          bio: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={savingProfile}
                    className={`${primaryButton} w-full`}
                  >
                    {savingProfile && (
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    )}

                    {savingProfile
                      ? 'Saving Changes...'
                      : 'Save Profile'}
                  </button>
                </form>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </main>
    </div>
  );





}
