import React from 'react';
import styles from '../styles/Welcome.module.scss';

interface WelcomePageProps {
  onLoginClick: () => void;
  onRegisterClick: () => void;
  onGuestClick: () => void;
  onHistoryClick?: () => void;
  onLogout?: () => void;
  isAuthenticated?: boolean;
}

const WelcomePage: React.FC<WelcomePageProps> = ({ onLoginClick, onRegisterClick, onGuestClick, onHistoryClick, onLogout, isAuthenticated = false }) => {
  // Google OAuth認証を開始
  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:8081/api/auth/google';
  };

  return (
    <div className={styles.welcomeContainer}>
      {/* ログアウトボタン（右上） */}
      {isAuthenticated && (
        <button onClick={onLogout} className={styles.logoutButton}>
          ログアウト
        </button>
      )}

      <div className={styles.welcomeCard}>
        <h1 className={styles.title}>PhiloCompass</h1>
        <p className={styles.subtitle}>あなたの思想を16次元で可視化</p>

        <div className={styles.buttonContainer}>
          {/* Googleログインボタン */}
          <button onClick={handleGoogleLogin} className={styles.googleButton}>
            Googleでログイン
          </button>

          {/* 区切り線 */}
          <div className={styles.divider}>
            <div className={styles.dividerLine} />
            <span className={styles.dividerText}>または</span>
            <div className={styles.dividerLine} />
          </div>

          {/* 既存のログイン/登録ボタン */}
          <button onClick={onLoginClick} className={styles.loginButton}>
            メール/パスワードでログイン
          </button>

          <button onClick={onRegisterClick} className={styles.registerButton}>
            新規登録
          </button>

          <button onClick={onGuestClick} className={styles.guestButton}>
            ゲストとして参加
          </button>
        </div>

        <p className={styles.note}>
          ゲストとして参加した場合、統計には貢献しますが、<br />
          結果を保存して後で確認することはできません
        </p>
      </div>
    </div>
  );
};

export default WelcomePage;
