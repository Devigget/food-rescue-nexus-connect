
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { Truck, Calendar, Clock, MapPin, CheckCircle, Clock as ClockIcon } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { db, doc, collection, getDocs, getDoc, updateDoc, query, where, serverTimestamp } from '../../lib/firebase';
import { useToast } from '../../hooks/use-toast';

const COLORS = ['#22c55e', '#eab308', '#ef4444'];

const VolunteerDashboard = ({ donations }) => {
  const { currentUser, userProfile } = useAuth();
  const { toast } = useToast();
  const [availableTransports, setAvailableTransports] = useState([]);
  const [myTransports, setMyTransports] = useState([]);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Dummy stats data (would be real data in production)
  const stats = {
    totalCompleted: 18,
    hoursVolunteered: 35,
    milesTraveled: 240,
    totalMealsHelped: 430
  };

  // Sample data for the bar chart (would be real data in production)
  const monthlyData = [
    { name: 'Jan', trips: 3 },
    { name: 'Feb', trips: 5 },
    { name: 'Mar', trips: 4 },
    { name: 'Apr', trips: 7 },
    { name: 'May', trips: 8 },
    { name: 'Jun', trips: 6 }
  ];

  // Dummy transport types data (would be real data in production)
  const transportTypesData = [
    { name: 'Restaurant to Charity', value: 45 },
    { name: 'Grocery to Food Bank', value: 35 },
    { name: 'Event to Shelter', value: 20 }
  ];

  useEffect(() => {
    if (donations && donations.length > 0) {
      const available = donations.filter(d => 
        d.status === 'claimed' && 
        d.needsTransport && 
        !d.transportVolunteerId
      );
      
      const myTransportsArray = donations.filter(d => 
        d.transportVolunteerId === currentUser.uid
      );
      
      setAvailableTransports(available);
      setMyTransports(myTransportsArray);
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [donations, currentUser.uid]);

  const handleVolunteer = async (donation) => {
    try {
      // Update the donation in Firestore
      const donationRef = doc(db, "donations", donation.id);
      await updateDoc(donationRef, {
        transportVolunteerId: currentUser.uid,
        transportVolunteerName: userProfile.email,
        transportAssignedAt: serverTimestamp()
      });
      
      // Update local state
      const updatedAvailable = availableTransports.filter(d => d.id !== donation.id);
      const updatedDonation = {
        ...donation,
        transportVolunteerId: currentUser.uid,
        transportVolunteerName: userProfile.email
      };
      
      setAvailableTransports(updatedAvailable);
      setMyTransports([...myTransports, updatedDonation]);
      
      toast({
        title: "Volunteer opportunity accepted!",
        description: `You have volunteered to transport ${donation.foodName}.`,
      });
      
      setSelectedDonation(null);
    } catch (error) {
      console.error("Error volunteering for transport:", error);
      toast({
        variant: "destructive",
        title: "Failed to volunteer",
        description: "There was an error processing your request. Please try again.",
      });
    }
  };

  const handleMarkComplete = async (donation) => {
    try {
      // Update the donation in Firestore
      const donationRef = doc(db, "donations", donation.id);
      await updateDoc(donationRef, {
        status: 'delivered',
        deliveredAt: serverTimestamp(),
        deliveredBy: currentUser.uid
      });
      
      // Update local state
      const updatedMyTransports = myTransports.map(d => {
        if (d.id === donation.id) {
          return { ...d, status: 'delivered' };
        }
        return d;
      });
      
      setMyTransports(updatedMyTransports);
      
      toast({
        title: "Delivery completed!",
        description: `You have successfully delivered the donation.`,
      });
    } catch (error) {
      console.error("Error marking delivery complete:", error);
      toast({
        variant: "destructive",
        title: "Failed to update status",
        description: "There was an error updating the delivery status. Please try again.",
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
        <h2 className="text-2xl font-bold text-gray-900">Volunteer Dashboard</h2>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-primary/10 mr-4">
              <CheckCircle className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Deliveries Completed</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalCompleted}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 mr-4">
              <ClockIcon className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Hours Volunteered</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.hoursVolunteered}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 mr-4">
              <MapPin className="h-6 w-6 text-yellow-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Miles Traveled</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.milesTraveled}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 mr-4">
              <Truck className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Meals Delivered</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalMealsHelped}</p>
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
                <Bar dataKey="trips" fill="#22c55e" name="Deliveries" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Transport Types</h3>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={transportTypesData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {transportTypesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Available Transport Opportunities */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Available Transport Opportunities</h3>
        </div>
        <div className="overflow-x-auto">
          {availableTransports.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Food Item</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">From</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">To</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {availableTransports.map((donation) => (
                  <tr key={donation.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{donation.foodName}</div>
                      <div className="text-sm text-gray-500">{donation.category}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{donation.donorName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{donation.claimedByName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{donation.quantity} {donation.unit}</div>
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
              No transport opportunities available at the moment. Check back later.
            </div>
          )}
        </div>
      </div>

      {/* Your Transport Assignments */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Your Transport Assignments</h3>
        </div>
        <div className="overflow-x-auto">
          {myTransports.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Food Item</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">From</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">To</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {myTransports.map((donation) => (
                  <tr key={donation.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{donation.foodName}</div>
                      <div className="text-sm text-gray-500">{donation.category}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{donation.donorName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{donation.claimedByName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${donation.status === 'claimed' ? 'bg-yellow-100 text-yellow-800' : ''}
                        ${donation.status === 'delivered' ? 'bg-green-100 text-green-800' : ''}
                      `}>
                        {donation.status === 'claimed' ? 'In Progress' : 'Delivered'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {donation.status === 'claimed' ? (
                        <button
                          onClick={() => handleMarkComplete(donation)}
                          className="text-primary hover:text-secondary"
                        >
                          Mark Delivered
                        </button>
                      ) : (
                        <Link to={`/deliveries/${donation.id}`} className="text-primary hover:text-secondary">
                          View Details
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-6 text-center text-gray-500">
              You haven't volunteered for any transports yet. Browse opportunities above.
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
                      Transport Opportunity
                    </h3>
                    <div className="mt-4 border-t border-gray-200 pt-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-500">Food Item</p>
                          <p className="text-sm text-gray-900">{selectedDonation.foodName}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Category</p>
                          <p className="text-sm text-gray-900">{selectedDonation.category}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Quantity</p>
                          <p className="text-sm text-gray-900">{selectedDonation.quantity} {selectedDonation.unit}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Expiration</p>
                          <p className="text-sm text-gray-900">{selectedDonation.expirationDate}</p>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <p className="text-sm font-medium text-gray-500">Pickup From</p>
                        <div className="flex items-center mt-1">
                          <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                          <p className="text-sm text-gray-900">{selectedDonation.donorName}</p>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{selectedDonation.pickupInstructions || "No specific pickup instructions provided."}</p>
                      </div>
                      
                      <div className="mt-4">
                        <p className="text-sm font-medium text-gray-500">Deliver To</p>
                        <div className="flex items-center mt-1">
                          <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                          <p className="text-sm text-gray-900">{selectedDonation.claimedByName}</p>
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="text-sm font-medium text-gray-900">Estimated Time: 30 minutes</p>
                        <p className="text-sm text-gray-500">Estimated Distance: 5 miles</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={() => handleVolunteer(selectedDonation)}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary text-base font-medium text-white hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Volunteer for Transport
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

export default VolunteerDashboard;
