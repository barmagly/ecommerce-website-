import React, { useState } from 'react';

function TestEndpointsButton() {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleTestEndpoints = async () => {
    // Always re-read the token on click!
    const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
    if (!token) {
      alert('يجب تسجيل الدخول أولاً لاختبار نقاط النهاية');
      setResult(null);
      setError('يجب تسجيل الدخول أولاً');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    try {
      // Example: Test /api/auth endpoint
      const response = await fetch('https://ecommerce-website-backend-nine.vercel.app/api/auth', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message || 'حدث خطأ أثناء اختبار نقاط النهاية');
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: 'center', margin: '16px 0' }}>
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
        disabled={loading}
      >
        {loading ? '...جاري الاختبار' : 'اختار ENDPOINTS الخلفية'}
      </button>
      {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
      {result && (
        <pre style={{
          textAlign: 'left',
          background: '#f5f5f5',
          borderRadius: 4,
          padding: 12,
          marginTop: 12,
          maxWidth: 600,
          marginLeft: 'auto',
          marginRight: 'auto',
          overflowX: 'auto'
        }}>{JSON.stringify(result, null, 2)}</pre>
      )}
    </div>
  );
}

export default TestEndpointsButton; 