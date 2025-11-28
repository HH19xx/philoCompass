import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./styles/Login.module.scss";

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/dashboard", { state: { username } });
  };

  return (
    <div className={styles.loginContainer}>
      <h2 className={styles.loginTitle}>ログイン</h2>
      <form className={styles.loginForm} onSubmit={handleSubmit}>
        <label>
          ユーザー名
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
        </label>
        <label>
          パスワード
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </label>
        <button className={styles.loginButton} type="submit">
          ログイン
        </button>
      </form>
    </div>
  );
}

export default Login;
