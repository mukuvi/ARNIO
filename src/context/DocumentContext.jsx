import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useSubscription } from './SubscriptionContext';
import toast from 'react-hot-toast';

const DocumentContext = createContext();

export const useDocuments = () => {
  const context = useContext(DocumentContext);
  if (!context) {
    throw new Error('useDocuments must be used within a DocumentProvider');
  }
  return context;
};

export const DocumentProvider = ({ children }) => {
  const { user, updateUser } = useAuth();
  const { currentPlan } = useSubscription();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadDocuments();
    }
  }, [user]);

  const loadDocuments = () => {
    const storedDocs = localStorage.getItem(`documents_${user?.id}`);
    if (storedDocs) {
      try {
        setDocuments(JSON.parse(storedDocs));
      } catch (error) {
        console.error('Error loading documents:', error);
      }
    }
  };

  const saveDocuments = (docs) => {
    if (user) {
      localStorage.setItem(`documents_${user.id}`, JSON.stringify(docs));
      setDocuments(docs);
    }
  };

  const uploadDocument = async (file) => {
    try {
      setLoading(true);

      // Check limits
      if (documents.length >= currentPlan.limits.documents) {
        toast.error(`Document limit reached. Upgrade to upload more documents.`);
        return false;
      }

      // Simulate file upload
      await new Promise(resolve => setTimeout(resolve, 1500));

      const newDocument = {
        id: Date.now().toString(),
        name: file.name,
        size: file.size,
        type: file.type,
        uploadDate: new Date().toISOString(),
        readingProgress: 0,
        lastRead: null,
        totalPages: Math.floor(Math.random() * 200) + 50,
        currentPage: 1
      };

      const updatedDocs = [...documents, newDocument];
      saveDocuments(updatedDocs);

      // Update user usage stats
      updateUser({
        usage: {
          ...user.usage,
          documentsUploaded: user.usage.documentsUploaded + 1
        }
      });

      toast.success('Document uploaded successfully!');
      return true;
    } catch (error) {
      toast.error('Failed to upload document');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteDocument = async (documentId) => {
    try {
      if (!currentPlan.limits.canDeleteDocuments) {
        toast.error('Document deletion requires Pro or Ultra Pro subscription');
        return false;
      }

      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      const updatedDocs = documents.filter(doc => doc.id !== documentId);
      saveDocuments(updatedDocs);

      toast.success('Document deleted successfully');
      return true;
    } catch (error) {
      toast.error('Failed to delete document');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getStorageUsed = () => {
    return documents.reduce((total, doc) => total + doc.size, 0);
  };

  const value = {
    documents,
    loading,
    uploadDocument,
    deleteDocument,
    getStorageUsed,
    storageLimit: currentPlan.limits.storage
  };

  return (
    <DocumentContext.Provider value={value}>
      {children}
    </DocumentContext.Provider>
  );
};