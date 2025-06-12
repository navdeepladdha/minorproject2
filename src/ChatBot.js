import React from 'react';

const ChatBot = () => {
  return (
    <div className="chatbot-container">
      <h2>HealthCare ChatBot</h2>
      <iframe
        src="http://localhost:8501"
        width="100%"
        height="600px"
        title="HealthCare ChatBot"
        style={{ border: 'none' }}
      ></iframe>
    </div>
  );
};

export default ChatBot;
