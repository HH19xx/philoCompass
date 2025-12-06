import { useEffect, useState } from 'react';
import ResultPage from './ResultPage';
import CommonHeader from './CommonHeader';
import styles from '../styles/History.module.scss';

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

type NeighborData = {
  radius: number;
  count: number;
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

type HistoryPageProps = {
  onBackToWelcome: () => void;
  onBackToPrevious: () => void;
  onLogout: () => void;
  getAuthHeaders: () => Record<string, string>;
};

function HistoryPage({ onBackToWelcome, onBackToPrevious, onLogout, getAuthHeaders }: HistoryPageProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [neighborData, setNeighborData] = useState<NeighborData[]>([]);
  const [philoLabel, setPhiloLabel] = useState<PhiloLabel | null>(null);
  const [categoryDistribution, setCategoryDistribution] = useState<CategoryDistributionData | null>(null);
  const [closestPhilosopher, setClosestPhilosopher] = useState<ClosestPhilosopher | null>(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081';

  useEffect(() => {
    const fetchLatestAnswer = async () => {
      try {
        const response = await fetch(`${API_URL}/api/answers/me`, {
          headers: getAuthHeaders(),
        });

        if (!response.ok) {
          if (response.status === 404) {
            setError('保存された診断結果がありません');
          } else {
            throw new Error('診断結果の取得に失敗しました');
          }
          setLoading(false);
          return;
        }

        const data = await response.json();

        const answersArray = [
          data.answer_01, data.answer_02, data.answer_03, data.answer_04,
          data.answer_05, data.answer_06, data.answer_07, data.answer_08,
          data.answer_09, data.answer_10, data.answer_11, data.answer_12,
          data.answer_13, data.answer_14, data.answer_15, data.answer_16,
        ];
        setAnswers(answersArray);

        const statsResponse = await fetch(`${API_URL}/api/statistics/distribution/${data.id}`);
        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setNeighborData(statsData.distribution);
          setPhiloLabel(statsData.label);
          setClosestPhilosopher(statsData.closest_philosopher);
        }

        const categoryResponse = await fetch(`${API_URL}/api/statistics/category-distribution/${data.id}`);
        if (categoryResponse.ok) {
          const categoryData = await categoryResponse.json();
          setCategoryDistribution(categoryData);
        }

        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'エラーが発生しました');
        setLoading(false);
      }
    };

    fetchLatestAnswer();
  }, [getAuthHeaders, API_URL]);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div>読み込み中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorMessage}>{error}</div>
        <button onClick={onBackToWelcome} className={styles.backButton}>
          ホームに戻る
        </button>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <CommonHeader
        showBackToResultButton={true}
        showBackToWelcomeButton={true}
        onBackToResultClick={onBackToPrevious}
        onBackToWelcomeClick={onBackToWelcome}
        onLogout={onLogout}
        pageTitle="過去の診断結果"
      />
      <div className={styles.content}>
        <ResultPage
          answers={answers}
          neighborData={neighborData}
          philoLabel={philoLabel}
          categoryDistribution={categoryDistribution}
          closestPhilosopher={closestPhilosopher}
          showSaveOption={false}
          onSave={() => {}}
          onSkip={() => {}}
          onBackToWelcome={onBackToWelcome}
          onLogout={onLogout}
          isAuthenticated={true}
        />
      </div>
    </div>
  );
}

export default HistoryPage;