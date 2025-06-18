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
    const interval = setInterval(fetchMessages, 10000); // Auto-refresh every 10 sec
    return () => clearInterval(interval);
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

  const handleReaction = async (id, type) => {
    await fetch(`http://localhost:8000/api/react/${id}/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type }),
    });
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
        <div key={msg.id} style={{ borderBottom: '1px solid #ccc', padding: '10px' }}>
          <strong>{msg.name}</strong>: {msg.content}
          <br /><small>{new Date(msg.timestamp).toLocaleString()}</small>
          <div style={{ marginTop: '8px' }}>
            <button onClick={() => handleReaction(msg.id, 'like')}>👍 {msg.reactions?.like || 0}</button>
            <button onClick={() => handleReaction(msg.id, 'love')}>❤️ {msg.reactions?.love || 0}</button>
            <button onClick={() => handleReaction(msg.id, 'funny')}>😂 {msg.reactions?.funny || 0}</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default App;
