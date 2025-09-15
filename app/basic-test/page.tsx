'use client';

import { useUser } from '../../components/UserContext';

export default function BasicTest() {
  const { user, login, logout } = useUser();

  const testLogin = () => {
    console.log('Testing login...');
    login('admin');
    console.log('Login called, current user:', user);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Basic UserContext Test</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>Current User:</h3>
        <p>{user ? `Role: ${user.role}` : 'No user'}</p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <button onClick={testLogin} style={{ marginRight: '10px', padding: '10px' }}>
          Test Login
        </button>
        <button onClick={logout} style={{ padding: '10px' }}>
          Test Logout
        </button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>localStorage Check:</h3>
        <p id="storageContent">Click button to check</p>
        <button onClick={() => {
          const content = localStorage.getItem('valuation_user');
          document.getElementById('storageContent')!.textContent = content || 'No data';
        }}>
          Check localStorage
        </button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Debug:</h3>
        <pre style={{ background: '#f0f0f0', padding: '10px' }}>
          {JSON.stringify({ user, timestamp: new Date().toISOString() }, null, 2)}
        </pre>
      </div>
    </div>
  );
}
