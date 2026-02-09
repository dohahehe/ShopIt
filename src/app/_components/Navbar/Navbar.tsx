'use client'
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Image from 'next/image';
import Logo from '../../../../public/freshcart-logo.49f1b44d.svg'
import { signOut, useSession } from "next-auth/react";
import getCategories from "@/services/categories/getCategories";
import { Category } from "@/app/types/productInterface";
import { useQuery } from "@tanstack/react-query";
import { CartResponse } from "@/app/types/cart-response";
import getWishlist from "@/services/wishlist/getWishlist";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showCategoriesDropdown, setShowCategoriesDropdown] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(2); 
  const [searchQuery, setSearchQuery] = useState("");
  let path = usePathname();
  const { status, data: session } = useSession();  

  // Get cart data
  const { data: cartData} = useQuery<CartResponse>({
    queryKey: ['get-cart'],
    queryFn: async () => {
      const response = await fetch('/api/cart')
      if (!response.ok) throw new Error('Failed to fetch cart')
      return response.json()
    }
  })

   // Get wishlist
    const { data: wishlistData, refetch } = useQuery({
        queryKey: ['wishlist'],
        queryFn: getWishlist,
    });    

  const {data: categories, isLoading, isError } =  useQuery<Category[]>({
    queryKey: ['get-categories'],
    queryFn: async () => {
      const response = await getCategories();
      return response.data;
    }
  });

  function toggleNav() {
    setIsOpen(!isOpen);
  }

  function toggleUserDropdown() {
    setShowUserDropdown(!showUserDropdown);
  }

  const navItems = [
    { href: '/', content: 'Home' },
    { href: '/products', content: 'Shop' },
    { href: '/brands', content: 'Brands' },
  ];

  function logout() {
    signOut({
      callbackUrl: '/login'
    });
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log("Searching for:", searchQuery);
    }
  };

  const getUserInitials = () => {
    if (!session?.user?.name) return 'U';
    return session.user.name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <nav className="bg-white border-b border-gray-200 w-full z-20 sticky top-0">
      <div className="container flex items-center justify-between mx-auto px-4 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 rtl:space-x-reverse z-30 shrink-0">
          <Image
            src={Logo}
            width={32}
            height={32}
            alt="ShopIt Logo"
            className="h-6 lg:h-8 w-auto"
            loading="eager"
          />
        </Link>

        {/* Search Bar - Desktop */}
        <div className="hidden lg:flex flex-1 max-w-xl mx-8">
          <form onSubmit={handleSearch} className="w-full relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-3 pl-4 pr-12 text-sm text-gray-900 border border-gray-300 rounded-full bg-gray-50 focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none"
              placeholder="Search products, brands and categories..."
            />
            <button
              type="submit"
              className="absolute inset-y-0 right-0 flex items-center justify-center w-10 h-10 my-auto mr-1 text-white bg-green-600 hover:bg-green-700 rounded-full focus:ring-2 focus:ring-green-300 transition-colors"
            >
              <svg 
                className="w-5 h-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                />
              </svg>
              <span className="sr-only">Search</span>
            </button>
          </form>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-6 shrink-0">
          <ul className="flex items-center space-x-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link 
                  href={item.href}
                  className={`
                    px-4 py-2 rounded-lg font-medium transition-all duration-200 cursor-pointer
                    ${path === item.href 
                      ? "text-green-700 bg-green-50 border border-green-100" 
                      : "text-gray-700 hover:text-green-700 hover:bg-gray-50"
                    }
                  `}
                >
                  {item.content}
                </Link>
              </li>
            ))}
            
            {/* Categories Dropdown */}
            <li 
              className="relative"
              onMouseEnter={() => setShowCategoriesDropdown(true)}
              onMouseLeave={() => setShowCategoriesDropdown(false)}
            >
              <button
                className={`
                  flex items-center px-4 py-2 gap-1 rounded-lg font-medium transition-all duration-200 cursor-pointer
                  ${path.startsWith('/categories')
                    ? "text-green-700 bg-green-50 border border-green-100" 
                    : "text-gray-700 hover:text-green-700 hover:bg-gray-50"
                  }
                `}
              >
                Categories
                <svg 
                  className={`w-4 h-4 transition-transform ${showCategoriesDropdown ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Categories Dropdown Menu - Same style as user dropdown */}
              {showCategoriesDropdown && (
                <div 
                  className="absolute left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 max-h-96 overflow-y-auto"
                  onMouseEnter={() => setShowCategoriesDropdown(true)}
                  onMouseLeave={() => setShowCategoriesDropdown(false)}
                >

                  
                  {categories?.map((category) => (
                    <Link
                      key={category?._id}
                      href={`/category/${category?._id}`}
                      className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 hover:text-green-700 transition-colors cursor-pointer"
                      onClick={() => setShowCategoriesDropdown(false)}
                    >
                      <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      {category?.name}
                    </Link>
                  ))}
                  
                  <div className="border-t border-gray-100 mt-2 pt-2">
                    <Link
                      href="/categories"
                      className="flex items-center px-4 py-3 text-sm font-medium text-green-700 hover:bg-green-50 transition-colors cursor-pointer"
                      onClick={() => setShowCategoriesDropdown(false)}
                    >
                      <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                      </svg>
                      View All Categories
                    </Link>
                  </div>
                </div>
              )}
            </li>
          </ul>
        </div>

        {/* User Actions */}
        <div className="hidden lg:flex items-center space-x-6 shrink-0">
          {status === 'authenticated' ? (
            <div className="flex items-center space-x-4">
              {/* Wishlist Icon */}
              <Link href="/wishlist" className="relative group">
                <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative cursor-pointer">
                  <svg 
                    className="w-6 h-6 text-gray-700 group-hover:text-red-500 transition-colors" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={1.5} 
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
                    />
                  </svg>
                  {wishlistData?.count > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {wishlistData?.count > 9 ? '9+' : wishlistData?.count}
                    </span>
                  )}
                  <span className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Wishlist
                  </span>
                </button>
              </Link>

              {/* Cart Icon */}
              <Link href="/cart" className="relative group">
                <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative cursor-pointer">
                  <svg 
                    className="w-6 h-6 text-gray-700 group-hover:text-green-600 transition-colors" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={1.5} 
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  {(cartData?.numOfCartItems ?? 0) > 0 && (
                    <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {(cartData?.numOfCartItems ?? 0) > 9 ? '9+' : cartData?.numOfCartItems ?? 0}
                    </span>
                  )}
                  <span className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Cart ({cartData?.numOfCartItems ?? 0} items)
                  </span>
                </button>
              </Link>

              {/* User Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setShowUserDropdown(true)}
                onMouseLeave={() => setShowUserDropdown(false)}
              >
                <button
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none cursor-pointer"
                >
                  <div className="h-9 w-9 rounded-full bg-linear-to-r from-green-500 to-emerald-600 flex items-center justify-center text-white font-semibold text-sm">
                    {getUserInitials()}
                  </div>
                  <svg 
                    className={`w-4 h-4 text-gray-500 transition-transform ${showUserDropdown ? 'rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {showUserDropdown && (
                  <div 
                    className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50"
                    onMouseEnter={() => setShowUserDropdown(true)}
                    onMouseLeave={() => setShowUserDropdown(false)}
                  >
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{session?.user?.name}</p>
                      <p className="text-xs text-gray-500 truncate">{session?.user?.email}</p>
                    </div>
                    <Link 
                      href="/profile" 
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-green-700 transition-colors cursor-pointer"
                      onClick={() => setShowUserDropdown(false)}
                    >
                      <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      My Profile
                    </Link>
                    <Link 
                      href="/orders" 
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-green-700 transition-colors cursor-pointer"
                      onClick={() => setShowUserDropdown(false)}
                    >
                      <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      My Orders
                    </Link>
                    <div className="border-t border-gray-100 my-1"></div>
                    <button
                      onClick={() => {
                        logout();
                        setShowUserDropdown(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors cursor-pointer"
                    >
                      <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Link href="/login">
                <button className="px-5 py-2 text-sm font-medium text-gray-700 hover:text-green-700 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
                  Sign In
                </button>
              </Link>
              <Link href="/register">
                <button className="px-5 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors shadow-sm cursor-pointer">
                  Sign Up
                </button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <button 
          onClick={toggleNav}
          type="button" 
          className="inline-flex items-center justify-center p-2 rounded-lg text-gray-700 hover:text-green-600 hover:bg-gray-100 lg:hidden transition-colors z-30 shrink-0 cursor-pointer"
          aria-controls="navbar-cta" 
          aria-expanded={isOpen}
        >
          <span className="sr-only">Open main menu</span>
          <svg 
            className="w-6 h-6" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300 cursor-pointer"
          onClick={toggleNav}
          aria-hidden="true"
        />
      )}

      {/* Mobile Menu Panel */}
      <div 
        className={`
          lg:hidden
          fixed top-0 right-0 w-80 max-w-[85vw] h-full flex flex-col
          bg-white z-50
          transition-all duration-300 ease-in-out shadow-2xl
          ${isOpen 
            ? 'translate-x-0' 
            : 'translate-x-full'
          }
        `}
        id="navbar-cta"
      >    
        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50/50">
          <Link href="/" className="flex items-center space-x-2 rtl:space-x-reverse" onClick={() => setIsOpen(false)}>
            <Image
              src={Logo}
              width={32}
              height={32}
              alt="ShopIt Logo"
              className="h-6 lg:h-8 w-auto"
            />
          </Link>          
          <button 
            onClick={toggleNav}
            type="button" 
            className="inline-flex items-center justify-center p-2 rounded-lg text-gray-700 hover:text-green-600 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <span className="sr-only">Close menu</span>
            <svg 
              className="w-6 h-6" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Mobile Search Bar */}
        <div className="p-4 border-b border-gray-100">
          <form onSubmit={handleSearch} className="w-full relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-3 pl-4 pr-12 text-sm text-gray-900 border border-gray-300 rounded-full bg-gray-50 focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none"
              placeholder="Search products, brands and categories..."
            />
            <button
              type="submit"
              className="absolute inset-y-0 right-0 flex items-center justify-center w-10 h-10 my-auto mr-1 text-white bg-green-600 hover:bg-green-700 rounded-full focus:ring-2 focus:ring-green-300 transition-colors cursor-pointer"
            >
              <svg 
                className="w-5 h-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                />
              </svg>
              <span className="sr-only">Search</span>
            </button>
          </form>
        </div>

        {/* Mobile Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Navigation Links */}
          <div className="mb-8">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link 
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`
                      flex items-center justify-between px-4 py-3 rounded-lg font-medium transition-colors cursor-pointer
                      ${path === item.href 
                        ? "text-green-700 bg-green-50" 
                        : "text-gray-700 hover:text-green-700 hover:bg-gray-50"
                      }
                    `}
                  >
                    <div className="flex items-center">
                      <span>{item.content}</span>
                    </div>
                  </Link>
                </li>
              ))}
              
              {/* Mobile Categories Section */}
              <li>
                <Link
                  href="/categories"
                  onClick={() => setIsOpen(false)}
                  className={`
                      flex items-center justify-between px-4 py-3 rounded-lg font-medium transition-colors cursor-pointer
                      ${path === "/categories"
                        ? "text-green-700 bg-green-50" 
                        : "text-gray-700 hover:text-green-700 hover:bg-gray-50"
                      }
                    `}
                >
                  <div className="flex items-center">
                    <span>Categories</span>
                    
                  </div>
                </Link>
              </li>
            </ul>
          </div>

          {/* Mobile Quick Actions */}
          {status === 'authenticated' && (
            <div className="mb-8">
              <div className="grid grid-cols-2 gap-4">
                {/* Wishlist */}
                <Link 
                  href="/wishlist" 
                  onClick={() => setIsOpen(false)}
                  className="flex flex-col items-center justify-center p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <div className="relative mb-2">
                    <svg 
                      className="w-8 h-8 text-gray-700" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={1.5} 
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
                      />
                    </svg>
                    {wishlistData?.count > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {wishlistData?.count > 9 ? '9+' : wishlistData?.count}
                      </span>
                    )}
                  </div>
                  <span className="text-sm font-medium text-gray-900">Wishlist</span>
                </Link>

                {/* Cart */}
                <Link 
                  href="/cart" 
                  onClick={() => setIsOpen(false)}
                  className="flex flex-col items-center justify-center p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <div className="relative mb-2">
                    <svg 
                      className="w-8 h-8 text-gray-700" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={1.5} 
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    {(cartData?.numOfCartItems ?? 0) > 0 && (
                      <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {cartData?.numOfCartItems ?? 0}
                      </span>
                    )}
                  </div>
                  <span className="text-sm font-medium text-gray-900">Cart</span>
                </Link>
              </div>
            </div>
          )}

          {/* User Profile / Auth (Mobile) */}
          <div className="pt-6 border-t border-gray-200">
            {status === 'authenticated' ? (
              <div className="space-y-4">
                <div className="flex items-center px-4 py-3 rounded-lg bg-gray-50">
                  <div className="h-12 w-12 rounded-full bg-linear-to-r from-green-500 to-emerald-600 flex items-center justify-center text-white font-semibold text-lg mr-4">
                    {getUserInitials()}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{session?.user?.name}</p>
                    <p className="text-sm text-gray-500">{session?.user?.email}</p>
                  </div>
                </div>
                
                <Link 
                  href="/profile" 
                  onClick={() => setIsOpen(false)}
                  className="flex items-center px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <svg className="w-5 h-5 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  My Profile
                </Link>
                
                <Link 
                  href="/orders" 
                  onClick={() => setIsOpen(false)}
                  className="flex items-center px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <svg className="w-5 h-5 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  My Orders
                </Link>
                
                <button
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className="flex items-center w-full px-4 py-3 text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                >
                  <svg 
                    className="w-5 h-5 mr-3" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
                    />
                  </svg>
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <Link 
                  href="/login" 
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between px-4 py-3 text-gray-700 hover:text-green-700 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
                >
                  <span className="font-medium">Sign In</span>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
                <Link 
                  href="/register" 
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between px-4 py-3 text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors cursor-pointer"
                >
                  <span className="font-medium">Sign Up</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}