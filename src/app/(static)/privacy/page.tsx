import { Metadata } from 'next';
import { Shield, Eye, Lock, Database } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy - FreshCart',
  description: 'Your privacy is important to us. Learn how we collect, use, and protect your information.',
};

const sections = [
  {
    title: 'Information We Collect',
    icon: Eye,
    content: [
      'Name and contact information (email, phone, address)',
      'Payment information (processed securely by our payment partners)',
      'Order history and preferences',
      'Device and browser information',
      'Cookies and usage data',
    ],
  },
  {
    title: 'How We Use Your Information',
    icon: Database,
    content: [
      'Process your orders and payments',
      'Communicate about your orders',
      'Improve our products and services',
      'Send marketing communications (with your consent)',
      'Prevent fraud and enhance security',
    ],
  },
  {
    title: 'Data Protection',
    icon: Lock,
    content: [
      '256-bit SSL encryption for all transactions',
      'Regular security audits',
      'Strict access controls',
      'Data anonymization where possible',
      'Secure data centers',
    ],
  },
  {
    title: 'Your Rights',
    icon: Shield,
    content: [
      'Access your personal data',
      'Correct inaccurate data',
      'Request data deletion',
      'Opt-out of marketing',
      'Export your data',
    ],
  },
];

export default function PrivacyPage() {
  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Privacy Policy</h2>
        <p className="text-lg text-gray-600">
          Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </p>
      </div>

      {/* Introduction */}
      <div className="bg-white rounded-2xl border border-gray-200 p-8">
        <p className="text-gray-600 leading-relaxed">
          At FreshCart, your privacy is our priority. This policy explains how we collect, use, and protect your personal information when you use our website and services. By using FreshCart, you agree to the practices described in this policy.
        </p>
      </div>

      {/* Sections Grid */}
      <div className="grid md:grid-cols-2 gap-6">
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
                {section.content.map((item) => (
                  <li key={item} className="text-sm text-gray-600 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-green-600 rounded-full mt-1.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {/* Contact Section */}
      <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
        <h3 className="font-semibold text-green-900 mb-2">Questions About Your Privacy?</h3>
        <p className="text-green-800 mb-4">
          If you have any questions or concerns about our privacy practices, please contact our Data Protection Officer.
        </p>
        <Link
          href="mailto:privacy@FreshCart.com"
          className="inline-flex items-center text-green-700 hover:text-green-800 font-medium gap-1"
        >
          privacy@FreshCart.com →
        </Link>
      </div>
    </div>
  );
}