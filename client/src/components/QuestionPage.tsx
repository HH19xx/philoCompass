import React, { useState } from 'react';
import { questions, answerOptions } from '../data/questions';

// 回答完了時のコールバック型定義
type OnCompleteCallback = (answers: number[]) => void;

type Props = {
  onComplete: OnCompleteCallback;
};

// 質問ページコンポーネント
const QuestionPage: React.FC<Props> = ({ onComplete }) => {
  // 現在の質問インデックス（0始まり）
  const [currentIndex, setCurrentIndex] = useState(0);
  // 16個の回答を保存する配列（初期値null）
  const [answers, setAnswers] = useState<(number | null)[]>(Array(16).fill(null));

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
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      {/* プログレスバー */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ 
          width: '100%', 
          height: '8px', 
          backgroundColor: '#e0e0e0',
          borderRadius: '4px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${progress}%`,
            height: '100%',
            backgroundColor: '#4caf50',
            transition: 'width 0.3s ease'
          }} />
        </div>
        <p style={{ textAlign: 'center', marginTop: '8px', color: '#666' }}>
          質問 {currentIndex + 1} / {questions.length}
        </p>
      </div>

      {/* 質問カード */}
      <div style={{
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        marginBottom: '20px'
      }}>
        <p style={{ 
          fontSize: '12px', 
          color: '#888', 
          marginBottom: '10px' 
        }}>
          {currentQuestion.category}
        </p>
        <h2 style={{ 
          fontSize: '20px', 
          marginBottom: '30px',
          lineHeight: '1.6'
        }}>
          {currentQuestion.text}
        </h2>

        {/* 回答ボタン */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {answerOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleAnswer(option.value)}
              style={{
                padding: '16px',
                fontSize: '16px',
                border: '2px solid #ddd',
                borderRadius: '8px',
                backgroundColor: 'white',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#4caf50';
                e.currentTarget.style.backgroundColor = '#f0f8f0';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#ddd';
                e.currentTarget.style.backgroundColor = 'white';
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* 戻るボタン */}
      {currentIndex > 0 && (
        <button
          onClick={handleBack}
          style={{
            padding: '12px 24px',
            fontSize: '14px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            backgroundColor: 'white',
            cursor: 'pointer',
          }}
        >
          ← 前の質問に戻る
        </button>
      )}
    </div>
  );
};

export default QuestionPage;
