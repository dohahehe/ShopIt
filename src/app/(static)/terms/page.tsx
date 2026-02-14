import { Metadata } from 'next';
import { FileText, Scale, Users, CreditCard } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms of Service - FreshCart',
  description: 'Our terms and conditions for using FreshCart services.',
};

const sections = [
  {
    title: 'Account Terms',
    icon: Users,
    items: [
      'You must be 18 years or older to create an account',
      'You are responsible for maintaining account security',
      'One person per account (no shared accounts)',
      'Accurate information must be provided',
    ],
  },
  {
    title: 'Payment Terms',
    icon: CreditCard,
    items: [
      'All payments are processed securely',
      'Prices are in EGP and include VAT',
      'We accept Visa, Mastercard, and Cash on Delivery',
      'Refunds follow our returns policy',
    ],
  },
  {
    title: 'Prohibited Activities',
    icon: Scale,
    items: [
      'Reselling products without authorization',
      'Using bots or automated tools',
      'Harassing other users',
      'Fraudulent transactions',
    ],
  },
];

export default function TermsPage() {
  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Terms of Service</h2>
        <p className="text-lg text-gray-600">
          Please read these terms carefully before using our services.
        </p>
      </div>

      {/* Introduction */}
      <div className="bg-white rounded-2xl border border-gray-200 p-8">
        <div className="flex items-center gap-3 mb-4">
          <FileText className="w-6 h-6 text-green-600" />
          <h3 className="text-xl font-semibold text-gray-900">Agreement to Terms</h3>
        </div>
        <p className="text-gray-600 leading-relaxed">
          By accessing or using FreshCart, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access our services.
        </p>
      </div>

      {/* Sections */}
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
                {section.items.map((item) => (
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

      {/* Modifications */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-2">Modifications to Terms</h3>
        <p className="text-gray-600">
          We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting. Your continued use of the site constitutes acceptance of modified terms.
        </p>
      </div>

      {/* Contact */}
      <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
        <h3 className="font-semibold text-green-900 mb-2">Questions About Terms?</h3>
        <a
          href="mailto:legal@FreshCart.com"
          className="inline-flex items-center text-green-700 hover:text-green-800 font-medium"
        >
          legal@FreshCart.com →
        </a>
      </div>
    </div>
  );
}