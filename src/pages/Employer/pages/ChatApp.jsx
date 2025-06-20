import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import {
  setActiveChat,
  setSearchQuery,
  hideMobileChat,
  saveContact,
  addMessage,
  setCurrentUser,
} from '../chatSlice';
import {
  useGetContactsQuery,
  useFetchMessagesMutation,
  useSendMessageMutation,
  useCreateConversationMutation,
  useGetUserInfoMutation,
} from '../../../api/chatApi';
import { 
  MessageCircle, 
  Search, 
  Send, 
  ArrowLeft, 
  Phone, 
  Video, 
  MoreVertical,
  Smile,
  Paperclip,
  Mic,
  Check,
  CheckCheck,
  Clock,
  AlertCircle
} from 'lucide-react';
import echo from '../../../echo';

// Component: Error Display
const ErrorDisplay = ({ error, onRetry }) => {
  return (
    <div className="flex items-center justify-center p-4 bg-red-50 border border-red-200 rounded-lg mx-4 my-2">
      <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
      <div className="flex-1">
        <p className="text-red-800 text-sm">
          {error?.data?.message || error?.message || 'حدث خطأ في الاتصال'}
        </p>
        {error?.status && (
          <p className="text-red-600 text-xs mt-1">رمز الخطأ: {error.status}</p>
        )}
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="ml-2 px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
        >
          إعادة المحاولة
        </button>
      )}
    </div>
  );
};

// Component: Contact Item
const ContactItem = ({ contact, isActive, onClick, currentUserId }) => {
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diffInHours = (now - date) / (1000 * 60 * 60);
      
      if (diffInHours < 24) {
        return date.toLocaleTimeString('ar-EG', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: false 
        });
      }
      return date.toLocaleDateString('ar-EG', { 
        day: '2-digit', 
        month: '2-digit' 
      });
    } catch (error) {
      return '';
    }
  };

  return (
    <div
      onClick={onClick}
      className={`flex items-center p-4 cursor-pointer hover:bg-gray-50 transition-colors border-b border-gray-100 ${
        isActive ? 'bg-blue-50 border-r-4 border-r-blue-500' : ''
      }`}
    >
      <div className="relative">
        <img
          src={contact.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(contact.name || 'User')}&background=6366f1&color=fff`}
          alt={contact.name || 'User'}
          className="w-12 h-12 rounded-full object-cover"
        />
        {contact.isOnline && (
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
        )}
      </div>
      
      <div className="flex-1 mr-3 min-w-0">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-gray-900 truncate">{contact.name || 'مستخدم غير معروف'}</h3>
          <span className="text-xs text-gray-500">
            {formatTime(contact.timestamp)}
          </span>
        </div>
        <div className="flex justify-between items-center mt-1">
          <p className="text-sm text-gray-600 truncate max-w-[180px]">
            {contact.lastMessage || 'ابدأ محادثة جديدة'}
          </p>
          {contact.unreadCount > 0 && (
            <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
              {contact.unreadCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

// Component: Message Status Icon
const MessageStatusIcon = ({ status, isSender }) => {
  if (!isSender) return null;

  switch (status) {
    case 'sending':
      return <Clock className="w-4 h-4 text-gray-400" />;
    case 'sent':
      return <Check className="w-4 h-4 text-gray-400" />;
    case 'delivered':
      return <CheckCheck className="w-4 h-4 text-gray-400" />;
    case 'seen':
      return <CheckCheck className="w-4 h-4 text-blue-500" />;
    default:
      return <Check className="w-4 h-4 text-gray-400" />;
  }
};

// Component: Message Bubble
const MessageBubble = ({ message, currentUserId }) => {
  const isSender = message.from_id == currentUserId || message.senderId === 'me';
  
  const formatMessageTime = (timestamp) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleTimeString('ar-EG', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      });
    } catch (error) {
      return '';
    }
  };

  return (
    <div className={`flex mb-4 ${isSender ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
        isSender 
          ? 'bg-blue-500 text-white rounded-br-md' 
          : 'bg-gray-200 text-gray-800 rounded-bl-md'
      }`}>
        {message.body && (
          <p className="text-sm leading-relaxed">{message.body}</p>
        )}
        
        {message.attachment && (
          <div className="mt-2">
            {message.type === 'image' ? (
              <img 
                src={message.attachment} 
                alt="attachment" 
                className="max-w-full rounded-lg"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            ) : (
              <div className="flex items-center p-2 bg-white bg-opacity-20 rounded-lg">
                <Paperclip className="w-4 h-4 mr-2" />
                <span className="text-sm truncate">{message.attachment}</span>
              </div>
            )}
          </div>
        )}
        
        <div className={`flex items-center justify-end mt-1 text-xs ${
          isSender ? 'text-blue-100' : 'text-gray-500'
        }`}>
          <span className="mr-1">{formatMessageTime(message.created_at)}</span>
          <MessageStatusIcon status={message.status} isSender={isSender} />
        </div>
      </div>
    </div>
  );
};

// Component: Chat Header
const ChatHeader = ({ contact, onBack, showBackButton = false }) => {
  return (
    <div className="bg-white border-b px-4 py-3">
      <div className="flex items-center">
        {showBackButton && (
          <button 
            onClick={onBack}
            className="mr-3 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        
        <img
          src={contact.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(contact.name || 'User')}&background=6366f1&color=fff`}
          alt={contact.name || 'User'}
          className="w-10 h-10 rounded-full object-cover"
        />
        
        <div className="flex-1 mr-3">
          <h3 className="font-semibold text-gray-900">{contact.name || 'مستخدم غير معروف'}</h3>
          <p className="text-sm text-gray-500">
            {contact.isOnline ? 'متصل الآن' : contact.lastSeen ? `آخر ظهور ${contact.lastSeen}` : 'غير متصل'}
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Phone className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Video className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <MoreVertical className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Component: Message Input
const MessageInput = ({ onSendMessage, disabled = false }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="bg-white border-t px-4 py-3">
      <div className="flex items-center space-x-2">
        <button
          type="button"
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <Paperclip className="w-5 h-5 text-gray-600" />
        </button>
        
        <div className="flex-1 relative">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="اكتب رسالتك..."
            disabled={disabled}
            className="w-full px-4 py-2 bg-gray-100 rounded-full border-none outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          />
          <button
            type="button"
            className="absolute left-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full transition-colors"
          >
            <Smile className="w-4 h-4 text-gray-600" />
          </button>
        </div>
        
        {message.trim() ? (
          <button
            onClick={handleSubmit}
            disabled={disabled}
            className="p-2 bg-blue-500 hover:bg-blue-600 rounded-full transition-colors disabled:opacity-50"
          >
            <Send className="w-5 h-5 text-white" />
          </button>
        ) : (
          <button
            type="button"
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Mic className="w-5 h-5 text-gray-600" />
          </button>
        )}
      </div>
    </div>
  );
};

// Component: Empty Chat State
const EmptyChatState = ({ onStartNewChat }) => {
  return (
    <div className="flex-1 flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <MessageCircle className="w-20 h-20 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">مرحباً بك في التشات</h3>
        <p className="text-gray-500 mb-6">اختر محادثة أو ابدأ محادثة جديدة</p>
        <button
          onClick={onStartNewChat}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full transition-colors"
        >
          ابدأ محادثة جديدة
        </button>
      </div>
    </div>
  );
};

// Main ChatApp Component
const ChatApp = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const currentUser = useSelector((state) => state.chat.currentUser);

  
  const { 
    activeChat, 
    searchQuery, 
    messages, 
    showMobileChat,  
  } = useSelector((state) => state.chat);
  
  const messagesEndRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [targetUserId, setTargetUserId] = useState(null);
  const [apiErrors, setApiErrors] = useState({});

  // API Hooks
  const { 
    data: contactsData = [], 
    refetch: refetchContacts,
    isLoading: contactsLoading,
    error: contactsError
  } = useGetContactsQuery(undefined, {
    // Add error handling options
    retry: (failureCount, error) => {
      return failureCount < 3 && error?.status !== 401;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
  
  const [fetchMessages, { 
    data: fetchedMessages = [], 
    isLoading: messagesLoading,
    error: messagesError
  }] = useFetchMessagesMutation();
  
  const [sendMessage, { 
    isLoading: sendingMessage,
    error: sendError
  }] = useSendMessageMutation();
  
  const [createConversation, {
    error: createConversationError
  }] = useCreateConversationMutation();
  
  const [getUserInfo, {
    error: userInfoError
  }] = useGetUserInfoMutation();

  // Process contacts data safely
  const contacts = useMemo(() => {
    try {
      if (Array.isArray(contactsData)) return contactsData;
      if (contactsData?.contacts) return contactsData.contacts;
      if (contactsData?.data) return contactsData.data;
      return [];
    } catch (error) {
      console.error('Error processing contacts:', error);
      return [];
    }
  }, [contactsData]);

  // Process messages data safely
  const displayMessages = useMemo(() => {
    try {
      if (Array.isArray(fetchedMessages)) return fetchedMessages;
      if (fetchedMessages?.messages) return fetchedMessages.messages;
      if (fetchedMessages?.data) return fetchedMessages.data;
      return messages;
    } catch (error) {
      console.error('Error processing messages:', error);
      return messages;
    }
  }, [fetchedMessages, messages]);
useEffect(() => {
  if (currentUser?.id) {
    const channel = echo.private(`chat.${currentUser.id}`);

    channel.listen('.message.sent', (e) => {
      console.log('📩 Received message:', e.message);
      dispatch(addMessage(e.message));
    });

    return () => {
      channel.stopListening('.message.sent');
    };
  }
}, [currentUser?.id, dispatch]);

  // Handle incoming user from navigation
  useEffect(() => {
    const targetUser = location.state?.user;
    if (targetUser && targetUser !== targetUserId) {
      setTargetUserId(targetUser);
      handleDirectUserChat(targetUser);
    }
  }, [location.state, targetUserId]);

  // Function to handle direct user chat with better error handling
  const handleDirectUserChat = async (userId) => {
    try {
      setApiErrors(prev => ({ ...prev, directChat: null }));
      
      // Check if user exists in contacts
      let targetContact = contacts.find(contact => contact.id === userId);
      
      if (!targetContact) {
        try {
          const userInfoResponse = await getUserInfo(userId).unwrap();
          
          if (userInfoResponse) {
            targetContact = {
              id: userId,
              name: userInfoResponse.name || userInfoResponse.username || `User ${userId}`,
              avatar: userInfoResponse.avatar || userInfoResponse.profile_picture || null,
              isOnline: userInfoResponse.isOnline || userInfoResponse.is_online || false,
              lastMessage: null,
              unreadCount: 0,
              timestamp: new Date().toISOString()
            };
            
            dispatch(saveContact(targetContact));
          }
        } catch (userInfoErr) {
          console.warn('Could not fetch user info:', userInfoErr);
          // Create a basic contact even if we can't get user info
          targetContact = {
            id: userId,
            name: `User ${userId}`,
            avatar: null,
            isOnline: false,
            lastMessage: null,
            unreadCount: 0,
            timestamp: new Date().toISOString()
          };
          dispatch(saveContact(targetContact));
        }
      }
      
      if (targetContact) {
        dispatch(setActiveChat(targetContact));
        
        // Try to create conversation only if it doesn't exist
        if (!targetContact.lastMessage) {
          try {
            await createConversation({ 
              user_id: userId,
              initial_message: null 
            }).unwrap();
            
            // Refetch contacts after creating conversation
            setTimeout(() => {
              refetchContacts();
            }, 500);
          } catch (createConvErr) {
            console.warn('Could not create conversation:', createConvErr);
            // Continue even if conversation creation fails
            setApiErrors(prev => ({ 
              ...prev, 
              createConversation: createConvErr 
            }));
          }
        }
        
        // Fetch messages
        try {
          await fetchMessages(userId).unwrap();
        } catch (fetchErr) {
          console.warn('Could not fetch messages:', fetchErr);
          setApiErrors(prev => ({ 
            ...prev, 
            fetchMessages: fetchErr 
          }));
        }
      }
    } catch (error) {
      console.error('Error handling direct user chat:', error);
      setApiErrors(prev => ({ 
        ...prev, 
        directChat: error 
      }));
    }
  };

  // Set current user
  useEffect(() => {
    // Get current user from your auth system or localStorage
    try {
      const storedUser = localStorage.getItem('currentUser');
      const user = storedUser ? JSON.parse(storedUser) : { id: 1, name: 'Current User' };
      dispatch(setCurrentUser(user));
    } catch (error) {
      console.error('Error setting current user:', error);
      dispatch(setCurrentUser({ id: 1, name: 'Current User' }));
    }
  }, [dispatch]);

  // Fetch messages when active chat changes
  useEffect(() => {
    if (activeChat?.id) {
      setIsLoading(true);
      fetchMessages(activeChat.id)
        .unwrap()
        .catch((error) => {
          console.error('Error fetching messages:', error);
          setApiErrors(prev => ({ 
            ...prev, 
            fetchMessages: error 
          }));
        })
        .finally(() => setIsLoading(false));
    }
  }, [activeChat?.id, fetchMessages]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [displayMessages]);

  // Handle contact click
  const handleContactClick = async (contact) => {
    try {
      setApiErrors(prev => ({ ...prev, contactClick: null }));
      dispatch(setActiveChat(contact));
      
      // Check if this is a new conversation
      if (!contact.lastMessage) {
        try {
          await createConversation({ 
            user_id: contact.id,
            initial_message: null 
          }).unwrap();
          
          setTimeout(() => {
            refetchContacts();
          }, 500);
        } catch (error) {
          console.warn('Error creating conversation:', error);
          setApiErrors(prev => ({ 
            ...prev, 
            createConversation: error 
          }));
        }
      }
    } catch (error) {
      console.error('Error handling contact click:', error);
      setApiErrors(prev => ({ 
        ...prev, 
        contactClick: error 
      }));
    }
  };

  // Handle send message with better error handling
  const handleSendMessage = async (text) => {
    if (!text.trim() || !activeChat?.id || sendingMessage) return;

    try {
      setApiErrors(prev => ({ ...prev, sendMessage: null }));
      
      // Optimistic update
      const tempMessage = {
        id: Date.now(),
        body: text,
        from_id: currentUser?.id,
        to_id: activeChat.id,
        senderId: 'me',
        created_at: new Date().toISOString(),
        status: 'sending'
      };
      
      dispatch(addMessage(tempMessage));

      // Send message
      await sendMessage({ 
        id: activeChat.id, 
        message: text.trim(),
        type: 'user'
      }).unwrap();

      // Refetch to get updated data
      setTimeout(() => {
        refetchContacts();
        fetchMessages(activeChat.id);
      }, 500);
      
    } catch (error) {
      console.error('Error sending message:', error);
      setApiErrors(prev => ({ 
        ...prev, 
        sendMessage: error 
      }));
    }
  };

  // Filter contacts based on search
  const filteredContacts = useMemo(() => {
    try {
      if (!searchQuery.trim()) return contacts;
      return contacts.filter(contact => 
        contact.name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    } catch (error) {
      console.error('Error filtering contacts:', error);
      return contacts;
    }
  }, [contacts, searchQuery]);

  // Clear API errors after some time
  useEffect(() => {
    const timer = setTimeout(() => {
      setApiErrors({});
    }, 10000); // Clear errors after 10 seconds

    return () => clearTimeout(timer);
  }, [apiErrors]);
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Contacts Sidebar */}
      <div className={`${showMobileChat ? 'hidden' : 'flex'} md:flex w-full md:w-1/3 lg:w-1/4 flex-col bg-white border-r`}>
        {/* Search Header */}
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="البحث في المحادثات..."
              value={searchQuery}
              onChange={(e) => dispatch(setSearchQuery(e.target.value))}
              className="w-full pr-10 pl-4 py-2 bg-gray-100 rounded-full border-none outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Error Display for Contacts */}
        {contactsError && (
          <ErrorDisplay 
            error={contactsError} 
            onRetry={() => refetchContacts()}
          />
        )}

        {/* Contacts List */}
        <div className="flex-1 overflow-y-auto">
          {contactsLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : filteredContacts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {searchQuery ? 'لا توجد نتائج' : 'لا توجد محادثات'}
            </div>
          ) : (
            filteredContacts.map((contact) => (
              <ContactItem
                key={contact.id}
                contact={contact}
                isActive={activeChat?.id === contact.id}
                onClick={() => handleContactClick(contact)}
                currentUserId={currentUser?.id}
              />
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className={`${!showMobileChat ? 'hidden' : 'flex'} md:flex flex-1 flex-col`}>
        {activeChat ? (
          <>
            {/* Chat Header */}
            <ChatHeader 
              contact={activeChat} 
              onBack={() => dispatch(hideMobileChat())}
              showBackButton={showMobileChat}
            />

            {/* Error Display for Messages */}
            {(messagesError || apiErrors.fetchMessages) && (
              <ErrorDisplay 
                error={messagesError || apiErrors.fetchMessages}
                onRetry={() => fetchMessages(activeChat.id)}
              />
            )}

            {/* Error Display for Send Message */}
            {(sendError || apiErrors.sendMessage) && (
              <ErrorDisplay 
                error={sendError || apiErrors.sendMessage}
              />
            )}

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
              {isLoading || messagesLoading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : displayMessages.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <MessageCircle className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>لا توجد رسائل بعد</p>
                  <p className="text-sm mt-1">ابدأ المحادثة بإرسال رسالة</p>
                </div>
              ) : (
                displayMessages.map((message) => (
                  <MessageBubble
                    key={message.id}
                    message={message}
                    currentUserId={currentUser?.id}
                  />
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <MessageInput 
              onSendMessage={handleSendMessage}
              disabled={sendingMessage}
            />
          </>
        ) : (
          /* Empty State */
          <EmptyChatState onStartNewChat={() => console.log('Start new chat')} />
        )}
      </div>
    </div>
  );
  
};

export default ChatApp;