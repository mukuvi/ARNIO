import { subscriptionPlans } from '../context/SubscriptionContext';

// Mock AI service for recommendations
export class AIService {
  static async getBookRecommendations(userPreferences, subscription = 'free') {
    const plan = subscriptionPlans[subscription];
    
    if (plan.limits.aiRecommendations === 0) {
      throw new Error('AI recommendations require a paid subscription');
    }

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const allBooks = [
      {
        id: 1,
        title: "The Psychology of Learning",
        author: "Dr. Sarah Johnson",
        genre: "Education",
        rating: 4.8,
        description: "A comprehensive guide to understanding how we learn and retain information.",
        cover: "https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg",
        aiScore: 0.95
      },
      {
        id: 2,
        title: "Digital Minimalism",
        author: "Cal Newport",
        genre: "Self-Help",
        rating: 4.6,
        description: "A philosophy for living better with less technology.",
        cover: "https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg",
        aiScore: 0.88
      },
      {
        id: 3,
        title: "The Art of Memory",
        author: "Frances Yates",
        genre: "History",
        rating: 4.7,
        description: "An exploration of memory techniques throughout history.",
        cover: "https://images.pexels.com/photos/1370295/pexels-photo-1370295.jpeg",
        aiScore: 0.92
      },
      {
        id: 4,
        title: "Mindset: The New Psychology of Success",
        author: "Carol S. Dweck",
        genre: "Psychology",
        rating: 4.9,
        description: "How a simple idea about the brain can help you learn and improve.",
        cover: "https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg",
        aiScore: 0.96
      },
      {
        id: 5,
        title: "The Feynman Technique",
        author: "Richard Feynman",
        genre: "Science",
        rating: 4.8,
        description: "Learn anything faster with this simple technique.",
        cover: "https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg",
        aiScore: 0.94
      }
    ];

    // Return limited recommendations based on subscription
    const limit = Math.min(plan.limits.aiRecommendations, allBooks.length);
    return allBooks.slice(0, limit);
  }

  static async getMusicRecommendations(subscription = 'free') {
    const plan = subscriptionPlans[subscription];
    
    if (!['pro', 'ultraPro'].includes(subscription)) {
      throw new Error('Music recommendations require Pro or Ultra Pro subscription');
    }

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));

    const musicTracks = [
      {
        id: 1,
        title: "Forest Rain",
        artist: "Nature Sounds",
        duration: "60:00",
        type: "ambient",
        description: "Gentle rain sounds for deep focus"
      },
      {
        id: 2,
        title: "Classical Focus",
        artist: "Various Artists",
        duration: "45:30",
        type: "classical",
        description: "Baroque music for enhanced concentration"
      },
      {
        id: 3,
        title: "Binaural Beats - Alpha",
        artist: "BrainWave",
        duration: "30:00",
        type: "binaural",
        description: "Alpha waves for relaxed alertness"
      },
      {
        id: 4,
        title: "Cafe Ambience",
        artist: "Urban Sounds",
        duration: "120:00",
        type: "ambient",
        description: "Coffee shop atmosphere for productivity"
      }
    ];

    return subscription === 'ultraPro' ? musicTracks : musicTracks.slice(0, 2);
  }

  static async getReadingInsights(readingData, subscription = 'free') {
    const plan = subscriptionPlans[subscription];
    
    if (plan.limits.aiRecommendations === 0) {
      return {
        basicStats: {
          totalTime: readingData.totalTime || 0,
          averageSpeed: readingData.averageSpeed || 0,
          completedBooks: readingData.completedBooks || 0
        }
      };
    }

    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 1200));

    const insights = {
      basicStats: {
        totalTime: readingData.totalTime || 0,
        averageSpeed: readingData.averageSpeed || 250, // words per minute
        completedBooks: readingData.completedBooks || 0
      },
      patterns: {
        bestReadingTime: "Morning (9-11 AM)",
        preferredGenres: ["Education", "Self-Help", "Science"],
        readingStreak: 7
      }
    };

    if (['pro', 'ultraPro'].includes(subscription)) {
      insights.advanced = {
        comprehensionScore: 85,
        focusLevel: "High",
        recommendedBreaks: "Every 45 minutes",
        learningStyle: "Visual learner"
      };
    }

    if (subscription === 'ultraPro') {
      insights.predictions = {
        nextBookCompletion: "3 days",
        yearlyGoalProgress: "67%",
        suggestedReadingGoal: "24 books this year"
      };
    }

    return insights;
  }
}