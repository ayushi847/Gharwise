




import { useRef, type ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  motion,
  useInView,
  useReducedMotion,
} from "framer-motion";

import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Building2,
  CheckCircle2,
  Heart,
  Home,
  KeyRound,
  MapPin,
  MessageCircle,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
  BrainCircuit,
  ClipboardCheck,
  UserRound,
} from "lucide-react";

import Navbar from "../components/Navbar";
import { useAuth } from "../contexts/AuthContext";

/* --------------------------------------------------
   DATA
-------------------------------------------------- */

const categories = [
  {
    title: "Hostels",
    description: "Convenient accommodation for everyday living.",
    image:
      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=900&q=85",
    icon: Building2,
  },
  {
    title: "PG Accommodation",
    description: "Find a comfortable place that suits your routine.",
    image:
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=900&q=85",
    icon: Home,
  },
  {
    title: "Private Rooms",
    description: "Enjoy your own space and everyday privacy.",
    image:
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=900&q=85",
    icon: KeyRound,
  },
  {
    title: "Shared Accommodation",
    description: "Explore shared living arrangements that fit your needs.",
    image:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=900&q=85",
    icon: Users,
  },
  {
    title: "Flats & Apartments",
    description: "Discover flexible spaces for your next chapter.",
    image:
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=85",
    icon: Building2,
  },
  {
    title: "Family Homes & Houses",
    description: "Find room to settle in, grow and feel at home.",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=85",
    icon: Heart,
  },
];

const benefits = [
  {
    icon: Search,
    title: "Search that fits your needs",
    description:
      "Explore active listings and narrow down your options using location and budget filters.",
  },
  {
    icon: BrainCircuit,
    title: "AI-powered compatibility",
    description:
      "Get a compatibility score and an understandable explanation to help evaluate potential matches.",
  },
  {
    icon: ShieldCheck,
    title: "A clearer decision process",
    description:
      "Review property details and communicate your interest before moving forward.",
  },
  {
    icon: MessageCircle,
    title: "Connect after acceptance",
    description:
      "Once an owner accepts your interest request, continue the conversation through real-time chat.",
  },
];

const steps = [
  {
    number: "01",
    title: "Set your preferences",
    description:
      "Create your tenant profile with your preferred location, budget and move-in date.",
    icon: UserRound,
  },
  {
    number: "02",
    title: "Explore properties",
    description:
      "Browse active listings, apply filters and review the details of suitable places.",
    icon: Search,
  },
  {
    number: "03",
    title: "Check compatibility",
    description:
      "Review your AI compatibility score and its explanation, with a fallback when AI is unavailable.",
    icon: BrainCircuit,
  },
  {
    number: "04",
    title: "Send your interest",
    description:
      "Send a request with an optional message. The property owner can accept or decline it.",
    icon: ClipboardCheck,
  },
  {
    number: "05",
    title: "Start a conversation",
    description:
      "After acceptance, use the available real-time chat to communicate with the owner.",
    icon: MessageCircle,
  },
];

/* --------------------------------------------------
   REVEAL ANIMATION
-------------------------------------------------- */

function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, {
    once: true,
    amount: 0.12,
  });
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={
        shouldReduceMotion ? false : { opacity: 0, y: 22 }
      }
      animate={
        isInView ? { opacity: 1, y: 0 } : undefined
      }
      transition={{
        duration: shouldReduceMotion ? 0 : 0.55,
        delay: shouldReduceMotion ? 0 : delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

/* --------------------------------------------------
   SECTION HEADING
-------------------------------------------------- */

function SectionHeading({
  eyebrow,
  title,
  description,
  centered = false,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  centered?: boolean;
}) {
  return (
    <div
      className={
        centered
          ? "mx-auto max-w-3xl text-center"
          : "max-w-2xl"
      }
    >
      <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#50765a]">
        {eyebrow}
      </p>

      <h2 className="text-3xl font-semibold leading-tight tracking-[-0.04em] text-[#26392b] sm:text-4xl lg:text-[3.15rem]">
        {title}
      </h2>

      {description && (
        <p className="mt-4 text-sm leading-7 text-[#727b72] sm:text-base">
          {description}
        </p>
      )}
    </div>
  );
}

/* --------------------------------------------------
   LANDING PAGE
-------------------------------------------------- */

export default function LandingPage() {
  const { user } = useAuth();

  const explorePath = user
    ? user.role === "owner"
      ? "/owner/dashboard"
      : "/dashboard"
    : "/register";

  const accountPath = user
    ? explorePath
    : "/login";

  const ownerPath =
    user?.role === "owner"
      ? "/owner/dashboard"
      : user
        ? "/dashboard"
        : "/register";

  return (
    <div
      id="top"
      className="min-h-screen overflow-x-hidden bg-[#faf9f6] text-[#26392b]"
    >
      <Navbar />

      {/* ================================================
          HERO
      ================================================ */}

      <section className="relative isolate px-5 pb-20 pt-12 sm:px-8 sm:pb-28 sm:pt-16 lg:px-12 lg:pb-32 lg:pt-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-28 top-0 -z-10 h-[420px] w-[420px] rounded-full bg-[#dfeadf]/70 blur-[100px]"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-10 -left-32 -z-10 h-[320px] w-[320px] rounded-full bg-[#f1e8d9]/70 blur-[90px]"
        />

        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
          {/* Hero content */}

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.75,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="relative z-10"
          >
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#dce6dc] bg-white/85 px-4 py-2 text-sm font-medium text-[#42664c] shadow-sm backdrop-blur">
              <Sparkles size={15} />
              Find a place that feels right
            </div>

            <h1 className="max-w-2xl text-[2.8rem] font-semibold leading-[1.08] tracking-[-0.055em] sm:text-6xl lg:text-[4.4rem]">
              Your next chapter
              <br />
              starts with
              <span className="relative ml-3 inline-block text-[#50765a]">
                a place
                <svg
                  viewBox="0 0 190 13"
                  preserveAspectRatio="none"
                  className="absolute -bottom-2 left-0 h-3 w-full"
                  aria-hidden="true"
                >
                  <path
                    d="M3 8 C 48 1, 130 2, 187 7"
                    fill="none"
                    stroke="#c6d8bc"
                    strokeWidth="5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              <br />
              to call home.
            </h1>

            <p className="mt-7 max-w-xl text-base leading-8 text-[#68736a] sm:text-lg">
              From cosy rooms and welcoming hostels to spacious
              apartments and family homes, discover accommodation
              that fits your lifestyle, your needs and your next move.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                to={explorePath}
                className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-2xl bg-[#315b3e] px-7 py-4 text-sm font-semibold text-white shadow-[0_12px_30px_-12px_rgba(49,91,62,0.55)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#24492f] hover:shadow-lg"
              >
                Explore properties
                <ArrowRight
                  size={18}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>

              <Link
                to={accountPath}
                className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl border border-[#dce2da] bg-white/80 px-7 py-4 text-sm font-semibold text-[#344a39] transition-all duration-300 hover:-translate-y-1 hover:border-[#8fa991] hover:bg-white"
              >
                {user ? "Open dashboard" : "Sign in"}
                <ArrowUpRight size={17} />
              </Link>
            </div>

            <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-sm text-[#68736a]">
              <span className="inline-flex items-center gap-2">
                <CheckCircle2
                  size={17}
                  className="shrink-0 text-[#50765a]"
                />
                Multiple accommodation types
              </span>

              <span className="inline-flex items-center gap-2">
                <CheckCircle2
                  size={17}
                  className="shrink-0 text-[#50765a]"
                />
                AI-assisted compatibility
              </span>
            </div>
          </motion.div>

          {/* Hero image */}

          <motion.div
            initial={{ opacity: 0, scale: 0.97, x: 14 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{
              duration: 0.85,
              delay: 0.12,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="relative mx-auto w-full max-w-[620px] lg:ml-auto"
          >
            <div className="relative">
              <div className="relative aspect-[4/4.1] overflow-hidden rounded-[2rem] bg-[#e5e8df] shadow-[0_28px_80px_-28px_rgba(37,57,41,0.35)] sm:aspect-[5/4.4] lg:aspect-[5/5.1]">
                <img
                  src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1500&q=90"
                  alt="Warm, modern living room in a welcoming home"
                  className="h-full w-full object-cover transition-transform duration-1000 hover:scale-[1.04]"
                  fetchPriority="high"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#142219]/70 via-transparent to-black/5" />

                <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full border border-white/50 bg-white/90 px-3.5 py-2 text-xs font-semibold text-[#315b3e] shadow-lg backdrop-blur-md sm:left-7 sm:top-7 sm:text-sm">
                  <span className="h-2 w-2 rounded-full bg-[#6c9b72]" />
                  Find your kind of home
                </div>

                <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-9">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-white/80">
                    Your space. Your story.
                  </p>

                  <h2 className="max-w-md text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
                    More than a place to stay.
                    <br />
                    A place to belong.
                  </h2>

                  <div className="mt-5 flex items-center gap-2 text-sm text-white/90">
                    <MapPin size={16} />
                    Find accommodation for your next chapter
                  </div>
                </div>
              </div>

              {/* Small photo accent */}

              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -bottom-5 -left-3 hidden w-40 overflow-hidden rounded-2xl border-4 border-[#faf9f6] shadow-xl sm:block md:w-48"
              >
                <img
                  src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=500&q=85"
                  alt="Thoughtfully furnished living space"
                  className="aspect-[4/3] w-full object-cover"
                  loading="lazy"
                />
              </motion.div>

              {/* Floating info card */}

              <motion.div
                animate={{ y: [0, 5, 0] }}
                transition={{
                  duration: 4.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -right-2 top-[30%] max-w-[190px] rounded-2xl border border-white/80 bg-white/95 p-4 shadow-[0_15px_45px_-18px_rgba(20,40,25,0.3)] backdrop-blur-xl sm:-right-5 sm:max-w-[220px] sm:p-5"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[#e9f0e6] text-[#315b3e]">
                  <Home size={20} />
                </div>

                <p className="text-sm font-semibold text-[#26392b]">
                  A space for every stage
                </p>

                <p className="mt-1.5 text-xs leading-5 text-[#788078]">
                  From your first room to a family home.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ================================================
          SIX ACCOMMODATION CATEGORIES
      ================================================ */}

      <section
        id="categories"
        className="scroll-mt-24 px-5 py-20 sm:px-8 sm:py-24 lg:px-12"
      >
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              { <SectionHeading
                eyebrow="Find your fit"
                title="A home for every kind of living."
              /> }



              <p className="max-w-md text-sm leading-7 text-[#727b72] sm:text-base">
                Different needs, different lifestyles, different
                spaces. Start with the kind of accommodation you
                have in mind.
              </p>
            </div>
          </Reveal>

          {/* Exactly 3 cards per row on desktop = 6 cards in 2 rows */}

          <div className="mt-11 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category, index) => {
              const Icon = category.icon;

              return (
                <Reveal
                  key={category.title}
                  delay={(index % 3) * 0.07}
                  className="h-full"
                >
                  <Link
                    to={explorePath}
                    aria-label={`Explore ${category.title}`}
                    className="group block h-full overflow-hidden rounded-[1.6rem] border border-[#e8e8df] bg-white transition-all duration-300 hover:-translate-y-1.5 hover:border-[#b9cbb7] hover:shadow-[0_22px_50px_-25px_rgba(36,67,43,0.25)]"
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={category.image}
                        alt={category.title}
                        loading="lazy"
                        className="aspect-[5/3.1] w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-70 transition-opacity duration-300 group-hover:opacity-100" />

                      <div className="absolute left-4 top-4 flex h-11 w-11 items-center justify-center rounded-xl border border-white/60 bg-white/90 text-[#315b3e] shadow-sm backdrop-blur-md">
                        <Icon size={20} />
                      </div>

                      <div className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#315b3e] transition-all duration-300 group-hover:rotate-45 group-hover:bg-[#315b3e] group-hover:text-white">
                        <ArrowUpRight size={19} />
                      </div>
                    </div>

                    <div className="p-5 sm:p-6">
                      <h3 className="text-xl font-semibold tracking-tight text-[#293b2e]">
                        {category.title}
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-[#778077]">
                        {category.description}
                      </p>

                      <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#41694b]">
                        Explore options
                        <ArrowRight
                          size={15}
                          className="transition-transform duration-300 group-hover:translate-x-1"
                        />
                      </span>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================================================
          WHY GHARWISE
      ================================================ */}

      <section
        id="why-gharwise"
        className="relative scroll-mt-24 overflow-hidden bg-[#edf1e9] px-5 py-20 sm:px-8 sm:py-24 lg:px-12"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-28 top-0 h-80 w-80 rounded-full bg-white/60 blur-[90px]"
        />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <div className="relative">
              <div className="overflow-hidden rounded-[2rem] shadow-[0_24px_65px_-28px_rgba(30,57,37,0.3)]">
                <img
                  src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85"
                  alt="Contemporary home with a comfortable interior"
                  loading="lazy"
                  className="aspect-[4/4.1] w-full object-cover transition-transform duration-1000 hover:scale-[1.035] sm:aspect-[5/4]"
                />
              </div>

              <div className="absolute -bottom-5 -right-2 max-w-[250px] rounded-2xl border border-white/80 bg-white p-5 shadow-xl sm:-right-5 sm:p-6">
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-[#e8f0e5] text-[#315b3e]">
                  <BadgeCheck size={22} />
                </div>

                <p className="font-semibold text-[#293b2e]">
                  Your next move, made simpler.
                </p>

                <p className="mt-1 text-xs leading-5 text-[#788078]">
                  Explore, compare and make a more informed choice.
                </p>
              </div>
            </div>
          </Reveal>

          <div className="pt-5 lg:pt-0">
            <Reveal>
              <SectionHeading
                eyebrow="Why choose Gharwise?"
                title="Finding a place should feel exciting, not overwhelming."
                description="Whether you're moving for work, beginning college, relocating with family or simply looking for a change, Gharwise helps you explore accommodation and take the next step with more clarity."
              />
            </Reveal>

            <div className="mt-9 grid gap-x-6 gap-y-8 sm:grid-cols-2">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;

                return (
                  <Reveal key={benefit.title} delay={index * 0.06}>
                    <div className="group">
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-[#d9e3d5] bg-white text-[#41694b] transition-all duration-300 group-hover:-translate-y-1 group-hover:bg-[#315b3e] group-hover:text-white">
                        <Icon size={21} />
                      </div>

                      <h3 className="font-semibold text-[#293b2e]">
                        {benefit.title}
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-[#738073]">
                        {benefit.description}
                      </p>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ================================================
          HOW IT WORKS — HORIZONTAL FLOW
      ================================================ */}

      <section
        id="how-it-works"
        className="scroll-mt-24 overflow-hidden px-5 py-20 sm:px-8 sm:py-24 lg:px-12"
      >
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <SectionHeading
              eyebrow="How Gharwise works"
              title="From your first search to a real conversation."
              description="A simple, transparent flow that helps tenants discover properties, evaluate compatibility and connect with owners."
              centered
            />
          </Reveal>

          {/* Horizontal scrolling timeline. No vertical step cards. */}

          <div className="relative mt-14">
            <div
              aria-hidden="true"
              className="absolute left-[8%] right-[8%] top-8 hidden h-px bg-[#cbd9c8] lg:block"
            />

            <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-6 pt-2 [scrollbar-color:#b9cbb7_transparent] [scrollbar-width:thin] lg:grid lg:grid-cols-5 lg:gap-5 lg:overflow-visible lg:pb-0">
              {steps.map((step, index) => {
                const Icon = step.icon;

                return (
                  <Reveal
                    key={step.number}
                    delay={index * 0.07}
                    className="min-w-[255px] snap-start sm:min-w-[290px] lg:min-w-0"
                  >
                    <div className="relative h-full rounded-[1.5rem] border border-[#e4e8df] bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#b9cbb7] hover:shadow-[0_18px_40px_-24px_rgba(36,67,43,0.25)] sm:p-6">
                      <div className="relative z-10 mb-6 flex items-center justify-between">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#dce7d8] bg-[#edf3e9] text-[#315b3e] shadow-sm">
                          <Icon size={23} />
                        </div>

                        <span className="text-sm font-bold tracking-[0.15em] text-[#8a9a87]">
                          {step.number}
                        </span>
                      </div>

                      <h3 className="text-lg font-semibold tracking-tight text-[#293b2e]">
                        {step.title}
                      </h3>

                      <p className="mt-3 text-sm leading-7 text-[#778077]">
                        {step.description}
                      </p>

                      {index < steps.length - 1 && (
                        <div className="mt-5 hidden items-center gap-2 text-xs font-semibold text-[#50765a] lg:flex">
                          <span>
                            {index === 2
                              ? "Next: owner review"
                              : index === 3
                                ? "After acceptance"
                                : "Continue"}
                          </span>
                          <ArrowRight size={14} />
                        </div>
                      )}
                    </div>
                  </Reveal>
                );
              })}
            </div>

            <p className="mt-3 text-center text-xs text-[#8a938a] lg:hidden">
              Swipe horizontally to see all five steps
            </p>
          </div>

          <Reveal delay={0.1}>
            <div className="mt-10 flex flex-col items-center justify-between gap-5 rounded-2xl border border-[#e4e8df] bg-[#f3f5ef] p-6 sm:flex-row sm:px-8">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-[#315b3e] shadow-sm">
                  <MessageCircle size={21} />
                </div>

                <div>
                  <h3 className="font-semibold text-[#293b2e]">
                    A connection starts with mutual interest.
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-[#778077]">
                    Chat becomes available after the owner accepts your request.
                  </p>
                </div>
              </div>

              <Link
                to={explorePath}
                className="group inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-[#315b3e] transition-colors hover:text-[#24492f]"
              >
                Get started
                <ArrowRight
                  size={17}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ================================================
          OWN A PROPERTY — BRAND-MATCHED SAGE SECTION
      ================================================ */}

      <section
        id="list-property"
        className="scroll-mt-24 px-5 pb-20 sm:px-8 sm:pb-24 lg:px-12"
      >
        <Reveal>
          <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-[#dce6d8] bg-[#e9f0e5] px-6 py-12 sm:px-10 sm:py-14 lg:px-16 lg:py-16">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-16 -top-24 h-80 w-80 rounded-full bg-white/65 blur-3xl"
            />

            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-[#cbdcc5]/60 blur-3xl"
            />

            <div className="relative grid items-center gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16">
              <div>
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#cfdfca] bg-white/75 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-[#41694b]">
                  <Building2 size={15} />
                  For property owners
                </div>

                <h2 className="max-w-2xl text-3xl font-semibold leading-tight tracking-[-0.045em] text-[#26392b] sm:text-4xl lg:text-[3.25rem]">
                  Your property could be someone's next home.
                </h2>

                <p className="mt-5 max-w-2xl text-sm leading-7 text-[#667468] sm:text-base sm:leading-8">
                  Bring your property to Gharwise. Create a listing,
                  showcase it with photos, manage availability and
                  review incoming interest requests — all in one place.
                </p>

                <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3">
                  {[
                    "Create and edit listings",
                    "Upload property photos",
                    "Manage availability",
                    "Review tenant requests",
                  ].map((item) => (
                    <span
                      key={item}
                      className="inline-flex items-center gap-2 text-sm font-medium text-[#425b47]"
                    >
                      <CheckCircle2
                        size={17}
                        className="shrink-0 text-[#50765a]"
                      />
                      {item}
                    </span>
                  ))}
                </div>

                <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                  <Link
                    to={ownerPath}
                    className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-2xl bg-[#315b3e] px-7 py-4 text-sm font-semibold text-white shadow-[0_12px_28px_-12px_rgba(49,91,62,0.45)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#24492f]"
                  >
                    {user?.role === "owner"
                      ? "Open owner dashboard"
                      : "Get started"}

                    <ArrowRight
                      size={18}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </Link>

                  <Link
                    to={accountPath}
                    className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl border border-[#cbd9c6] bg-white/80 px-6 py-4 text-sm font-semibold text-[#344a39] transition-all duration-300 hover:border-[#9eb79a] hover:bg-white"
                  >
                    {user ? "Open dashboard" : "Already a member? Sign in"}
                    <ArrowUpRight size={17} />
                  </Link>
                </div>
              </div>

              {/* Owner-side visual */}

              <div className="relative hidden lg:block">
                <div className="overflow-hidden rounded-[1.7rem] border-4 border-white/80 shadow-[0_25px_60px_-25px_rgba(36,67,43,0.28)]">
                  <img
                    src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1000&q=85"
                    alt="Bright, well-designed property ready to be listed"
                    loading="lazy"
                    className="aspect-[4/4.2] w-full object-cover"
                  />
                </div>

                <div className="absolute -bottom-5 -left-8 flex max-w-[270px] items-center gap-3 rounded-2xl border border-[#e2e8de] bg-white p-4 shadow-xl">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#edf3e9] text-[#315b3e]">
                    <Home size={22} />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-[#293b2e]">
                      Your property, your listing
                    </p>
                    <p className="mt-1 text-xs leading-5 text-[#788078]">
                      Manage your details in one place.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ================================================
          PROFESSIONAL MULTI-COLUMN FOOTER
      ================================================ */}

      <footer className="border-t border-[#e3e6dc] bg-[#f3f4ee]">
        <div className="mx-auto max-w-7xl px-5 pb-8 pt-14 sm:px-8 sm:pt-16 lg:px-12">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.45fr_0.8fr_1fr_0.85fr] lg:gap-12">
            {/* Brand column */}

            <div>
              <Link
                to="/"
                className="inline-flex w-fit items-center gap-3"
                aria-label="Gharwise home"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#315b3e] text-white shadow-sm">
                  <Home size={22} />
                </span>

                <span className="text-2xl font-bold tracking-tight text-[#293b2e]">
                  Gharwise
                </span>
              </Link>

              <p className="mt-5 max-w-sm text-sm leading-7 text-[#727b72]">
                A simpler way to discover your next home. Explore
                accommodation options, check compatibility, connect
                with property owners and take your next step with
                confidence.
              </p>

              <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#dce5d7] bg-white/75 px-3 py-2 text-xs font-medium text-[#507057]">
                <Heart size={14} />
                Made for your next chapter
              </div>
            </div>

            {/* Explore */}

            <div>
              <h3 className="mb-5 text-sm font-bold text-[#293b2e]">
                Explore
              </h3>

              <ul className="space-y-3.5 text-sm text-[#727b72]">
                <li>
                  <Link
                    to={explorePath}
                    className="transition-colors hover:text-[#315b3e]"
                  >
                    Browse properties
                  </Link>
                </li>

                <li>
                  <a
                    href="#categories"
                    className="transition-colors hover:text-[#315b3e]"
                  >
                    Accommodation types
                  </a>
                </li>

                <li>
                  <a
                    href="#how-it-works"
                    className="transition-colors hover:text-[#315b3e]"
                  >
                    How it works
                  </a>
                </li>

                <li>
                  <a
                    href="#why-gharwise"
                    className="transition-colors hover:text-[#315b3e]"
                  >
                    Why Gharwise
                  </a>
                </li>
              </ul>
            </div>

            {/* Accommodation */}

            <div>
              <h3 className="mb-5 text-sm font-bold text-[#293b2e]">
                Accommodation
              </h3>

              <ul className="space-y-3.5 text-sm text-[#727b72]">
                {categories.map((category) => (
                  <li key={category.title}>
                    <Link
                      to={explorePath}
                      className="transition-colors hover:text-[#315b3e]"
                    >
                      {category.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Account and platform */}

            <div>
              <h3 className="mb-5 text-sm font-bold text-[#293b2e]">
                Your Gharwise
              </h3>

              <ul className="space-y-3.5 text-sm text-[#727b72]">
                <li>
                  <Link
                    to={accountPath}
                    className="transition-colors hover:text-[#315b3e]"
                  >
                    {user ? "My dashboard" : "Sign in"}
                  </Link>
                </li>

                {!user && (
                  <li>
                    <Link
                      to="/register"
                      className="transition-colors hover:text-[#315b3e]"
                    >
                      Create an account
                    </Link>
                  </li>
                )}

                <li>
                  <a
                    href="#list-property"
                    className="transition-colors hover:text-[#315b3e]"
                  >
                    List your property
                  </a>
                </li>

                <li>
                  <a
                    href="#how-it-works"
                    className="transition-colors hover:text-[#315b3e]"
                  >
                    Tenant journey
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Footer callout */}

          <div className="mt-12 flex flex-col gap-5 rounded-2xl border border-[#e0e5da] bg-white/65 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
            <div>
              <p className="font-semibold text-[#293b2e]">
                Still looking for the right place?
              </p>
              <p className="mt-1 text-sm leading-6 text-[#778077]">
                Start exploring and find an option that suits your needs.
              </p>
            </div>

            <Link
              to={explorePath}
              className="group inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-[#315b3e] transition-colors hover:text-[#24492f]"
            >
              Explore Gharwise
              <ArrowRight
                size={17}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>

          {/* Copyright */}

          <div className="mt-8 flex flex-col gap-3 border-t border-[#e0e3da] pt-6 text-xs leading-6 text-[#858d83] sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {new Date().getFullYear()} Gharwise. All rights reserved.
            </p>

            <a
              href="#top"
              className="inline-flex w-fit items-center gap-2 font-medium text-[#59675b] transition-colors hover:text-[#315b3e]"
            >
              Back to top
              <ArrowUpRight size={14} />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}