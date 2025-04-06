
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend
} from 'recharts';
import { ShoppingBag, Users, MapPin, Calendar, CheckCircle, Truck } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { db, doc, collection, getDocs, getDoc, updateDoc, query, where, serverTimestamp } from '../../lib/firebase';
import { useToast } from '../../hooks/use-toast';

const COLORS = ['#22c55e', '#eab308', '#ef4444'];

const CharityDashboard = ({ donations }) => {
  const { currentUser, userProfile } = useAuth();
  const { toast } = useToast();
  const [availableDonations, setAvailableDonations] = useState([]);
  const [claimedDonations, setClaimedDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDonation, setSelectedDonation] = useState(null);
  
  // Dummy stats data (would be real data in production)
  const stats = {
    totalClaimed: claimedDonations.length,
    totalReceived: 24,
    peopleServed: 130,
    volumeSaved: 450
  };

  // Sample data for the bar chart (would be real data in production)
  const monthlyData = [
    { name: 'Jan', claimed: 5, received: 4 },
    { name: 'Feb', claimed: 8, received: 7 },
    { name: 'Mar', claimed: 7, received: 6 },
    { name: 'Apr', claimed: 10, received: 9 },
    { name: 'May', claimed: 12, received: 11 },
    { name: 'Jun', claimed: 15, received: 13 }
  ];

  // Dummy donation sources data (would be real data in production)
  const sourcesData = [
    { name: 'Restaurants', value: 45 },
    { name: 'Grocery Stores', value: 30 },
    { name: 'Bakeries', value: 15 },
    { name: 'Events', value: 10 }
  ];

  useEffect(() => {
    if (donations && donations.length > 0) {
      const available = donations.filter(d => d.status === 'available');
      const claimed = donations.filter(d => 
        d.status === 'claimed' && 
        d.claimedBy === currentUser.uid
      );
      
      setAvailableDonations(available);
      setClaimedDonations(claimed);
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [donations, currentUser.uid]);

  const handleClaim = async (donation) => {
    try {
      // Update the donation in Firestore
      const donationRef = doc(db, "donations", donation.id);
      await updateDoc(donationRef, {
        status: 'claimed',
        claimedBy: currentUser.uid,
        claimedByName: userProfile.organizationName,
        claimedAt: serverTimestamp()
      });
      
      // Update local state
      const updatedAvailable = availableDonations.filter(d => d.id !== donation.id);
      const updatedDonation = {
        ...donation,
        status: 'claimed',
        claimedBy: currentUser.uid,
        claimedByName: userProfile.organizationName
      };
      
      setAvailableDonations(updatedAvailable);
      setClaimedDonations([...claimedDonations, updatedDonation]);
      
      toast({
        title: "Donation claimed!",
        description: `You have successfully claimed ${donation.foodName}.`,
      });
      
      setSelectedDonation(null);
    } catch (error) {
      console.error("Error claiming donation:", error);
      toast({
        variant: "destructive",
        title: "Failed to claim donation",
        description: "There was an error claiming this donation. Please try again.",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Charity Dashboard</h2>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-primary/10 mr-4">
              <ShoppingBag className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Donations Claimed</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalClaimed}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 mr-4">
              <CheckCircle className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Donations Received</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalReceived}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 mr-4">
              <Users className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">People Served</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.peopleServed}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 mr-4">
              <Truck className="h-6 w-6 text-yellow-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Pounds Saved</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.volumeSaved}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Activity</h3>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="claimed" fill="#eab308" name="Claimed" />
                <Bar dataKey="received" fill="#22c55e" name="Received" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Donation Sources</h3>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sourcesData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {sourcesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Available Donations */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Available Donations</h3>
        </div>
        <div className="overflow-x-auto">
          {availableDonations.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Food Item</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Donor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiration</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {availableDonations.map((donation) => (
                  <tr key={donation.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{donation.foodName}</div>
                      <div className="text-sm text-gray-500">{donation.category}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{donation.donorName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{donation.quantity} {donation.unit}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{donation.expirationDate}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => setSelectedDonation(donation)}
                        className="text-primary hover:text-secondary"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-6 text-center text-gray-500">
              No available donations found. Check back later for new listings.
            </div>
          )}
        </div>
      </div>

      {/* Your Claims */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Your Claims</h3>
        </div>
        <div className="overflow-x-auto">
          {claimedDonations.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Food Item</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Donor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiration</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {claimedDonations.map((donation) => (
                  <tr key={donation.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{donation.foodName}</div>
                      <div className="text-sm text-gray-500">{donation.category}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{donation.donorName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{donation.quantity} {donation.unit}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{donation.expirationDate}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        Claimed
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link to={`/donations/${donation.id}`} className="text-primary hover:text-secondary">
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-6 text-center text-gray-500">
              You haven't claimed any donations yet. Browse available donations above.
            </div>
          )}
        </div>
      </div>

      {/* Donation Details Modal */}
      {selectedDonation && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-2">
                      {selectedDonation.foodName}
                    </h3>
                    <div className="mt-4 border-t border-gray-200 pt-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-500">Category</p>
                          <p className="text-sm text-gray-900">{selectedDonation.category}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Quantity</p>
                          <p className="text-sm text-gray-900">{selectedDonation.quantity} {selectedDonation.unit}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Donor</p>
                          <p className="text-sm text-gray-900">{selectedDonation.donorName}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Expiration Date</p>
                          <p className="text-sm text-gray-900">{selectedDonation.expirationDate}</p>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <p className="text-sm font-medium text-gray-500">Pickup Instructions</p>
                        <p className="text-sm text-gray-900">{selectedDonation.pickupInstructions || "No specific instructions provided."}</p>
                      </div>
                      
                      <div className="mt-4">
                        <p className="text-sm font-medium text-gray-500">Description</p>
                        <p className="text-sm text-gray-900">{selectedDonation.description || "No additional details provided."}</p>
                      </div>
                      
                      <div className="mt-4 flex items-center">
                        <Truck className="h-5 w-5 text-gray-400 mr-2" />
                        <p className="text-sm text-gray-900">
                          {selectedDonation.needsTransport 
                            ? "Needs volunteer transport assistance" 
                            : "No transport assistance needed"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={() => handleClaim(selectedDonation)}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary text-base font-medium text-white hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Claim Donation
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedDonation(null)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CharityDashboard;
