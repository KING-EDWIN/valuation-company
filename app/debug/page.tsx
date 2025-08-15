'use client';

import { useUser } from '../../components/UserContext';

export default function DebugPage() {
  const { user, login, logout } = useUser();

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Debug Page</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>Current User State:</h3>
        <pre style={{ background: '#f0f0f0', padding: '10px', borderRadius: '5px' }}>
          {JSON.stringify(user, null, 2)}
        </pre>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Actions:</h3>
        <button 
          onClick={() => login('admin')}
          style={{ 
            margin: '5px', 
            padding: '10px 20px', 
            fontSize: '16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Login as Admin
        </button>
        
        <button 
          onClick={logout}
          style={{ 
            margin: '5px', 
            padding: '10px 20px', 
            fontSize: '16px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Logout
        </button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>localStorage Check:</h3>
        <div id="localStorageContent" style={{ background: '#e9ecef', padding: '10px', borderRadius: '5px' }}>
          Checking localStorage...
        </div>
        <button 
          onClick={() => {
            const content = localStorage.getItem('stanfield_user');
            document.getElementById('localStorageContent')!.textContent = content || 'No data';
          }}
          style={{ 
            margin: '5px', 
            padding: '5px 10px', 
            fontSize: '14px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '3px',
            cursor: 'pointer'
          }}
        >
          Check localStorage
        </button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Navigation:</h3>
        <a href="/dashboard" style={{ 
          margin: '5px', 
          padding: '10px 20px', 
          fontSize: '16px',
          backgroundColor: '#6c757d',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '5px',
          display: 'inline-block'
        }}>
          Go to Dashboard
        </a>
        
        <a href="/signin" style={{ 
          margin: '5px', 
          padding: '10px 20px', 
          fontSize: '16px',
          backgroundColor: '#17a2b8',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '5px',
          display: 'inline-block'
        }}>
          Go to Sign In
        </a>
      </div>
    </div>
  );
}
