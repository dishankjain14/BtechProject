import React, { useState } from 'react';
import './App.css';
import EmojiPicker from 'emoji-picker-react';
import botImage from './images/chatbot.png';
import userImage from './images/user.png';

const App = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [language, setLanguage] = useState('english'); // State to manage selected language
  const [emojiPickerVisible, setEmojiPickerVisible] = useState(false); // State to manage emoji picker visibility
  const [chats, setChats] = useState([{ id: 1, name: 'Chat 1', messages: [] }]);
  const [activeChat, setActiveChat] = useState(1);

  // Simulated fetch to backend API based on language
  const getBotResponse = async (message) => {
    if (language === 'english') {
      return "Hey, my name is Dish, how can I help you?";
    } else {
      return "नमस्ते, मैं Dish हूँ, मैं आपकी कैसे सहायता कर सकता हूँ?";
    }
  };

  const sendMessage = async () => {
    if (input.trim() === '') return;

    const newMessage = { text: input, sender: 'user' };
    const updatedChats = [...chats];
    updatedChats[activeChat - 1].messages = [...updatedChats[activeChat - 1].messages, newMessage];
    setChats(updatedChats);

    const botResponseText = await getBotResponse(input);
    const botResponse = { text: botResponseText, sender: 'Dish' };

    setTimeout(() => {
      const updatedChats = [...chats];
      updatedChats[activeChat - 1].messages = [...updatedChats[activeChat - 1].messages, botResponse];
      setChats(updatedChats);
    }, 1000);

    setInput(''); // Clear input field
  };

  const changeLanguage = (lang) => {
    setLanguage(lang);
  };

  const onEmojiClick = (emojiObject) => {
    setInput((prevInput) => prevInput + emojiObject.emoji); // Append the selected emoji to the input
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  // Function to create a new chat window
  const createNewChat = () => {
    const newChatId = chats.length + 1;
    const newChat = { id: newChatId, name: `Chat ${newChatId}`, messages: [] };
    setChats([...chats, newChat]);
    setActiveChat(newChatId);
  };

  return (
    <div className="app-container">
      <ChatSidebar chats={chats} setActiveChat={setActiveChat} createNewChat={createNewChat} />
      <div className="chat-container">
        <div className="chat-header">
          <h2>Dish</h2>
          <div className="language-switcher">
            <button onClick={() => changeLanguage('english')} className={language === 'english' ? 'active' : ''}>
              English
            </button>
            <button onClick={() => changeLanguage('hindi')} className={language === 'hindi' ? 'active' : ''}>
              Hindi
            </button>
          </div>
        </div>
        <ChatWindow messages={chats[activeChat - 1].messages} />
        <InputBar
          input={input}
          setInput={setInput}
          sendMessage={sendMessage}
          handleKeyPress={handleKeyPress}
          emojiPickerVisible={emojiPickerVisible}
          setEmojiPickerVisible={setEmojiPickerVisible}
          onEmojiClick={onEmojiClick}
          language={language}
        />
      </div>
    </div>
  );
};

// ChatSidebar component with "New Chat" button
const ChatSidebar = ({ chats, setActiveChat, createNewChat }) => (
  <div className="chat-sidebar">
    <h3>Chats</h3>
    <ul>
      {chats.map((chat) => (
        <li key={chat.id} onClick={() => setActiveChat(chat.id)}>
          {chat.name}
        </li>
      ))}
    </ul>
    <button className="new-chat-btn" onClick={createNewChat}>
      + New Chat
    </button> {/* New button to open a new chat */}
  </div>
);

// ChatWindow and InputBar components (same as before)
const ChatWindow = ({ messages }) => (
  <div className="chat-window">
    {messages.map((msg, index) => (
      <div key={index} className={`message ${msg.sender}`}>
        <div className="message-container">
          <img
            src={msg.sender === 'user' ? userImage : botImage}
            alt={msg.sender}
            className="avatar"
          />
          <span>{msg.text}</span>
        </div>
      </div>
    ))}
  </div>
);

const InputBar = ({ input, setInput, sendMessage, handleKeyPress, emojiPickerVisible, setEmojiPickerVisible, onEmojiClick, language }) => (
  <div className="input-bar">
    <input
      type={language === 'english' ? 'text' : 'text'} // Adjust the input type based on language
      value={input}
      onChange={(e) => setInput(e.target.value)}
      onKeyPress={handleKeyPress}
      placeholder="Type a message..."
    />
    <button onClick={() => setEmojiPickerVisible(!emojiPickerVisible)}>😊</button>
    {emojiPickerVisible && (
      <div className="emoji-picker">
        <EmojiPicker onEmojiClick={onEmojiClick} />
      </div>
    )}
    <button onClick={sendMessage}>Send</button>
  </div>
);

export default App;
