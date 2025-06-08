import React from 'react';
import { motion } from 'framer-motion';
import { Code, Book, Search } from 'lucide-react';

export default function API() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Code className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">ARN.IO API</h1>
              <p className="text-gray-600">Access our comprehensive book database</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to ARN.IO API</h2>
            <p className="text-gray-600 mb-6">
              Our RESTful API provides access to a comprehensive database of books, including metadata, 
              ratings, and recommendations. Perfect for developers building educational applications.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-blue-50 rounded-lg">
                <Book className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">10,000+ Books</h3>
                <p className="text-gray-600">Comprehensive database with detailed metadata</p>
              </div>
              <div className="text-center p-6 bg-green-50 rounded-lg">
                <Search className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Advanced Search</h3>
                <p className="text-gray-600">Filter by genre, author, rating, and more</p>
              </div>
              <div className="text-center p-6 bg-purple-50 rounded-lg">
                <Code className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Free Access</h3>
                <p className="text-gray-600">No API key required for basic endpoints</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Start</h3>
            <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
              <code className="text-green-400 text-sm">
                {`curl -X GET "https://arn.io/api/v1/books" \\
  -H "Accept: application/json"`}
              </code>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}