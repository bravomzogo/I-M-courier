import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCommentAlt, FaTimes, FaPaperPlane, FaUser, FaHeadset } from "react-icons/fa";

const LiveChat = () => {
  // Luxurious golden and dark theme colors
  const colors = {
    primary: '#D4AF37',       // Classic gold
    primaryLight: '#E8C766',  // Light gold
    primaryDark: '#B38B2D',   // Dark gold
    secondary: '#1A1A2E',     // Deep navy
    secondaryLight: '#e6e6eeff',// Light navy
    dark: '#121212',          // Rich black
    light: '#F9F7F0',         // Cream/off-white
    gray: '#7D7D7D',          // Medium gray
    lightGray: '#E5E5E5',     // Light gray
    accent: '#A52A2A',        // Rich burgundy
    success: '#4CAF50'        // Emerald green
  };

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      text: "Hello! Welcome to I&M Courier support. How can we assist you today?",
      sender: "bot",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const messagesEndRef = useRef(null);

  // Handle window resize for mobile responsiveness
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-scroll to latest message
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      const newMessage = {
        text: inputMessage,
        sender: "user",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, newMessage]);
      setInputMessage("");
      setIsTyping(true);
      
      // Simulate bot response
      setTimeout(() => {
     const responses = [
  "For further assistance, please contact us at +255 693 212 091 or email us at issasuleman93@gmail.com.",
  "Thank you for reaching out! Our team will be happy to help you. Please call +255 693 212 091 or send an email to issasuleman93@gmail.com.",
  "That's a great question! For detailed support, kindly reach us at +255 693 212 091 or via email at issasuleman93@gmail.com.",
  "We appreciate your message. To get immediate assistance, please contact us at +255 693 212 091 or email issasuleman93@gmail.com."
];

        const botResponse = {
          text: responses[Math.floor(Math.random() * responses.length)],
          sender: "bot",
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botResponse]);
        setIsTyping(false);
      }, 1500 + Math.random() * 2000);
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Mobile responsive values
  const chatPosition = windowWidth < 640 ? 'bottom-0 right-0' : 'bottom-6 right-6';
  const chatDimensions = windowWidth < 640 ? 
    { width: '100vw', height: '100vh', borderRadius: '0' } : 
    { width: '100%', height: '75vh', borderRadius: '1rem' };
  const buttonPosition = windowWidth < 640 ? 'bottom-4 right-4' : 'bottom-6 right-6';

  return (
    <>
      {/* Floating Chat Button */}
      <motion.div
        className={`fixed ${buttonPosition} z-50`}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
      >
        <motion.button
          onClick={() => setIsOpen(true)}
          className={`p-4 rounded-full shadow-xl text-white relative group ${
            messages.length > 1 ? "ring-2 ring-primary" : ""
          }`}
          style={{
            backgroundColor: colors.primary,
            boxShadow: `0 4px 20px ${colors.primary}80`
          }}
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Open live chat"
        >
          <FaCommentAlt className="text-2xl" />
          {messages.length > 1 && (
            <motion.span 
              className="absolute -top-1 -right-1 bg-accent text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
            >
              {messages.length - 1}
            </motion.span>
          )}
          {windowWidth >= 640 && (
            <motion.div 
              className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-dark text-light text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ backgroundColor: colors.secondary }}
            >
              Need Help?
            </motion.div>
          )}
        </motion.button>
      </motion.div>

      {/* Chat Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={`fixed ${chatPosition} z-50 flex items-end justify-end p-0 sm:p-6 pointer-events-none w-full sm:w-auto`}
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <motion.div
              className="flex flex-col w-full sm:max-w-md"
              style={{ 
                height: chatDimensions.height,
                maxHeight: '100vh',
                borderRadius: chatDimensions.borderRadius,
                width: chatDimensions.width,
                maxWidth: '100vw'
              }}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              {/* Overlay for mobile to close chat when clicking outside */}
              {windowWidth < 640 && (
                <div 
                  className="absolute inset-0 bg-black bg-opacity-50 pointer-events-auto"
                  onClick={() => setIsOpen(false)}
                />
              )}
              
              {/* Actual chat container */}
              <motion.div
                className="flex flex-col w-full h-full rounded-2xl overflow-hidden shadow-2xl pointer-events-auto relative"
                style={{ 
                  backgroundColor: colors.secondary,
                  border: `1px solid ${colors.primary}30`
                }}
                initial={{ y: windowWidth < 640 ? '100%' : 0 }}
                animate={{ y: 0 }}
                exit={{ y: windowWidth < 640 ? '100%' : 0 }}
                transition={{ duration: 0.3 }}
              >
                {/* Header */}
                <div
                  className="p-4 flex justify-between items-center"
                  style={{ 
                    backgroundColor: colors.primary,
                    borderBottom: `1px solid ${colors.primaryDark}`
                  }}
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-full bg-white bg-opacity-20">
                      <FaHeadset className="text-white text-lg" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        Premium Support
                      </h3>
                      <p className="text-xs text-white text-opacity-80">
                        I&M Courier Assistance
                      </p>
                    </div>
                  </div>
                  <motion.button
                    onClick={() => setIsOpen(false)}
                    className="text-white hover:text-dark p-1"
                    whileHover={{ scale: 1.2, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    style={{ backgroundColor: colors.primaryDark }}
                  >
                    <FaTimes className="text-lg" />
                  </motion.button>
                </div>

                {/* Messages */}
                <div
                  className="flex-1 p-4 space-y-4 overflow-y-auto custom-scrollbar"
                  style={{ backgroundColor: colors.secondaryLight }}
                >
                  {messages.map((msg, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`flex ${
                        msg.sender === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div className="flex flex-col max-w-[85%]">
                        <div className="flex items-center space-x-2 mb-1">
                          <div className={`p-1 rounded-full ${
                            msg.sender === "user" 
                              ? "bg-primary text-dark" 
                              : "bg-dark text-primary"
                          }`}>
                            {msg.sender === "user" ? (
                              <FaUser className="text-xs" />
                            ) : (
                              <FaHeadset className="text-xs" />
                            )}
                          </div>
                          <span className="text-xs text-lightGray">
                            {formatTime(msg.timestamp)}
                          </span>
                        </div>
                        <div
                          className={`px-4 py-3 rounded-2xl text-sm shadow-md ${
                            msg.sender === "user"
                              ? "rounded-br-none bg-primary text-dark"
                              : "rounded-bl-none bg-dark text-light"
                          }`}
                          style={{
                            border: msg.sender === "user" 
                              ? `1px solid ${colors.primaryDark}`
                              : `1px solid ${colors.secondary}`
                          }}
                        >
                          {msg.text}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex justify-start"
                    >
                      <div className="flex flex-col max-w-[85%]">
                        <div className="flex items-center space-x-2 mb-1">
                          <div className="p-1 rounded-full bg-dark text-primary">
                            <FaHeadset className="text-xs" />
                          </div>
                          <span className="text-xs text-lightGray">
                            typing...
                          </span>
                        </div>
                        <div className="px-4 py-3 rounded-2xl rounded-bl-none bg-dark text-light text-sm shadow-md flex space-x-1">
                          <motion.span
                            animate={{ y: [0, -3, 0] }}
                            transition={{ repeat: Infinity, duration: 1 }}
                            className="inline-block w-2 h-2 rounded-full bg-lightGray"
                          />
                          <motion.span
                            animate={{ y: [0, -3, 0] }}
                            transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                            className="inline-block w-2 h-2 rounded-full bg-lightGray"
                          />
                          <motion.span
                            animate={{ y: [0, -3, 0] }}
                            transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                            className="inline-block w-2 h-2 rounded-full bg-lightGray"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <form
                  onSubmit={handleSendMessage}
                  className="p-3 border-t flex items-center space-x-2"
                  style={{ 
                    borderColor: colors.secondary,
                    backgroundColor: colors.secondaryLight
                  }}
                >
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-3 rounded-full border focus:outline-none focus:ring-1 text-sm"
                    style={{
                      backgroundColor: colors.secondary,
                      borderColor: colors.primary + '50',
                      color: colors.light,
                      focusRingColor: colors.primary
                    }}
                  />
                  <motion.button
                    type="submit"
                    className="p-3 rounded-full disabled:opacity-50"
                    style={{
                      backgroundColor: colors.primary,
                      color: colors.dark
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    disabled={!inputMessage.trim()}
                  >
                    <FaPaperPlane />
                  </motion.button>
                </form>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom Scrollbar */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: ${colors.secondaryLight};
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: ${colors.primary}80;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: ${colors.primary};
        }
      `}</style>
    </>
  );
};

export default LiveChat;