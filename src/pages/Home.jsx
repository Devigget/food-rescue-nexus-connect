
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="hero-pattern">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="flex flex-col justify-center">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-4">
                Reduce Food Waste. <span className="text-primary">Feed Communities.</span>
              </h1>
              <p className="text-lg text-gray-700 mb-8">
                Connect surplus food with those who need it most. Our platform brings together
                food businesses, charities, and volunteers to rescue food and fight hunger.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/signup"
                  className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-secondary transition-colors"
                >
                  Join the Network
                </Link>
                <Link
                  to="/about"
                  className="px-6 py-3 border border-primary text-primary rounded-lg font-medium hover:bg-primary hover:text-white transition-colors"
                >
                  Learn More
                </Link>
              </div>
            </div>
            <div className="relative hidden md:block">
              <div className="relative w-full h-80 animate-float">
                <img
                  src="https://images.unsplash.com/photo-1593113598332-cd59a0c3a9a1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
                  alt="Food donation"
                  className="rounded-xl shadow-xl object-cover h-full w-full"
                />
              </div>
              <div className="absolute -bottom-4 -left-4 w-40 h-40 bg-accent rounded-lg p-4 shadow-lg">
                <div className="bg-white h-full w-full rounded flex flex-col items-center justify-center text-center p-2">
                  <span className="block text-3xl font-bold text-primary">10M+</span>
                  <span className="text-sm text-gray-600">Meals Rescued</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform makes food rescue simple and efficient for everyone involved.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Food Businesses</h3>
              <p className="text-gray-600 mb-4">
                List surplus food items, set pickup windows, and track your contributions to the community.
              </p>
              <Link to="/signup" className="text-primary hover:text-secondary font-medium inline-flex items-center">
                Register as a Business <ArrowRight size={16} className="ml-1" />
              </Link>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Charity Organizations</h3>
              <p className="text-gray-600 mb-4">
                Browse available donations, claim items that match your needs, and coordinate pickups.
              </p>
              <Link to="/signup" className="text-primary hover:text-secondary font-medium inline-flex items-center">
                Register as a Charity <ArrowRight size={16} className="ml-1" />
              </Link>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Volunteers</h3>
              <p className="text-gray-600 mb-4">
                Help transport food donations, log volunteer hours, and make a direct impact in your community.
              </p>
              <Link to="/signup" className="text-primary hover:text-secondary font-medium inline-flex items-center">
                Register as a Volunteer <ArrowRight size={16} className="ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Impact Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Our Impact</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Together, we're making a difference in communities across the country.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md border border-gray-100 text-center">
              <div className="text-4xl font-bold text-primary mb-2">2.5M+</div>
              <div className="text-xl font-medium text-gray-700 mb-2">Pounds of Food Rescued</div>
              <p className="text-gray-600">
                Keeping good food out of landfills and onto plates.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md border border-gray-100 text-center">
              <div className="text-4xl font-bold text-primary mb-2">500+</div>
              <div className="text-xl font-medium text-gray-700 mb-2">Active Organizations</div>
              <p className="text-gray-600">
                A growing network of businesses, charities, and volunteers.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md border border-gray-100 text-center">
              <div className="text-4xl font-bold text-primary mb-2">100K+</div>
              <div className="text-xl font-medium text-gray-700 mb-2">Volunteer Hours</div>
              <p className="text-gray-600">
                Dedicated community members making connections happen.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-6">Ready to Make a Difference?</h2>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/signup"
                className="px-8 py-3 bg-white text-primary rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                Join Now
              </Link>
              <Link
                to="/contact"
                className="px-8 py-3 border border-white text-white rounded-lg font-medium hover:bg-white hover:text-primary transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
