import React, { createContext, useContext, useState } from 'react';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const SubscriptionContext = createContext();

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};

export const subscriptionPlans = {
  free: {
    name: 'Free',
    price: 0,
    priceUSD: 0,
    features: [
      'Upload up to 3 documents',
      'Basic reading tracking',
      'Limited progress analytics',
      '1GB storage'
    ],
    limits: {
      documents: 3,
      storage: 1 * 1024 * 1024 * 1024, // 1GB
      aiRecommendations: 0,
      canDeleteDocuments: false
    }
  },
  basic: {
    name: 'Basic',
    price: 500,
    priceUSD: 3.85,
    features: [
      'Upload up to 15 documents',
      'Basic reading analytics',
      'Standard book recommendations',
      'Basic progress tracking',
      '5GB storage',
      'Email support'
    ],
    limits: {
      documents: 15,
      storage: 5 * 1024 * 1024 * 1024, // 5GB
      aiRecommendations: 5,
      canDeleteDocuments: false
    }
  },
  pro: {
    name: 'Pro',
    price: 850,
    priceUSD: 6.55,
    features: [
      'Upload up to 50 documents',
      'Advanced AI analytics',
      'Premium book recommendations',
      'Ambient music suggestions',
      'Advanced progress tracking',
      'Document deletion',
      'Priority support',
      '25GB storage'
    ],
    limits: {
      documents: 50,
      storage: 25 * 1024 * 1024 * 1024, // 25GB
      aiRecommendations: 25,
      canDeleteDocuments: true
    }
  },
  ultraPro: {
    name: 'Ultra Pro',
    price: 1200,
    priceUSD: 9.25,
    features: [
      'Unlimited document uploads',
      'Advanced AI insights & predictions',
      'Personalized learning paths',
      'Premium music library',
      'Real-time collaboration',
      'Document deletion & management',
      'API access',
      'Unlimited storage',
      '24/7 priority support'
    ],
    limits: {
      documents: Infinity,
      storage: Infinity,
      aiRecommendations: Infinity,
      canDeleteDocuments: true
    }
  }
};

export const SubscriptionProvider = ({ children }) => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);

  const getCurrentPlan = () => {
    return subscriptionPlans[user?.subscription || 'free'];
  };

  const canUpgrade = (feature) => {
    const currentPlan = getCurrentPlan();
    return currentPlan.limits[feature];
  };

  const upgradeSubscription = async (planName) => {
    try {
      setLoading(true);
      
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      updateUser({ subscription: planName });
      toast.success(`Successfully upgraded to ${subscriptionPlans[planName].name}!`);
      
      return true;
    } catch (error) {
      toast.error('Payment failed. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const cancelSubscription = async () => {
    try {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      updateUser({ subscription: 'free' });
      toast.success('Subscription cancelled successfully');
      
      return true;
    } catch (error) {
      toast.error('Failed to cancel subscription');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    currentPlan: getCurrentPlan(),
    plans: subscriptionPlans,
    loading,
    canUpgrade,
    upgradeSubscription,
    cancelSubscription
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};