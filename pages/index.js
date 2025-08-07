import Link from "next/link";

const cards = [
  {
    title: "Super Admin",
    description: "Manage the entire platform, users, and settings.",
    href: "/superAdmin",
    icon: (
      <svg width="40" height="40" fill="none" viewBox="0 0 40 40">
        <circle cx="20" cy="20" r="20" fill="#6366F1" />
        <path
          d="M20 12a4 4 0 1 1 0 8 4 4 0 0 1 0-8zm0 10c4.418 0 8 2.239 8 5v3H12v-3c0-2.761 3.582-5 8-5z"
          fill="#fff"
        />
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
        <rect x="13" y="15" width="14" height="10" rx="2" fill="#fff" />
        <rect x="17" y="19" width="6" height="2" rx="1" fill="#10B981" />
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
        <path
          d="M20 25c3.314 0 6-2.239 6-5s-2.686-5-6-5-6 2.239-6 5 2.686 5 6 5zm0 2c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5z"
          fill="#fff"
        />
      </svg>
    ),
  },
];

export default function Home() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-4 sm:p-8 "
      style={{
        backgroundImage: 'url("/bg.png")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8 sm:mb-12 text-center text-gray-900 drop-shadow-lg px-4">
        Select your role
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 w-full max-w-5xl px-4">
        {cards.map((card) => (
          <Link
            key={card.title}
            href={card.href}
            className="group bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-2xl hover:scale-102 sm:hover:scale-105 transition-all duration-300 p-6 sm:p-8 flex flex-col items-center text-center cursor-pointer hover:border-primary-500"
          >
            <div className="mb-4 sm:mb-6 transform group-hover:scale-110 transition-transform duration-300">
              {card.icon}
            </div>
            <h2 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-3 text-gray-900 group-hover:text-primary-600 transition-colors duration-300">
              {card.title}
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              {card.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
