
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { db, doc, getDoc, updateDoc, serverTimestamp } from '../lib/firebase';
import { useToast } from '../hooks/use-toast';
import { User, Truck, MapPin, Phone, Mail, Calendar, CheckCircle } from 'lucide-react';

const Profile = () => {
  const { currentUser, userProfile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    organizationName: '',
    contactName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    bio: '',
    canTransport: false,
    transportRadius: ''
  });
  
  useEffect(() => {
    const fetchProfileDetails = async () => {
      if (!currentUser) {
        navigate('/login');
        return;
      }
      
      try {
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const userData = docSnap.data();
          setFormData({
            organizationName: userData.organizationName || '',
            contactName: userData.contactName || '',
            phone: userData.phone || '',
            address: userData.address || '',
            city: userData.city || '',
            state: userData.state || '',
            zipCode: userData.zipCode || '',
            bio: userData.bio || '',
            canTransport: userData.canTransport || false,
            transportRadius: userData.transportRadius || ''
          });
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching profile:", error);
        setLoading(false);
        toast({
          variant: "destructive",
          title: "Error fetching profile",
          description: "There was an error loading your profile data.",
        });
      }
    };
    
    fetchProfileDetails();
  }, [currentUser, navigate, toast]);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const userRef = doc(db, "users", currentUser.uid);
      await updateDoc(userRef, {
        ...formData,
        lastUpdated: serverTimestamp()
      });
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
      
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        variant: "destructive",
        title: "Update failed",
        description: "There was an error updating your profile.",
      });
    } finally {
      setLoading(false);
    }
  };
  
  if (loading && !userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-8 border-b border-gray-200 bg-primary/5">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
              <div className="flex items-center">
                <div className="h-16 w-16 rounded-full bg-primary text-white flex items-center justify-center">
                  {userProfile?.userType === 'business' && <Truck size={32} />}
                  {userProfile?.userType === 'charity' && <CheckCircle size={32} />}
                  {userProfile?.userType === 'volunteer' && <User size={32} />}
                </div>
                <div className="ml-4">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {formData.organizationName || currentUser.email}
                  </h1>
                  <p className="text-sm text-gray-500 capitalize">
                    {userProfile?.userType} Account
                  </p>
                </div>
              </div>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="mt-4 md:mt-0 px-4 py-2 border border-primary text-primary rounded-md hover:bg-primary hover:text-white transition-colors"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>
          
          {isEditing ? (
            <div className="px-6 py-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Edit Your Profile</h2>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="organizationName" className="block text-sm font-medium text-gray-700 mb-1">
                      {userProfile?.userType === 'volunteer' ? 'Full Name' : 'Organization Name'}
                    </label>
                    <input
                      type="text"
                      id="organizationName"
                      name="organizationName"
                      value={formData.organizationName}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                      placeholder={userProfile?.userType === 'volunteer' ? 'Your full name' : 'Organization name'}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="contactName" className="block text-sm font-medium text-gray-700 mb-1">
                      {userProfile?.userType === 'volunteer' ? 'Preferred Name' : 'Contact Person'}
                    </label>
                    <input
                      type="text"
                      id="contactName"
                      name="contactName"
                      value={formData.contactName}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                      placeholder={userProfile?.userType === 'volunteer' ? 'Preferred name' : 'Contact person name'}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                      placeholder="(123) 456-7890"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={currentUser.email}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                      Street Address
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                      placeholder="Street address"
                    />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                        placeholder="City"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                        State
                      </label>
                      <input
                        type="text"
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                        placeholder="State"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                        ZIP Code
                      </label>
                      <input
                        type="text"
                        id="zipCode"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                        placeholder="ZIP"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                    Bio / Description
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    rows={4}
                    value={formData.bio}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                    placeholder="Tell us about yourself or your organization..."
                  ></textarea>
                </div>
                
                {userProfile?.userType === 'volunteer' && (
                  <div className="mb-6">
                    <div className="flex items-start mb-4">
                      <div className="flex items-center h-5">
                        <input
                          id="canTransport"
                          name="canTransport"
                          type="checkbox"
                          checked={formData.canTransport}
                          onChange={handleChange}
                          className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="canTransport" className="font-medium text-gray-700">
                          I can provide transportation
                        </label>
                        <p className="text-gray-500">Check this if you can transport food donations between donors and recipients.</p>
                      </div>
                    </div>
                    
                    {formData.canTransport && (
                      <div>
                        <label htmlFor="transportRadius" className="block text-sm font-medium text-gray-700 mb-1">
                          How far are you willing to travel? (miles)
                        </label>
                        <input
                          type="number"
                          id="transportRadius"
                          name="transportRadius"
                          min="1"
                          value={formData.transportRadius}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                          placeholder="Distance in miles"
                        />
                      </div>
                    )}
                  </div>
                )}
                
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="px-6 py-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Profile Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div>
                  <div className="flex items-center text-gray-800 mb-2">
                    <User className="h-5 w-5 text-gray-400 mr-2" />
                    <h3 className="text-sm font-medium text-gray-500">
                      {userProfile?.userType === 'volunteer' ? 'Full Name' : 'Organization'}
                    </h3>
                  </div>
                  <p className="text-gray-900">
                    {formData.organizationName || <span className="text-gray-400 italic">Not provided</span>}
                  </p>
                </div>
                
                <div>
                  <div className="flex items-center text-gray-800 mb-2">
                    <User className="h-5 w-5 text-gray-400 mr-2" />
                    <h3 className="text-sm font-medium text-gray-500">
                      {userProfile?.userType === 'volunteer' ? 'Preferred Name' : 'Contact Person'}
                    </h3>
                  </div>
                  <p className="text-gray-900">
                    {formData.contactName || <span className="text-gray-400 italic">Not provided</span>}
                  </p>
                </div>
                
                <div>
                  <div className="flex items-center text-gray-800 mb-2">
                    <Mail className="h-5 w-5 text-gray-400 mr-2" />
                    <h3 className="text-sm font-medium text-gray-500">Email</h3>
                  </div>
                  <p className="text-gray-900">{currentUser.email}</p>
                </div>
                
                <div>
                  <div className="flex items-center text-gray-800 mb-2">
                    <Phone className="h-5 w-5 text-gray-400 mr-2" />
                    <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                  </div>
                  <p className="text-gray-900">
                    {formData.phone || <span className="text-gray-400 italic">Not provided</span>}
                  </p>
                </div>
                
                <div className="md:col-span-2">
                  <div className="flex items-center text-gray-800 mb-2">
                    <MapPin className="h-5 w-5 text-gray-400 mr-2" />
                    <h3 className="text-sm font-medium text-gray-500">Address</h3>
                  </div>
                  {formData.address ? (
                    <p className="text-gray-900">
                      {formData.address}<br />
                      {formData.city && formData.state ? `${formData.city}, ${formData.state} ${formData.zipCode || ''}` : ''}
                    </p>
                  ) : (
                    <p className="text-gray-400 italic">Address not provided</p>
                  )}
                </div>
                
                <div className="md:col-span-2">
                  <div className="flex items-center text-gray-800 mb-2">
                    <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                    <h3 className="text-sm font-medium text-gray-500">Bio / Description</h3>
                  </div>
                  <p className="text-gray-900 whitespace-pre-line">
                    {formData.bio || <span className="text-gray-400 italic">No bio provided</span>}
                  </p>
                </div>
                
                {userProfile?.userType === 'volunteer' && (
                  <div className="md:col-span-2">
                    <div className="flex items-center text-gray-800 mb-2">
                      <Truck className="h-5 w-5 text-gray-400 mr-2" />
                      <h3 className="text-sm font-medium text-gray-500">Transportation</h3>
                    </div>
                    {formData.canTransport ? (
                      <p className="text-gray-900">
                        Available to transport food donations
                        {formData.transportRadius && ` within ${formData.transportRadius} miles`}
                      </p>
                    ) : (
                      <p className="text-gray-400 italic">Not available for transportation</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
