import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useSubscription } from './SubscriptionContext';
import { supabase } from '../lib/supabase';
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

  const loadDocuments = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setDocuments(data || []);
    } catch (error) {
      console.error('Error loading documents:', error);
      toast.error('Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  const uploadDocument = async (file) => {
    if (!user) {
      toast.error('Please sign in to upload documents');
      return false;
    }

    try {
      setLoading(true);

      // Check limits
      if (documents.length >= currentPlan.limits.documents) {
        toast.error(`Document limit reached. Upgrade to upload more documents.`);
        return false;
      }

      // Check file size (for demo, we'll just store file metadata)
      const fileSizeInBytes = file.size;
      const currentStorageUsed = getStorageUsed();
      
      if (currentStorageUsed + fileSizeInBytes > currentPlan.limits.storage) {
        toast.error('Storage limit exceeded. Please upgrade your plan.');
        return false;
      }

      // For demo purposes, we'll simulate file upload without actual file storage
      // In production, you would upload to Supabase Storage first
      const documentData = {
        user_id: user.id,
        name: file.name,
        file_size: fileSizeInBytes,
        file_type: file.type,
        reading_progress: 0,
        total_pages: Math.floor(Math.random() * 200) + 50,
        current_page: 1
      };

      const { data, error } = await supabase
        .from('documents')
        .insert([documentData])
        .select()
        .single();

      if (error) throw error;

      // Update local state
      setDocuments(prev => [data, ...prev]);

      // Update user usage stats
      if (user.usage) {
        await updateUser({
          usage: {
            ...user.usage,
            documentsUploaded: user.usage.documentsUploaded + 1
          }
        });
      }

      toast.success('Document uploaded successfully!');
      return true;
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload document');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteDocument = async (documentId) => {
    if (!user) return false;

    try {
      if (!currentPlan.limits.canDeleteDocuments) {
        toast.error('Document deletion requires Pro or Ultra Pro subscription');
        return false;
      }

      setLoading(true);
      
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', documentId)
        .eq('user_id', user.id);

      if (error) throw error;

      // Update local state
      setDocuments(prev => prev.filter(doc => doc.id !== documentId));

      toast.success('Document deleted successfully');
      return true;
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete document');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateReadingProgress = async (documentId, progress) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('documents')
        .update({ 
          reading_progress: progress,
          last_read: new Date().toISOString()
        })
        .eq('id', documentId)
        .eq('user_id', user.id);

      if (error) throw error;

      // Update local state
      setDocuments(prev => 
        prev.map(doc => 
          doc.id === documentId 
            ? { ...doc, reading_progress: progress, last_read: new Date().toISOString() }
            : doc
        )
      );

      return true;
    } catch (error) {
      console.error('Update progress error:', error);
      return false;
    }
  };

  const getStorageUsed = () => {
    return documents.reduce((total, doc) => total + doc.file_size, 0);
  };

  const value = {
    documents,
    loading,
    uploadDocument,
    deleteDocument,
    updateReadingProgress,
    getStorageUsed,
    storageLimit: currentPlan.limits.storage,
    loadDocuments
  };

  return (
    <DocumentContext.Provider value={value}>
      {children}
    </DocumentContext.Provider>
  );
};