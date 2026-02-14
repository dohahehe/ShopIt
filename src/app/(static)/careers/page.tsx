import { Metadata } from 'next';
import { Heart, Users, TrendingUp, Mail, MapPin, Clock } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Careers - FreshCart',
  description: 'Join our team and help shape the future of FreshCart.',
};

const benefits = [
  {
    title: 'Remote-First Culture',
    icon: Users,
    description: 'Work from anywhere in Egypt with flexible hours.',
  },
  {
    title: 'Health Insurance',
    icon: Heart,
    description: 'Comprehensive medical coverage for you and your family.',
  },
  {
    title: 'Growth Opportunities',
    icon: TrendingUp,
    description: 'Continuous learning and career development programs.',
  },
];

const values = [
  'Customer First',
  'Innovation',
  'Integrity',
  'Teamwork',
  'Excellence',
];

export default function CareersPage() {
  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Join Our Team</h2>
        <p className="text-lg text-gray-600">
          Help us build the future of online shopping in Egypt.
        </p>
      </div>

      {/* Why Join Us */}
      <div className="bg-white rounded-2xl border border-gray-200 p-8">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Why Work at FreshCart?</h3>
        <div className="grid md:grid-cols-3 gap-6">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <div key={benefit.title} className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-8 h-8 text-green-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">{benefit.title}</h4>
                <p className="text-sm text-gray-600">{benefit.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Our Values */}
      <div className="bg-white rounded-2xl border border-gray-200 p-8">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Our Values</h3>
        <div className="flex flex-wrap gap-3">
          {values.map((value) => (
            <span
              key={value}
              className="px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-medium"
            >
              {value}
            </span>
          ))}
        </div>
      </div>

      {/* Culture */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <Users className="w-6 h-6 text-green-600" />
          </div>
          <h4 className="font-semibold text-gray-900 mb-2">Collaborative Environment</h4>
          <p className="text-sm text-gray-600">
            Work alongside talented individuals who are passionate about what they do.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <TrendingUp className="w-6 h-6 text-green-600" />
          </div>
          <h4 className="font-semibold text-gray-900 mb-2">Fast-Growing Company</h4>
          <p className="text-sm text-gray-600">
            Be part of a rapidly growing startup with endless opportunities.
          </p>
        </div>
      </div>

      {/* How to Apply */}
      <div className="bg-white rounded-2xl border border-gray-200 p-8">
        <h3 className="text-xl font-bold text-gray-900 mb-6">How to Apply</h3>
        <div className="space-y-4">
          <p className="text-gray-600">
            We're always looking for talented individuals to join our team. Even if you don't see a specific role, we'd love to hear from you.
          </p>
          
          <div className="bg-gray-50 rounded-xl p-6">
            <h4 className="font-semibold text-gray-900 mb-4">Send your application to:</h4>
            <div className="space-y-3">
              <a
                href="mailto:careers@freshcart.com"
                className="flex items-center gap-3 text-green-600 hover:text-green-700 transition-colors"
              >
                <Mail className="w-5 h-5" />
                <span className="font-medium">careers@freshcart.com</span>
              </a>
              <p className="text-sm text-gray-500 mt-2">
                Please include your resume and a brief cover letter telling us why you'd be a great fit for FreshCart.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Locations */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <MapPin className="w-5 h-5 text-green-600" />
            <h4 className="font-semibold text-green-900">Cairo Office</h4>
          </div>
          <p className="text-green-800 text-sm">
            42 Nile Street, Maadi<br />
            Cairo, Egypt
          </p>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Clock className="w-5 h-5 text-green-600" />
            <h4 className="font-semibold text-green-900">Remote Work</h4>
          </div>
          <p className="text-green-800 text-sm">
            Fully remote positions available<br />
            Work from anywhere in Egypt
          </p>
        </div>
      </div>

    </div>
  );
}