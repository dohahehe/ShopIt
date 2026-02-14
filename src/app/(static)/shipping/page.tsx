import { Metadata } from 'next';
import { CheckCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Shipping Information - FreshCart',
  description: 'Learn about our shipping options, delivery times, and tracking information.',
};

const shippingMethods = [
  {
    name: 'Standard Shipping',
    time: '3-5 business days',
    cost: 'Free on orders over 500 EGP',
    icon: 'truck',
  },
  {
    name: 'Express Shipping',
    time: '1-2 business days',
    cost: '50 EGP',
    icon: 'rocket',
  },
  {
    name: 'Same-Day Delivery',
    time: 'Within 24 hours',
    cost: '100 EGP',
    icon: 'clock',
  },
];

const faqs = [
  {
    q: 'Do you ship internationally?',
    a: 'Currently, we only ship within Egypt. We\'re working on expanding to other countries soon!',
  },
  {
    q: 'What if my package is delayed?',
    a: 'If your package is delayed beyond the estimated delivery time, please contact our support team and we\'ll investigate.',
  },
];

export default function ShippingPage() {
  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Shipping Information</h2>
        <p className="text-lg text-gray-600">
          We offer fast, reliable shipping options to get your orders to you as quickly as possible.
        </p>
      </div>

      {/* Shipping Methods */}
      <div className="grid md:grid-cols-3 gap-6">
        {shippingMethods.map((method) => (
          <div key={method.name} className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {method.icon === 'truck' && (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                )}
                {method.icon === 'rocket' && (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                )}
                {method.icon === 'clock' && (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                )}
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">{method.name}</h3>
            <p className="text-sm text-gray-600 mb-1">Delivery: {method.time}</p>
            <p className="text-sm font-medium text-green-600">{method.cost}</p>
          </div>
        ))}
      </div>

      {/* Shipping Policy */}
      <div className="bg-white rounded-2xl border border-gray-200 p-8">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Shipping Policy</h3>
        <div className="space-y-4 text-gray-600">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
            <p><span className="font-medium text-gray-900">Order Processing:</span> Orders are processed within 24 hours of payment confirmation.</p>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
            <p><span className="font-medium text-gray-900">Cut-off Time:</span> Orders placed after 2 PM will be processed the next business day.</p>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
            <p><span className="font-medium text-gray-900">Delivery Areas:</span> We deliver to all governorates in Egypt.</p>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
            <p><span className="font-medium text-gray-900">Tracking:</span> You'll receive SMS and email updates at every stage of delivery.</p>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white rounded-2xl border border-gray-200 p-8">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h3>
        <div className="space-y-6">
          {faqs.map((faq) => (
            <div key={faq.q} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
              <h4 className="font-semibold text-gray-900 mb-2">{faq.q}</h4>
              <p className="text-gray-600">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}