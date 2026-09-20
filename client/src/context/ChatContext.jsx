import React, { createContext, useContext, useState, useCallback } from 'react';
import { conversations as convApi, messages as msgApi } from '../services/api';

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [typingUsers, setTypingUsers] = useState({});
  const [unreadCounts, setUnreadCounts] = useState({});

  const loadConversations = useCallback(async () => {
    try {
      const { data } = await convApi.getConversations();
      setConversations(data);
    } catch (error) {
      console.error('Error loading conversations', error);
    }
  }, []);

  const loadMessages = useCallback(async (conversationId) => {
    try {
      const { data } = await msgApi.getMessages(conversationId);
      setMessages(data.messages || data);
    } catch (error) {
      console.error('Error loading messages', error);
    }
  }, []);

  const sendMessage = async (messageData) => {
    try {
      const { data } = await msgApi.sendMessage(messageData);
      setMessages(prev => [...prev, data]);
      return data;
    } catch (error) {
      console.error('Error sending message', error);
      throw error;
    }
  };

  const editMessage = async (id, text) => {
    try {
      const { data } = await msgApi.editMessage(id, text);
      setMessages(prev => prev.map(m => m._id === id ? data : m));
    } catch (error) {
      console.error('Error editing message', error);
    }
  };

  const deleteMessage = async (id) => {
    try {
      await msgApi.deleteMessage(id);
      setMessages(prev => prev.filter(m => m._id !== id));
    } catch (error) {
      console.error('Error deleting message', error);
    }
  };

  const markAsRead = (conversationId) => {
    setUnreadCounts(prev => ({ ...prev, [conversationId]: 0 }));
  };

  return (
    <ChatContext.Provider value={{
      conversations,
      setConversations,
      activeConversation,
      setActiveConversation,
      messages,
      setMessages,
      onlineUsers,
      setOnlineUsers,
      typingUsers,
      setTypingUsers,
      unreadCounts,
      setUnreadCounts,
      loadConversations,
      loadMessages,
      sendMessage,
      editMessage,
      deleteMessage,
      markAsRead
    }}>
      {children}
    </ChatContext.Provider>
  );
};
