import { Metadata } from 'next';
import Link from 'next/link';
import { Home, ShoppingBag, Tags, User, HelpCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Sitemap - FreshCart',
  description: 'Navigate through all pages on FreshCart.',
};

const sections = [
  {
    title: 'Main Pages',
    icon: Home,
    links: [
      { name: 'Home', href: '/' },
      { name: 'Products', href: '/products' },
      { name: 'Categories', href: '/categories' },
      { name: 'Brands', href: '/brands' },
    ],
  },
  {
    title: 'Account',
    icon: User,
    links: [
      { name: 'Login', href: '/login' },
      { name: 'Register', href: '/register' },
      { name: 'Profile', href: '/profile' },
      { name: 'Orders', href: '/order-confirmation/allorders' },
      { name: 'Wishlist', href: '/wishlist' },
      { name: 'Cart', href: '/cart' },
    ],
  },
  {
    title: 'Shop',
    icon: ShoppingBag,
    links: [
      { name: 'New Arrivals', href: '/products?sort=-createdAt' },
      { name: 'Best Sellers', href: '/products?sort=-sold' },
      { name: 'On Sale', href: '/products?price[gte]=0' },
    ],
  },
  {
    title: 'Help & Support',
    icon: HelpCircle,
    links: [
      { name: 'Contact Us', href: '/contact' },
      { name: 'Shipping Info', href: '/shipping' },
      { name: 'Returns & Refunds', href: '/returns' },
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Cookie Policy', href: '/cookies' },
      { name: 'Accessibility', href: '/accessibility' },
      { name: 'Careers', href: '/careers' },
    ],
  },
];

export default function SitemapPage() {
  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Sitemap</h2>
        <p className="text-lg text-gray-600">
          Find everything on FreshCart with our complete site navigation.
        </p>
      </div>

      {/* Sitemap Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-6">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <div key={section.title} className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Icon className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900">{section.title}</h3>
              </div>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-600 hover:text-green-600 transition-colors flex items-center gap-2"
                    >
                      <span className="w-1 h-1 bg-gray-300 rounded-full" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}