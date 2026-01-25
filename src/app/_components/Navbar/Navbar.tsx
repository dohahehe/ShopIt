'use client'
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  let path = usePathname()
  
  function toggleNav(){
    setIsOpen(!isOpen);
  }

  const navItems = [
    {href: '/', content: 'Home'},
    {href: '/products', content: 'Products'},
    {href: '/brands', content: 'Brands'},
    {href: '/cart', content: 'Cart'}
  ]
  return (
  <nav className="bg-gray-100 w-full z-20 ">
    <div className="max-w-7xl flex flex-wrap items-center justify-between mx-auto p-4">
      <Link href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
        <span className="self-center text-xl text-heading font-semibold whitespace-nowrap">Fresh Cart</span>
      </Link>
        <button 
        onClick={toggleNav}
        type="button" 
        className="inline-flex items-center w-9 h-9 justify-center text-sm text-body rounded-base md:hidden hover:bg-neutral-secondary-soft hover:text-heading" aria-controls="navbar-cta" aria-expanded="false">
          <span className="sr-only">Open main menu</span>
          <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeWidth={2} d="M5 7h14M5 12h14M5 17h14" /></svg>
        </button>
      <div className={`${!isOpen && 'hidden'} items-center justify-between w-full md:flex md:w-auto md:order-1`} id="navbar-cta">
        
        <ul className="font-medium flex flex-col md:p-0 mt-4 rounded-base md:flex-row md:space-x-2 rtl:space-x-reverse md:mt-0 md:border-0 ">
          {
            navItems.map((item) => (
              <li 
              key={item.href}
              className={path == item.href? "text-green-800 font-bold md:bg-green-800 md:text-white py-2 md:px-3 duration-100 rounded-md" : "py-2 md:px-3 duration-100 hover:bg-green-800 hover:text-white rounded-md focus:text-green-800"}>
                <Link href={item.href} className="block bg-brand  md:bg-transparent md:text-fg-brand md:p-0" aria-current="page">{item.content}</Link>
              </li>
            ))
          }
            <Link href={'/register'}>
              <button type="button" className="text-green-800 hover:text-green-950 bg-transparent hover:bg-transparent cursor-pointer font-medium rounded-base md:px-3 py-2">
                Register</button>       
            </Link>
            <Link href={'/login'}>
              <button type="button" className="text-green-800 hover:text-green-950 bg-transparent hover:bg-transparent cursor-pointer font-medium rounded-base md:px-3 py-2">Login</button>
            </Link>
          
        </ul>
      </div>
    </div>
  </nav>


  )
}
