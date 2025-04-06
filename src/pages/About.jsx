
import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-primary/10 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">About Food Rescue Nexus</h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              We're on a mission to reduce food waste while addressing food insecurity in communities across the nation.
            </p>
          </div>
        </div>
      </div>

      {/* Our Story Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
              <p className="text-gray-700 mb-4">
                Food Rescue Nexus began in 2022 when a group of food service professionals, technologists, and community advocates came together to address the dual problems of food waste and hunger.
              </p>
              <p className="text-gray-700 mb-4">
                We noticed that while many restaurants, grocery stores, and food businesses had surplus food at the end of the day, nearby shelters and community organizations were struggling to feed those in need.
              </p>
              <p className="text-gray-700">
                Our platform was created to bridge this gap, making it simple and efficient for businesses to donate food that would otherwise go to waste, for charitable organizations to access these resources, and for volunteers to help facilitate these connections.
              </p>
            </div>
            <div className="rounded-lg overflow-hidden shadow-lg">
              <img 
                src="https://images.unsplash.com/photo-1615397587950-3651b8542766?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80" 
                alt="Team planning session" 
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Our Mission Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              To create a sustainable, community-driven solution that reduces food waste, alleviates hunger, and strengthens local connections.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Reduce Waste</h3>
              <p className="text-gray-600">
                Minimize environmental impact by diverting edible food from landfills, reducing greenhouse gas emissions.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Address Hunger</h3>
              <p className="text-gray-600">
                Ensure nutritious food reaches those who need it most, improving food security in our communities.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Build Community</h3>
              <p className="text-gray-600">
                Foster meaningful connections between businesses, charitable organizations, and volunteers.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Team</h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Meet the passionate individuals working to make our vision a reality.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white rounded-lg overflow-hidden shadow-md">
              <img 
                src="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=761&q=80" 
                alt="Sarah Johnson" 
                className="w-full h-64 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900">Sarah Johnson</h3>
                <p className="text-primary font-medium">Co-Founder & CEO</p>
                <p className="text-gray-600 mt-2">
                  Former restaurant manager passionate about reducing food waste.
                </p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg overflow-hidden shadow-md">
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80" 
                alt="Michael Chen" 
                className="w-full h-64 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900">Michael Chen</h3>
                <p className="text-primary font-medium">Co-Founder & CTO</p>
                <p className="text-gray-600 mt-2">
                  Tech innovator with a background in logistics and supply chain.
                </p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg overflow-hidden shadow-md">
              <img 
                src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80" 
                alt="Amara Rodriguez" 
                className="w-full h-64 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900">Amara Rodriguez</h3>
                <p className="text-primary font-medium">Community Outreach Director</p>
                <p className="text-gray-600 mt-2">
                  Community organizer with expertise in nonprofit management.
                </p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg overflow-hidden shadow-md">
              <img 
                src="https://images.unsplash.com/photo-1531384441138-2736e62e0919?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80" 
                alt="David Williams" 
                className="w-full h-64 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900">David Williams</h3>
                <p className="text-primary font-medium">Operations Manager</p>
                <p className="text-gray-600 mt-2">
                  Former food bank director with expertise in food safety and logistics.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Partners Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Partners</h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              We're proud to work with these organizations to further our mission.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex items-center justify-center p-4 bg-white rounded-lg shadow-md h-24">
              <span className="text-xl font-bold text-gray-400">FoodShare</span>
            </div>
            <div className="flex items-center justify-center p-4 bg-white rounded-lg shadow-md h-24">
              <span className="text-xl font-bold text-gray-400">GreenEats</span>
            </div>
            <div className="flex items-center justify-center p-4 bg-white rounded-lg shadow-md h-24">
              <span className="text-xl font-bold text-gray-400">Community Hub</span>
            </div>
            <div className="flex items-center justify-center p-4 bg-white rounded-lg shadow-md h-24">
              <span className="text-xl font-bold text-gray-400">FreshStart</span>
            </div>
            <div className="flex items-center justify-center p-4 bg-white rounded-lg shadow-md h-24">
              <span className="text-xl font-bold text-gray-400">MealConnect</span>
            </div>
            <div className="flex items-center justify-center p-4 bg-white rounded-lg shadow-md h-24">
              <span className="text-xl font-bold text-gray-400">EcoHarvest</span>
            </div>
            <div className="flex items-center justify-center p-4 bg-white rounded-lg shadow-md h-24">
              <span className="text-xl font-bold text-gray-400">FoodRescue</span>
            </div>
            <div className="flex items-center justify-center p-4 bg-white rounded-lg shadow-md h-24">
              <span className="text-xl font-bold text-gray-400">SecondServing</span>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-6">Join Our Mission</h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
              Whether you're a business with surplus food, a charity helping those in need, or an individual looking to volunteer, we invite you to be part of our community.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/signup"
                className="px-8 py-3 bg-white text-primary rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                Sign Up Today
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

export default About;
