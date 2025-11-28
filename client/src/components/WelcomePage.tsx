import React from 'react';

interface WelcomePageProps {
  onLoginClick: () => void;
  onRegisterClick: () => void;
  onGuestClick: () => void;
  onLogout?: () => void;
  isAuthenticated?: boolean;
}

const WelcomePage: React.FC<WelcomePageProps> = ({ onLoginClick, onRegisterClick, onGuestClick, onLogout, isAuthenticated = false }) => {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f5f5f5',
      padding: '20px',
      position: 'relative',
    }}>
      {/* ログアウトボタン（右上） */}
      {isAuthenticated && (
        <div style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
        }}>
          <button
            onClick={onLogout}
            style={{
              padding: '8px 16px',
              fontSize: '14px',
              border: '2px solid #dc3545',
              borderRadius: '8px',
              backgroundColor: '#dc3545',
              color: 'white',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            ログアウト
          </button>
        </div>
      )}
      <div style={{
        maxWidth: '500px',
        width: '100%',
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      }}>
        <h1 style={{
          textAlign: 'center',
          marginBottom: '10px',
          fontSize: '32px',
          color: '#333',
        }}>
          PhiloCompass
        </h1>
        <p style={{
          textAlign: 'center',
          color: '#666',
          marginBottom: '40px',
          fontSize: '14px',
        }}>
          あなたの思想を16次元で可視化
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <button
            onClick={onLoginClick}
            style={{
              padding: '16px',
              fontSize: '16px',
              fontWeight: 'bold',
              border: '2px solid #007bff',
              borderRadius: '8px',
              backgroundColor: '#007bff',
              color: 'white',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#0056b3';
              e.currentTarget.style.borderColor = '#0056b3';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#007bff';
              e.currentTarget.style.borderColor = '#007bff';
            }}
          >
            ログイン
          </button>

          <button
            onClick={onRegisterClick}
            style={{
              padding: '16px',
              fontSize: '16px',
              fontWeight: 'bold',
              border: '2px solid #28a745',
              borderRadius: '8px',
              backgroundColor: '#28a745',
              color: 'white',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#1e7e34';
              e.currentTarget.style.borderColor = '#1e7e34';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#28a745';
              e.currentTarget.style.borderColor = '#28a745';
            }}
          >
            新規登録
          </button>

          <button
            onClick={onGuestClick}
            style={{
              padding: '16px',
              fontSize: '16px',
              fontWeight: 'bold',
              border: '2px solid #ddd',
              borderRadius: '8px',
              backgroundColor: 'white',
              color: '#333',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f5f5f5';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'white';
            }}
          >
            ゲストとして参加
          </button>
        </div>

        <p style={{
          marginTop: '30px',
          fontSize: '12px',
          color: '#999',
          textAlign: 'center',
          lineHeight: '1.6',
        }}>
          ゲストとして参加した場合、統計には貢献しますが、<br />
          結果を保存して後で確認することはできません
        </p>
      </div>
    </div>
  );
};

export default WelcomePage;
