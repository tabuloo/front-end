import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { Plus, Users, Store, MapPin, Edit, Trash2, X, AlertTriangle, DollarSign, TrendingUp, Calendar, BarChart3, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import PasswordInput from '../components/PasswordInput';

const AdminDashboard: React.FC = () => {
  const { restaurants, orders, bookings, addRestaurant, updateRestaurant, deleteRestaurant, updateRestaurantStatus } = useApp();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editingRestaurant, setEditingRestaurant] = useState<any>(null);
  const [deletingRestaurant, setDeletingRestaurant] = useState<any>(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState<any>(null);
  const [showRevenueDetails, setShowRevenueDetails] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'restaurant' as 'restaurant' | 'hotel' | 'resort',
    address: '',
    capacity: '',
    crowdCapacity: '',
    images: '',
    price: '',
    ownerUsername: '',
    ownerPassword: '',
    timings: '9:00 AM - 11:00 PM'
  });
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [imageInput, setImageInput] = useState('');

  // Dynamic total customers: unique users across orders and bookings
  const totalCustomers = (() => {
    try {
      const orderUserIds = orders.map(o => o.userId).filter(Boolean);
      const bookingUserIds = bookings.map(b => b.userId).filter(Boolean);
      return new Set([...orderUserIds, ...bookingUserIds]).size;
    } catch {
      return 0;
    }
  })();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all required fields
    if (!formData.name.trim()) {
      toast.error('Restaurant name is required');
      return;
    }
    
    if (!formData.address.trim()) {
      toast.error('Restaurant address is required');
      return;
    }
    
    if (!formData.capacity || parseInt(formData.capacity) <= 0) {
      toast.error('Please enter a valid food serving capacity');
      return;
    }
    
    if (!formData.crowdCapacity || parseInt(formData.crowdCapacity) <= 0) {
      toast.error('Please enter a valid crowd capacity');
      return;
    }
    
    if (!formData.ownerUsername.trim()) {
      toast.error('Owner username is required');
      return;
    }
    
    if (!formData.ownerPassword.trim() || formData.ownerPassword.length < 6) {
      toast.error('Owner password must be at least 6 characters long');
      return;
    }

    setIsSubmitting(true);

    try {
      const newRestaurant = {
        name: formData.name.trim(),
        type: formData.type,
        address: formData.address.trim(),
        capacity: parseInt(formData.capacity),
        crowdCapacity: parseInt(formData.crowdCapacity),
        images: imageUrls,
        price: 0, // Default price
        ownerCredentials: {
          username: formData.ownerUsername.trim(),
          password: formData.ownerPassword
        },
        isOpen: true,
        timings: formData.timings || '9:00 AM - 11:00 PM'
      };

      await addRestaurant(newRestaurant);
      
      setShowAddForm(false);
      setFormData({
        name: '',
        type: 'restaurant',
        address: '',
        capacity: '',
        crowdCapacity: '',
        images: '',
        price: '',
        ownerUsername: '',
        ownerPassword: '',
        timings: '9:00 AM - 11:00 PM'
      });
      setImageUrls([]);
      setImageInput('');
      toast.success('Restaurant added successfully! Owner account has been created.');
    } catch (error) {
      console.error('Error adding restaurant:', error);
      toast.error('Failed to add restaurant. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (restaurant: any) => {
    setEditingRestaurant(restaurant);
    setFormData({
      name: restaurant.name,
      type: restaurant.type,
      address: restaurant.address,
      capacity: restaurant.capacity.toString(),
      crowdCapacity: restaurant.crowdCapacity.toString(),
      images: restaurant.images.join(', '),
      price: (restaurant.price ?? 0).toString(),
      ownerUsername: restaurant.ownerCredentials.username,
      ownerPassword: restaurant.ownerCredentials.password,
      timings: restaurant.timings
    });
    setShowEditForm(true);
  };

  const handleDelete = (restaurant: any) => {
    setDeletingRestaurant(restaurant);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!deletingRestaurant) return;
    
    setIsDeleting(true);
    
    try {
      await deleteRestaurant(deletingRestaurant.id);
      setShowDeleteConfirm(false);
      setDeletingRestaurant(null);
      toast.success(`Restaurant "${deletingRestaurant.name}" and all associated data deleted successfully!`);
    } catch (error) {
      console.error('Error deleting restaurant:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast.error(`Failed to delete restaurant: ${errorMessage}`);
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setDeletingRestaurant(null);
  };

  const toggleRestaurantStatus = async (restaurant: any) => {
    try {
      await updateRestaurantStatus(restaurant.id, !restaurant.isOpen);
      toast.success(`Restaurant ${restaurant.isOpen ? 'closed' : 'opened'} successfully!`);
    } catch (error) {
      console.error('Error toggling restaurant status:', error);
      toast.error('Failed to update restaurant status. Please try again.');
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingRestaurant) return;

    // Validate required fields
    if (!formData.name.trim()) {
      toast.error('Restaurant name is required');
      return;
    }
    
    if (!formData.address.trim()) {
      toast.error('Restaurant address is required');
      return;
    }
    
    if (!formData.capacity || parseInt(formData.capacity) <= 0) {
      toast.error('Please enter a valid food serving capacity');
      return;
    }
    
    if (!formData.crowdCapacity || parseInt(formData.crowdCapacity) <= 0) {
      toast.error('Please enter a valid crowd capacity');
      return;
    }
    
    if (!formData.ownerUsername.trim()) {
      toast.error('Owner username is required');
      return;
    }
    
    if (!formData.ownerPassword.trim() || formData.ownerPassword.length < 6) {
      toast.error('Owner password must be at least 6 characters long');
      return;
    }

    setIsSubmitting(true);

    try {
      const updatedRestaurant = {
        ...editingRestaurant,
        name: formData.name.trim(),
        type: formData.type,
        address: formData.address.trim(),
        capacity: parseInt(formData.capacity),
        crowdCapacity: parseInt(formData.crowdCapacity),
        images: formData.images ? formData.images.split(',').map(img => img.trim()).filter(img => img) : [],
        price: editingRestaurant.price ?? 0,
        ownerCredentials: {
          username: formData.ownerUsername.trim(),
          password: formData.ownerPassword
        },
        timings: formData.timings
      };

      await updateRestaurant(updatedRestaurant);
      
      setShowEditForm(false);
      setEditingRestaurant(null);
      setFormData({
        name: '',
        type: 'restaurant',
        address: '',
        capacity: '',
        crowdCapacity: '',
        images: '',
        price: '',
        ownerUsername: '',
        ownerPassword: '',
        timings: '9:00 AM - 11:00 PM'
      });
      toast.success('Restaurant updated successfully!');
    } catch (error) {
      console.error('Error updating restaurant:', error);
      toast.error('Failed to update restaurant. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeEditForm = () => {
    setShowEditForm(false);
    setEditingRestaurant(null);
    setFormData({
      name: '',
      type: 'restaurant',
      address: '',
      capacity: '',
      crowdCapacity: '',
      images: '',
      price: '',
      ownerUsername: '',
      ownerPassword: '',
      timings: '9:00 AM - 11:00 PM'
    });
  };

  // Revenue calculation functions
  const calculateRestaurantRevenue = (restaurantId: string, period: 'today' | 'month' | 'year') => {
    const now = new Date();
    let startDate: Date;
    
    switch (period) {
      case 'today':
        startDate = new Date(now);
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        startDate = new Date(now);
        startDate.setHours(0, 0, 0, 0);
    }

    const restaurantOrders = orders.filter(order => 
      order.restaurantId === restaurantId && 
      order.createdAt && 
      new Date(order.createdAt) >= startDate
    );
    
    const restaurantBookings = bookings.filter(booking => 
      booking.restaurantId === restaurantId && 
      booking.createdAt && 
      new Date(booking.createdAt) >= startDate
    );

    const ordersRevenue = restaurantOrders.reduce((sum, order) => sum + order.total, 0);
    const bookingsRevenue = restaurantBookings.reduce((sum, booking) => sum + booking.amount, 0);
    
    return {
      total: ordersRevenue + bookingsRevenue,
      orders: ordersRevenue,
      bookings: bookingsRevenue,
      orderCount: restaurantOrders.length,
      bookingCount: restaurantBookings.length
    };
  };

  const calculateTotalRevenue = (period: 'today' | 'month' | 'year') => {
    const now = new Date();
    let startDate: Date;
    
    switch (period) {
      case 'today':
        startDate = new Date(now);
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        startDate = new Date(now);
        startDate.setHours(0, 0, 0, 0);
    }

    const periodOrders = orders.filter(order => 
      order.createdAt && 
      new Date(order.createdAt) >= startDate
    );
    
    const periodBookings = bookings.filter(booking => 
      booking.createdAt && 
      new Date(booking.createdAt) >= startDate
    );

    const ordersRevenue = periodOrders.reduce((sum, order) => sum + order.total, 0);
    const bookingsRevenue = periodBookings.reduce((sum, booking) => sum + booking.amount, 0);
    
    return {
      total: ordersRevenue + bookingsRevenue,
      orders: ordersRevenue,
      bookings: bookingsRevenue,
      orderCount: periodOrders.length,
      bookingCount: periodBookings.length
    };
  };

  const handleRevenueDetails = (restaurant: any) => {
    setSelectedRestaurant(restaurant);
    setShowRevenueDetails(true);
  };

  const handleLogout = () => {
    logout();
    toast.success('Logout successful!');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Tabuloo Admin Dashboard</h1>
              <p className="text-gray-600 mt-2 text-sm sm:text-base">Manage restaurant partnerships and create owner accounts</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white p-3 sm:p-6 rounded-lg sm:rounded-xl shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 sm:p-3 bg-blue-100 rounded-lg">
                <Users className="h-4 w-4 sm:h-6 sm:w-6 text-blue-600" />
              </div>
              <div className="ml-2 sm:ml-4">
                <h3 className="text-xs sm:text-sm font-medium text-gray-600">Total Customers</h3>
                <p className="text-lg sm:text-2xl font-bold text-blue-600">{totalCustomers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-3 sm:p-6 rounded-lg sm:rounded-xl shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 sm:p-3 bg-green-100 rounded-lg">
                <Store className="h-4 w-4 sm:h-6 sm:w-6 text-green-600" />
              </div>
              <div className="ml-2 sm:ml-4">
                <h3 className="text-xs sm:text-sm font-medium text-gray-600">Partner Restaurants</h3>
                <p className="text-lg sm:text-2xl font-bold text-green-600">{restaurants.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-3 sm:p-6 rounded-lg sm:rounded-xl shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 sm:p-3 bg-purple-100 rounded-lg">
                <MapPin className="h-4 w-4 sm:h-6 sm:w-6 text-purple-600" />
              </div>
              <div className="ml-2 sm:ml-4">
                <h3 className="text-xs sm:text-sm font-medium text-gray-600">Active Partners</h3>
                <p className="text-lg sm:text-2xl font-bold text-purple-600">{restaurants.filter(r => r.isOpen).length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-3 sm:p-6 rounded-lg sm:rounded-xl shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 sm:p-3 bg-yellow-100 rounded-lg">
                <DollarSign className="h-4 w-4 sm:h-6 sm:w-6 text-yellow-600" />
              </div>
              <div className="ml-2 sm:ml-4">
                <h3 className="text-xs sm:text-sm font-medium text-gray-600">Today's Revenue</h3>
                <p className="text-lg sm:text-2xl font-bold text-yellow-600">₹{calculateTotalRevenue('today').total.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Revenue Overview Section */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg sm:rounded-xl shadow-sm mb-6 sm:mb-8">
          <div className="p-4 sm:p-6">
            <div className="flex items-center mb-4">
              <div className="p-2 sm:p-3 bg-green-100 rounded-lg">
                <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
              </div>
              <div className="ml-3">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900">Platform Revenue Overview</h3>
                <p className="text-sm text-gray-600">Total revenue across all partner restaurants</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Today's Revenue */}
              <div className="bg-white p-4 rounded-lg border border-green-200 shadow-sm">
                <div className="text-center">
                  <p className="text-sm font-medium text-green-700 mb-1">Today's Revenue</p>
                  <p className="text-2xl sm:text-3xl font-bold text-green-600">
                    ₹{calculateTotalRevenue('today').total.toFixed(2)}
                  </p>
                  <p className="text-xs text-green-600 mt-1">
                    {calculateTotalRevenue('today').orderCount + calculateTotalRevenue('today').bookingCount} transactions
                  </p>
                  <div className="mt-2 text-xs text-gray-500">
                    <p>Orders: {calculateTotalRevenue('today').orderCount}</p>
                    <p>Bookings: {calculateTotalRevenue('today').bookingCount}</p>
                  </div>
                </div>
              </div>

              {/* Monthly Revenue */}
              <div className="bg-white p-4 rounded-lg border border-blue-200 shadow-sm">
                <div className="text-center">
                  <p className="text-sm font-medium text-blue-700 mb-1">Monthly Revenue</p>
                  <p className="text-2xl sm:text-3xl font-bold text-blue-600">
                    ₹{calculateTotalRevenue('month').total.toFixed(2)}
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    {calculateTotalRevenue('month').orderCount + calculateTotalRevenue('month').bookingCount} transactions
                  </p>
                  <div className="mt-2 text-xs text-gray-500">
                    <p>Orders: {calculateTotalRevenue('month').orderCount}</p>
                    <p>Bookings: {calculateTotalRevenue('month').bookingCount}</p>
                  </div>
                </div>
              </div>

              {/* Annual Revenue */}
              <div className="bg-white p-4 rounded-lg border border-purple-200 shadow-sm">
                <div className="text-center">
                  <p className="text-sm font-medium text-purple-700 mb-1">Annual Revenue</p>
                  <p className="text-2xl sm:text-3xl font-bold text-purple-600">
                    ₹{calculateTotalRevenue('year').total.toFixed(2)}
                  </p>
                  <p className="text-xs text-purple-600 mt-1">
                    {calculateTotalRevenue('year').orderCount + calculateTotalRevenue('year').bookingCount} transactions
                  </p>
                  <div className="mt-2 text-xs text-gray-500">
                    <p>Orders: {calculateTotalRevenue('year').orderCount}</p>
                    <p>Bookings: {calculateTotalRevenue('year').bookingCount}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Add Restaurant Button */}
        <div className="mb-4 sm:mb-6">
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all flex items-center justify-center space-x-3 text-base sm:text-lg font-semibold shadow-lg"
          >
            <Plus className="h-5 w-5 sm:h-6 sm:w-6" />
            <span>Add New Restaurant & Create Owner Account</span>
          </button>
        </div>

        {/* Add Place Form Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-4 sm:p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Add New Restaurant & Create Owner Account</h2>
              
              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Restaurant Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                      placeholder="Enter restaurant name"
                    />
                    <p className="text-xs text-gray-500 mt-1">Enter the official name of the restaurant</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Restaurant Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                    >
                      <option value="restaurant">Restaurant</option>
                      <option value="hotel">Hotel</option>
                      <option value="resort">Resort</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-1">Select the type of establishment</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Restaurant Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    value={formData.address}
                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                    rows={3}
                    placeholder="Enter complete restaurant address"
                  />
                  <p className="text-xs text-gray-500 mt-1">Include street address, city, and state</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Food Serving Capacity <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={formData.capacity}
                      onChange={(e) => setFormData(prev => ({ ...prev, capacity: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                      placeholder="Number of people"
                    />
                    <p className="text-xs text-gray-500 mt-1">Maximum number of people that can be served food</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Crowd Capacity <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={formData.crowdCapacity}
                      onChange={(e) => setFormData(prev => ({ ...prev, crowdCapacity: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                      placeholder="Maximum crowd capacity"
                    />
                    <p className="text-xs text-gray-500 mt-1">Total capacity for events and gatherings</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Restaurant Images
                  </label>

                  {imageUrls.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {imageUrls.map((url, idx) => (
                        <span key={idx} className="inline-flex items-center max-w-full px-2 py-1 rounded-full text-xs bg-gray-100 border">
                          <span className="truncate max-w-[220px]">{url}</span>
                          <button
                            type="button"
                            onClick={() => setImageUrls(prev => prev.filter((_, i) => i !== idx))}
                            className="ml-2 text-gray-500 hover:text-gray-700"
                            aria-label="Remove image URL"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={imageInput}
                      onChange={(e) => setImageInput(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                      placeholder="https://image.jpg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const value = imageInput.trim();
                        const isValid = /^https?:\/\/.+/i.test(value);
                        if (!isValid) {
                          toast.error('Enter a valid image URL');
                          return;
                        }
                        if (imageUrls.includes(value)) {
                          toast.error('URL already added');
                          return;
                        }
                        setImageUrls(prev => [...prev, value]);
                        setImageInput('');
                      }}
                      className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                    >
                      Add
                    </button>
                  </div>

                  <p className="text-xs text-gray-500 mt-1">Add one image URL at a time</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Operating Hours
                  </label>
                  <input
                    type="text"
                    value={formData.timings}
                    onChange={(e) => {
                      const value = e.target.value;
                      // Allow formats like 9:00 AM - 11:00 PM (12-hour)
                      const pattern = /^\s*(0?[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM)\s?-\s?(0?[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM)\s*$/i;
                      if (value === '' || pattern.test(value)) {
                        setFormData(prev => ({ ...prev, timings: value }));
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="e.g., 9:00 AM - 11:00 PM"
                  />
                  <p className="text-xs text-gray-500 mt-1">Standard operating hours (optional)</p>
                </div>

                {/* Restaurant Owner Account Creation Section */}
                <div className="border-t pt-4 mt-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Create Restaurant Owner Account</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    This will create login credentials for the restaurant owner to manage their restaurant.
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Owner Username <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.ownerUsername}
                        onChange={(e) => setFormData(prev => ({ ...prev, ownerUsername: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                        placeholder="Enter username for login"
                      />
                      <p className="text-xs text-gray-500 mt-1">This will be the login username for the restaurant owner</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Owner Password <span className="text-red-500">*</span>
                      </label>
                      <PasswordInput
                        value={formData.ownerPassword}
                        onChange={(value) => setFormData(prev => ({ ...prev, ownerPassword: value }))}
                        placeholder="Enter password for login"
                        className="text-sm"
                        required
                        minLength={6}
                      />
                      <p className="text-xs text-gray-500 mt-1">Minimum 6 characters. Owner can change this later.</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center space-x-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Creating...</span>
                      </>
                    ) : (
                      <span>Create Restaurant & Owner Account</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Place Form Modal */}
        {showEditForm && editingRestaurant && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-4 sm:p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Edit Restaurant & Owner Account</h2>
                <button onClick={closeEditForm} className="text-gray-400 hover:text-gray-600">
                  <X className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>
              </div>
              
              <form onSubmit={handleEditSubmit} className="space-y-3 sm:space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Restaurant Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                      placeholder="Enter restaurant name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Restaurant Type
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                    >
                      <option value="restaurant">Restaurant</option>
                      <option value="hotel">Hotel</option>
                      <option value="resort">Resort</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Restaurant Address
                  </label>
                  <textarea
                    required
                    value={formData.address}
                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                    rows={3}
                    placeholder="Enter complete restaurant address"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Food Serving Capacity
                    </label>
                    <input
                      type="number"
                      required
                      value={formData.capacity}
                      onChange={(e) => setFormData(prev => ({ ...prev, capacity: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                      placeholder="Number of people"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Crowd Capacity
                    </label>
                    <input
                      type="number"
                      required
                      value={formData.crowdCapacity}
                      onChange={(e) => setFormData(prev => ({ ...prev, crowdCapacity: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                      placeholder="Maximum crowd capacity"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Restaurant Images (comma separated URLs)
                    </label>
                    <input
                      type="text"
                      value={formData.images}
                      onChange={(e) => {
                        const value = e.target.value;
                        // Accept comma-separated URLs only
                        const urlPattern = /^\s*(https?:\/\/[^\s,]+)(\s*,\s*https?:\/\/[^\s,]+)*\s*$/i;
                        if (value === '' || urlPattern.test(value)) {
                          setFormData(prev => ({ ...prev, images: value }));
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                      placeholder="https://image1.jpg, https://image2.jpg"
                    />
                  </div>

                  {/* Average Price per Person input removed from Edit form */}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Operating Hours
                  </label>
                  <input
                    type="text"
                    value={formData.timings}
                    onChange={(e) => setFormData(prev => ({ ...prev, timings: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="e.g., 9:00 AM - 11:00 PM"
                  />
                </div>

                {/* Restaurant Owner Account Section */}
                <div className="border-t pt-4 mt-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Restaurant Owner Account</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Update the login credentials for the restaurant owner.
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Owner Username
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.ownerUsername}
                        onChange={(e) => setFormData(prev => ({ ...prev, ownerUsername: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                        placeholder="Username for login"
                      />
                      <p className="text-xs text-gray-500 mt-1">This will be the login username for the restaurant owner</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Owner Password
                      </label>
                      <PasswordInput
                        value={formData.ownerPassword}
                        onChange={(value) => setFormData(prev => ({ ...prev, ownerPassword: value }))}
                        placeholder="Password for login"
                        className="text-sm"
                        required
                        minLength={6}
                      />
                      <p className="text-xs text-gray-500 mt-1">Minimum 6 characters. Owner can change this later.</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={closeEditForm}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center space-x-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Updating...</span>
                      </>
                    ) : (
                      <span>Update Restaurant & Owner Account</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && deletingRestaurant && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-4 sm:p-6 w-full max-w-md">
              <div className="flex items-center mb-4">
                <div className="p-2 sm:p-3 bg-red-100 rounded-full mr-3 sm:mr-4">
                  <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">Delete Place</h3>
                  <p className="text-xs sm:text-sm text-gray-600">This action cannot be undone</p>
                </div>
              </div>
              
              <div className="mb-4 sm:mb-6">
                <p className="text-sm sm:text-base text-gray-700">
                  Are you sure you want to delete <strong>{deletingRestaurant.name}</strong>?
                </p>
                <div className="text-xs sm:text-sm text-red-600 mt-2 space-y-1">
                  <p>⚠️ This action will permanently delete:</p>
                  <ul className="list-disc list-inside ml-2 space-y-1">
                    <li>The restaurant record</li>
                    <li>All associated menu items</li>
                    <li>All associated orders and order history</li>
                    <li>All associated bookings and booking history</li>
                    <li>The restaurant owner account</li>
                  </ul>
                  <p className="font-semibold">This action cannot be undone!</p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
                <button
                  onClick={cancelDelete}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={isDeleting}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center space-x-2"
                >
                  {isDeleting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <span>Delete Restaurant</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Restaurants List */}
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-4 sm:p-6 border-b">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Partner Restaurants</h2>
          </div>
          
          <div className="p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
              {restaurants.map((restaurant) => (
                <div key={restaurant.id} className="border rounded-lg p-3 sm:p-4">
                  {restaurant.images[0] && (
                    <img
                      src={restaurant.images[0] && restaurant.images[0].trim() ? restaurant.images[0] : '/placeholder-restaurant.jpg'}
                      alt={restaurant.name}
                      className="w-full h-24 sm:h-32 object-cover rounded-lg mb-2 sm:mb-3"
                    />
                  )}
                  
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base mb-1">{restaurant.name}</h3>
                  <p className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2">{restaurant.type}</p>
                  <p className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2 line-clamp-2">{restaurant.address}</p>
                  {/* Price per person hidden as requested */}
                  
                  {/* Revenue Information */}
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="grid grid-cols-3 gap-2 text-center mb-3">
                      <div>
                        <p className="text-xs text-gray-500">Today</p>
                        <p className="text-sm font-semibold text-green-600">
                          ₹{calculateRestaurantRevenue(restaurant.id, 'today').total.toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Month</p>
                        <p className="text-sm font-semibold text-blue-600">
                          ₹{calculateRestaurantRevenue(restaurant.id, 'month').total.toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Year</p>
                        <p className="text-sm font-semibold text-purple-600">
                          ₹{calculateRestaurantRevenue(restaurant.id, 'year').total.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className={`px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full text-xs ${
                        restaurant.isOpen 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {restaurant.isOpen ? 'Open' : 'Closed'}
                      </span>
                      
                      <div className="flex space-x-1 sm:space-x-2">
                        <button 
                          onClick={() => handleRevenueDetails(restaurant)}
                          className="p-1 text-green-600 hover:text-green-800"
                          title="View revenue details"
                        >
                          <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" />
                        </button>
                        <button 
                          onClick={() => handleEdit(restaurant)}
                          className="p-1 text-blue-600 hover:text-blue-800"
                          title="Edit restaurant"
                        >
                          <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(restaurant)}
                          className="p-1 text-red-600 hover:text-red-800"
                          title="Delete restaurant"
                        >
                          <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Revenue Details Modal */}
        {showRevenueDetails && selectedRestaurant && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-4 sm:p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                    Revenue Details - {selectedRestaurant.name}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Comprehensive revenue breakdown and analytics
                  </p>
                </div>
                <button
                  onClick={() => setShowRevenueDetails(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Revenue Overview Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="text-center">
                    <p className="text-sm font-medium text-green-700 mb-1">Today's Revenue</p>
                    <p className="text-2xl font-bold text-green-600">
                      ₹{calculateRestaurantRevenue(selectedRestaurant.id, 'today').total.toFixed(2)}
                    </p>
                    <p className="text-xs text-green-600 mt-1">
                      {calculateRestaurantRevenue(selectedRestaurant.id, 'today').orderCount + 
                       calculateRestaurantRevenue(selectedRestaurant.id, 'today').bookingCount} transactions
                    </p>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="text-center">
                    <p className="text-sm font-medium text-blue-700 mb-1">Monthly Revenue</p>
                    <p className="text-2xl font-bold text-blue-600">
                      ₹{calculateRestaurantRevenue(selectedRestaurant.id, 'month').total.toFixed(2)}
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      {calculateRestaurantRevenue(selectedRestaurant.id, 'month').orderCount + 
                       calculateRestaurantRevenue(selectedRestaurant.id, 'month').bookingCount} transactions
                    </p>
                  </div>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <div className="text-center">
                    <p className="text-sm font-medium text-purple-700 mb-1">Annual Revenue</p>
                    <p className="text-2xl font-bold text-purple-600">
                      ₹{calculateRestaurantRevenue(selectedRestaurant.id, 'year').total.toFixed(2)}
                    </p>
                    <p className="text-xs text-purple-600 mt-1">
                      {calculateRestaurantRevenue(selectedRestaurant.id, 'year').orderCount + 
                       calculateRestaurantRevenue(selectedRestaurant.id, 'year').bookingCount} transactions
                    </p>
                  </div>
                </div>
              </div>

              {/* Revenue Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Orders Revenue */}
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <DollarSign className="h-5 w-5 text-blue-600 mr-2" />
                    Orders Revenue
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Today:</span>
                      <span className="font-semibold text-green-600">
                        ₹{calculateRestaurantRevenue(selectedRestaurant.id, 'today').orders.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">This Month:</span>
                      <span className="font-semibold text-blue-600">
                        ₹{calculateRestaurantRevenue(selectedRestaurant.id, 'month').orders.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">This Year:</span>
                      <span className="font-semibold text-purple-600">
                        ₹{calculateRestaurantRevenue(selectedRestaurant.id, 'year').orders.toFixed(2)}
                      </span>
                    </div>
                    <div className="pt-2 border-t border-gray-200">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">Total Orders:</span>
                        <span className="font-semibold text-gray-900">
                          {calculateRestaurantRevenue(selectedRestaurant.id, 'year').orderCount}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bookings Revenue */}
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Calendar className="h-5 w-5 text-purple-600 mr-2" />
                    Bookings Revenue
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Today:</span>
                      <span className="font-semibold text-green-600">
                        ₹{calculateRestaurantRevenue(selectedRestaurant.id, 'today').bookings.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">This Month:</span>
                      <span className="font-semibold text-blue-600">
                        ₹{calculateRestaurantRevenue(selectedRestaurant.id, 'month').bookings.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">This Year:</span>
                      <span className="font-semibold text-purple-600">
                        ₹{calculateRestaurantRevenue(selectedRestaurant.id, 'year').bookings.toFixed(2)}
                      </span>
                    </div>
                    <div className="pt-2 border-t border-gray-200">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">Total Bookings:</span>
                        <span className="font-semibold text-gray-900">
                          {calculateRestaurantRevenue(selectedRestaurant.id, 'year').bookingCount}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Restaurant Information */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Restaurant Information</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Type: <span className="font-medium text-gray-900">{selectedRestaurant.type}</span></p>
                    <p className="text-gray-600">Status: <span className={`font-medium ${selectedRestaurant.isOpen ? 'text-green-600' : 'text-red-600'}`}>
                      {selectedRestaurant.isOpen ? 'Open' : 'Closed'}
                    </span></p>
                    <p className="text-gray-600">Food Capacity: <span className="font-medium text-gray-900">{selectedRestaurant.capacity} people</span></p>
                  </div>
                  <div>
                    <p className="text-gray-600">Crowd Capacity: <span className="font-medium text-gray-900">{selectedRestaurant.crowdCapacity} people</span></p>
                    {/* Avg price hidden as requested */}
                    <p className="text-gray-600">Timings: <span className="font-medium text-gray-900">{selectedRestaurant.timings}</span></p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-6 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setShowRevenueDetails(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;