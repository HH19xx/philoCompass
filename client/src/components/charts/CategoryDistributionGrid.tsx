import React from 'react';
import CategoryDistributionChart from './CategoryDistributionChart';

type DataPoint = {
  score: number;
  count: number;
};

type CategoryData = {
  logic: DataPoint[];
  ethics: DataPoint[];
  aesthetics: DataPoint[];
  postmodern: DataPoint[];
};

type CategoryScores = {
  Logic: number;
  Ethics: number;
  Aesthetics: number;
  Postmodern: number;
};

type Props = {
  data: CategoryData;
  userScores: CategoryScores;
};

const CategoryDistributionGrid: React.FC<Props> = ({ data, userScores }) => {
  return (
    <div style={{
      backgroundColor: 'white',
      padding: '30px',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      marginBottom: '30px',
    }}>
      <h2 style={{ marginBottom: '20px', textAlign: 'center' }}>
        カテゴリ別スコア分布
      </h2>
      <p style={{ textAlign: 'center', color: '#666', marginBottom: '30px', fontSize: '14px' }}>
        あなたのスコア（赤い棒）と全ユーザーの分布を比較
      </p>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '20px',
      }}>
        <div style={{ textAlign: 'center' }}>
          <CategoryDistributionChart
            categoryName="論理"
            data={data.logic}
            userScore={userScores.Logic}
          />
        </div>
        <div style={{ textAlign: 'center' }}>
          <CategoryDistributionChart
            categoryName="倫理"
            data={data.ethics}
            userScore={userScores.Ethics}
          />
        </div>
        <div style={{ textAlign: 'center' }}>
          <CategoryDistributionChart
            categoryName="美学"
            data={data.aesthetics}
            userScore={userScores.Aesthetics}
          />
        </div>
        <div style={{ textAlign: 'center' }}>
          <CategoryDistributionChart
            categoryName="ポストモダン"
            data={data.postmodern}
            userScore={userScores.Postmodern}
          />
        </div>
      </div>
    </div>
  );
};

export default CategoryDistributionGrid;
