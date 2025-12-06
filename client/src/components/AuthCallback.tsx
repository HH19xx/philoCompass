import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

interface AuthCallbackProps {
  onAuthSuccess: (token: string, username: string) => void;
}

// Google OAuth認証後のコールバック処理コンポーネント
const AuthCallback: React.FC<AuthCallbackProps> = ({ onAuthSuccess }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    // URLからトークンとユーザー名を取得
    const token = searchParams.get('token');
    const user = searchParams.get('user');

    if (token && user) {
      // 認証成功時の処理を実行
      onAuthSuccess(token, user);
      
      // 質問ページへリダイレクト
      navigate('/');
    } else {
      // トークンが取得できない場合はエラー表示
      console.error('認証に失敗しました');
      navigate('/');
    }
  }, [searchParams, onAuthSuccess, navigate]);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
    }}>
      <div style={{ textAlign: 'center' }}>
        <h2>認証処理中...</h2>
        <p>少々お待ちください</p>
      </div>
    </div>
  );
};

export default AuthCallback;
