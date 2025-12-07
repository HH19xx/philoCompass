import QuestionPage from "./components/QuestionPage";
import ResultPage from "./components/ResultPage";
import WelcomePage from "./components/WelcomePage";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import HistoryPage from "./components/HistoryPage";
import CommonHeader from "./components/CommonHeader";
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

export type AppPhase = "welcome" | "login" | "register" | "question" | "result" | "history";

type AppRouterProps = {
  phase: AppPhase;
  setPhase: (phase: AppPhase) => void;
  isAuthenticated: boolean;
  logout: () => void;
  getAuthHeaders: () => Record<string, string>;
  answers: number[];
  neighborData: NeighborData[];
  philoLabel: PhiloLabel | null;
  categoryDistribution: CategoryDistributionData | null;
  closestPhilosopher: ClosestPhilosopher | null;
  handleLoginSuccess: (token: string, user: { id: number; username: string; email: string }) => void;
  handleRegisterSuccess: (token: string, user: { id: number; username: string; email: string }) => void;
  handleComplete: (completedAnswers: number[]) => Promise<void>;
  handleSaveResult: () => Promise<void>;
  handleSkipSave: () => void;
  resetState: () => void;
  // 質問画面の進行状態保存・復元用
  savedQuestionIndex: number;
  savedPartialAnswers: (number | null)[];
  onSaveQuestionState: (index: number, answers: (number | null)[]) => void;
  // 履歴画面に遷移する前のページを記録
  previousPhase: AppPhase | null;
  setPreviousPhase: (phase: AppPhase | null) => void;
};

function AppRouter({
  phase,
  setPhase,
  isAuthenticated,
  logout,
  getAuthHeaders,
  answers,
  neighborData,
  philoLabel,
  categoryDistribution,
  closestPhilosopher,
  handleLoginSuccess,
  handleRegisterSuccess,
  handleComplete,
  handleSaveResult,
  handleSkipSave,
  resetState,
  savedQuestionIndex,
  savedPartialAnswers,
  onSaveQuestionState,
  previousPhase,
  setPreviousPhase,
}: AppRouterProps) {
  const handleLogout = () => {
    logout();
    setPhase('welcome');
    resetState();
  };

  const handleBackToWelcome = () => {
    setPhase('welcome');
    resetState();
  };

  // 履歴画面から前のページに戻る処理
  const handleBackFromHistory = () => {
    if (previousPhase === 'result') {
      setPhase('result');
    } else if (previousPhase === 'question') {
      setPhase('question');
    } else {
      setPhase('welcome');
    }
    setPreviousPhase(null);
  };

  switch (phase) {
    case "welcome":
      return (
        <WelcomePage
          onLoginClick={() => setPhase("login")}
          onRegisterClick={() => setPhase("register")}
          onGuestClick={() => setPhase("question")}
          onHistoryClick={() => setPhase("history")}
          onLogout={() => {
            logout();
            window.location.reload();
          }}
          isAuthenticated={isAuthenticated}
        />
      );

    case "login":
      return (
        <LoginPage
          onLoginSuccess={handleLoginSuccess}
          onSwitchToRegister={() => setPhase("register")}
          onBackToWelcome={handleBackToWelcome}
        />
      );

    case "register":
      return (
        <RegisterPage
          onRegisterSuccess={handleRegisterSuccess}
          onSwitchToLogin={() => setPhase("login")}
          onBackToWelcome={handleBackToWelcome}
        />
      );

    case "history":
      return (
        <HistoryPage
          onBackToWelcome={handleBackToWelcome}
          onBackToPrevious={handleBackFromHistory}
          onLogout={handleLogout}
          getAuthHeaders={getAuthHeaders}
        />
      );

    case "question":
      return (
        <div className={styles.pageContainer}>
          {isAuthenticated && (
            <CommonHeader
              showHistoryButton={true}
              onHistoryClick={() => {
                setPreviousPhase('question');
                setPhase('history');
              }}
              onLogout={handleLogout}
            />
          )}
          <QuestionPage
            onComplete={handleComplete}
            initialIndex={savedQuestionIndex}
            initialAnswers={savedPartialAnswers}
            onSaveState={onSaveQuestionState}
          />
        </div>
      );

    case "result":
      return (
        <div className={styles.pageContainer}>
          {isAuthenticated && (
            <CommonHeader
              showHistoryButton={true}
              onHistoryClick={() => {
                setPreviousPhase('result');
                setPhase('history');
              }}
              onLogout={handleLogout}
            />
          )}
          <ResultPage
            answers={answers}
            neighborData={neighborData}
            philoLabel={philoLabel}
            categoryDistribution={categoryDistribution}
            closestPhilosopher={closestPhilosopher}
            showSaveOption={isAuthenticated}
            onSave={handleSaveResult}
            onSkip={handleSkipSave}
            onBackToWelcome={handleBackToWelcome}
            onLogout={handleLogout}
            isAuthenticated={isAuthenticated}
          />
        </div>
      );

    default:
      return null;
  }
}

export default AppRouter;
