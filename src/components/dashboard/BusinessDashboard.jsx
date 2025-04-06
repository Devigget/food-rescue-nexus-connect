
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend
} from 'recharts';
import { PlusCircle, ShoppingBag, CheckCircle, Clock, AlertTriangle, BrainCircuit } from 'lucide-react';
import { db, collection, addDoc, serverTimestamp, getDocs, query, where, orderBy } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../hooks/use-toast';
import { analyzeWastePatterns } from '../../lib/gemini';

const COLORS = ['#22c55e', '#eab308', '#ef4444'];

const BusinessDashboard = ({ donations }) => {
  const { currentUser, userProfile } = useAuth();
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiInsights, setAiInsights] = useState(null);
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);
  const [formData, setFormData] = useState({
    foodName: '',
    category: '',
    quantity: '',
    unit: 'pounds',
    expirationDate: '',
    pickupInstructions: '',
    description: '',
    needsTransport: false,
    storageRequirements: ''
  });

  const donationStats = {
    total: donations.length,
    claimed: donations.filter(d => d.status === 'claimed').length,
    delivered: donations.filter(d => d.status === 'delivered').length,
    expired: donations.filter(d => d.status === 'expired').length
  };

  const pieData = [
    { name: 'Delivered', value: donationStats.delivered },
    { name: 'Claimed', value: donationStats.claimed },
    { name: 'Available', value: donationStats.total - donationStats.claimed - donationStats.delivered - donationStats.expired }
  ];

  // Sample data for the bar chart (would be real data in production)
  const impactData = [
    { name: 'Jan', meals: 78 },
    { name: 'Feb', meals: 120 },
    { name: 'Mar', meals: 95 },
    { name: 'Apr', meals: 145 },
    { name: 'May', meals: 182 },
    { name: 'Jun', meals: 210 }
  ];

  useEffect(() => {
    // When donations change and we have enough data, get AI insights
    if (donations.length >= 5) {
      fetchAiInsights();
    }
  }, [donations]);

  const fetchAiInsights = async () => {
    if (donations.length === 0) return;
    
    setIsLoadingInsights(true);
    try {
      const insights = await analyzeWastePatterns(donations);
      setAiInsights(insights);
    } catch (error) {
      console.error("Error getting AI insights:", error);
      toast({
        variant: "destructive",
        title: "Failed to generate AI insights",
        description: "There was an error analyzing your donation patterns. Please try again later.",
      });
    } finally {
      setIsLoadingInsights(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await addDoc(collection(db, "donations"), {
        donorId: currentUser.uid,
        donorName: userProfile.organizationName,
        foodName: formData.foodName,
        category: formData.category,
        quantity: formData.quantity,
        unit: formData.unit,
        expirationDate: formData.expirationDate,
        pickupInstructions: formData.pickupInstructions,
        description: formData.description,
        needsTransport: formData.needsTransport,
        storageRequirements: formData.storageRequirements,
        status: 'available',
        createdAt: serverTimestamp()
      });

      toast({
        title: "Donation created!",
        description: "Your donation has been successfully listed.",
      });

      // Reset form
      setFormData({
        foodName: '',
        category: '',
        quantity: '',
        unit: 'pounds',
        expirationDate: '',
        pickupInstructions: '',
        description: '',
        needsTransport: false,
        storageRequirements: ''
      });
      
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error adding donation:", error);
      toast({
        variant: "destructive",
        title: "Failed to create donation",
        description: "There was an error creating your donation. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 md:mb-0">Business Dashboard</h2>
        <div className="flex space-x-3">
          <button
            onClick={fetchAiInsights}
            disabled={isLoadingInsights || donations.length < 5}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <BrainCircuit className="mr-2 h-5 w-5" />
            {isLoadingInsights ? "Analyzing..." : "AI Insights"}
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            <PlusCircle className="mr-2 h-5 w-5" />
            Add New Donation
          </button>
        </div>
      </div>

      {/* AI Insights Panel - New Section */}
      {aiInsights && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-8">
          <div className="flex items-center mb-2">
            <BrainCircuit className="h-6 w-6 text-indigo-600 mr-2" />
            <h3 className="text-lg font-semibold text-indigo-700">AI-Powered Insights</h3>
          </div>
          <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-line">
            {aiInsights}
          </div>
        </div>
      )}

      {/* Donation Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-primary/10 mr-4">
              <ShoppingBag className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Donations</p>
              <p className="text-2xl font-semibold text-gray-900">{donationStats.total}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 mr-4">
              <Clock className="h-6 w-6 text-yellow-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Claimed</p>
              <p className="text-2xl font-semibold text-gray-900">{donationStats.claimed}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 mr-4">
              <CheckCircle className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Delivered</p>
              <p className="text-2xl font-semibold text-gray-900">{donationStats.delivered}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 mr-4">
              <AlertTriangle className="h-6 w-6 text-red-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Expired</p>
              <p className="text-2xl font-semibold text-gray-900">{donationStats.expired}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Donation Status</h3>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Meals Provided</h3>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={impactData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="meals" fill="#22c55e" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Donations */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Donations</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Food Item</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiration</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {donations.length > 0 ? (
                donations.map((donation) => (
                  <tr key={donation.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{donation.foodName}</div>
                      <div className="text-sm text-gray-500">{donation.category}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{donation.quantity} {donation.unit}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{donation.expirationDate}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${donation.status === 'available' ? 'bg-blue-100 text-blue-800' : ''}
                        ${donation.status === 'claimed' ? 'bg-yellow-100 text-yellow-800' : ''}
                        ${donation.status === 'delivered' ? 'bg-green-100 text-green-800' : ''}
                        ${donation.status === 'expired' ? 'bg-red-100 text-red-800' : ''}
                      `}>
                        {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link to={`/donations/${donation.id}`} className="text-primary hover:text-secondary">
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                    No donations found. Create your first donation by clicking "Add New Donation" above.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Donation Modal */}
      {isModalOpen && (
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
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4" id="modal-title">
                      Add New Donation
                    </h3>
                    <form onSubmit={handleSubmit}>
                      <div className="mb-4">
                        <label htmlFor="foodName" className="block text-sm font-medium text-gray-700 mb-1">
                          Food Name
                        </label>
                        <input
                          type="text"
                          id="foodName"
                          name="foodName"
                          value={formData.foodName}
                          onChange={handleChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                        />
                      </div>
                      
                      <div className="mb-4">
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                          Category
                        </label>
                        <select
                          id="category"
                          name="category"
                          value={formData.category}
                          onChange={handleChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                        >
                          <option value="">Select a category</option>
                          <option value="Produce">Produce</option>
                          <option value="Dairy">Dairy</option>
                          <option value="Bakery">Bakery</option>
                          <option value="Meat">Meat</option>
                          <option value="Prepared Foods">Prepared Foods</option>
                          <option value="Canned Goods">Canned Goods</option>
                          <option value="Dry Goods">Dry Goods</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                            Quantity
                          </label>
                          <input
                            type="number"
                            id="quantity"
                            name="quantity"
                            min="1"
                            value={formData.quantity}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="unit" className="block text-sm font-medium text-gray-700 mb-1">
                            Unit
                          </label>
                          <select
                            id="unit"
                            name="unit"
                            value={formData.unit}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                          >
                            <option value="pounds">Pounds</option>
                            <option value="kg">Kilograms</option>
                            <option value="servings">Servings</option>
                            <option value="packages">Packages</option>
                            <option value="boxes">Boxes</option>
                            <option value="items">Items</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <label htmlFor="expirationDate" className="block text-sm font-medium text-gray-700 mb-1">
                          Expiration Date
                        </label>
                        <input
                          type="date"
                          id="expirationDate"
                          name="expirationDate"
                          value={formData.expirationDate}
                          onChange={handleChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                        />
                      </div>
                      
                      <div className="mb-4">
                        <label htmlFor="storageRequirements" className="block text-sm font-medium text-gray-700 mb-1">
                          Storage Requirements
                        </label>
                        <select
                          id="storageRequirements"
                          name="storageRequirements"
                          value={formData.storageRequirements}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                        >
                          <option value="">Select storage requirements</option>
                          <option value="Room Temperature">Room Temperature</option>
                          <option value="Refrigeration">Refrigeration</option>
                          <option value="Freezer">Freezer</option>
                          <option value="Keep Dry">Keep Dry</option>
                          <option value="Other">Other (specify in description)</option>
                        </select>
                      </div>
                      
                      <div className="mb-4">
                        <label htmlFor="pickupInstructions" className="block text-sm font-medium text-gray-700 mb-1">
                          Pickup Instructions
                        </label>
                        <textarea
                          id="pickupInstructions"
                          name="pickupInstructions"
                          rows={2}
                          value={formData.pickupInstructions}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                          placeholder="E.g., Available for pickup at the back entrance between 2-4pm"
                        ></textarea>
                      </div>
                      
                      <div className="mb-4">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                          Description
                        </label>
                        <textarea
                          id="description"
                          name="description"
                          rows={3}
                          value={formData.description}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                          placeholder="Additional details about the food items"
                        ></textarea>
                      </div>
                      
                      <div className="mb-4 flex items-center">
                        <input
                          type="checkbox"
                          id="needsTransport"
                          name="needsTransport"
                          checked={formData.needsTransport}
                          onChange={handleChange}
                          className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                        />
                        <label htmlFor="needsTransport" className="ml-2 block text-sm text-gray-900">
                          Requires volunteer transport assistance
                        </label>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary text-base font-medium text-white hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                >
                  {isSubmitting ? 'Creating...' : 'Create Donation'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessDashboard;
