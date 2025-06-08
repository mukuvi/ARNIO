import React, { useState } from 'react';
import { useSubscription } from '../context/SubscriptionContext';
import { motion } from 'framer-motion';
import { Check, Star, Zap, Infinity } from 'lucide-react';

export default function Pro() {
  const { plans, upgradeSubscription, currentPlan, loading } = useSubscription();
  const [billingCycle, setBillingCycle] = useState('monthly');

  const handleUpgrade = async (planName) => {
    await upgradeSubscription(planName);
  };

  const planIcons = {
    basic: Star,
    pro: Zap,
    ultraPro: Infinity
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="relative max-w-7xl mx-auto px-4 py-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-5xl font-bold mb-6">
              Unlock Your Learning Potential
            </h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Transform your reading experience with AI-powered insights, personalized recommendations, 
              and advanced analytics. Choose the plan that fits your learning journey.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Billing Toggle */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex justify-center mb-12">
          <div className="bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-md transition-colors ${
                billingCycle === 'monthly'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-2 rounded-md transition-colors ${
                billingCycle === 'yearly'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600'
              }`}
            >
              Yearly
              <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {Object.entries(plans).filter(([key]) => key !== 'free').map(([key, plan]) => {
            const Icon = planIcons[key];
            const isPopular = key === 'pro';
            const isCurrent = currentPlan.name === plan.name;
            
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Object.keys(plans).indexOf(key) * 0.1 }}
                className={`relative bg-white rounded-2xl shadow-lg overflow-hidden ${
                  isPopular ? 'ring-2 ring-purple-500 scale-105' : ''
                } ${isCurrent ? 'ring-2 ring-green-500' : ''}`}
              >
                {isPopular && (
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-center py-2 text-sm font-medium">
                    Most Popular
                  </div>
                )}
                
                {isCurrent && (
                  <div className="absolute top-0 left-0 right-0 bg-green-500 text-white text-center py-2 text-sm font-medium">
                    Current Plan
                  </div>
                )}

                <div className={`p-8 ${isPopular || isCurrent ? 'pt-16' : ''}`}>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-baseline">
                      <span className="text-4xl font-bold text-gray-900">
                        KSh {billingCycle === 'yearly' ? Math.floor(plan.price * 0.8) : plan.price}
                      </span>
                      <span className="text-gray-600 ml-2">
                        /{billingCycle === 'yearly' ? 'year' : 'month'}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mt-1">
                      ${billingCycle === 'yearly' ? (plan.priceUSD * 0.8).toFixed(2) : plan.priceUSD} USD
                    </p>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handleUpgrade(key)}
                    disabled={loading || isCurrent}
                    className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
                      isCurrent
                        ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                        : isPopular
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Processing...</span>
                      </div>
                    ) : isCurrent ? (
                      'Current Plan'
                    ) : (
                      `Upgrade to ${plan.name}`
                    )}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}