
import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import BusinessDashboard from '../components/dashboard/BusinessDashboard';
import CharityDashboard from '../components/dashboard/CharityDashboard';
import VolunteerDashboard from '../components/dashboard/VolunteerDashboard';
import { db, collection, getDocs, query, where, orderBy, limit } from '../lib/firebase';
import { useToast } from '../hooks/use-toast';
import { BrainCircuit } from 'lucide-react';
import { generateImpactInsights } from '../lib/gemini';

const Dashboard = () => {
  const { currentUser, userProfile } = useAuth();
  const { toast } = useToast();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [globalInsights, setGlobalInsights] = useState(null);
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);

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

        // Once we have donations data, fetch global insights
        if (donationsList.length > 0) {
          fetchGlobalInsights(donationsList);
        }
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

  const fetchGlobalInsights = async (donationsList) => {
    setIsLoadingInsights(true);
    try {
      // Mock data for demonstration - in a real app, this would be calculated properly
      const impactData = {
        totalFood: donationsList.reduce((sum, donation) => sum + parseFloat(donation.quantity || 0), 0).toFixed(0),
        unit: donationsList[0]?.unit || "pounds",
        totalDonations: donationsList.length,
        businessCount: new Set(donationsList.map(d => d.donorId)).size,
        charityCount: new Set(donationsList.map(d => d.claimedBy).filter(Boolean)).size,
        volunteerCount: new Set(donationsList.map(d => d.transportVolunteerId).filter(Boolean)).size,
        mealsProvided: Math.round(donationsList.reduce((sum, donation) => sum + parseFloat(donation.quantity || 0), 0) / 1.2),
        carbonSaved: Math.round(donationsList.reduce((sum, donation) => sum + parseFloat(donation.quantity || 0), 0) * 2.5),
        timePeriod: "Last 30 days"
      };
      
      const insights = await generateImpactInsights(impactData);
      setGlobalInsights(insights);
    } catch (error) {
      console.error("Error generating global insights:", error);
      toast({
        variant: "destructive",
        title: "Failed to generate insights",
        description: "There was an error analyzing platform impact. Please try again later.",
      });
    } finally {
      setIsLoadingInsights(false);
    }
  };

  const handleRefreshInsights = () => {
    if (donations.length > 0) {
      fetchGlobalInsights(donations);
    } else {
      toast({
        title: "No donation data",
        description: "Need donation data to generate insights.",
      });
    }
  };

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
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome, {userProfile.organizationName || currentUser.email}!
            </h1>
            <button
              onClick={handleRefreshInsights}
              disabled={isLoadingInsights}
              className="mt-2 md:mt-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              <BrainCircuit className="mr-2 h-5 w-5" />
              {isLoadingInsights ? "Analyzing..." : "Platform Insights"}
            </button>
          </div>
          <p className="text-gray-600 mt-1">
            {userProfile.userType === 'business' && "Manage your food donations and track your impact."}
            {userProfile.userType === 'charity' && "Find available donations and manage your requests."}
            {userProfile.userType === 'volunteer' && "Find opportunities to help deliver food donations."}
          </p>
        </div>
        
        {/* Global AI Insights Panel */}
        {globalInsights && (
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-8">
            <div className="flex items-center mb-3">
              <BrainCircuit className="h-6 w-6 text-indigo-600 mr-2" />
              <h2 className="text-xl font-semibold text-indigo-700">AI Platform Impact Analysis</h2>
            </div>
            <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-line">
              {globalInsights}
            </div>
          </div>
        )}
        
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
