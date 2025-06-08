import React, { useState, useEffect } from 'react';
import { BookAPI } from '../services/apiService';
import { motion } from 'framer-motion';
import { Code, Book, Search, Filter, Download, Key } from 'lucide-react';

export default function API() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [genres, setGenres] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadGenres();
    loadBooks();
  }, []);

  const loadGenres = async () => {
    try {
      const genreList = await BookAPI.getGenres();
      setGenres(genreList);
    } catch (error) {
      console.error('Error loading genres:', error);
    }
  };

  const loadBooks = async () => {
    try {
      setLoading(true);
      const response = await BookAPI.getAllBooks(1, 10, selectedGenre);
      setBooks(response.books);
    } catch (error) {
      console.error('Error loading books:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadBooks();
      return;
    }

    try {
      setLoading(true);
      const response = await BookAPI.searchBooks(searchQuery, { genre: selectedGenre });
      setBooks(response.books);
    } catch (error) {
      console.error('Error searching books:', error);
    } finally {
      setLoading(false);
    }
  };

  const codeExamples = {
    getAllBooks: `// Get all books with pagination
fetch('/api/v1/books?page=1&limit=20')
  .then(response => response.json())
  .then(data => console.log(data));

// Response
{
  "books": [...],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalBooks": 100,
    "hasNext": true,
    "hasPrev": false
  }
}`,
    searchBooks: `// Search books by title, author, or tags
fetch('/api/v1/books/search?q=psychology&genre=Education')
  .then(response => response.json())
  .then(data => console.log(data));

// Response
{
  "books": [...],
  "query": "psychology",
  "filters": { "genre": "Education" },
  "totalResults": 15
}`,
    getBook: `// Get a specific book by ID
fetch('/api/v1/books/1')
  .then(response => response.json())
  .then(book => console.log(book));

// Response
{
  "id": 1,
  "title": "The Psychology of Learning",
  "author": "Dr. Sarah Johnson",
  "isbn": "978-0123456789",
  "genre": "Education",
  "publishedYear": 2023,
  "pages": 320,
  "rating": 4.8,
  "description": "...",
  "cover": "...",
  "tags": ["psychology", "learning", "education"],
  "language": "English"
}`
  };

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
        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-8 w-fit">
          {[
            { id: 'overview', label: 'Overview', icon: Book },
            { id: 'explorer', label: 'API Explorer', icon: Search },
            { id: 'docs', label: 'Documentation', icon: Code }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to ARN.IO API</h2>
              <p className="text-gray-600 mb-6">
                Our RESTful API provides access to a comprehensive database of books, including metadata, 
                ratings, and recommendations. Perfect for developers building educational applications, 
                reading platforms, or research tools.
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
                  <Key className="w-12 h-12 text-purple-600 mx-auto mb-4" />
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Rate Limits</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• 1000 requests per hour (free)</li>
                  <li>• 10,000 requests per hour (Pro)</li>
                  <li>• Unlimited (Ultra Pro)</li>
                </ul>
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Response Format</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• JSON responses</li>
                  <li>• UTF-8 encoding</li>
                  <li>• Standard HTTP status codes</li>
                </ul>
              </div>
            </div>
          </motion.div>
        )}

        {/* API Explorer Tab */}
        {activeTab === 'explorer' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">API Explorer</h2>
              
              {/* Search Controls */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Search books by title, author, or tags..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <select
                  value={selectedGenre}
                  onChange={(e) => setSelectedGenre(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Genres</option>
                  {genres.map((genre) => (
                    <option key={genre} value={genre}>{genre}</option>
                  ))}
                </select>
                <button
                  onClick={handleSearch}
                  disabled={loading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Searching...' : 'Search'}
                </button>
              </div>

              {/* Results */}
              <div className="space-y-4">
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-gray-600 mt-2">Loading books...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {books.map((book) => (
                      <div key={book.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <img
                          src={book.cover}
                          alt={book.title}
                          className="w-full h-32 object-cover rounded-lg mb-3"
                        />
                        <h3 className="font-semibold text-gray-900 mb-1">{book.title}</h3>
                        <p className="text-gray-600 text-sm mb-2">{book.author}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                            {book.genre}
                          </span>
                          <span className="text-sm text-gray-600">⭐ {book.rating}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Documentation Tab */}
        {activeTab === 'docs' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">API Documentation</h2>
              
              <div className="space-y-8">
                {/* Get All Books */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">GET /api/v1/books</h3>
                  <p className="text-gray-600 mb-4">Retrieve a paginated list of all books.</p>
                  <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                    <pre className="text-green-400 text-sm">{codeExamples.getAllBooks}</pre>
                  </div>
                </div>

                {/* Search Books */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">GET /api/v1/books/search</h3>
                  <p className="text-gray-600 mb-4">Search books by title, author, or tags with optional filters.</p>
                  <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                    <pre className="text-green-400 text-sm">{codeExamples.searchBooks}</pre>
                  </div>
                </div>

                {/* Get Book by ID */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">GET /api/v1/books/:id</h3>
                  <p className="text-gray-600 mb-4">Get detailed information about a specific book.</p>
                  <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                    <pre className="text-green-400 text-sm">{codeExamples.getBook}</pre>
                  </div>
                </div>

                {/* Parameters */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Query Parameters</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border border-gray-200 rounded-lg">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">Parameter</th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">Type</th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">Description</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        <tr>
                          <td className="px-4 py-2 text-sm text-gray-900">page</td>
                          <td className="px-4 py-2 text-sm text-gray-600">integer</td>
                          <td className="px-4 py-2 text-sm text-gray-600">Page number (default: 1)</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 text-sm text-gray-900">limit</td>
                          <td className="px-4 py-2 text-sm text-gray-600">integer</td>
                          <td className="px-4 py-2 text-sm text-gray-600">Items per page (default: 20, max: 100)</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 text-sm text-gray-900">genre</td>
                          <td className="px-4 py-2 text-sm text-gray-600">string</td>
                          <td className="px-4 py-2 text-sm text-gray-600">Filter by genre</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 text-sm text-gray-900">q</td>
                          <td className="px-4 py-2 text-sm text-gray-600">string</td>
                          <td className="px-4 py-2 text-sm text-gray-600">Search query</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}