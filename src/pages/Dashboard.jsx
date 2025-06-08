import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useSubscription } from "../context/SubscriptionContext";
import { useDocuments } from "../context/DocumentContext";
import { motion } from "framer-motion";
import { 
  Upload, 
  Book, 
  TrendingUp, 
  Clock, 
  Target, 
  FileText,
  Trash2,
  BarChart3
} from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  const { currentPlan } = useSubscription();
  const { documents, uploadDocument, deleteDocument } = useDocuments();
  const [activeTab, setActiveTab] = useState("overview");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    const success = await uploadDocument(file);
    
    clearInterval(progressInterval);
    setUploadProgress(100);
    
    setTimeout(() => {
      setIsUploading(false);
      setUploadProgress(0);
    }, 1000);
  };

  const handleDeleteDocument = async (docId) => {
    await deleteDocument(docId);
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'documents', label: 'Documents', icon: FileText }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-gray-600">
            Continue your learning journey with personalized insights and recommendations.
          </p>
        </motion.div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-2xl shadow-lg"
          >
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Book className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{documents.length}</p>
                <p className="text-gray-600 text-sm">Documents</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 rounded-2xl shadow-lg"
          >
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">7</p>
                <p className="text-gray-600 text-sm">Day Streak</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white p-6 rounded-2xl shadow-lg"
          >
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">12h</p>
                <p className="text-gray-600 text-sm">Reading Time</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white p-6 rounded-2xl shadow-lg"
          >
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Target className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">3</p>
                <p className="text-gray-600 text-sm">Books Completed</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-white p-1 rounded-lg mb-8 w-fit shadow-lg">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-100 text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              {/* Reading Progress */}
              <div className="bg-white p-6 rounded-2xl shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Reading Progress</h3>
                {documents.length > 0 ? (
                  <div className="space-y-4">
                    {documents.slice(0, 3).map((doc) => (
                      <div key={doc.id} className="flex items-center space-x-4">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{doc.name}</p>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${doc.readingProgress}%` }}
                            ></div>
                          </div>
                        </div>
                        <span className="text-sm text-gray-600">{doc.readingProgress}%</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">No documents uploaded yet. Start by uploading your first document!</p>
                )}
              </div>

              {/* Plan Information */}
              <div className="bg-white p-6 rounded-2xl shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Plan</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Plan</span>
                    <span className="font-medium">{currentPlan.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Documents</span>
                    <span className="font-medium">
                      {documents.length}/{currentPlan.limits.documents === Infinity ? '∞' : currentPlan.limits.documents}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Storage</span>
                    <span className="font-medium">
                      {formatBytes(documents.reduce((total, doc) => total + doc.size, 0))} / 
                      {currentPlan.limits.storage === Infinity ? ' Unlimited' : formatBytes(currentPlan.limits.storage)}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'documents' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              {/* Upload Section */}
              <div className="bg-white p-6 rounded-2xl shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Documents</h3>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">
                    Drag and drop your documents here, or click to browse
                  </p>
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    accept=".pdf,.doc,.docx,.txt"
                    className="hidden"
                    id="file-upload"
                    disabled={isUploading}
                  />
                  <label
                    htmlFor="file-upload"
                    className={`inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer ${
                      isUploading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {isUploading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Uploading... {uploadProgress}%
                      </>
                    ) : (
                      'Choose Files'
                    )}
                  </label>
                  <p className="text-sm text-gray-500 mt-2">
                    Supported formats: PDF, DOC, DOCX, TXT (Max: {currentPlan.limits.documents} documents)
                  </p>
                </div>
              </div>

              {/* Documents List */}
              <div className="bg-white p-6 rounded-2xl shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Your Documents ({documents.length}/{currentPlan.limits.documents === Infinity ? '∞' : currentPlan.limits.documents})
                </h3>
                {documents.length > 0 ? (
                  <div className="space-y-4">
                    {documents.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{doc.name}</h4>
                          <p className="text-sm text-gray-600">
                            {formatBytes(doc.size)} • Uploaded {new Date(doc.uploadDate).toLocaleDateString()}
                          </p>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                            <div
                              className="bg-green-600 h-2 rounded-full"
                              style={{ width: `${doc.readingProgress}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                            <Book size={16} />
                          </button>
                          {currentPlan.limits.canDeleteDocuments && (
                            <button
                              onClick={() => handleDeleteDocument(doc.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600 text-center py-8">
                    No documents uploaded yet. Upload your first document to get started!
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}