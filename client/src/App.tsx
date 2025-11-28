import { useEffect, useState } from "react";
import QuestionPage from "./components/QuestionPage";
import ResultPage from "./components/ResultPage";
import WelcomePage from "./components/WelcomePage";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import { useAuth } from "./hooks/useAuth";

type NeighborData = {
  radius: number;
  count: number;
};

type CategoryScores = {
  Logic: number;
  Ethics: number;
  Aesthetics: number;
  Postmodern: number;
};

type SubIndicators = {
  Q13: number;
  Q14: number;
  Q15: number;
  Q16: number;
};

type PhiloLabel = {
  main_label: string;
  sub_label: string;
  full_label: string;
  category_scores: CategoryScores;
  sub_scores: SubIndicators;
};

type AppPhase = "welcome" | "login" | "register" | "question" | "result";

function App() {
  const { isAuthenticated, login, logout, getAuthHeaders } = useAuth();
  const [phase, setPhase] = useState<AppPhase>("welcome");
  const [answers, setAnswers] = useState<number[]>([]);
  const [neighborData, setNeighborData] = useState<NeighborData[]>([]);
  const [answerID, setAnswerID] = useState<number | null>(null);
  const [philoLabel, setPhiloLabel] = useState<PhiloLabel | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // バックエンド疎通確認（/api/hello）
  useEffect(() => {
    const checkBackend = async () => {
      try {
        const res = await fetch("http://localhost:8081/api/hello");
        const data = await res.json();
        console.log("[backend /hello]", data);
      } catch (err) {
        console.error("[backend /hello] error", err);
      }
    };
    checkBackend();
  }, []);

  // ログイン成功時の処理
  const handleLoginSuccess = (token: string, user: { id: number; username: string; email: string }) => {
    login(token, user);
    setPhase("question");
  };

  // ユーザー登録成功時の処理
  const handleRegisterSuccess = (token: string, user: { id: number; username: string; email: string }) => {
    login(token, user);
    setPhase("question");
  };

  // 回答完了時の処理（匿名で保存し、統計を取得）
  const handleComplete = async (completedAnswers: number[]) => {
    setAnswers(completedAnswers);
    setLoading(true);
    setError(null);

    try {
      // 回答を匿名で保存（認証不要）
      const response = await fetch("http://localhost:8081/api/answers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          answers: completedAnswers,
        }),
      });

      if (!response.ok) {
        throw new Error("回答の保存に失敗しました");
      }

      const data = await response.json();
      const savedAnswerID = data.answer_id;
      setAnswerID(savedAnswerID);

      // 近傍ユーザー数の分布を取得（認証不要）
      const statsResponse = await fetch(`http://localhost:8081/api/statistics/distribution/${savedAnswerID}`);
      if (!statsResponse.ok) {
        throw new Error("統計データの取得に失敗しました");
      }

      const statsData = await statsResponse.json();
      setNeighborData(statsData.distribution);
      setPhiloLabel(statsData.label);

      // 結果画面に遷移
      setPhase("result");
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  // 結果をユーザーに紐づける
  const handleSaveResult = async () => {
    if (!answerID) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:8081/api/answers/link", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify({
          answer_id: answerID,
        }),
      });

      if (!response.ok) {
        throw new Error("結果の保存に失敗しました");
      }

      alert("結果が保存されました！");
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  // 保存をスキップ
  const handleSkipSave = () => {
    // 何もしない（結果画面に留まる）
    alert("結果は保存されませんでした");
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh'
      }}>
        <div>データを送信中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        gap: '20px'
      }}>
        <div style={{ color: 'red' }}>エラー: {error}</div>
        <button onClick={() => window.location.reload()}>
          リロード
        </button>
      </div>
    );
  }

  // ウェルカム画面
  if (phase === "welcome") {
    return (
      <WelcomePage
        onLoginClick={() => setPhase("login")}
        onRegisterClick={() => setPhase("register")}
        onGuestClick={() => setPhase("question")}
        onLogout={() => {
          logout();
          window.location.reload();
        }}
        isAuthenticated={isAuthenticated}
      />
    );
  }

  // ログイン画面
  if (phase === "login") {
    return (
      <LoginPage
        onLoginSuccess={handleLoginSuccess}
        onSwitchToRegister={() => setPhase("register")}
      />
    );
  }

  // 登録画面
  if (phase === "register") {
    return (
      <RegisterPage
        onRegisterSuccess={handleRegisterSuccess}
        onSwitchToLogin={() => setPhase("login")}
      />
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {isAuthenticated && (
        <div style={{
          padding: '20px',
          textAlign: 'right',
          backgroundColor: '#fff',
          borderBottom: '1px solid #ddd'
        }}>
          <button
            onClick={logout}
            style={{
              padding: '8px 16px',
              backgroundColor: '#dc3545',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            ログアウト
          </button>
        </div>
      )}
      {phase === "question" && (
        <QuestionPage onComplete={handleComplete} />
      )}
      {phase === "result" && (
        <ResultPage
          answers={answers}
          neighborData={neighborData}
          philoLabel={philoLabel}
          showSaveOption={isAuthenticated}
          onSave={handleSaveResult}
          onSkip={handleSkipSave}
          onBackToWelcome={() => {
            setPhase("welcome");
            setAnswers([]);
            setNeighborData([]);
            setAnswerID(null);
            setPhiloLabel(null);
          }}
          onLogout={() => {
            logout();
            setPhase("welcome");
            setAnswers([]);
            setNeighborData([]);
            setAnswerID(null);
            setPhiloLabel(null);
          }}
          isAuthenticated={isAuthenticated}
        />
      )}
    </div>
  );
}

export default App;
