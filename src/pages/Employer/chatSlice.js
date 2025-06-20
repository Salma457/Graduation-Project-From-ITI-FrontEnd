// إضافة هذا في ملف chatSlice.js

import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  activeChat: null,
  contacts: [],
  messages: [],
  searchQuery: '',
  showMobileChat: false,
  currentUser: null,
  isTyping: false,
  unreadCount: 0,
}

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {

    setActiveChat: (state, action) => {
      state.activeChat = action.payload
      state.showMobileChat = true // للموبايل
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload
    },
    hideMobileChat: (state) => {
      state.showMobileChat = false
    },
    showMobileChat: (state) => {
      state.showMobileChat = true
    },
    // Action جديد لحفظ جهة اتصال
    saveContact: (state, action) => {
      const newContact = action.payload
      const existingIndex = state.contacts.findIndex(
        contact => contact.id === newContact.id
      )
      
      if (existingIndex >= 0) {
        // إذا كان موجود، حدث البيانات
        state.contacts[existingIndex] = { ...state.contacts[existingIndex], ...newContact }
      } else {
        // إذا لم يكن موجود، أضفه في البداية
        state.contacts.unshift(newContact)
      }
    },
    addMessage: (state, action) => {
      const message = action.payload
      state.messages.push(message)
      
      // حدث آخر رسالة في جهة الاتصال
      if (state.activeChat && (
        message.to_id === state.activeChat.id || 
        message.from_id === state.activeChat.id
      )) {
        const contactIndex = state.contacts.findIndex(
          contact => contact.id === state.activeChat.id
        )
        if (contactIndex >= 0) {
          state.contacts[contactIndex].lastMessage = message.body
          state.contacts[contactIndex].timestamp = message.created_at
        }
      }
    },
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload
    },
    setMessages: (state, action) => {
      state.messages = action.payload
    },
    clearMessages: (state) => {
      state.messages = []
    },
    updateMessageStatus: (state, action) => {
      const { messageId, status } = action.payload
      const messageIndex = state.messages.findIndex(msg => msg.id === messageId)
      if (messageIndex >= 0) {
        state.messages[messageIndex].status = status
      }
    },
    setContacts: (state, action) => {
      state.contacts = action.payload
    },
    updateContactLastMessage: (state, action) => {
      const { contactId, message, timestamp } = action.payload
      const contactIndex = state.contacts.findIndex(contact => contact.id === contactId)
      if (contactIndex >= 0) {
        state.contacts[contactIndex].lastMessage = message
        state.contacts[contactIndex].timestamp = timestamp
        // انقل جهة الاتصال للأعلى
        const updatedContact = state.contacts[contactIndex]
        state.contacts.splice(contactIndex, 1)
        state.contacts.unshift(updatedContact)
      }
    },
    incrementUnreadCount: (state, action) => {
      const contactId = action.payload
      const contactIndex = state.contacts.findIndex(contact => contact.id === contactId)
      if (contactIndex >= 0) {
        state.contacts[contactIndex].unreadCount = (state.contacts[contactIndex].unreadCount || 0) + 1
      }
    },
    clearUnreadCount: (state, action) => {
      const contactId = action.payload
      const contactIndex = state.contacts.findIndex(contact => contact.id === contactId)
      if (contactIndex >= 0) {
        state.contacts[contactIndex].unreadCount = 0
      }
    },
    setTyping: (state, action) => {
      state.isTyping = action.payload
    },
    resetChat: (state) => {
      return initialState
    }
  }
})

export const {
  setActiveChat,
  setSearchQuery,
  hideMobileChat,
  showMobileChat,
  saveContact,
  addMessage,
  setCurrentUser,
  setMessages,
  clearMessages,
  updateMessageStatus,
  setContacts,
  updateContactLastMessage,
  incrementUnreadCount,
  clearUnreadCount,
  setTyping,
  resetChat
} = chatSlice.actions

export default chatSlice.reducer