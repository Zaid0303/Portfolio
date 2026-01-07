import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getMessages, subscribeToMessages } from '../firebase/firestoreServices';
import { Mail, User, Calendar, MessageSquare, RefreshCw, Bell } from 'lucide-react';

const MessagesList = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newMessageCount, setNewMessageCount] = useState(0);

  useEffect(() => {
    let previousCount = 0;
    
    // Load initial messages
    loadMessages();
    
    // Subscribe to realtime updates
    const unsubscribe = subscribeToMessages((result) => {
      if (result.success && result.data) {
        const currentCount = result.data.length;
        setMessages(result.data);
        
        // Show notification for new messages
        if (currentCount > previousCount && previousCount > 0) {
          setNewMessageCount(currentCount - previousCount);
          // Show browser notification if permission granted
          if (Notification.permission === 'granted') {
            new Notification('New Contact Message', {
              body: `You have ${currentCount - previousCount} new message(s)`,
              icon: '/icon.png',
            });
          }
        }
        previousCount = currentCount;
        setError('');
      } else {
        setError(result.error || 'Failed to load messages');
      }
      setLoading(false);
    });

    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const loadMessages = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await getMessages();
      if (result.success && result.data) {
        setMessages(result.data);
      } else {
        setError('Failed to load messages');
      }
    } catch (error) {
      console.error('Error loading messages:', error);
      setError('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp || !timestamp.seconds) return 'N/A';
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-300">Loading messages...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Contact Messages
            </h1>
            {newMessageCount > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="px-3 py-1 bg-red-500 text-white rounded-full text-sm font-bold flex items-center space-x-1"
              >
                <Bell className="w-4 h-4" />
                <span>{newMessageCount} new</span>
              </motion.div>
            )}
          </div>
          <p className="text-gray-600 dark:text-gray-300">
            View and manage messages from visitors (realtime updates)
          </p>
        </div>
        <button
          onClick={() => {
            setNewMessageCount(0);
            loadMessages();
          }}
          className="btn-secondary flex items-center space-x-2 mt-4 sm:mt-0"
        >
          <RefreshCw className="w-5 h-5" />
          <span>Refresh</span>
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-600 rounded-lg text-red-700 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Messages List */}
      {messages.length > 0 ? (
        <div className="space-y-4">
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="card"
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                {/* Message Content */}
                <div className="flex-1 space-y-4">
                  {/* Header */}
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                        {message.name}
                      </h3>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
                        <div className="flex items-center space-x-2">
                          <Mail className="w-4 h-4" />
                          <a
                            href={`mailto:${message.email}`}
                            className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                          >
                            {message.email}
                          </a>
                        </div>
                        {message.createdAt && (
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(message.createdAt)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Message */}
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-2 mb-2">
                      <MessageSquare className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Message:
                      </span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                      {message.message}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="card text-center py-12">
          <div className="text-6xl mb-4">📧</div>
          <h3 className="text-2xl font-bold mb-2">No messages yet</h3>
          <p className="text-gray-600 dark:text-gray-300">
            Messages from the contact form will appear here
          </p>
        </div>
      )}
    </div>
  );
};

export default MessagesList;

