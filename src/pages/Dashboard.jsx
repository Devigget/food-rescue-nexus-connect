
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
  const { toast } = useToast();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [globalInsights, setGlobalInsights] = useState(null);
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);
  
  // For testing, hardcode a dashboard type to view
  const [activeDashboard, setActiveDashboard] = useState('business');

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        let donationsQuery;
        
        // Simplified query for testing - gets most recent donations
        donationsQuery = query(
          collection(db, 'donations'),
          orderBy('createdAt', 'desc'),
          limit(10)
        );
        
        const querySnapshot = await getDocs(donationsQuery);
        const donationsList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setDonations(donationsList);

        // Generate insights with sample data if no donations are available
        if (donationsList.length === 0) {
          // Create mock data for testing
          const mockDonations = [
            {
              id: 'mock1',
              donorId: 'business1',
              claimedBy: 'charity1',
              foodName: 'Fresh Vegetables',
              category: 'Produce',
              quantity: '25',
              unit: 'pounds',
              status: 'available',
              createdAt: new Date()
            },
            {
              id: 'mock2',
              donorId: 'business2',
              claimedBy: 'charity1',
              foodName: 'Bread',
              category: 'Bakery',
              quantity: '15',
              unit: 'pounds',
              status: 'claimed',
              createdAt: new Date()
            }
          ];
          setDonations(mockDonations);
          fetchGlobalInsights(mockDonations);
        } else {
          fetchGlobalInsights(donationsList);
        }
      } catch (err) {
        console.error("Error fetching donations:", err);
        setError("Failed to load donations. Please refresh the page.");
        
        // Use mock data if fetch fails
        const mockDonations = [
          {
            id: 'mock1',
            donorId: 'business1',
            claimedBy: 'charity1',
            foodName: 'Fresh Vegetables',
            category: 'Produce',
            quantity: '25',
            unit: 'pounds',
            status: 'available',
            createdAt: new Date()
          },
          {
            id: 'mock2',
            donorId: 'business2',
            claimedBy: 'charity1',
            foodName: 'Bread',
            category: 'Bakery',
            quantity: '15',
            unit: 'pounds',
            status: 'claimed',
            createdAt: new Date()
          }
        ];
        setDonations(mockDonations);
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, []);

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
              Dashboard
            </h1>
            <div className="mt-4 md:mt-0 flex space-x-2">
              <button
                onClick={() => setActiveDashboard('business')}
                className={`px-4 py-2 rounded-md ${activeDashboard === 'business' 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-200 text-gray-800'}`}
              >
                Business View
              </button>
              <button
                onClick={() => setActiveDashboard('charity')}
                className={`px-4 py-2 rounded-md ${activeDashboard === 'charity' 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-200 text-gray-800'}`}
              >
                Charity View
              </button>
              <button
                onClick={() => setActiveDashboard('volunteer')}
                className={`px-4 py-2 rounded-md ${activeDashboard === 'volunteer' 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-200 text-gray-800'}`}
              >
                Volunteer View
              </button>
              <button
                onClick={handleRefreshInsights}
                disabled={isLoadingInsights}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                <BrainCircuit className="mr-2 h-5 w-5" />
                {isLoadingInsights ? "Analyzing..." : "Generate Insights"}
              </button>
            </div>
          </div>
          <p className="text-gray-600 mt-1">
            {activeDashboard === 'business' && "Manage your food donations and track your impact."}
            {activeDashboard === 'charity' && "Find available donations and manage your requests."}
            {activeDashboard === 'volunteer' && "Find opportunities to help deliver food donations."}
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
        
        {activeDashboard === 'business' && (
          <BusinessDashboard donations={donations} />
        )}
        
        {activeDashboard === 'charity' && (
          <CharityDashboard donations={donations} />
        )}
        
        {activeDashboard === 'volunteer' && (
          <VolunteerDashboard donations={donations} />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
