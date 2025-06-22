import { useEffect, useState, useRef, useCallback } from 'react';
import { MessageCircle, Send, User, Clock, Search, Menu, Sparkles, Smile } from 'lucide-react';
import { supabase } from '../../../supabaseClient';
import { useLocation } from 'react-router-dom';

const ChatApp = () => {
  const userId = parseInt(localStorage.getItem('user-id'));
  const location = useLocation();
  
  // Fix: Properly destructure the state parameters
  const { user: contactId, name: contactName } = location.state || {};

  // State declarations
  const [contacts, setContacts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedContact, setSelectedContact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [unreadMessages, setUnreadMessages] = useState({});

  const messagesEndRef = useRef(null);
  const emojiPickerRef = useRef(null);

  // Handle initial contact selection - Fix: Use contactId and contactName
useEffect(() => {
  if (contactId && !contacts.some(c => c.contact_id === contactId)) {
    // إنشاء اتصال مؤقت بمفتاح فريد
    const tempContact = {
      id: `temp-${Date.now()}`, // استخدام الطابع الزمني لجعل المفتاح فريداً
      contact_id: contactId,
      contact_name: contactName,
      contact_avatar: null,
      body: "Start a conversation...",
      created_at: new Date().toISOString(),
      from_id: contactId
    };
    
    setContacts(prev => [tempContact, ...prev]);
    setSelectedContact(tempContact);
    fetchMessages(contactId);
  } else if (contactId) {
    const existingContact = contacts.find(c => c.contact_id === contactId);
    if (existingContact) {
      setSelectedContact(existingContact);
      fetchMessages(contactId);
      markMessagesAsRead(contactId);
    }
  }
}, [contactId, contacts]);// <-- Removed `contacts` dependency

  // Online presence tracking
  useEffect(() => {
    if (!userId) return;

    const presenceChannel = supabase.channel('online_users', {
      config: {
        presence: {
          key: userId.toString()
        }
      }
    });

    presenceChannel.on('presence', { event: 'sync' }, () => {
      const newState = presenceChannel.presenceState();
      const onlineUserIds = Object.keys(newState).map(Number);
      setOnlineUsers(onlineUserIds);
    });

    presenceChannel.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        await presenceChannel.track({
          user_id: userId,
          online_at: new Date().toISOString(),
          status: 'online'
        });
      }
    });

    const handleBeforeUnload = () => {
      presenceChannel.untrack();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      presenceChannel.unsubscribe();
    };
  }, [userId]);

  // Helper function to check online status
  const isOnline = useCallback((userId) => {
    return onlineUsers.includes(userId);
  }, [onlineUsers]);

  // Emoji categories
  const emojiCategories = {
    'Smileys': ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😙', '🥲', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥', '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕', '🤢', '🤮', '🤧', '🥵', '🥶', '🥴', '😵', '🤯', '🤠', '🥳', '🥸', '😎', '🤓', '🧐'],
    'Hearts': ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟'],
    'Gestures': ['👍', '👎', '👌', '🤌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👋', '🤚', '🖐️', '✋', '🖖', '👏', '🙌', '🤲', '🤝', '🙏'],
    'Activities': ['⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱', '🪀', '🏓', '🏸', '🏒', '🏑', '🥍', '🏏', '🪃', '🥅', '⛳', '🪁', '🏹', '🎣', '🤿', '🥊', '🥋', '🎽', '🛹', '🛷', '⛸️', '🥌', '🎿', '⛷️', '🏂', '🪂', '🏋️‍♀️', '🏋️', '🏋️‍♂️', '🤼‍♀️', '🤼', '🤼‍♂️', '🤸‍♀️', '🤸', '🤸‍♂️', '⛹️‍♀️', '⛹️', '⛹️‍♂️', '🤺', '🤾‍♀️', '🤾', '🤾‍♂️', '🏌️‍♀️', '🏌️', '🏌️‍♂️', '🏇', '🧘‍♀️', '🧘', '🧘‍♂️', '🏄‍♀️', '🏄', '🏄‍♂️', '🏊‍♀️', '🏊', '🏊‍♂️', '🤽‍♀️', '🤽', '🤽‍♂️', '🚣‍♀️', '🚣', '🚣‍♂️', '🧗‍♀️', '🧗', '🧗‍♂️', '🚵‍♀️', '🚵', '🚵‍♂️', '🚴‍♀️', '🚴', '🚴‍♂️'],
    'Objects': ['🎮', '🕹️', '🎰', '🎲', '🧩', '🎯', '🎪', '🎨', '🎬', '🎤', '🎧', '🎼', '🎵', '🎶', '🎹', '🥁', '🎷', '🎺', '🎸', '🪕', '🎻', '🎳', '🎉', '🎊', '🎈', '🎁', '🎀', '🎂', '🍰', '🧁', '🍭', '🍬', '🍫', '🍿', '🍩', '🍪', '🌰', '🥜', '🍯', '🥛', '🍼', '☕', '🫖', '🍵', '🧃', '🥤', '🧋', '🍶', '🍾', '🍷', '🍸', '🍹', '🍺', '🍻', '🥂', '🥃', '🥤', '🧊', '🥢', '🍽️', '🍴', '🥄', '🔪', '🏺'],
    'Nature': ['🌍', '🌎', '🌏', '🌐', '🗺️', '🗾', '🧭', '🏔️', '⛰️', '🌋', '🗻', '🏕️', '🏖️', '🏜️', '🏝️', '🏞️', '🏟️', '🏛️', '🏗️', '🧱', '🪨', '🪵', '🛖', '🏘️', '🏚️', '🏠', '🏡', '🏢', '🏣', '🏤', '🏥', '🏦', '🏨', '🏩', '🏪', '🏫', '🏬', '🏭', '🏯', '🏰', '🗼', '🗽', '⛪', '🕌', '🛕', '🕍', '⛩️', '🕋', '⛲', '⛺', '🌁', '🌃', '🏙️', '🌄', '🌅', '🌆', '🌇', '🌉', '♨️', '🎠', '🎡', '🎢', '💈', '🎪', '🚂', '🚃', '🚄', '🚅', '🚆', '🚇', '🚈', '🚉', '🚊', '🚝', '🚞', '🚋', '🚌', '🚍', '🚎', '🚐', '🚑', '🚒', '🚓', '🚔', '🚕', '🚖', '🚗', '🚘', '🚙', '🛻', '🚚', '🚛', '🚜', '🏎️', '🏍️', '🛵', '🦽', '🦼', '🛴', '🚲', '🛺', '🚁', '🚟', '🚠', '🚡', '🛰️', '🚀', '🛸', '🛶', '⛵', '🚤', '🛥️', '🛳️', '⛴️', '🚢', '⚓', '⛽', '🚧', '🚨', '🚥', '🚦', '🛑', '🚏', '⛱️', '🏖️', '🏝️', '🏜️', '🌋', '⛰️', '🏔️', '🗻', '🏕️', '⛺', '🏠', '🏡', '🏘️', '🏚️', '🏗️', '🏭', '🏢', '🏬', '🏣', '🏤', '🏥', '🏦', '🏨', '🏪', '🏫', '🏩', '💒', '🏛️', '⛪', '🕌', '🕍', '🛕', '🕋', '⛩️', '🛤️', '🛣️', '🗾', '🎑', '🏞️', '🌅', '🌄', '🌠', '🎇', '🎆', '🌇', '🌆', '🏙️', '🌃', '🌌', '🌉', '🌁']
  };

  const quickEmojis = ['😀', '😂', '😍', '🤔', '👍', '❤️', '😢', '😡', '🎉', '🔥'];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Add emoji to message
  const addEmoji = (emoji) => {
    setNewMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const initializeUnreadCounts = async (contactsList) => {
    const counts = {};
    const hasReadAtColumn = await checkColumnExists();
    
    if (!hasReadAtColumn) {
      // If column doesn't exist, initialize all counts to 0
      contactsList.forEach(contact => {
        counts[contact.contact_id] = 0;
      });
      setUnreadCounts(counts);
      return;
    }

    // If column exists, count unread messages per contact
    for (const contact of contactsList) {
      try {
        const { count, error } = await supabase
          .from('ch_messages')
          .select('*', { count: 'exact', head: true })
          .eq('from_id', contact.contact_id)
          .eq('to_id', userId)
          .is('read_at', null);
        
        counts[contact.contact_id] = error ? 0 : count;
      } catch (err) {
        counts[contact.contact_id] = 0;
      }
    }
    
    setUnreadCounts(counts);
  };

  const checkColumnExists = async () => {
    try {
      const { error } = await supabase
        .from('ch_messages')
        .select('read_at')
        .limit(0); 
      
      return !error;
    } catch (err) {
      return false;
    }
  };

  // Mark messages as read when opening a chat
  const markMessagesAsRead = async (contactId) => {
    try {
      // First check if column exists
      const { error: testError } = await supabase
        .from('ch_messages')
        .select('read_at')
        .limit(0);
      
      if (!testError) {
        // Column exists - update in database
        await supabase
          .from('ch_messages')
          .update({ read_at: new Date().toISOString() })
          .eq('from_id', contactId)
          .eq('to_id', userId)
          .is('read_at', null);
      }
      
      // Update local state
      setUnreadCounts(prev => ({ ...prev, [contactId]: 0 }));
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  // Fetch contacts/conversations
const fetchContacts = useCallback(async () => {
  try {
    setLoading(true);
    
    // تأكد أن userId هو عدد صحيح
    const numericUserId = parseInt(userId, 10);
    if (isNaN(numericUserId)) {
      throw new Error('Invalid user ID format');
    }

    const response = await fetch('https://obrhuhasrppixjwkznri.supabase.co/functions/v1/last_conversations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ current_user_id: numericUserId }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch contacts');
    }

    const data = await response.json();
    
   const transformedContacts = data.map((msg) => ({
  id: msg.id,
 contact_id: msg.from_id === numericUserId ? msg.to_id : msg.from_id,  contact_name: msg.contact_name || `User ${msg.from_id === numericUserId ? msg.to_id : msg.from_id}`,
  contact_avatar: msg.contact_avatar || null,
  body: msg.body,
  created_at: msg.created_at,
  from_id: msg.from_id,
}));

transformedContacts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

setContacts(transformedContacts);
    await initializeUnreadCounts(transformedContacts);
  } catch (err) {
    console.error('Error fetching contacts:', err);
  } finally {
    setLoading(false);
  }
}, [userId]);
  useEffect(() => {
  fetchContacts();
}, [fetchContacts]); // Remove user and name dependencies, use contactId and contactName instead

  // Fetch messages between selected contact and current user
const handleContactSelect = useCallback((contact) => {
  // Always set the selected contact first
  setSelectedContact(contact);
  
  // Then fetch messages and mark as read
  fetchMessages(contact.contact_id);
  markMessagesAsRead(contact.contact_id);
  
  // Close mobile menu if open
  setIsMobileMenuOpen(false);
}, []);

  const fetchMessages = async (contactId) => {
    const { data, error } = await supabase
      .from('ch_messages')
      .select('*')
      .or(`and(from_id.eq.${userId},to_id.eq.${contactId}),and(from_id.eq.${contactId},to_id.eq.${userId})`)
      .order('created_at', { ascending: true });

    if (error) {
      console.error(error);
      setMessages([]);
    } else {
      setMessages(data || []);
    }
  };

  // Send message
 const sendMessage = async () => {
  if (!newMessage.trim() || !selectedContact) return;

  const trimmedMessage = newMessage.trim();
  try {
    const messageData = {
      from_id: userId,
      to_id: selectedContact.contact_id, // Ensure we're using the correct contact ID
      body: trimmedMessage,
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('ch_messages')
      .insert([messageData])
      .select();

    if (error) {
      console.error('Error sending message:', error);
    } else if (data && data.length > 0) {
      // Add new message to message list
      setMessages(prev => [...prev, data[0]]);

      // Update last message in contacts list without changing the selected contact
      setContacts(prev => {
      const updatedContacts = prev.map(contact =>
        contact.contact_id === selectedContact.contact_id
          ? {
              ...contact,
              body: trimmedMessage,
              created_at: data[0].created_at,
              id: contact.id.toString().startsWith('temp-') ? data[0].id : contact.id,
            }
          : contact
      );
      
      return updatedContacts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    });

      // Clear input after success
      setNewMessage('');
    }
  } catch (err) {
    console.error('Error sending message:', err);
  }
};

  // Set up real-time subscription
 useEffect(() => {
  if (!userId) return;

  const channel = supabase
    .channel('public:ch_messages')
    .on(
      'postgres_changes',
      { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'ch_messages',
        filter: `or(to_id.eq.${userId},from_id.eq.${userId})`
      },
      (payload) => {
        // Only add to messages if it belongs to current conversation
        if (selectedContact && 
            (payload.new.from_id === selectedContact.contact_id || 
             payload.new.to_id === selectedContact.contact_id)) {
          setMessages(prev => [...prev, payload.new]);
        }
        
        // Update unread counts for other contacts
        if (!selectedContact || payload.new.from_id !== selectedContact.contact_id) {
          setUnreadCounts(prev => ({
            ...prev,
            [payload.new.from_id]: (prev[payload.new.from_id] || 0) + 1
          }));
        }
        
        // Update contacts list
        setContacts(prev => {
          const existingContactIndex = prev.findIndex(
            c => c.contact_id === payload.new.from_id || c.contact_id === payload.new.to_id
          );
          
          if (existingContactIndex !== -1) {
            const updatedContacts = [...prev];
            updatedContacts[existingContactIndex] = {
              ...updatedContacts[existingContactIndex],
              body: payload.new.body,
              created_at: payload.new.created_at
            };
            return updatedContacts;
          }
          return prev;
        });
      }
    )
    .subscribe();

  return () => {
    channel.unsubscribe();
  };
}, [userId, selectedContact]); // Include selectedContact in dependencies
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const filteredContacts = contacts.filter(contact =>
    contact.contact_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-red-100 to-red-200 flex items-center justify-center">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-red-500 rounded-full animate-spin animation-delay-150"></div>
          <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-red-600 w-8 h-8 animate-pulse" />
        </div>
        <p className="ml-6 text-red-800 text-xl font-medium animate-pulse">Loading chat details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-red-100 to-red-200">
      <div className="container mx-auto max-w-7xl h-screen flex flex-col p-2 md:p-4">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 backdrop-blur-lg rounded-xl shadow-2xl border border-red-300 mb-4 p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button 
                className="md:hidden text-white hover:text-red-200 transition-colors"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <Menu size={24} />
              </button>
              <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
                <MessageCircle className="text-white drop-shadow-lg" size={28} />
                <span className="hidden sm:inline drop-shadow-md">Red Messenger</span>
                <span className="sm:hidden drop-shadow-md">Chat</span>
              </h1>
            </div>
            <div className="hidden md:block w-64">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search contacts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-full border border-red-300 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent bg-white/90 backdrop-blur-sm text-red-900 placeholder-red-400"
                />
                <Search className="absolute left-3 top-2.5 text-red-400" size={18} />
              </div>
            </div>
          </div>
        </div>

        {/* Chat Container */}
        <div className="flex-1 flex bg-white/95 backdrop-blur-lg rounded-xl shadow-2xl border border-red-200 overflow-hidden">
          {/* Mobile Menu Button */}
          {isMobileMenuOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={() => setIsMobileMenuOpen(false)}></div>
          )}

          {/* Contacts Sidebar */}
          <div className={`w-72 md:w-80 border-r-2 border-red-200 bg-gradient-to-b from-red-50 via-white to-red-50 absolute md:relative z-50 md:z-auto h-full transition-all duration-300 ${isMobileMenuOpen ? 'left-0' : '-left-full'} md:left-0`}>
            <div className="p-4 border-b-2 border-red-200 bg-gradient-to-r from-red-500 to-red-600">
              <div className="relative md:hidden">
                <input
                  type="text"
                  placeholder="Search contacts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-full border border-red-300 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent bg-white text-red-900 placeholder-red-400"
                />
                <Search className="absolute left-3 top-2.5 text-red-400" size={18} />
              </div>
            </div>
            
            <div className="overflow-y-auto h-[calc(100%-80px)]">
              {filteredContacts.length === 0 ? (
                <div className="p-6 text-center">
                  <div className="bg-gradient-to-br from-red-100 to-red-200 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center shadow-lg">
                    <MessageCircle className="text-red-500" size={24} />
                  </div>
                  <p className="text-red-800 font-medium">No conversations found</p>
                  <p className="text-red-500 text-sm mt-1">{searchQuery ? 'Try a different search' : 'Start a new chat'}</p>
                </div>
              ) : (
                filteredContacts.map((contact) => (
                  <div
                   key={`${contact.id}-${contact.contact_id}`} // مفتاح مركب لضمان التفرد
                    onClick={() => handleContactSelect(contact)}

                    className={`p-3 border-b border-red-100 relative cursor-pointer transition-all duration-200 hover:shadow-md ${
                      selectedContact?.contact_id === contact.contact_id 
                        ? 'bg-gradient-to-r from-red-200 to-red-100 shadow-inner border-l-4 border-l-red-500' 
                        : 'hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center shadow-lg ring-2 ring-red-300">
                          {contact.contact_avatar ? (
                            <img 
                              src={contact.contact_avatar} 
                              alt={contact.contact_name}
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            <User size={20} className="text-white" />
                          )}
                        </div>
                        {isOnline(contact.contact_id) && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
                        )}
                        
                        {/* Notification Badge */}
                        {unreadCounts[contact.contact_id] > 0 && (
                          <div className="absolute -top-1 -right-1 min-w-[20px] h-5 bg-red-600 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white shadow-lg animate-pulse">
                            {unreadCounts[contact.contact_id] > 99 ? '99+' : unreadCounts[contact.contact_id]}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                          <h3 className={`font-semibold truncate ${
                            unreadCounts[contact.contact_id] > 0 ? 'text-red-900 font-bold' : 'text-red-900'
                          }`}>
                            {contact.contact_name}
                          </h3>
                          <span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
                            <Clock size={10} />
                            {formatTime(contact.created_at)}
                          </span>
                        </div>
                        <p className={`text-sm truncate mt-1 ${
                          unreadCounts[contact.contact_id] > 0 ? 'text-red-800 font-semibold' : 'text-red-700 font-medium'
                        }`}>
                          {contact.body}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col bg-gradient-to-b from-white to-red-50 relative">
            {selectedContact ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b-2 border-red-200 bg-gradient-to-r from-red-500 to-red-600 backdrop-blur-sm flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button className="md:hidden text-white hover:text-red-200 transition-colors" onClick={() => setIsMobileMenuOpen(true)}>
                      <Menu size={24} />
                    </button>
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center shadow-lg ring-2 ring-white">
                        <User size={20} className="text-white" />
                      </div>
                    </div>
                    <div>
                      {/* Replace "Red Messenger" with selectedContact.contact_name */}
                      <h3 className="font-semibold text-white drop-shadow-md">
                        {selectedContact ? selectedContact.contact_name : "Select a chat"}
                      </h3>
                      {/* Online status indicator */}
                      {selectedContact && (
                        <div className="text-xs font-medium flex items-center gap-1">
                          <div className={`w-2 h-2 rounded-full ${
                            isOnline(selectedContact.contact_id) 
                              ? 'bg-green-500 animate-pulse' 
                              : 'bg-gray-400'
                          }`}></div>
                          <span className={isOnline(selectedContact.contact_id) 
                            ? 'text-green-200' 
                            : 'text-gray-300'
                          }>
                            {isOnline(selectedContact.contact_id) ? 'Online' : 'Offline'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-white via-red-50 to-red-100">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.from_id === userId ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs md:max-w-md px-4 py-3 rounded-2xl shadow-lg transition-all duration-200 hover:shadow-xl ${
                          message.from_id === userId
                            ? 'bg-gradient-to-br from-red-600 to-red-700 text-white'
                            : 'bg-white text-red-900 border-2 border-red-200'
                        }`}
                      >
                        <p className="text-sm leading-relaxed" style={{ fontSize: '16px', lineHeight: '1.4' }}>{message.body}</p>
                        <p className={`text-xs mt-2 text-right ${
                          message.from_id === userId ? 'text-red-200' : 'text-red-500'
                        }`}>
                          {formatTime(message.created_at)}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="p-4 border-t-2 border-red-200 bg-gradient-to-r from-red-50 to-white relative">
                  {/* Quick Emoji Bar */}
                  <div className="flex gap-2 mb-3 overflow-x-auto pb-2">
                    {quickEmojis.map((emoji, index) => (
                      <button
                        key={index}
                        onClick={() => addEmoji(emoji)}
                        className="text-xl hover:scale-125 transition-transform duration-200 p-1 hover:bg-red-100 rounded-full flex-shrink-0"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>

                 
                  {/* Emoji Picker */}
                  {showEmojiPicker && (
                    <div 
                      ref={emojiPickerRef}
                      className="absolute bottom-full left-4 right-4 mb-2 bg-white border-2 border-red-200 rounded-lg shadow-2xl z-50 max-h-64 overflow-hidden"
                    >
                      <div className="p-2 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold text-sm">
                        Choose an emoji
                      </div>
                      <div className="overflow-y-auto max-h-48">
                        {Object.entries(emojiCategories).map(([category, emojis]) => (
                          <div key={category} className="p-2">
                            <div className="text-xs font-semibold text-red-700 mb-2">{category}</div>
                            <div className="grid grid-cols-8 gap-1">
                              {emojis.map((emoji, index) => (
                                <button
                                  key={index}
                                  onClick={() => addEmoji(emoji)}
                                  className="text-lg hover:bg-red-100 p-1 rounded transition-colors duration-150"
                                >
                                  {emoji}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 items-end">
                    <button
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-full transition-all duration-200 hover:scale-110 flex-shrink-0"
                    >
                      <Smile size={20} />
                    </button>
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      placeholder="Type your message..."
                      className="flex-1 px-4 py-3 border-2 border-red-200 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-400 bg-white shadow-inner text-red-900 placeholder-red-400 transition-all duration-200"
                      style={{ fontSize: '16px' }}
                    />
                    <button
                      onClick={sendMessage}
                      disabled={!newMessage.trim()}
                      className="p-3 bg-gradient-to-br from-red-600 to-red-700 text-white rounded-full hover:from-red-700 hover:to-red-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl flex-shrink-0"
                    >
                      <Send size={20} />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-red-700">
                <div className="text-center p-8">
                  <div className="bg-gradient-to-br from-red-200 to-red-300 rounded-full p-8 w-32 h-32 mx-auto mb-8 flex items-center justify-center shadow-2xl ring-4 ring-red-100">
                    <MessageCircle size={48} className="text-red-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-red-800 mb-3 drop-shadow-sm">Red Messenger</h3>
                  <p className="text-red-600 text-lg">Select a conversation to start chatting</p>
                  <div className="flex justify-center gap-2 mt-4">
                    <span className="text-2xl animate-bounce">💬</span>
                    <span className="text-2xl animate-bounce" style={{ animationDelay: '0.1s' }}>❤️</span>
                    <span className="text-2xl animate-bounce" style={{ animationDelay: '0.2s' }}>😊</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatApp;