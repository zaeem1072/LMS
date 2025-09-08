// import { useEffect, useState } from 'react';

// function Debug() {
//   const [info, setInfo] = useState({
//     isAuthenticated: localStorage.getItem('isAuthenticated'),
//     userRole: localStorage.getItem('userRole'),
//     token: localStorage.getItem('token'),
//     currentPath: window.location.pathname
//   });

//   useEffect(() => {
//     console.log('Debug Info:', info);
//   }, [info]);

//   return (
//     <div style={{ 
//       padding: '2rem', 
//       backgroundColor: '#f0f0f0', 
//       margin: '1rem',
//       borderRadius: '8px',
//       fontFamily: 'monospace'
//     }}>
//       <h2>🐛 Debug Information</h2>
//       <div style={{ marginBottom: '1rem' }}>
//         <strong>Current URL:</strong> {window.location.href}
//       </div>
//       <div style={{ marginBottom: '1rem' }}>
//         <strong>Path:</strong> {info.currentPath}
//       </div>
//       <div style={{ marginBottom: '1rem' }}>
//         <strong>Is Authenticated:</strong> {info.isAuthenticated || 'null'}
//       </div>
//       <div style={{ marginBottom: '1rem' }}>
//         <strong>User Role:</strong> {info.userRole || 'null'}
//       </div>
//       <div style={{ marginBottom: '1rem' }}>
//         <strong>Token:</strong> {info.token ? `${info.token.substring(0, 20)}...` : 'null'}
//       </div>
      
//       <button 
//         onClick={() => {
//           localStorage.clear();
//           window.location.href = '/login';
//         }}
//         style={{
//           padding: '8px 16px',
//           backgroundColor: '#dc2626',
//           color: 'white',
//           border: 'none',
//           borderRadius: '4px',
//           cursor: 'pointer',
//           marginRight: '8px'
//         }}
//       >
//         Clear Storage & Go to Login
//       </button>
      
//       <button 
//         onClick={() => {
//           localStorage.setItem('isAuthenticated', 'true');
//           localStorage.setItem('userRole', 'admin');
//           localStorage.setItem('token', 'test-admin-token');
//           window.location.reload();
//         }}
//         style={{
//           padding: '8px 16px',
//           backgroundColor: '#059669',
//           color: 'white',
//           border: 'none',
//           borderRadius: '4px',
//           cursor: 'pointer',
//           marginRight: '8px'
//         }}
//       >
//         Set Admin Test Data
//       </button>

//       <button 
//         onClick={() => {
//           localStorage.setItem('isAuthenticated', 'true');
//           localStorage.setItem('userRole', 'mini_admin');
//           localStorage.setItem('token', 'test-mini-admin-token');
//           window.location.reload();
//         }}
//         style={{
//           padding: '8px 16px',
//           backgroundColor: '#4b6cb7',
//           color: 'white',
//           border: 'none',
//           borderRadius: '4px',
//           cursor: 'pointer'
//         }}
//       >
//         Set Mini-Admin Test Data
//       </button>
//     </div>
//   );
// }

// export default Debug;
