import { Metadata } from 'next';
import { RefreshCw, Clock, Shield, AlertCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Returns & Refunds - FreshCart',
  description: 'Our hassle-free return policy. Learn how to return items and get refunds quickly.',
};

const steps = [
  {
    title: 'Request Return',
    description: 'Log into your account and select the items you want to return.',
    icon: RefreshCw,
  },
  {
    title: 'Pack Items',
    description: 'Pack the items securely in their original packaging.',
    icon: Clock,
  },
  {
    title: 'Ship Back',
    description: 'Ship the items back to us using the provided return label.',
    icon: Shield,
  },
  {
    title: 'Get Refund',
    description: 'We\'ll process your refund within 5-7 business days.',
    icon: AlertCircle,
  },
];

export default function ReturnsPage() {
  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Returns & Refunds</h2>
        <p className="text-lg text-gray-600">
          We want you to love your purchase. If something isn't right, we're here to help.
        </p>
      </div>

      {/* Policy Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <RefreshCw className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">30-Day Returns</h3>
          <p className="text-gray-600">You have 30 days from delivery to return items for a full refund.</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <Shield className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Free Returns</h3>
          <p className="text-gray-600">We provide free return shipping on all eligible items.</p>
        </div>
      </div>

      {/* Return Steps */}
      <div className="bg-white rounded-2xl border border-gray-200 p-8">
        <h3 className="text-xl font-bold text-gray-900 mb-6">How to Return an Item</h3>
        <div className="grid md:grid-cols-4 gap-6">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={step.title} className="text-center">
                <div className="relative">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-green-600" />
                  </div>
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-green-200 -z-10" />
                  )}
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">{step.title}</h4>
                <p className="text-sm text-gray-600">{step.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Conditions */}
      <div className="bg-white rounded-2xl border border-gray-200 p-8">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Return Conditions</h3>
        <ul className="space-y-3 text-gray-600">
          <li className="flex items-start gap-3">
            <span className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2" />
            <span>Items must be unused and in original packaging</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2" />
            <span>All tags and labels must be attached</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2" />
            <span>Returns must be initiated within 30 days of delivery</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2" />
            <span>Final sale items cannot be returned</span>
          </li>
        </ul>
      </div>

      {/* Exceptions */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <AlertCircle className="w-6 h-6 text-amber-600 shrink-0" />
          <div>
            <h4 className="font-semibold text-amber-900 mb-2">Non-Returnable Items</h4>
            <p className="text-amber-800">
              For hygiene reasons, we cannot accept returns on underwear, swimwear, or personal care items unless defective.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}