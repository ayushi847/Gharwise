





import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  MapPin,
  IndianRupee,
  ChevronLeft,
  Send,
  CheckCircle,
  CalendarDays,
  UserRound,
  Phone,
  MessageCircle,
  Home,
  
  Utensils,
  ShieldCheck,
  Sparkles,
  Wallet,
  Building2,
  LoaderCircle,
  AlertCircle,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { format, isValid } from 'date-fns';
import toast from 'react-hot-toast';

import { listingsAPI, compatibilityAPI, interestsAPI } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import CompatibilityBadge from '../components/CompatibilityBadge';
import type { Listing } from '../types';

const roomTypeLabel: Record<string, string> = {
  SINGLE: 'Single Room',
  SHARED: 'Shared Room',
  STUDIO: 'Studio',
  APARTMENT: 'Apartment',
  PG: 'PG Accommodation',
};

const furnishingLabel: Record<string, string> = {
  FURNISHED: 'Fully Furnished',
  SEMI_FURNISHED: 'Semi-Furnished',
  UNFURNISHED: 'Unfurnished',
};

const formatDate = (dateValue?: string) => {
  if (!dateValue) return 'Not specified';

  const date = new Date(dateValue);

  return isValid(date) ? format(date, 'dd MMM yyyy') : 'Not specified';
};

const cleanPhoneNumber = (phone?: string) => {
  if (!phone) return '';

  // Keep digits and allow a leading international +.
  return phone.trim().replace(/[^\d+]/g, '');
};

const getWhatsAppNumber = (phone?: string) => {
  // WhatsApp URLs require digits only, including the country code.
  return phone?.replace(/\D/g, '') ?? '';
};

interface DetailSectionProps {
  title: string;
  icon: React.ReactNode;
  items?: string[];
  emptyText?: string;
}

function DetailSection({
  title,
  icon,
  items,
  emptyText = 'Not provided',
}: DetailSectionProps) {
  const visibleItems = (items ?? []).filter(
    (item) => typeof item === 'string' && item.trim().length > 0
  );

  return (
    <section className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm dark:border-dark-700 dark:bg-dark-900">
      <div className="mb-4 flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
          {icon}
        </span>
        <h3 className="font-semibold text-dark-900 dark:text-white">
          {title}
        </h3>
      </div>

      {visibleItems.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {visibleItems.map((item, index) => (
            <span
              key={`${item}-${index}`}
              className="rounded-full border border-emerald-100 bg-emerald-50/70 px-3 py-1.5 text-sm text-emerald-900 dark:border-dark-700 dark:bg-dark-800 dark:text-emerald-200"
            >
              {item}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-sm text-dark-500 dark:text-dark-400">
          {emptyText}
        </p>
      )}
    </section>
  );
}

export default function ListingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [selectedImage, setSelectedImage] = useState(0);
  const [interestMessage, setInterestMessage] = useState('');
  const [sendingInterest, setSendingInterest] = useState(false);
  const [interestSent, setInterestSent] = useState(false);

  const {
    data: listing,
    isLoading,
    isError,
  } = useQuery<Listing>({
    queryKey: ['listing', id],
    queryFn: () => listingsAPI.getOne(id!).then((response) => response.data),
    enabled: Boolean(id),
  });

  const { data: compatibility } = useQuery({
    queryKey: ['compatibility', id],
    queryFn: () =>
      compatibilityAPI.get(id!).then((response) => response.data),
    enabled: Boolean(id) && user?.role === 'TENANT',
  });

  const handleSendInterest = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!id) {
      toast.error('Unable to identify this property.');
      return;
    }

    setSendingInterest(true);

    try {
      await interestsAPI.send({
        listingId: id,
        message: interestMessage.trim(),
      });

      toast.success('Interest sent successfully!');
      setInterestSent(true);
    } catch (error: any) {
      const message =
        error?.response?.data?.error || 'Failed to send interest. Try again.';

      if (message.toLowerCase().includes('already')) {
        toast.error('You have already sent interest for this property.');
        setInterestSent(true);
      } else {
        toast.error(message);
      }
    } finally {
      setSendingInterest(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-50 dark:bg-dark-950">
        <Navbar />

        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-6 h-5 w-24 animate-pulse rounded bg-dark-200 dark:bg-dark-800" />

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <div className="h-80 animate-pulse rounded-2xl bg-dark-200 dark:bg-dark-800 lg:h-96" />
              <div className="h-56 animate-pulse rounded-2xl bg-dark-200 dark:bg-dark-800" />
            </div>

            <div className="h-64 animate-pulse rounded-2xl bg-dark-200 dark:bg-dark-800" />
          </div>
        </main>
      </div>
    );
  }

  if (isError || !listing) {
    return (
      <div className="min-h-screen bg-dark-50 dark:bg-dark-950">
        <Navbar />

        <main className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center">
          <AlertCircle size={42} className="mb-4 text-amber-600" />

          <h1 className="text-2xl font-bold text-dark-900 dark:text-white">
            Property not found
          </h1>

          <p className="mt-2 text-dark-500 dark:text-dark-400">
            This property may have been removed or the link may be incorrect.
          </p>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="btn-primary mt-6 flex items-center gap-2"
          >
            <ChevronLeft size={18} />
            Go Back
          </button>
        </main>
      </div>
    );
  }

  const images =
    listing.images?.filter((image) => Boolean(image.url)) ?? [];

  const activeImage = images[selectedImage];

  const phoneNumber = cleanPhoneNumber(listing.contactPhone);
  const whatsappNumber = getWhatsAppNumber(
    listing.whatsappNumber || listing.contactPhone
  );

  const canContactOwner = listing.status === 'ACTIVE';

  const whatsappMessage = encodeURIComponent(
    `Hi, I'm interested in your property "${listing.title}" listed on Gharwise.`
  );

  return (
    <div className="min-h-screen bg-[#F7F8F4] text-dark-900 dark:bg-dark-950 dark:text-white">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium text-dark-600 transition hover:bg-emerald-50 hover:text-emerald-800 dark:text-dark-300 dark:hover:bg-dark-800"
        >
          <ChevronLeft size={18} />
          Back to listings
        </button>

        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3 lg:gap-8">
          {/* Left column: property photos and details */}
          <div className="min-w-0 space-y-6 lg:col-span-2">
            {/* Image gallery */}
            <section className="overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-sm dark:border-dark-700 dark:bg-dark-900">
              <div className="relative h-72 bg-dark-100 sm:h-96 dark:bg-dark-800">
                {activeImage ? (
                  <img
                    src={activeImage.url}
                    alt={listing.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center gap-3 text-dark-400">
                    <Building2 size={48} />
                    <p className="text-sm">No property images available</p>
                  </div>
                )}

                {listing.status === 'FILLED' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/55">
                    <span className="rounded-full bg-white px-5 py-2 text-sm font-bold text-dark-900 shadow-lg">
                      Property No Longer Available
                    </span>
                  </div>
                )}

                {listing.status === 'DELETED' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/55">
                    <span className="rounded-full bg-white px-5 py-2 text-sm font-bold text-dark-900 shadow-lg">
                      Listing Removed
                    </span>
                  </div>
                )}
              </div>

              {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto p-4">
                  {images.map((image, index) => (
                    <button
                      key={image.id || image.publicId || image.url}
                      type="button"
                      onClick={() => setSelectedImage(index)}
                      aria-label={`View property image ${index + 1}`}
                      aria-pressed={selectedImage === index}
                      className={`h-16 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition sm:h-20 sm:w-24 ${
                        selectedImage === index
                          ? 'border-emerald-600 ring-2 ring-emerald-100'
                          : 'border-transparent opacity-75 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={image.url}
                        alt={`${listing.title} - image ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </section>

            {/* Basic property information */}
            <section className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm sm:p-6 dark:border-dark-700 dark:bg-dark-900">
              <div className="mb-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">
                  {roomTypeLabel[listing.roomType] || listing.roomType}
                </span>

                <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-800 dark:bg-sky-900/30 dark:text-sky-300">
                  {furnishingLabel[listing.furnishing] || listing.furnishing}
                </span>

                {listing.status === 'ACTIVE' && (
                  <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-800 dark:bg-green-900/30 dark:text-green-300">
                    Available
                  </span>
                )}

                {listing.status === 'FILLED' && (
                  <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                    Filled
                  </span>
                )}
              </div>

              <h1 className="break-words text-2xl font-bold tracking-tight sm:text-3xl">
                {listing.title}
              </h1>

              <div className="mt-3 flex items-start gap-2 text-sm text-dark-500 dark:text-dark-400">
                <MapPin size={18} className="mt-0.5 shrink-0 text-emerald-700 dark:text-emerald-400" />
                <span>{listing.location}</span>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-xl bg-emerald-50/80 p-4 dark:bg-dark-800">
                  <p className="mb-2 flex items-center gap-1 text-xs text-dark-500 dark:text-dark-400">
                    <IndianRupee size={14} />
                    Monthly Rent
                  </p>

                  <p className="text-xl font-bold text-emerald-800 dark:text-emerald-300">
                    ₹{Number(listing.rent || 0).toLocaleString('en-IN')}
                    <span className="ml-1 text-xs font-normal text-dark-500 dark:text-dark-400">
                      / month
                    </span>
                  </p>
                </div>

                <div className="rounded-xl bg-emerald-50/80 p-4 dark:bg-dark-800">
                  <p className="mb-2 flex items-center gap-2 text-xs text-dark-500 dark:text-dark-400">
                    <CalendarDays size={14} />
                    Available From
                  </p>

                  <p className="text-sm font-semibold">
                    {formatDate(listing.availableFrom)}
                  </p>
                </div>

                <div className="rounded-xl bg-emerald-50/80 p-4 dark:bg-dark-800">
                  <p className="mb-2 flex items-center gap-2 text-xs text-dark-500 dark:text-dark-400">
                    <UserRound size={14} />
                    Listed By
                  </p>

                  <p className="break-words text-sm font-semibold">
                    {listing.owner?.name || 'Property Owner'}
                  </p>
                </div>
              </div>

              <div className="mt-7 border-t border-dark-100 pt-6 dark:border-dark-700">
                <h2 className="mb-3 text-lg font-semibold">
                  About this property
                </h2>

                <p className="whitespace-pre-line break-words text-sm leading-7 text-dark-600 dark:text-dark-300">
                  {listing.description || 'No description provided.'}
                </p>
              </div>
            </section>

            {/* Occupancy options */}
            <DetailSection
              title="Occupancy Options"
              icon={<Home size={19} />}
              items={listing.occupancyOptions}
              emptyText="Occupancy options have not been specified."
            />

            {/* Shared amenities */}
            <DetailSection
              title="Common Amenities"
              icon={<Sparkles size={19} />}
              items={listing.commonAmenities}
              emptyText="No amenities have been listed."
            />

            {/* Food and kitchen */}
            <DetailSection
              title="Food & Kitchen"
              icon={<Utensils size={19} />}
              items={listing.foodAndKitchen}
              emptyText="Food and kitchen facilities have not been specified."
            />

            {/* Extra charges */}
            <DetailSection
              title="Other Charges"
              icon={<Wallet size={19} />}
              items={listing.otherCharges}
              emptyText="No additional charges have been specified."
            />

            {/* House rules */}
            <DetailSection
              title="House Rules"
              icon={<ShieldCheck size={19} />}
              items={listing.houseRules}
              emptyText="No specific house rules have been listed."
            />

            {/* Neighbourhood */}
            <section className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm dark:border-dark-700 dark:bg-dark-900">
              <div className="mb-3 flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                  <MapPin size={19} />
                </span>

                <h2 className="font-semibold">Explore the Neighbourhood</h2>
              </div>

              <p className="whitespace-pre-line break-words text-sm leading-7 text-dark-600 dark:text-dark-300">
                {listing.neighbourhood?.trim() ||
                  'Neighbourhood information has not been provided yet.'}
              </p>

              {listing.location && (
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(listing.location)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-emerald-800 hover:underline dark:text-emerald-400"
                >
                  <MapPin size={16} />
                  View area on Google Maps
                </a>
              )}
            </section>
          </div>

          {/* Right column: compatibility, contact and interest */}
          <aside className="min-w-0 space-y-5 lg:sticky lg:top-24">
            {/* Compatibility */}
            {compatibility && (
              <CompatibilityBadge compatibility={compatibility} />
            )}

            {/* Owner contact card */}
            <section className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm dark:border-dark-700 dark:bg-dark-900">
              <h2 className="text-lg font-bold">Contact Owner</h2>

              <p className="mt-1 text-sm text-dark-500 dark:text-dark-400">
                Interested in this property? Reach out to the owner.
              </p>

              <div className="mt-4 rounded-xl bg-emerald-50/80 p-4 dark:bg-dark-800">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
                    <UserRound size={21} />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate font-semibold">
                      {listing.owner?.name || 'Property Owner'}
                    </p>

                    <p className="text-xs text-dark-500 dark:text-dark-400">
                      Property Owner
                    </p>
                  </div>
                </div>
              </div>

              {canContactOwner ? (
                <div className="mt-4 space-y-3">
                  {phoneNumber ? (
                    <a
                      href={`tel:${phoneNumber}`}
                      className="flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-700 px-4 py-3 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-50 dark:border-emerald-500 dark:text-emerald-300 dark:hover:bg-dark-800"
                    >
                      <Phone size={17} />
                      Call Owner
                    </a>
                  ) : (
                    <p className="rounded-xl bg-dark-50 p-3 text-sm text-dark-500 dark:bg-dark-800 dark:text-dark-400">
                      Phone number not provided.
                    </p>
                  )}

                  {whatsappNumber ? (
                    <a
                      href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
                    >
                      <MessageCircle size={17} />
                      Chat on WhatsApp
                    </a>
                  ) : (
                    <p className="text-xs text-dark-500 dark:text-dark-400">
                      WhatsApp number not provided.
                    </p>
                  )}
                </div>
              ) : (
                <p className="mt-4 rounded-xl bg-amber-50 p-3 text-sm text-amber-800 dark:bg-amber-900/20 dark:text-amber-300">
                  This property is not currently accepting enquiries.
                </p>
              )}
            </section>

            {/* Tenant interest form */}
            {user?.role === 'TENANT' && listing.status === 'ACTIVE' && (
              <section className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm dark:border-dark-700 dark:bg-dark-900">
                <h2 className="text-lg font-bold">Interested in this home?</h2>

                <p className="mt-1 text-sm text-dark-500 dark:text-dark-400">
                  Send the owner an interest request to get started.
                </p>

                {interestSent ? (
                  <div className="mt-4 flex items-start gap-2 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300">
                    <CheckCircle size={19} className="mt-0.5 shrink-0" />

                    <div>
                      <p className="font-semibold">Interest request sent!</p>
                      <p className="mt-1">
                        You can wait for the owner to respond.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="mt-4">
                    <label
                      htmlFor="interest-message"
                      className="mb-2 block text-sm font-medium text-dark-700 dark:text-dark-300"
                    >
                      Message to owner
                      <span className="ml-1 font-normal text-dark-400">
                        (optional)
                      </span>
                    </label>

                    <textarea
                      id="interest-message"
                      className="input min-h-28 w-full resize-y"
                      placeholder="Hi! I'm interested in your property..."
                      value={interestMessage}
                      onChange={(event) =>
                        setInterestMessage(event.target.value)
                      }
                      maxLength={500}
                    />

                    <p className="mt-1 text-right text-xs text-dark-400">
                      {interestMessage.length}/500
                    </p>

                    <button
                      id="send-interest-btn"
                      type="button"
                      onClick={handleSendInterest}
                      disabled={sendingInterest}
                      className="btn-primary mt-3 flex w-full items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {sendingInterest ? (
                        <LoaderCircle size={17} className="animate-spin" />
                      ) : (
                        <Send size={17} />
                      )}

                      {sendingInterest ? 'Sending...' : 'Send Interest Request'}
                    </button>
                  </div>
                )}
              </section>
            )}

            {/* Signed-out visitor */}
            {!user && (
              <section className="rounded-2xl border border-emerald-100 bg-white p-5 text-center shadow-sm dark:border-dark-700 dark:bg-dark-900">
                <h2 className="font-semibold">Looking for a home?</h2>

                <p className="mt-2 text-sm text-dark-500 dark:text-dark-400">
                  Sign in to express interest and explore your rental options.
                </p>

                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="btn-primary mt-4 w-full"
                >
                  Sign In
                </button>
              </section>
            )}
          </aside>
        </div>
      </main>
    </div>
  );
}
