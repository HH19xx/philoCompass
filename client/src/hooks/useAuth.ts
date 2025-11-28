import { useState, useEffect } from 'react';

interface User {
  id: number;
  username: string;
  email: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
}

const TOKEN_KEY = 'philocompass_token';
const USER_KEY = 'philocompass_user';

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    token: null,
    user: null,
    isAuthenticated: false,
  });

  // 初期化時にlocalStorageからトークンとユーザー情報を読み込む
  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY);
    const storedUser = localStorage.getItem(USER_KEY);

    if (storedToken && storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setAuthState({
          token: storedToken,
          user,
          isAuthenticated: true,
        });
      } catch (error) {
        // パースエラー時はlocalStorageをクリア
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
      }
    }
  }, []);

  // ログイン処理
  const login = (token: string, user: User) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    setAuthState({
      token,
      user,
      isAuthenticated: true,
    });
  };

  // ログアウト処理
  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setAuthState({
      token: null,
      user: null,
      isAuthenticated: false,
    });
  };

  // 認証済みAPIリクエスト用のヘッダーを取得
  const getAuthHeaders = (): Record<string, string> => {
    if (!authState.token) {
      return {};
    }
    return {
      'Authorization': `Bearer ${authState.token}`,
    };
  };

  return {
    ...authState,
    login,
    logout,
    getAuthHeaders,
  };
};
