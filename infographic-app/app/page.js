'use client';

import { useState } from 'react';

export default function HomePage() {
  const [headerTitle, setHeaderTitle] = useState('');
  const [headerContent, setHeaderContent] = useState('');

  const [bodyTitle, setBodyTitle] = useState('');
  const [bodyContent, setBodyContent] = useState('');

  const [footerTitle, setFooterTitle] = useState('');
  const [footerContent, setFooterContent] = useState('');

  const [audience, setAudience] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setImageUrl(null);

    try {
      // Send each field separately
      const res = await fetch('/api/render', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          headerTitle,
          headerContent,
          bodyTitle,
          bodyContent,
          footerTitle,
          footerContent,
          audience
        })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'An error occurred while rendering.');
      }

      const data = await res.json();
      setImageUrl(data.image_url);
    } catch (error) {
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '50px auto', fontFamily: 'Arial, sans-serif', padding: '20px' }}>
      <h1>Create Your Anti-Drug Infographic</h1>
      <form onSubmit={handleSubmit}>
        <h2>Header Section</h2>
        <input
          type="text"
          placeholder="Header Title"
          value={headerTitle}
          onChange={(e) => setHeaderTitle(e.target.value)}
          style={{ width: '100%', marginBottom: '8px', padding: '8px' }}
          required
        />
        <textarea
          placeholder="Header Content"
          value={headerContent}
          onChange={(e) => setHeaderContent(e.target.value)}
          style={{ width: '100%', marginBottom: '16px', padding: '8px' }}
          required
        />

        <h2>Body Section</h2>
        <input
          type="text"
          placeholder="Body Title"
          value={bodyTitle}
          onChange={(e) => setBodyTitle(e.target.value)}
          style={{ width: '100%', marginBottom: '8px', padding: '8px' }}
          required
        />
        <textarea
          placeholder="Body Content"
          value={bodyContent}
          onChange={(e) => setBodyContent(e.target.value)}
          style={{ width: '100%', marginBottom: '16px', padding: '8px' }}
          required
        />

        <h2>Footer Section</h2>
        <input
          type="text"
          placeholder="Footer Title"
          value={footerTitle}
          onChange={(e) => setFooterTitle(e.target.value)}
          style={{ width: '100%', marginBottom: '8px', padding: '8px' }}
          required
        />
        <textarea
          placeholder="Footer Content"
          value={footerContent}
          onChange={(e) => setFooterContent(e.target.value)}
          style={{ width: '100%', marginBottom: '16px', padding: '8px' }}
          required
        />

        <h2>Target Audience</h2>
        <input
          type="text"
          placeholder="e.g., Teenagers, University Students"
          value={audience}
          onChange={(e) => setAudience(e.target.value)}
          style={{ width: '100%', marginBottom: '16px', padding: '8px' }}
          required
        />

        <button type="submit" style={{ padding: '10px 20px' }} disabled={loading}>
          {loading ? 'Generating...' : 'Generate Infographic'}
        </button>
      </form>

      {errorMsg && <p style={{ color: 'red', marginTop: '20px' }}>{errorMsg}</p>}

      {imageUrl && (
        <div style={{ marginTop: '20px' }}>
          <h2>Your Generated Infographic</h2>
          <img src={imageUrl} alt="Generated Infographic" style={{ width: '100%', border: '1px solid #ccc' }} />
        </div>
      )}
    </div>
  );
}
