'use client'
import { useQuery } from "@tanstack/react-query";
import { ProductCard } from "./_components/ProductCard/ProductCard";
import { Product } from "./types/productInterface";
import getProducts from "@/services/products/getProducts";
import getCategories from "@/services/categories/getCategories";
import Loader from "@/Loader/Loader";
import ErrorComponent from "./_components/Error/Error";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface Category {
  _id: string;
  name: string;
  image: string;
  slug?: string;
}

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [categoryScrollPosition, setCategoryScrollPosition] = useState(0);
  const categoriesContainerRef = useRef<HTMLDivElement>(null);

  // Get Products
  const { data: allProducts, isLoading, isError, error } = useQuery<Product[]>({
    queryKey: ['get-products'],
    queryFn: async () => {
    const products = await getProducts();
    return products;
  },
    refetchOnMount: 'always',
  });

  // Get Categories from API
  const { data: categories, isLoading: categoriesLoading, isError: categoriesIsError, error: categoriesError } = useQuery<Category[]>({
    queryKey: ['get-categories'],
    queryFn: getCategories,
  });

  // Hero slides
  const heroSlides = [
    {
      id: 1,
      title: "Fresh Products Delivered",
      description: "Get fresh items delivered right to your doorstep",
      image: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1000",
      buttonText: "Shop Now",
      link: "/products"
    },
    {
      id: 2,
      title: "Music Collection",
      description: "Instruments, headphones, and audio gear for every music lover",
      image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=1000",
      buttonText: "Shop Music",
      link: "/categories"
    },
    {
      id: 3,
      title: "Easy Shopping Experience",
      description: "Shop conveniently from the comfort of your home",
      image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?q=80&w=1000",
      buttonText: "Start Shopping",
      link: "/products"
    }
  ];
  
  // Auto slide 
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, heroSlides.length]);

  // Category scroll functions
  const scrollCategoriesLeft = () => {
    if (categoriesContainerRef.current) {
      const container = categoriesContainerRef.current;
      const scrollAmount = container.clientWidth * 0.8;
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      setCategoryScrollPosition(container.scrollLeft - scrollAmount);
    }
  };

  const scrollCategoriesRight = () => {
    if (categoriesContainerRef.current) {
      const container = categoriesContainerRef.current;
      const scrollAmount = container.clientWidth * 0.8;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      setCategoryScrollPosition(container.scrollLeft + scrollAmount);
    }
  };

  // Pause auto play on hover
  const handleMouseEnter = () => setIsAutoPlaying(false);
  const handleMouseLeave = () => setIsAutoPlaying(true);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  if (isLoading || categoriesLoading) return <Loader />;

  if (isError || categoriesIsError ) return <ErrorComponent message={error?.message || categoriesError?.message} showContactButton={false} />;

  return (
    <div className="min-h-screen">
      {/* Hero Slider Section */}
      <section className="relative overflow-hidden">
        <div 
          className="relative h-100 md:h-125 lg:h-150 transition-all duration-500 ease-in-out"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {heroSlides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
                index === currentSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            >
              {/* Background Image with Overlay */}
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${slide.image})` }}
              >
                <div className="absolute inset-0 bg-black/40"></div>
              </div>
              
              {/* Content */}
              <div className="relative h-full flex items-center">
                <div className="container mx-auto px-8 sm:px-18">
                  <div className="max-w-2xl">
                    <div className="space-y-4 text-center sm:text-left">
                      <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                        {slide.title}
                      </h1>
                      <p className="text-lg md:text-xl text-gray-200 max-w-xl">
                        {slide.description}
                      </p>
                      <Link href={slide.link}>
                        <Button 
                          size="lg" 
                          className="bg-green-600 hover:bg-green-700 text-white mt-4 px-8 py-3 rounded-full transform hover:scale-105 transition-transform duration-300 cursor-pointer"
                        >
                          {slide.buttonText}
                          <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute cursor-pointer left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-all duration-300 hover:scale-110"
            aria-label="Previous slide"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={nextSlide}
            className="absolute cursor-pointer right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-all duration-300 hover:scale-110"
            aria-label="Next slide"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Indicators */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentSlide 
                    ? 'bg-white w-8' 
                    : 'bg-white/50 hover:bg-white/80'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Categories Slider Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-linear-to-br from-green-100 to-emerald-100 rounded-full mb-4">
                <svg 
                  className="w-4 h-4 text-green-600" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={1.5} 
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
                <span className="text-sm font-medium text-green-600">Browse Categories</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Explore Our Categories
              </h2>
              <p className="text-gray-600 max-w-2xl">
                Discover our wide range of fresh products and collections
              </p>
            </div>

            <div className="sm:mt-10">
              <Link
                className="text-green-600 hover:text-green-700 cursor-pointer font-medium whitespace-nowrap"
                href="/categories"
              >
                View All Categories →
              </Link>
            </div>
          </div>

          {/* Categories Slider Container */}
          <div className="relative group">
            {/* Left Navigation Button */}
            <button
              onClick={scrollCategoriesLeft}
              className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-6 z-10 bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 hover:text-gray-900 p-2 lg:p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 cursor-pointer"
              aria-label="Scroll categories left"
            >
              <svg className="w-5 h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Categories Slider */}
            <div 
              ref={categoriesContainerRef}
              className="overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth pb-4"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              <div className="flex space-x-4 md:space-x-6 min-w-max md:min-w-0 px-2 py-2">
                {categories?.map((category) => (
                  <Link 
                    key={category._id} 
                    href={`/category/${category._id}`}
                    className="group block min-w-70 md:min-w-75 snap-start"
                  >
                    <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer">
                      <div className="relative h-48 md:h-56 overflow-hidden">
                        <div 
                          className="w-full h-full bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
                          style={{ 
                            backgroundImage: category.image 
                              ? `url(${category.image})` 
                              : 'linear-gradient(135deg, #10b981, #059669)' 
                          }}
                        />
                        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-300"></div>
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 md:p-6 text-center">
                          <h3 className="text-xl md:text-2xl font-bold text-white mb-2 md:mb-3">{category.name}</h3>
                          <div className="inline-flex items-center gap-2 text-green-200 group-hover:text-green-100 transition-colors duration-300">
                            <span className="text-sm md:text-base">Shop Now</span>
                            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Right Navigation Button */}
            <button
              onClick={scrollCategoriesRight}
              className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-6 z-10 bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 hover:text-gray-900 p-2 lg:p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 cursor-pointer"
              aria-label="Scroll categories right"
            >
              <svg className="w-5 h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-8 md:py-4">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-linear-to-br from-green-100 to-emerald-100 rounded-full mb-4">
                <svg 
                  className="w-4 h-4 text-green-600" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={1.5} 
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                <span className="text-sm font-medium text-green-600">Featured Products</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Top Picks For You
              </h2>
              <p className="text-gray-600 max-w-2xl">
                Discover our most popular and fresh products
              </p>
            </div>

            <div className="sm:mt-10">
              <Link
                className="text-green-600 hover:text-green-700 cursor-pointer font-medium whitespace-nowrap"
                href="/products"
              >
                View All Products →
              </Link>
            </div>
          </div>

          <div className="mx-auto container pt-2 pb-10 gap-5 grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {allProducts?.slice(0, 10).map((product) => (
              <div key={product._id}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>

         
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-linear-to-br from-gray-900 to-gray-800 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-green-500/20 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Fast Delivery</h3>
              <p className="text-gray-300">Same-day delivery for orders placed before 2 PM</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-green-500/20 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Quality Guarantee</h3>
              <p className="text-gray-300">Freshness and quality guaranteed on every product</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-green-500/20 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Secure Payment</h3>
              <p className="text-gray-300">100% secure payment with multiple options</p>
            </div>
          </div>
        </div>
      </section>

      {/* Add CSS animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
          opacity: 0;
        }

        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}