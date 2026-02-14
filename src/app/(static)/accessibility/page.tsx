import { Metadata } from 'next';
import { Eye, Keyboard, Type } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Accessibility - FreshCart',
  description: 'Our commitment to making FreshCart accessible to everyone.',
};

const features = [
  {
    title: 'Screen Reader Compatible',
    icon: Eye,
    description: 'Our site works with popular screen readers including NVDA, JAWS, and VoiceOver.',
  },
  {
    title: 'Keyboard Navigation',
    icon: Keyboard,
    description: 'Full keyboard support for users who cannot use a mouse.',
  },
  {
    title: 'Readable Fonts',
    icon: Type,
    description: 'Clear, legible typography with adjustable text sizes.',
  },
];

export default function AccessibilityPage() {
  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Accessibility</h2>
        <p className="text-lg text-gray-600">
          We're committed to making FreshCart accessible to everyone, regardless of ability.
        </p>
      </div>

      {/* Commitment Statement */}
      <div className="bg-white rounded-2xl border border-gray-200 p-8">
        <p className="text-gray-600 leading-relaxed">
          At FreshCart, we believe everyone deserves a great shopping experience. We continuously work to improve our website's accessibility in accordance with WCAG 2.1 Level AA guidelines.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <div key={feature.title} className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Icon className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-600">{feature.description}</p>
            </div>
          );
        })}
      </div>

      {/* Standards */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Accessibility Standards</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <span className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2" />
            <span className="text-gray-600">WCAG 2.1 Level AA compliant</span>
          </div>
          <div className="flex items-start gap-3">
            <span className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2" />
            <span className="text-gray-600">Section 508 compliant</span>
          </div>
          <div className="flex items-start gap-3">
            <span className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2" />
            <span className="text-gray-600">EN 301 549 compliant</span>
          </div>
        </div>
      </div>

      {/* Contact */}
      <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
        <h3 className="font-semibold text-green-900 mb-2">Need Assistance?</h3>
        <p className="text-green-800 mb-4">
          If you have trouble accessing any part of our site, please contact our accessibility team.
        </p>
        <Link
          href="mailto:accessibility@FreshCart.com"
          className="inline-flex items-center text-green-700 hover:text-green-800 font-medium"
        >
          accessibility@FreshCart.com →
        </Link>
      </div>
    </div>
  );
}