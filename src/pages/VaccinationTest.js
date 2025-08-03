import React, { useState } from 'react';
import { confirmVaccination } from '../services/vaccinationApi';

function VaccinationTest() {
  const [confirmationId, setConfirmationId] = useState('test-confirmation-id');
  const [decision, setDecision] = useState('CONFIRMED');
  const [reason, setReason] = useState('Test confirmation reason');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setResult('');
      
      const confirmationData = {
        confirmationId: confirmationId,
        decision: decision,
        reason: reason,
        confirmedAt: new Date().toISOString()
      };

      console.log('🧪 Testing vaccination confirmation with data:', confirmationData);
      
      const response = await confirmVaccination(confirmationData);
      
      console.log('✅ Test response:', response);
      setResult(JSON.stringify(response, null, 2));
      
    } catch (error) {
      console.error('❌ Test error:', error);
      setResult(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '600px',
        margin: '0 auto',
        background: '#fff',
        borderRadius: '20px',
        padding: '30px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ 
          textAlign: 'center', 
          color: '#495057', 
          marginBottom: '30px' 
        }}>
          🧪 Test Vaccination Confirmation API
        </h1>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '5px', 
              fontWeight: '600',
              color: '#495057'
            }}>
              Confirmation ID:
            </label>
            <input
              type="text"
              value={confirmationId}
              onChange={(e) => setConfirmationId(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid #ddd',
                fontSize: '14px'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '5px', 
              fontWeight: '600',
              color: '#495057'
            }}>
              Decision:
            </label>
            <select
              value={decision}
              onChange={(e) => setDecision(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid #ddd',
                fontSize: '14px'
              }}
            >
              <option value="CONFIRMED">CONFIRMED</option>
              <option value="REJECTED">REJECTED</option>
            </select>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '5px', 
              fontWeight: '600',
              color: '#495057'
            }}>
              Reason:
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid #ddd',
                fontSize: '14px',
                minHeight: '80px',
                resize: 'vertical'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '15px',
              background: loading ? '#ccc' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Testing...' : 'Test API'}
          </button>
        </form>

        {result && (
          <div style={{
            marginTop: '30px',
            padding: '20px',
            background: '#f8f9fa',
            borderRadius: '10px',
            border: '1px solid #e9ecef'
          }}>
            <h3 style={{ 
              marginBottom: '15px', 
              color: '#495057' 
            }}>
              API Response:
            </h3>
            <pre style={{
              background: '#fff',
              padding: '15px',
              borderRadius: '8px',
              border: '1px solid #ddd',
              overflow: 'auto',
              fontSize: '12px',
              whiteSpace: 'pre-wrap'
            }}>
              {result}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

export default VaccinationTest; 