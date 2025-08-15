'use client';

import { useUser } from '../../components/UserContext';
import { useEffect, useState } from 'react';

export default function SimpleLogin() {
  const { user, login, logout } = useUser();
  const [localStorageContent, setLocalStorageContent] = useState('');

  const handleLogin = () => {
    console.log('=== SIMPLE LOGIN TEST ===');
    console.log('Before login - user:', user);
    
    login('admin');
    
    console.log('After login - user:', user);
    
    // Check localStorage immediately
    const stored = localStorage.getItem('stanfield_user');
    console.log('localStorage after login:', stored);
    setLocalStorageContent(stored || 'No data');
    
    // Wait a bit then navigate
    setTimeout(() => {
      console.log('Navigating to dashboard...');
      window.location.href = '/dashboard';
    }, 200);
  };

  const handleLogout = () => {
    logout();
    setLocalStorageContent('');
  };

  useEffect(() => {
    // Check localStorage on mount
    const stored = localStorage.getItem('stanfield_user');
    setLocalStorageContent(stored || 'No data');
    console.log('Page mounted, localStorage:', stored);
  }, []);

  useEffect(() => {
    console.log('User state changed:', user);
  }, [user]);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Simple Login Test</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>Current User:</h3>
        <pre style={{ background: '#f0f0f0', padding: '10px', borderRadius: '5px' }}>
          {JSON.stringify(user, null, 2)}
        </pre>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>localStorage Content:</h3>
        <pre style={{ background: '#e9ecef', padding: '10px', borderRadius: '5px' }}>
          {localStorageContent}
        </pre>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={handleLogin}
          style={{ 
            margin: '5px', 
            padding: '15px 30px', 
            fontSize: '18px',
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
          onClick={handleLogout}
          style={{ 
            margin: '5px', 
            padding: '15px 30px', 
            fontSize: '18px',
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
        <h3>Navigation:</h3>
        <a href="/dashboard" style={{ 
          margin: '5px', 
          padding: '10px 20px', 
          fontSize: '16px',
          backgroundColor: '#28a745',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '5px',
          display: 'inline-block'
        }}>
          Go to Dashboard
        </a>
        
        <a href="/test" style={{ 
          margin: '5px', 
          padding: '10px 20px', 
          fontSize: '16px',
          backgroundColor: '#6c757d',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '5px',
          display: 'inline-block'
        }}>
          Go to Test Page
        </a>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Debug Info:</h3>
        <pre style={{ background: '#f8f9fa', padding: '10px', borderRadius: '5px', fontSize: '12px' }}>
          {JSON.stringify({
            user,
            localStorageContent,
            timestamp: new Date().toISOString(),
            windowAvailable: typeof window !== 'undefined'
          }, null, 2)}
        </pre>
      </div>
    </div>
  );
}
