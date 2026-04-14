import { useEffect, useMemo, useRef, useState } from "react";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import { io } from "socket.io-client";
import API from "../../api/axios";
import styles from "./messages.module.css";

const API_BASE = "http://127.0.0.1:3333";

const getImageUrl = (path) => {
  if (!path) return "/avatar.png";
  return path.startsWith("http") ? path : `${API_BASE}${path}`;
};

const formatTime = (dateString) => {
  if (!dateString) return "";

  return new Date(dateString).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const Messages = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sendLoading, setSendLoading] = useState(false);
  const socketRef = useRef(null);
  const userIdRef = useRef(null);
  const activeChatRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, postsRes] = await Promise.all([
          API.get("/api/users/me"),
          API.get("/api/posts"),
        ]);

        setUser(userRes.data || null);
        setPosts(postsRes.data || []);
      } catch (err) {
        console.log("Messages page error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const chats = useMemo(() => {
    const uniqueUsers = [];
    const seen = new Set();

    posts.forEach((post) => {
      const author = post.author;
      if (!author?._id || seen.has(author._id) || author._id === user?._id) return;
      seen.add(author._id);
      uniqueUsers.push(author);
    });

    return uniqueUsers;
  }, [posts, user?._id]);

  useEffect(() => {
    if (!activeChatId && chats.length > 0) {
      setActiveChatId(chats[0]._id);
    }
  }, [activeChatId, chats]);

  useEffect(() => {
    userIdRef.current = user?._id || null;
  }, [user?._id]);

  useEffect(() => {
    activeChatRef.current = activeChatId || null;
  }, [activeChatId]);

  useEffect(() => {
    if (!user?._id) return;

    const socket = io(API_BASE, {
      auth: { userId: user._id },
      transports: ["websocket"],
    });

    socketRef.current = socket;

    socket.on("new-message", (incomingMessage) => {
      const senderId =
        typeof incomingMessage.sender === "object"
          ? incomingMessage.sender?._id
          : incomingMessage.sender;
      const receiverId =
        typeof incomingMessage.receiver === "object"
          ? incomingMessage.receiver?._id
          : incomingMessage.receiver;
      const currentUserId = userIdRef.current;
      const currentChatId = activeChatRef.current;

      if (!currentUserId || !currentChatId) return;

      const belongsToOpenChat =
        (senderId === currentChatId && receiverId === currentUserId) ||
        (senderId === currentUserId && receiverId === currentChatId);

      if (!belongsToOpenChat) return;

      setMessages((current) => {
        const exists = current.some((msg) => msg._id === incomingMessage._id);
        if (exists) return current;
        return [...current, incomingMessage];
      });
    });

    return () => {
      socket.off("new-message");
      socket.disconnect();
      socketRef.current = null;
    };
  }, [user?._id]);

  useEffect(() => {
    if (!activeChatId) return;

    const fetchConversation = async () => {
      try {
        const res = await API.get(`/api/messages/${activeChatId}`);
        setMessages(res.data || []);
      } catch (err) {
        console.log("Conversation error:", err);
      }
    };

    fetchConversation();
  }, [activeChatId]);

  const activeChat = chats.find((chat) => chat._id === activeChatId) || null;

  const handleSendMessage = async () => {
    if (!activeChatId || !newMessage.trim()) return;

    try {
      setSendLoading(true);
      const res = await API.post(`/api/messages/${activeChatId}`, {
        text: newMessage,
      });

      setMessages((current) => [...current, res.data]);
      setNewMessage("");
    } catch (err) {
      console.log("Send message error:", err);
    } finally {
      setSendLoading(false);
    }
  };

  if (loading) {
    return (
      <section className={styles.page}>
        <div className={styles.centerMessage}>Loading messages...</div>
      </section>
    );
  }

  return (
    <section className={styles.page}>
      <div className={styles.shell}>
        <aside className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <div>
              <p className={styles.username}>{user?.username || "username"}</p>
              <span className={styles.subtext}>Messages</span>
            </div>

            <button type="button" className={styles.iconButton}>
              <BorderColorOutlinedIcon />
            </button>
          </div>

          <div className={styles.sidebarTop}>
            <h2>Chats</h2>
            <span>{chats.length}</span>
          </div>

          <div className={styles.chatList}>
            {chats.length > 0 ? (
              chats.map((chat) => (
                <button
                  key={chat._id}
                  type="button"
                  onClick={() => setActiveChatId(chat._id)}
                  className={`${styles.chatItem} ${
                    chat._id === activeChatId ? styles.chatItemActive : ""
                  }`}
                >
                  <img
                    src={getImageUrl(chat.avatar)}
                    alt={chat.username}
                    className={styles.avatar}
                  />

                  <div className={styles.chatInfo}>
                    <p>{chat.username}</p>
                    <span>Tap to open chat</span>
                  </div>
                </button>
              ))
            ) : (
              <p className={styles.emptyText}>No conversations yet.</p>
            )}
          </div>
        </aside>

        <div className={styles.content}>
          {activeChat ? (
            <>
              <div className={styles.chatHeader}>
                <div className={styles.chatProfile}>
                  <img
                    src={getImageUrl(activeChat.avatar)}
                    alt={activeChat.username}
                    className={styles.headerAvatar}
                  />

                  <div>
                    <p>{activeChat.username}</p>
                    <span>{messages.length} messages</span>
                  </div>
                </div>
              </div>

              <div className={styles.messagesArea}>
                {messages.length > 0 ? (
                  messages.map((message) => {
                    const fromMe =
                      (typeof message.sender === "object"
                        ? message.sender?._id
                        : message.sender) === user?._id;

                    return (
                      <div
                        key={message._id}
                        className={`${styles.bubbleRow} ${
                          fromMe ? styles.bubbleRowRight : ""
                        }`}
                      >
                        <div>
                          <div
                            className={`${styles.bubble} ${
                              fromMe ? styles.bubbleMe : styles.bubbleThem
                            }`}
                          >
                            {message.text}
                          </div>
                          <div
                            className={`${styles.messageTime} ${
                              fromMe ? styles.messageTimeRight : ""
                            }`}
                          >
                            {formatTime(message.createdAt)}
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className={styles.centerMessage}>
                    No messages yet. Start the conversation.
                  </div>
                )}
              </div>

              <div className={styles.inputArea}>
                <input
                  placeholder="Message..."
                  className={styles.input}
                  value={newMessage}
                  onChange={(event) => setNewMessage(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      handleSendMessage();
                    }
                  }}
                />
                <button
                  type="button"
                  className={styles.sendButton}
                  onClick={handleSendMessage}
                  disabled={sendLoading || !newMessage.trim()}
                >
                  {sendLoading ? "Sending..." : "Send"}
                </button>
              </div>
            </>
          ) : (
            <div className={styles.centerMessage}>Select a chat to start messaging.</div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Messages;
