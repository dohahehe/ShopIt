import { Metadata } from 'next';
import { Cookie, Settings, Info, Shield } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Cookie Policy - FreshCart',
  description: 'Learn about how we use cookies to improve your browsing experience.',
};

const cookieTypes = [
  {
    name: 'Essential Cookies',
    description: 'Required for the website to function properly. Cannot be disabled.',
    examples: ['Authentication', 'Security', 'Shopping cart'],
  },
  {
    name: 'Functional Cookies',
    description: 'Remember your preferences and settings.',
    examples: ['Language preferences', 'Saved items', 'Region selection'],
  },
  {
    name: 'Analytics Cookies',
    description: 'Help us understand how visitors use our site.',
    examples: ['Page visits', 'Click tracking', 'Traffic sources'],
  },
  {
    name: 'Marketing Cookies',
    description: 'Used to deliver relevant ads and track campaign performance.',
    examples: ['Ad personalization', 'Retargeting', 'Campaign measurement'],
  },
];

export default function CookiesPage() {
  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Cookie Policy</h2>
        <p className="text-lg text-gray-600">
          We use cookies to enhance your browsing experience and provide personalized services.
        </p>
      </div>

      {/* Introduction */}
      <div className="bg-white rounded-2xl border border-gray-200 p-8">
        <div className="flex items-center gap-3 mb-4">
          <Cookie className="w-6 h-6 text-green-600" />
          <h3 className="text-xl font-semibold text-gray-900">What Are Cookies?</h3>
        </div>
        <p className="text-gray-600 leading-relaxed">
          Cookies are small text files stored on your device when you visit websites. They help us remember your preferences, understand how you use our site, and improve your experience.
        </p>
      </div>

      {/* Cookie Types */}
      <div className="grid md:grid-cols-2 gap-6">
        {cookieTypes.map((type) => (
          <div key={type.name} className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                {type.name === 'Essential Cookies' && <Shield className="w-5 h-5 text-green-600" />}
                {type.name === 'Functional Cookies' && <Settings className="w-5 h-5 text-green-600" />}
                {type.name === 'Analytics Cookies' && <Info className="w-5 h-5 text-green-600" />}
                {type.name === 'Marketing Cookies' && <Cookie className="w-5 h-5 text-green-600" />}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{type.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{type.description}</p>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Examples:</p>
              <ul className="space-y-1">
                {type.examples.map((example) => (
                  <li key={example} className="text-sm text-gray-600 flex items-center gap-2">
                    <span className="w-1 h-1 bg-green-600 rounded-full" />
                    {example}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Update Date */}
      <p className="text-sm text-gray-500 text-center">
        Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
      </p>
    </div>
  );
}