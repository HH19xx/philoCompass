import React, { useState } from 'react';
import styles from '../styles/Auth.module.scss';

interface RegisterPageProps {
  onRegisterSuccess: (token: string, user: { id: number; username: string; email: string }) => void;
  onSwitchToLogin: () => void;
  onBackToWelcome?: () => void;
}

const RegisterPage: React.FC<RegisterPageProps> = ({ onRegisterSuccess, onSwitchToLogin, onBackToWelcome }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('パスワードが一致しません');
      return;
    }

    if (password.length < 6) {
      setError('パスワードは6文字以上で入力してください');
      return;
    }

    setIsLoading(true);

    try {
      const registerResponse = await fetch(`${API_URL}/api/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });

      const registerData = await registerResponse.json();

      if (!registerResponse.ok) {
        throw new Error(registerData.error || '登録に失敗しました');
      }

      const loginResponse = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const loginData = await loginResponse.json();

      if (!loginResponse.ok) {
        throw new Error('登録は成功しましたが、ログインに失敗しました');
      }

      onRegisterSuccess(loginData.token, loginData.user);
    } catch (err) {
      setError(err instanceof Error ? err.message : '登録に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

    // 登録せずに戻る場合のハンドラ
  const handleCancel = () => {
    if (onBackToWelcome) {
      onBackToWelcome();
    } else {
      onSwitchToLogin();
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>新規登録</h2>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.label}>ユーザー名</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              minLength={3}
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>メールアドレス</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>パスワード</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className={styles.input}
            />
            <small className={styles.helperText}>6文字以上で入力してください</small>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>パスワード（確認）</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className={styles.input}
            />
          </div>

          {error && (
            <div className={styles.errorMessage}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={styles.submitButton}
          >
            {isLoading ? '登録中...' : '登録'}
          </button>
        </form>

        <div className={styles.footer}>
          <span className={styles.footerText}>既にアカウントをお持ちですか？ </span>
          <button onClick={onSwitchToLogin} className={styles.switchLink}>
            ログイン
          </button>
        </div>
        <div>
          <button type="button" onClick={handleCancel} className={styles.switchLink}>
            戻る
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
