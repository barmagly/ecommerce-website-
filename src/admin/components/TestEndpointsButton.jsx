import React from 'react';

function TestEndpointsButton() {
  const handleTestEndpoints = () => {
    // Check for token in localStorage
    const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
    if (!token) {
      alert('يجب تسجيل الدخول أولاً لاختبار نقاط النهاية');
      // Optionally, redirect to login page:
      // window.location.href = '/admin/login';
      return;
    }

    // If logged in, proceed with endpoint tests
    // ... your endpoint testing logic here ...
    console.log('Testing backend endpoints...');
    // Example: fetch('/api/auth', { headers: { Authorization: `Bearer ${token}` } })
  };

  return (
    <button
      style={{
        border: '1px solid #2196f3',
        background: 'white',
        color: '#2196f3',
        borderRadius: '6px',
        padding: '12px 24px',
        fontSize: '16px',
        cursor: 'pointer',
        margin: '16px auto',
        display: 'block'
      }}
      onClick={handleTestEndpoints}
    >
      اختار ENDPOINTS الخلفية
    </button>
  );
}

export default TestEndpointsButton; 