import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cards = [
  {
    title: "Super Admin",
    description: "Manage the entire platform, users, and settings.",
    href: "/superAdmin",
    icon: (
      <svg width="40" height="40" fill="none" viewBox="0 0 40 40">
        <circle cx="20" cy="20" r="20" fill="#6366F1" />
        <path d="M20 12a4 4 0 1 1 0 8 4 4 0 0 1 0-8zm0 10c4.418 0 8 2.239 8 5v3H12v-3c0-2.761 3.582-5 8-5z" fill="#fff"/>
      </svg>
    ),
  },
  {
    title: "Center",
    description: "Access center-specific tools and manage local operations.",
    href: "/center",
    icon: (
      <svg width="40" height="40" fill="none" viewBox="0 0 40 40">
        <circle cx="20" cy="20" r="20" fill="#10B981" />
        <rect x="13" y="15" width="14" height="10" rx="2" fill="#fff"/>
        <rect x="17" y="19" width="6" height="2" rx="1" fill="#10B981"/>
      </svg>
    ),
  },
  {
    title: "Farmer",
    description: "View and manage your farm data and activities.",
    href: "/farmer",
    icon: (
      <svg width="40" height="40" fill="none" viewBox="0 0 40 40">
        <circle cx="20" cy="20" r="20" fill="#F59E42" />
        <path d="M20 25c3.314 0 6-2.239 6-5s-2.686-5-6-5-6 2.239-6 5 2.686 5 6 5zm0 2c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5z" fill="#fff"/>
      </svg>
    ),
  },
];

export default function Home() {
  return (
    <div
      className={`${geistSans.className} ${geistMono.className} font-sans min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-black p-8`}
    >
      <h1 className="text-3xl font-bold mb-10 text-center text-gray-900 dark:text-white">
        Select your role
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 w-full max-w-4xl">
        {cards.map((card) => (
          <Link
            key={card.title}
            href={card.href}
            className="group bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-xl shadow-md hover:shadow-lg transition-shadow p-8 flex flex-col items-center text-center cursor-pointer hover:border-primary-500"
          >
            <div className="mb-4">{card.icon}</div>
            <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white group-hover:text-primary-600">
              {card.title}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-sm">{card.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
