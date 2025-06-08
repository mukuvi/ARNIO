// Public API for book data
export class BookAPI {
  static baseURL = '/api/v1';

  static async getAllBooks(page = 1, limit = 20, genre = null) {
    // Simulate API response
    await new Promise(resolve => setTimeout(resolve, 500));

    const books = [
      {
        id: 1,
        title: "The Psychology of Learning",
        author: "Dr. Sarah Johnson",
        isbn: "978-0123456789",
        genre: "Education",
        publishedYear: 2023,
        pages: 320,
        rating: 4.8,
        description: "A comprehensive guide to understanding how we learn and retain information.",
        cover: "https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg",
        tags: ["psychology", "learning", "education"],
        language: "English"
      },
      {
        id: 2,
        title: "Digital Minimalism",
        author: "Cal Newport",
        isbn: "978-0987654321",
        genre: "Self-Help",
        publishedYear: 2019,
        pages: 280,
        rating: 4.6,
        description: "A philosophy for living better with less technology.",
        cover: "https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg",
        tags: ["technology", "minimalism", "productivity"],
        language: "English"
      },
      {
        id: 3,
        title: "The Art of Memory",
        author: "Frances Yates",
        isbn: "978-0456789123",
        genre: "History",
        publishedYear: 1966,
        pages: 400,
        rating: 4.7,
        description: "An exploration of memory techniques throughout history.",
        cover: "https://images.pexels.com/photos/1370295/pexels-photo-1370295.jpeg",
        tags: ["memory", "history", "techniques"],
        language: "English"
      }
    ];

    // Filter by genre if specified
    const filteredBooks = genre 
      ? books.filter(book => book.genre.toLowerCase() === genre.toLowerCase())
      : books;

    // Simulate pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedBooks = filteredBooks.slice(startIndex, endIndex);

    return {
      books: paginatedBooks,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(filteredBooks.length / limit),
        totalBooks: filteredBooks.length,
        hasNext: endIndex < filteredBooks.length,
        hasPrev: page > 1
      }
    };
  }

  static async getBookById(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const books = await this.getAllBooks();
    const book = books.books.find(b => b.id === parseInt(id));
    
    if (!book) {
      throw new Error('Book not found');
    }

    return book;
  }

  static async searchBooks(query, filters = {}) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const { books } = await this.getAllBooks();
    
    let filteredBooks = books.filter(book => 
      book.title.toLowerCase().includes(query.toLowerCase()) ||
      book.author.toLowerCase().includes(query.toLowerCase()) ||
      book.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    );

    // Apply additional filters
    if (filters.genre) {
      filteredBooks = filteredBooks.filter(book => 
        book.genre.toLowerCase() === filters.genre.toLowerCase()
      );
    }

    if (filters.minRating) {
      filteredBooks = filteredBooks.filter(book => 
        book.rating >= filters.minRating
      );
    }

    return {
      books: filteredBooks,
      query,
      filters,
      totalResults: filteredBooks.length
    };
  }

  static async getGenres() {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return [
      "Education",
      "Self-Help", 
      "History",
      "Psychology",
      "Science",
      "Technology",
      "Fiction",
      "Biography",
      "Philosophy",
      "Business"
    ];
  }
}