import React from 'react';

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

type Props = {
  answers: number[];
  neighborData: NeighborData[];
  philoLabel: PhiloLabel | null;
  onSave?: () => void;
  onSkip?: () => void;
  showSaveOption?: boolean;
  onBackToWelcome?: () => void;
  onLogout?: () => void;
  isAuthenticated?: boolean;
};

const ResultPage: React.FC<Props> = ({ answers, neighborData, philoLabel, onSave, onSkip, showSaveOption = false, onBackToWelcome, onLogout, isAuthenticated = false }) => {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '40px' }}>
        あなたの思想コンパス結果
      </h1>

      {/* MBTI風ラベル表示 */}
      {philoLabel && (
        <div style={{
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          marginBottom: '30px',
          textAlign: 'center',
        }}>
          <h2 style={{ marginBottom: '20px', fontSize: '18px', color: '#666' }}>
            あなたの哲学タイプ
          </h2>
          <div style={{
            fontSize: '48px',
            fontWeight: 'bold',
            color: '#007bff',
            marginBottom: '20px',
            letterSpacing: '4px',
          }}>
            {philoLabel.full_label}
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '16px',
            marginTop: '30px',
          }}>
            <div style={{ padding: '12px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
              <div style={{ fontSize: '12px', color: '#666' }}>論理</div>
              <div style={{ fontSize: '20px', fontWeight: 'bold', marginTop: '4px' }}>
                {philoLabel.main_label[0]} ({philoLabel.category_scores.Logic > 0 ? '+' : ''}{philoLabel.category_scores.Logic})
              </div>
              <div style={{ fontSize: '11px', color: '#999', marginTop: '4px' }}>
                {philoLabel.main_label[0] === 'S' ? '構造志向' : '大きな物語志向'}
              </div>
            </div>
            <div style={{ padding: '12px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
              <div style={{ fontSize: '12px', color: '#666' }}>倫理</div>
              <div style={{ fontSize: '20px', fontWeight: 'bold', marginTop: '4px' }}>
                {philoLabel.main_label[1]} ({philoLabel.category_scores.Ethics > 0 ? '+' : ''}{philoLabel.category_scores.Ethics})
              </div>
              <div style={{ fontSize: '11px', color: '#999', marginTop: '4px' }}>
                {philoLabel.main_label[1] === 'A' ? '行為論志向' : '徳論志向'}
              </div>
            </div>
            <div style={{ padding: '12px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
              <div style={{ fontSize: '12px', color: '#666' }}>美学</div>
              <div style={{ fontSize: '20px', fontWeight: 'bold', marginTop: '4px' }}>
                {philoLabel.main_label[2]} ({philoLabel.category_scores.Aesthetics > 0 ? '+' : ''}{philoLabel.category_scores.Aesthetics})
              </div>
              <div style={{ fontSize: '11px', color: '#999', marginTop: '4px' }}>
                {philoLabel.main_label[2] === 'O' ? '存在論志向' : '認識論志向'}
              </div>
            </div>
            <div style={{ padding: '12px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
              <div style={{ fontSize: '12px', color: '#666' }}>ポストモダン</div>
              <div style={{ fontSize: '20px', fontWeight: 'bold', marginTop: '4px' }}>
                {philoLabel.main_label[3]} ({philoLabel.category_scores.Postmodern > 0 ? '+' : ''}{philoLabel.category_scores.Postmodern})
              </div>
              <div style={{ fontSize: '11px', color: '#999', marginTop: '4px' }}>
                {philoLabel.main_label[3] === 'M' ? 'モダン志向' : 'ポストモダン志向'}
              </div>
            </div>
          </div>
          <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #ddd' }}>
            <div style={{ fontSize: '14px', color: '#666', marginBottom: '12px' }}>
              サブ指標
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '8px',
            }}>
              <div style={{ fontSize: '12px', color: '#666' }}>
                <div style={{ fontWeight: 'bold', fontSize: '16px', color: '#333' }}>
                  {philoLabel.sub_label[0]}
                </div>
                <div style={{ marginTop: '4px' }}>
                  {philoLabel.sub_label[0] === 'L' ? '論理重視' : '現象学的'}
                </div>
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>
                <div style={{ fontWeight: 'bold', fontSize: '16px', color: '#333' }}>
                  {philoLabel.sub_label[1]}
                </div>
                <div style={{ marginTop: '4px' }}>
                  {philoLabel.sub_label[1] === 'D' ? '義務論的' : '功利主義的'}
                </div>
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>
                <div style={{ fontWeight: 'bold', fontSize: '16px', color: '#333' }}>
                  {philoLabel.sub_label[2]}
                </div>
                <div style={{ marginTop: '4px' }}>
                  {philoLabel.sub_label[2] === 'S' ? '科学的' : '人文的'}
                </div>
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>
                <div style={{ fontWeight: 'bold', fontSize: '16px', color: '#333' }}>
                  {philoLabel.sub_label[3]}
                </div>
                <div style={{ marginTop: '4px' }}>
                  {philoLabel.sub_label[3] === 'A' ? '不可知論的' : '可知論的'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div style={{
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        marginBottom: '30px'
      }}>
        <h2 style={{ marginBottom: '20px' }}>あなたの16次元座標</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '16px'
        }}>
          {answers.map((value, index) => (
            <div key={index} style={{
              padding: '12px',
              backgroundColor: '#f5f5f5',
              borderRadius: '4px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>
                次元 {index + 1}
              </div>
              <div style={{ 
                fontSize: '24px', 
                fontWeight: 'bold',
                color: value > 0 ? '#4caf50' : value < 0 ? '#f44336' : '#666'
              }}>
                {value > 0 ? '+' : ''}{value}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      }}>
        <h2 style={{ marginBottom: '20px' }}>あなたの近くにいる人の数</h2>
        <p style={{ color: '#666', marginBottom: '20px' }}>
          思想空間上であなたの近くにいるユーザーの数を表示しています
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {neighborData.map((data) => (
            <div key={data.radius} style={{
              display: 'flex',
              alignItems: 'center',
              padding: '16px',
              backgroundColor: '#f5f5f5',
              borderRadius: '4px',
            }}>
              <div style={{ flex: '0 0 120px' }}>
                <div style={{ fontSize: '14px', color: '#666' }}>半径 {data.radius}</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{
                  height: '24px',
                  backgroundColor: '#e0e0e0',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  position: 'relative'
                }}>
                  <div style={{
                    height: '100%',
                    width: data.count > 0 ? '50%' : '0%',
                    backgroundColor: '#4caf50',
                    transition: 'width 0.5s ease'
                  }} />
                </div>
              </div>
              <div style={{ flex: '0 0 80px', textAlign: 'right' }}>
                <span style={{ fontSize: '20px', fontWeight: 'bold' }}>{data.count}</span>
                <span style={{ fontSize: '14px', color: '#666' }}> 人</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 保存オプション */}
      {showSaveOption && (
        <div style={{
          backgroundColor: '#fff3cd',
          padding: '30px',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          marginTop: '30px',
        }}>
          <h3 style={{ marginBottom: '10px', textAlign: 'center' }}>
            この結果を保存しますか？
          </h3>
          <p style={{ color: '#666', marginBottom: '20px', textAlign: 'center', fontSize: '14px' }}>
            保存すると、ログイン時に過去の結果を確認できます
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button
              onClick={onSkip}
              style={{
                padding: '12px 32px',
                fontSize: '16px',
                border: '2px solid #ddd',
                borderRadius: '8px',
                backgroundColor: 'white',
                cursor: 'pointer',
                fontWeight: 'bold',
              }}
            >
              保存しない
            </button>
            <button
              onClick={onSave}
              style={{
                padding: '12px 32px',
                fontSize: '16px',
                border: 'none',
                borderRadius: '8px',
                backgroundColor: '#4caf50',
                color: 'white',
                cursor: 'pointer',
                fontWeight: 'bold',
              }}
            >
              保存する
            </button>
          </div>
        </div>
      )}

      {/* 最初に戻る・ログアウトボタン */}
      <div style={{
        marginTop: '30px',
        display: 'flex',
        gap: '12px',
        justifyContent: 'center',
      }}>
        <button
          onClick={onBackToWelcome}
          style={{
            padding: '12px 32px',
            fontSize: '16px',
            border: '2px solid #007bff',
            borderRadius: '8px',
            backgroundColor: '#007bff',
            color: 'white',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          最初に戻る
        </button>
        {isAuthenticated && (
          <button
            onClick={onLogout}
            style={{
              padding: '12px 32px',
              fontSize: '16px',
              border: '2px solid #dc3545',
              borderRadius: '8px',
              backgroundColor: '#dc3545',
              color: 'white',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            ログアウト
          </button>
        )}
      </div>
    </div>
  );
};

export default ResultPage;
