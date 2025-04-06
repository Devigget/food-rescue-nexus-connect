
import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import BusinessDashboard from '../components/dashboard/BusinessDashboard';
import CharityDashboard from '../components/dashboard/CharityDashboard';
import VolunteerDashboard from '../components/dashboard/VolunteerDashboard';
import { db, collection, getDocs, query, where, orderBy, limit } from '../lib/firebase';

const Dashboard = () => {
  const { currentUser, userProfile } = useAuth();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        let donationsQuery;
        
        if (userProfile?.userType === 'business') {
          // Get donations made by this business
          donationsQuery = query(
            collection(db, 'donations'),
            where('donorId', '==', currentUser.uid),
            orderBy('createdAt', 'desc'),
            limit(10)
          );
        } else if (userProfile?.userType === 'charity') {
          // Get available donations and donations claimed by this charity
          donationsQuery = query(
            collection(db, 'donations'),
            where('status', 'in', ['available', 'claimed']),
            orderBy('createdAt', 'desc'),
            limit(20)
          );
        } else if (userProfile?.userType === 'volunteer') {
          // Get donations that need transportation
          donationsQuery = query(
            collection(db, 'donations'),
            where('status', '==', 'claimed'),
            where('needsTransport', '==', true),
            orderBy('createdAt', 'desc'),
            limit(20)
          );
        } else {
          donationsQuery = query(
            collection(db, 'donations'),
            orderBy('createdAt', 'desc'),
            limit(10)
          );
        }
        
        const querySnapshot = await getDocs(donationsQuery);
        const donationsList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setDonations(donationsList);
      } catch (err) {
        console.error("Error fetching donations:", err);
        setError("Failed to load donations. Please refresh the page.");
      } finally {
        setLoading(false);
      }
    };

    if (currentUser && userProfile) {
      fetchDonations();
    }
  }, [currentUser, userProfile]);

  if (!currentUser || !userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Access Restricted</h1>
          <p className="text-gray-600">Please log in to access your dashboard.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome, {userProfile.organizationName || currentUser.email}!
          </h1>
          <p className="text-gray-600 mt-1">
            {userProfile.userType === 'business' && "Manage your food donations and track your impact."}
            {userProfile.userType === 'charity' && "Find available donations and manage your requests."}
            {userProfile.userType === 'volunteer' && "Find opportunities to help deliver food donations."}
          </p>
        </div>
        
        {userProfile.userType === 'business' && (
          <BusinessDashboard donations={donations} />
        )}
        
        {userProfile.userType === 'charity' && (
          <CharityDashboard donations={donations} />
        )}
        
        {userProfile.userType === 'volunteer' && (
          <VolunteerDashboard donations={donations} />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
