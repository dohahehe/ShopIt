import Link from "next/link";

const navigation = [
  { name: "Contact", href: "/contact" },
  { name: "Shipping Info", href: "/shipping" },
  { name: "Returns & Refunds", href: "/returns" },
  { name: "Privacy Policy", href: "/privacy" },
  { name: "Terms of Service", href: "/terms" },
  { name: "Cookie Policy", href: "/cookies" },
  { name: "Sitemap", href: "/sitemap" },
  { name: "Accessibility", href: "/accessibility" },
  { name: "Careers", href: "/careers" },
];

export default function StaticLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Help Center</h1>
              <p className="text-gray-600 mt-2 max-w-2xl">
                Find all the information you need about our services, policies, and more.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-b border-gray-200 bg-white/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <nav className="flex space-x-6 py-4 min-w-max">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm font-medium text-gray-600 hover:text-green-600 transition-colors whitespace-nowrap"
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
          {children}
      </main>
    </div>
  );
}