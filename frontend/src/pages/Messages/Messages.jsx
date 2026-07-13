import "./Messages.css";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import {
  getConversations,
  getMessages,
  sendMessage,
  startConversation,
} from "../../services/messageService";

const currentUser = JSON.parse(localStorage.getItem("user")) || {};

function getOtherParticipant(conv) {
  return conv.participants?.find((p) => p.id !== currentUser.id) || conv.participants?.[0];
}

function getInitials(participant) {
  if (!participant) return "?";
  return (participant.first_name?.[0] || participant.email?.[0] || "?").toUpperCase();
}

function formatTime(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  const today = new Date();
  if (d.toDateString() === today.toDateString()) return "Today";
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

export default function Messages() {
  const [conversations, setConversations] = useState([]);
  const [activeConv, setActiveConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loadingConvs, setLoadingConvs] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [sending, setSending] = useState(false);
  const [showNewChat, setShowNewChat] = useState(false);
  const [newRecipientId, setNewRecipientId] = useState("");
  const [newBody, setNewBody] = useState("");
  const messagesEndRef = useRef(null);
  const pollRef = useRef(null);

  // Load conversations on mount
  useEffect(() => {
    loadConversations();
  }, []);

  // Poll for new messages every 4s when a conversation is open
  useEffect(() => {
    if (activeConv) {
      pollRef.current = setInterval(() => refreshMessages(activeConv.id), 4000);
    }
    return () => clearInterval(pollRef.current);
  }, [activeConv]);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadConversations = async () => {
    try {
      const data = await getConversations();
      setConversations(data);
      if (data.length > 0 && !activeConv) {
        selectConversation(data[0]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingConvs(false);
    }
  };

  const selectConversation = async (conv) => {
    setActiveConv(conv);
    setLoadingMsgs(true);
    try {
      const data = await getMessages(conv.id);
      setMessages(data);
      // Update unread count locally
      setConversations((prev) =>
        prev.map((c) => (c.id === conv.id ? { ...c, unread_count: 0 } : c))
      );
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingMsgs(false);
    }
  };

  const refreshMessages = async (convId) => {
    try {
      const data = await getMessages(convId);
      setMessages(data);
    } catch (e) {
      /* silent */
    }
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text || !activeConv) return;

    setSending(true);
    setInput("");

    // Optimistic update
    const optimistic = {
      id: `opt-${Date.now()}`,
      body: text,
      sender: { id: currentUser.id, email: currentUser.email, first_name: currentUser.first_name, last_name: currentUser.last_name },
      created_at: new Date().toISOString(),
      is_read: false,
    };
    setMessages((prev) => [...prev, optimistic]);

    try {
      const real = await sendMessage(activeConv.id, text);
      setMessages((prev) =>
        prev.map((m) => (m.id === optimistic.id ? real : m))
      );
      // Bump conversation preview
      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeConv.id
            ? { ...c, last_message: { body: text, sender_email: currentUser.email } }
            : c
        )
      );
    } catch (e) {
      toast.error("Failed to send message.");
      setMessages((prev) => prev.filter((m) => m.id !== optimistic.id));
      setInput(text);
    } finally {
      setSending(false);
    }
  };

  const handleStartConversation = async () => {
    if (!newRecipientId || !newBody.trim()) {
      toast.error("Enter a recipient user ID and a message.");
      return;
    }
    try {
      const conv = await startConversation(Number(newRecipientId), newBody.trim());
      setConversations((prev) => {
        const exists = prev.find((c) => c.id === conv.id);
        return exists ? prev.map((c) => (c.id === conv.id ? conv : c)) : [conv, ...prev];
      });
      setShowNewChat(false);
      setNewRecipientId("");
      setNewBody("");
      selectConversation(conv);
    } catch (e) {
      toast.error(e.response?.data?.detail || "Could not start conversation.");
    }
  };

  // Group messages by date
  const grouped = messages.reduce((acc, msg) => {
    const label = formatDate(msg.created_at);
    if (!acc[label]) acc[label] = [];
    acc[label].push(msg);
    return acc;
  }, {});

  const totalUnread = conversations.reduce((s, c) => s + (c.unread_count || 0), 0);

  return (
    <div className="messages-page">
      <ToastContainer position="top-right" />

      <div className="messages-header">
        <div>
          <h1>
            <i className="bi bi-chat-dots-fill"></i> Messages
            {totalUnread > 0 && (
              <span className="header-unread">{totalUnread}</span>
            )}
          </h1>
          <p>Real-time conversations with organizers and support.</p>
        </div>
        <button className="new-chat-btn" onClick={() => setShowNewChat(true)}>
          <i className="bi bi-pencil-square"></i> New Message
        </button>
      </div>

      {/* New Conversation Modal */}
      <AnimatePresence>
        {showNewChat && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowNewChat(false)}
          >
            <motion.div
              className="modal-box"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3><i className="bi bi-chat-plus-fill"></i> New Conversation</h3>
              <p>Enter the User ID of the person you want to message.</p>
              <input
                type="number"
                placeholder="Recipient User ID"
                value={newRecipientId}
                onChange={(e) => setNewRecipientId(e.target.value)}
              />
              <textarea
                placeholder="Write your first message..."
                value={newBody}
                onChange={(e) => setNewBody(e.target.value)}
                rows={3}
              />
              <div className="modal-actions">
                <button className="cancel-modal-btn" onClick={() => setShowNewChat(false)}>
                  Cancel
                </button>
                <button className="send-modal-btn" onClick={handleStartConversation}>
                  <i className="bi bi-send-fill"></i> Send
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="messages-layout">
        {/* ── Conversations Panel ── */}
        <div className="conversations-panel">
          {loadingConvs ? (
            <div className="panel-loading">Loading...</div>
          ) : conversations.length === 0 ? (
            <div className="panel-empty">
              <i className="bi bi-chat-square-dots"></i>
              <p>No conversations yet.</p>
              <button onClick={() => setShowNewChat(true)}>Start one</button>
            </div>
          ) : (
            conversations.map((conv) => {
              const other = getOtherParticipant(conv);
              const isActive = activeConv?.id === conv.id;
              return (
                <div
                  key={conv.id}
                  className={`conv-item ${isActive ? "active" : ""}`}
                  onClick={() => selectConversation(conv)}
                >
                  <div className="conv-avatar">{getInitials(other)}</div>
                  <div className="conv-info">
                    <div className="conv-top">
                      <h4>{other?.first_name} {other?.last_name || other?.email}</h4>
                      {conv.last_message?.created_at && (
                        <small>{formatDate(conv.last_message.created_at)}</small>
                      )}
                    </div>
                    <div className="conv-bottom">
                      <p>{conv.last_message?.body || "Start the conversation"}</p>
                      {conv.unread_count > 0 && (
                        <span className="unread-badge">{conv.unread_count}</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* ── Chat Panel ── */}
        <div className="chat-panel">
          {!activeConv ? (
            <div className="chat-empty">
              <i className="bi bi-chat-dots"></i>
              <p>Select a conversation to start chatting.</p>
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div className="chat-header">
                {(() => {
                  const other = getOtherParticipant(activeConv);
                  return (
                    <>
                      <div className="chat-avatar">{getInitials(other)}</div>
                      <div>
                        <h4>{other?.first_name} {other?.last_name || ""}</h4>
                        <small>{other?.role || "User"} · {other?.email}</small>
                      </div>
                    </>
                  );
                })()}
              </div>

              {/* Messages */}
              <div className="chat-messages">
                {loadingMsgs ? (
                  <div className="msgs-loading">Loading messages...</div>
                ) : (
                  Object.entries(grouped).map(([dateLabel, msgs]) => (
                    <div key={dateLabel}>
                      <div className="date-divider"><span>{dateLabel}</span></div>
                      {msgs.map((msg) => {
                        const isMine = msg.sender?.id === currentUser.id;
                        return (
                          <motion.div
                            key={msg.id}
                            className={`msg-row ${isMine ? "mine" : "theirs"}`}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            {!isMine && (
                              <div className="msg-avatar">
                                {getInitials(msg.sender)}
                              </div>
                            )}
                            <div className="msg-bubble">
                              <p>{msg.body}</p>
                              <small>{formatTime(msg.created_at)}</small>
                            </div>
                            {isMine && (
                              <div className="msg-status">
                                <i className={`bi ${msg.is_read ? "bi-check2-all" : "bi-check2"}`}></i>
                              </div>
                            )}
                          </motion.div>
                        );
                      })}
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="chat-input">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                  disabled={sending}
                />
                <button
                  className="send-btn"
                  onClick={handleSend}
                  disabled={sending || !input.trim()}
                >
                  <i className={`bi ${sending ? "bi-hourglass-split" : "bi-send-fill"}`}></i>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
