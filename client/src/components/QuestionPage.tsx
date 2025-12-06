import React, { useState } from 'react';
import { questions, answerOptions } from '../data/questions';
import styles from '../styles/Question.module.scss';

// 回答完了時のコールバック型定義
type OnCompleteCallback = (answers: number[]) => void;

type Props = {
  onComplete: OnCompleteCallback;
  // 質問画面の初期状態（履歴画面から戻る際に使用）
  initialIndex?: number;
  initialAnswers?: (number | null)[];
  // 質問画面の進行状態を保存するコールバック（履歴画面に遷移する際に使用）
  onSaveState?: (index: number, answers: (number | null)[]) => void;
};

// 質問ページコンポーネント
const QuestionPage: React.FC<Props> = ({ onComplete, initialIndex = 0, initialAnswers, onSaveState }) => {
  // 現在の質問インデックス（0始まり）
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  // 16個の回答を保存する配列（初期値null）
  const [answers, setAnswers] = useState<(number | null)[]>(initialAnswers || Array(16).fill(null));

  // 状態が変更されたら親コンポーネントに通知（履歴画面に遷移する際に使用）
  React.useEffect(() => {
    if (onSaveState) {
      onSaveState(currentIndex, answers);
    }
  }, [currentIndex, answers, onSaveState]);

  // 回答選択時の処理
  const handleAnswer = (value: number) => {
    const newAnswers = [...answers];
    newAnswers[currentIndex] = value;
    setAnswers(newAnswers);

    // 最後の質問の場合は完了
    if (currentIndex === 15) {
      onComplete(newAnswers as number[]);
    } else {
      // 次の質問へ
      setCurrentIndex(currentIndex + 1);
    }
  };

  // 前の質問に戻る
  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className={styles.container}>
      {/* プログレスバー */}
      <div className={styles.progressSection}>
        <div className={styles.progressBarContainer}>
          <div className={styles.progressBar} style={{ width: `${progress}%` }} />
        </div>
        <p className={styles.progressText}>
          質問 {currentIndex + 1} / {questions.length}
        </p>
      </div>

      {/* 質問カード */}
      <div className={styles.questionCard}>
        <p className={styles.categoryLabel}>
          {currentQuestion.category}
        </p>
        <h2 className={styles.questionText}>
          {currentQuestion.text}
        </h2>

        {/* 回答ボタン */}
        <div className={styles.answerButtons}>
          {answerOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleAnswer(option.value)}
              className={styles.answerButton}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* 戻るボタン */}
      {currentIndex > 0 && (
        <button onClick={handleBack} className={styles.backButton}>
          ← 前の質問に戻る
        </button>
      )}
    </div>
  );
};

export default QuestionPage;
