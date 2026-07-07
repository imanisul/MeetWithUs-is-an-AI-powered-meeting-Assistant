import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

function AdminDashboard({ token }) {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setIsSearching(true);
    const loadingToast = toast.loading('Searching AI knowledge base...');
    
    try {
      // Calls the API Gateway which proxies to ai-service
      const res = await axios.get(`http://localhost:8000/ai/search?q=${encodeURIComponent(query)}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setSearchResults(res.data.data);
      toast.success('Search complete', { id: loadingToast });
    } catch (err) {
      console.error(err);
      toast.error('Search failed: ' + (err.response?.data?.message || err.message), { id: loadingToast });
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <section className="glass" style={{ padding: '2rem', borderLeft: '4px solid var(--primary)' }}>
        <h2>Admin Control Center</h2>
        <p style={{ color: 'var(--text-muted)' }}>You have elevated permissions. From here you can search all meeting transcripts and documents using AI RAG.</p>
      </section>

      <section className="glass" style={{ padding: '2rem' }}>
        <h2>AI Knowledge Search (RAG)</h2>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', alignItems: 'flex-start' }}>
          <div style={{ flex: 1 }}>
            <input 
              type="text" 
              className="input-field" 
              placeholder="Ask anything about past meetings (e.g., 'What was discussed about Q3 marketing?')" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={isSearching}>
            {isSearching ? 'Searching...' : 'Ask AI'}
          </button>
        </form>

        {searchResults && (
          <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'rgba(0,0,0,0.2)', borderRadius: '12px' }}>
            <h3 style={{ marginBottom: '1rem', color: 'var(--primary)' }}>AI Response:</h3>
            <p style={{ lineHeight: '1.6', fontSize: '1.1rem' }}>{searchResults.answer}</p>
            
            {searchResults.sources && searchResults.sources.length > 0 && (
              <div style={{ marginTop: '1.5rem' }}>
                <h4 style={{ color: 'var(--text-muted)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Sources utilized:</h4>
                <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', color: 'var(--text-muted)' }}>
                  {searchResults.sources.map((source, index) => (
                    <li key={index}>{source}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

export default AdminDashboard;
