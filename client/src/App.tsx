import { useEffect, useState } from "react";
import { useAuth } from "./hooks/useAuth";
import AppRouter from "./AppRouter";
import type { AppPhase } from "./AppRouter";
import styles from "./styles/App.module.scss";

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

type DataPoint = {
  score: number;
  count: number;
};

type CategoryDistributionData = {
  logic: DataPoint[];
  ethics: DataPoint[];
  aesthetics: DataPoint[];
  postmodern: DataPoint[];
};

type Philosopher = {
  id: number;
  name: string;
  era: string;
  description: string;
  answer_01: number;
  answer_02: number;
  answer_03: number;
  answer_04: number;
  answer_05: number;
  answer_06: number;
  answer_07: number;
  answer_08: number;
  answer_09: number;
  answer_10: number;
  answer_11: number;
  answer_12: number;
  answer_13: number;
  answer_14: number;
  answer_15: number;
  answer_16: number;
  deleted: boolean;
  created_at: string;
  created_by?: string;
  updated_at?: string;
  updated_by?: string;
};

type ClosestPhilosopher = {
  philosopher: Philosopher;
  distance: number;
};

function App() {
  const { isAuthenticated, login, logout, getAuthHeaders } = useAuth();
  const [phase, setPhase] = useState<AppPhase>("welcome");
  const [answers, setAnswers] = useState<number[]>([]);
  const [neighborData, setNeighborData] = useState<NeighborData[]>([]);
  const [answerID, setAnswerID] = useState<number | null>(null);
  const [philoLabel, setPhiloLabel] = useState<PhiloLabel | null>(null);
  const [categoryDistribution, setCategoryDistribution] = useState<CategoryDistributionData | null>(null);
  const [closestPhilosopher, setClosestPhilosopher] = useState<ClosestPhilosopher | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 質問画面の進行状態を保存（履歴画面から戻る際に復元するため）
  const [savedQuestionIndex, setSavedQuestionIndex] = useState<number>(0);
  const [savedPartialAnswers, setSavedPartialAnswers] = useState<(number | null)[]>(Array(16).fill(null));

  // 履歴画面に遷移する前のページを記録（戻るボタンで適切なページに戻すため）
  const [previousPhase, setPreviousPhase] = useState<AppPhase | null>(null);

  // 環境変数から設定を取得
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081';

  // バックエンド疎通確認（/api/hello）
  useEffect(() => {
    const checkBackend = async () => {
      try {
        const res = await fetch(`${API_URL}/api/hello`);
        const data = await res.json();
        console.log("[backend /hello]", data);
      } catch (err) {
        console.error("[backend /hello] error", err);
      }
    };
    checkBackend();
  }, [API_URL]);

  // Google OAuthコールバック処理（URLパラメータからトークンを取得）
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const username = urlParams.get('user');
    const userIdStr = urlParams.get('user_id');

    // URLパラメータにトークンとユーザー情報が含まれている場合
    if (token && username && userIdStr) {
      const user = {
        id: parseInt(userIdStr, 10),
        username: username,
        email: '',
      };

      login(token, user);

      // URLパラメータをクリア（セキュリティのため）
      window.history.replaceState({}, document.title, window.location.pathname);

      // 質問ページに遷移
      setPhase('question');
    }
  }, [login]);

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
      const response = await fetch(`${API_URL}/api/answers`, {
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
      const statsResponse = await fetch(`${API_URL}/api/statistics/distribution/${savedAnswerID}`);
      if (!statsResponse.ok) {
        throw new Error("統計データの取得に失敗しました");
      }

      const statsData = await statsResponse.json();
      setNeighborData(statsData.distribution);
      setPhiloLabel(statsData.label);
      setClosestPhilosopher(statsData.closest_philosopher);

      // カテゴリ別スコア分布を取得（認証不要）
      const categoryResponse = await fetch(`${API_URL}/api/statistics/category-distribution/${savedAnswerID}`);
      if (!categoryResponse.ok) {
        throw new Error("カテゴリ分布データの取得に失敗しました");
      }

      const categoryData = await categoryResponse.json();
      setCategoryDistribution(categoryData);

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
      const response = await fetch(`${API_URL}/api/answers/link`, {
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
    alert("結果は保存されませんでした");
  };

  // 状態をリセット
  const resetState = () => {
    setAnswers([]);
    setNeighborData([]);
    setAnswerID(null);
    setPhiloLabel(null);
    setCategoryDistribution(null);
    setClosestPhilosopher(null);
    // 質問状態もリセット
    setSavedQuestionIndex(0);
    setSavedPartialAnswers(Array(16).fill(null));
  };

  // 質問画面の進行状態を保存（履歴画面に遷移する前に呼ばれる）
  const handleSaveQuestionState = (index: number, partialAnswers: (number | null)[]) => {
    setSavedQuestionIndex(index);
    setSavedPartialAnswers(partialAnswers);
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div>データを送信中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorMessage}>エラー: {error}</div>
        <button onClick={() => window.location.reload()} className={styles.reloadButton}>
          リロード
        </button>
      </div>
    );
  }

  return (
    <AppRouter
      phase={phase}
      setPhase={setPhase}
      isAuthenticated={isAuthenticated}
      logout={logout}
      getAuthHeaders={getAuthHeaders}
      answers={answers}
      neighborData={neighborData}
      philoLabel={philoLabel}
      categoryDistribution={categoryDistribution}
      closestPhilosopher={closestPhilosopher}
      handleLoginSuccess={handleLoginSuccess}
      handleRegisterSuccess={handleRegisterSuccess}
      handleComplete={handleComplete}
      handleSaveResult={handleSaveResult}
      handleSkipSave={handleSkipSave}
      resetState={resetState}
      savedQuestionIndex={savedQuestionIndex}
      savedPartialAnswers={savedPartialAnswers}
      onSaveQuestionState={handleSaveQuestionState}
      previousPhase={previousPhase}
      setPreviousPhase={setPreviousPhase}
    />
  );
}

export default App;
