'use client'
import Image from "next/image";
import Link from "next/link";
import Logo from '../../../../public/freshcart-logo.49f1b44d.svg'
import getCategories from "@/services/categories/getCategories";
import { Category } from "@/app/types/cart-response";
import { useQuery } from "@tanstack/react-query";

const socialLinks = [
  { 
    name: "Facebook", 
    href: "#", 
    icon: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" 
  },
  { 
    name: "Twitter", 
    href: "#", 
    icon: "M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.213c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" 
  },
  { 
    name: "Instagram", 
    href: "#", 
    icon: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" 
  },
  { 
    name: "LinkedIn", 
    href: "#", 
    icon: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" 
  },
];

const accountLinks = [
  { name: "My Account", href: "/account" },
  { name: "Order History", href: "/orders" },
  { name: "Wishlist", href: "/wishlist" },
  { name: "Shopping Cart", href: "/cart" },
  
];

const shopLinks = [
  { name: "All Products", href: "/products" },
  { name: "Categories", href: "/categories" },
  { name: "Brands", href: "/brands" },
  
];

const supportLinks = [
  { name: "Contact Us", href: "/contact" },
  { name: "Shipping Info", href: "/shipping" },
  { name: "Returns & Refunds", href: "/returns" },
];

const legalLinks = [
  { name: "Privacy Policy", href: "/privacy" },
  { name: "Terms of Service", href: "/terms" },
  { name: "Cookie Policy", href: "/cookies" },
];

export default function Footer() {
  const { data: categories, isLoading, isError } = useQuery({
    queryKey: ['get-categories'],
    queryFn: async () => {
      const response = await getCategories();
      return response.data;
    }
  });

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className=" grid grid-cols-1 sm:grid-cols-2 gap-8">
          
          {/* Company Info */}
          <div>
            <div className="mb-6">
              <Link href="/" className="inline-flex items-center  p-2 bg-white rounded-lg">
                <Image
                  src={Logo}
                  width={40}
                  height={40}
                  alt="FreshCart Logo"
                  className="h-6 lg:h-8 w-auto"
                  loading="eager"
                />
              </Link>
            </div>
            
            <p className="text-gray-300 mb-6 max-w-md">
              FreshCart is your one-stop destination for quality products. From fashion to electronics, we bring you the best brands at competitive prices with a seamless shopping experience.
            </p>
            
            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="text-gray-300">+1 (800) 123-4567</span>
              </div>
              
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-gray-300">support@freshcart.com</span>
              </div>
              
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-gray-300">123 Commerce Street, New York, NY 10001</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center hover:bg-gray-800 transition-colors group"
                  aria-label={social.name}
                >
                  <svg 
                    className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" 
                    viewBox="0 0 24 24" 
                    fill="currentColor"
                  >
                    <path d={social.icon} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          <div className="gap-6 grid grid-cols-2 md:grid-cols-4 mx-auto w-full text-center sm:text-left">
          {/* Shop Links */}
          <div >
            <h3 className="text-lg font-bold mb-4 text-white">Shop</h3>
            <ul className="space-y-3">
              {shopLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors text-sm hover:underline"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account Links */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-white">Account</h3>
            <ul className="space-y-3">
              {accountLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors text-sm hover:underline"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-white">Support</h3>
            <ul className="space-y-3">
              {supportLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors text-sm hover:underline"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-white">Legal</h3>
            <ul className="space-y-3">
              {legalLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors text-sm hover:underline"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-800 my-8"></div>

      {/* Bottom Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-sm text-gray-400">
          © 2026 FreshCart™. All Rights Reserved.
        </div>
        
        <div className="flex items-center gap-6 text-sm">
          <Link href="/sitemap" className="text-gray-400 hover:text-white transition-colors hover:underline">
            Sitemap
          </Link>
          <Link href="/accessibility" className="text-gray-400 hover:text-white transition-colors hover:underline">
            Accessibility
          </Link>
          <Link href="/careers" className="text-gray-400 hover:text-white transition-colors hover:underline">
            Careers
          </Link>
        </div>
      </div>
      
      </div>
    </footer>
  );
}