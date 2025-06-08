import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useSubscription } from "../context/SubscriptionContext";
import { useDocuments } from "../context/DocumentContext";
import { AIService } from "../services/aiService";
import { motion } from "framer-motion";
import { 
  Upload, 
  Book, 
  TrendingUp, 
  Clock, 
  Target, 
  Music, 
  Brain,
  FileText,
  Trash2,
  Play,
  Pause,
  BarChart3
} from "lucide-react";
import toast from "react-hot-toast";

export default function Dashboard() {
  const { user } = useAuth();
  const { currentPlan } = useSubscription();
  const { documents, uploadDocument, deleteDocument, updateReadingProgress } = useDocuments();
  const [activeTab, setActiveTab] = useState("overview");
  const [bookRecommendations, setBookRecommendations] = useState([]);
  const [musicRecommendations, setMusicRecommendations] = useState([]);
  const [readingInsights, setReadingInsights] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    loadRecommendations();
    loadInsights();
  }, [user?.subscription]);

  const loadRecommendations = async () => {
    try {
      if (currentPlan.limits.aiRecommendations > 0) {
        const books = await AIService.getBookRecommendations({}, user?.subscription);
        setBookRecommendations(books);
      }

      if (['pro', 'ultraPro'].includes(user?.subscription)) {
        const music = await AIService.getMusicRecommendations(user?.subscription);
        setMusicRecommendations(music);
      }
    } catch (error) {
      console.error('Error loading recommendations:', error);
    }
  };

  const loadInsights = async () => {
    try {
      const insights = await AIService.getReadingInsights(user?.usage || {}, user?.subscription);
      setReadingInsights(insights);
    } catch (error) {
      console.error('Error loading insights:', error);
    }
  };

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

    if (success) {
      loadInsights(); // Refresh insights after upload
    }
  };

  const handleDeleteDocument = async (docId) => {
    const success = await deleteDocument(docId);
    if (success) {
      loadInsights(); // Refresh insights after deletion
    }
  };

  const playMusic = (track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    toast.success(`Now playing: ${track.title}`);
  };

  const pauseMusic = () => {
    setIsPlaying(false);
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
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'recommendations', label: 'AI Recommendations', icon: Brain },
    { id: 'music', label: 'Focus Music', icon: Music }
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
                <p className="text-2xl font-bold text-gray-900">
                  {readingInsights?.patterns?.readingStreak || 0}
                </p>
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
                <p className="text-2xl font-bold text-gray-900">
                  {Math.floor((readingInsights?.basicStats?.totalTime || 0) / 60)}h
                </p>
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
                <p className="text-2xl font-bold text-gray-900">
                  {readingInsights?.basicStats?.completedBooks || 0}
                </p>
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

              {/* AI Insights */}
              <div className="bg-white p-6 rounded-2xl shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Insights</h3>
                {readingInsights ? (
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Reading Speed</span>
                      <span className="font-medium">{readingInsights.basicStats.averageSpeed} WPM</span>
                    </div>
                    {readingInsights.patterns && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Best Reading Time</span>
                          <span className="font-medium">{readingInsights.patterns.bestReadingTime}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Preferred Genres</span>
                          <span className="font-medium">{readingInsights.patterns.preferredGenres.join(', ')}</span>
                        </div>
                      </>
                    )}
                    {readingInsights.advanced && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Comprehension Score</span>
                        <span className="font-medium">{readingInsights.advanced.comprehensionScore}%</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-600">Start reading to get personalized insights!</p>
                )}
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

          {activeTab === 'recommendations' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white p-6 rounded-2xl shadow-lg"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Book Recommendations</h3>
              {currentPlan.limits.aiRecommendations > 0 ? (
                bookRecommendations.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {bookRecommendations.map((book) => (
                      <div key={book.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <img
                          src={book.cover}
                          alt={book.title}
                          className="w-full h-48 object-cover rounded-lg mb-4"
                        />
                        <h4 className="font-semibold text-gray-900 mb-2">{book.title}</h4>
                        <p className="text-gray-600 text-sm mb-2">{book.author}</p>
                        <p className="text-gray-700 text-sm mb-3">{book.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                            {book.genre}
                          </span>
                          <div className="flex items-center space-x-1">
                            <span className="text-sm text-gray-600">⭐ {book.rating}</span>
                            <span className="text-xs text-green-600">
                              {Math.round(book.aiScore * 100)}% match
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">Loading recommendations...</p>
                )
              ) : (
                <div className="text-center py-8">
                  <Brain className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">
                    AI recommendations are available with paid plans
                  </p>
                  <button
                    onClick={() => window.location.href = '/pro'}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Upgrade to Pro
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'music' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white p-6 rounded-2xl shadow-lg"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Focus Music</h3>
              {['pro', 'ultraPro'].includes(user?.subscription) ? (
                musicRecommendations.length > 0 ? (
                  <div className="space-y-4">
                    {currentTrack && (
                      <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg mb-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900">{currentTrack.title}</h4>
                            <p className="text-gray-600 text-sm">{currentTrack.artist}</p>
                          </div>
                          <button
                            onClick={isPlaying ? pauseMusic : () => playMusic(currentTrack)}
                            className="p-3 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
                          >
                            {isPlaying ? <Pause className="w-6 h-6 text-purple-600" /> : <Play className="w-6 h-6 text-purple-600" />}
                          </button>
                        </div>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {musicRecommendations.map((track) => (
                        <div key={track.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{track.title}</h4>
                            <p className="text-gray-600 text-sm">{track.artist} • {track.duration}</p>
                            <p className="text-gray-500 text-xs">{track.description}</p>
                          </div>
                          <button
                            onClick={() => playMusic(track)}
                            className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                          >
                            <Play size={20} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-600">Loading music recommendations...</p>
                )
              ) : (
                <div className="text-center py-8">
                  <Music className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">
                    Focus music is available with Pro and Ultra Pro plans
                  </p>
                  <button
                    onClick={() => window.location.href = '/pro'}
                    className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Upgrade to Pro
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}