import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [name, setName] = useState('');
  const [content, setContent] = useState('');
  const [messages, setMessages] = useState([]);

  const fetchMessages = async () => {
    const res = await fetch('http://localhost:8000/api/messages/');
    const data = await res.json();
    setMessages(data);
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch('http://localhost:8000/api/submit/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, content }),
    });
    setName('');
    setContent('');
    fetchMessages();
  };

  return (
    <div className="App">
      <h1>📝 Guestbook</h1>
      <form onSubmit={handleSubmit}>
        <input placeholder="Your name" value={name} onChange={e => setName(e.target.value)} required />
        <textarea placeholder="Your message" value={content} onChange={e => setContent(e.target.value)} required />
        <button type="submit">Submit</button>
      </form>
      <hr />
      <h2>Messages:</h2>
      {messages.map(msg => (
        <div key={msg.id} style={{borderBottom: '1px solid #ccc', padding: '10px'}}>
          <strong>{msg.name}</strong>: {msg.content}
          <br /><small>{new Date(msg.timestamp).toLocaleString()}</small>
        </div>
      ))}
    </div>
  );
}

export default App;
