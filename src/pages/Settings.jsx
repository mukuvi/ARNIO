import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSubscription } from '../context/SubscriptionContext';
import { motion } from 'framer-motion';
import { User, Bell, CreditCard, Shield, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Settings() {
  const { user, updateUser, deleteAccount } = useAuth();
  const { currentPlan, cancelSubscription } = useSubscription();
  const [activeTab, setActiveTab] = useState('profile');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    notifications: user?.settings?.notifications || true,
    language: user?.settings?.language || 'en'
  });

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    updateUser({
      name: formData.name,
      email: formData.email,
      settings: {
        notifications: formData.notifications,
        language: formData.language
      }
    });
    toast.success('Profile updated successfully');
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteAccount();
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error('Delete account error:', error);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'subscription', label: 'Subscription', icon: CreditCard },
    { id: 'security', label: 'Security', icon: Shield }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          <div className="flex flex-col lg:flex-row">
            {/* Sidebar */}
            <div className="lg:w-1/4 bg-gray-50 p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Settings</h2>
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                        activeTab === tab.id
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <Icon size={20} />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Content */}
            <div className="lg:w-3/4 p-6">
              {activeTab === 'profile' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  <h3 className="text-xl font-semibold text-gray-800">Profile Information</h3>
                  
                  <form onSubmit={handleUpdateProfile} className="space-y-4">
                    <div className="flex items-center space-x-6 mb-6">
                      <img
                        src={user?.profilePic}
                        alt="Profile"
                        className="w-20 h-20 rounded-full object-cover"
                      />
                      <button
                        type="button"
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Change Photo
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Save Changes
                    </button>
                  </form>
                </motion.div>
              )}

              {activeTab === 'subscription' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  <h3 className="text-xl font-semibold text-gray-800">Subscription Management</h3>
                  
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-800">Current Plan</h4>
                        <p className="text-2xl font-bold text-blue-600">{currentPlan.name}</p>
                        {currentPlan.price > 0 && (
                          <p className="text-gray-600">
                            KSh {currentPlan.price} / month (${currentPlan.priceUSD} USD)
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-800">Plan Features</h4>
                    <ul className="space-y-2">
                      {currentPlan.features.map((feature, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex space-x-4">
                    <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      Upgrade Plan
                    </button>
                    {currentPlan.price > 0 && (
                      <button
                        onClick={cancelSubscription}
                        className="px-6 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        Cancel Subscription
                      </button>
                    )}
                  </div>
                </motion.div>
              )}

              {activeTab === 'security' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  <h3 className="text-xl font-semibold text-gray-800">Security Settings</h3>
                  
                  <div className="border-t pt-6">
                    <h4 className="font-medium text-red-600 mb-4">Danger Zone</h4>
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      className="flex items-center space-x-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                    >
                      <Trash2 size={16} />
                      <span>Delete Account</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Delete Account Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-6 rounded-lg max-w-md w-full mx-4"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Delete Account</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete your account? This action cannot be undone.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete Account
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}