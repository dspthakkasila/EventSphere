import api from "./api";

// Get all conversations for the logged-in user
export const getConversations = async () => {
  const response = await api.get("messages/conversations/");
  return response.data;
};

// Start a new conversation or send to existing one
export const startConversation = async (recipientId, body) => {
  const response = await api.post("messages/conversations/", {
    recipient_id: recipientId,
    body,
  });
  return response.data;
};

// Get all messages in a conversation (also marks incoming as read)
export const getMessages = async (convId) => {
  const response = await api.get(`messages/conversations/${convId}/messages/`);
  return response.data;
};

// Send a message in an existing conversation
export const sendMessage = async (convId, body) => {
  const response = await api.post(`messages/conversations/${convId}/messages/`, { body });
  return response.data;
};

// Total unread count
export const getUnreadCount = async () => {
  const response = await api.get("messages/unread/");
  return response.data.unread;
};
