// 思想コンパス質問データ
// docs/qanda.mdから抽出した16個の哲学的質問

export type QuestionData = {
  id: number;
  category: string;
  text: string;
};

export type AnswerOption = {
  value: number;
  label: string;
};

// 5段階評価の選択肢
export const answerOptions: AnswerOption[] = [
  { value: 2, label: 'まさにその通りだ' },
  { value: 1, label: '少しそう思う' },
  { value: 0, label: 'どちらとも言えない' },
  { value: -1, label: '少し違うと思う' },
  { value: -2, label: '絶対に違う' },
];

// 16個の質問データ
export const questions: QuestionData[] = [
  // 論理 (3問)、「構造」志向～「大きな物語」志向
  {
    id: 1,
    category: '論理',
    text: '哲学は文学よりも数学に似ている',
  },
  {
    id: 2,
    category: '論理',
    text: '理論に基づいた仮説は正しい傾向にある',
  },
  {
    id: 3,
    category: '論理',
    text: '日常言語の意味はあいまいだ',
  },
  // 倫理 (3問)、「行為論」志向～「徳論」志向
  {
    id: 4,
    category: '倫理',
    text: '善いことをする習慣よりも、善い人格を身に着けるべきだ',
  },
  {
    id: 5,
    category: '倫理',
    text: '善い人は必ず幸福になるし、幸福な人は必ず善い人だ',
  },
  {
    id: 6,
    category: '倫理',
    text: '他人を幸せにすることは善いことだ',
  },
  // 美 (3問)、「存在論」志向～「認識論」志向
  {
    id: 7,
    category: '美',
    text: '美しさは美しいものに宿っている',
  },
  {
    id: 8,
    category: '美',
    text: '美しいものにはそのものらしさがある',
  },
  {
    id: 9,
    category: '美',
    text: '人工の美しさと自然の美しさに違いはない',
  },
  // ポストモダン (3問)、「モダン」志向～「ポストモダン」志向
  {
    id: 10,
    category: 'ポストモダン',
    text: '真実は、時代、地域、その他によって無数に異なる',
  },
  {
    id: 11,
    category: 'ポストモダン',
    text: '論理的に正しいことよりも、素朴な感情に従って行動すべきだ',
  },
  {
    id: 12,
    category: 'ポストモダン',
    text: '個別具体的な場面にいる私とは違う、「本当の私」なんていない',
  },
  // 横断的 (4問)
  {
    id: 16, //高いと分析哲学的傾向、低いと現象学的傾向
    category: '横断的',
    text: '直観と論理なら、論理のほうを信じる',
  },
  {
    id: 14, //高いと義務論的傾向、低いと功利主義的傾向
    category: '横断的',
    text: '基本的に嘘をつくことは悪いことだ',
  },
  {
    id: 15, //高いと科学的傾向、低いと人文的傾向
    category: '横断的',
    text: '自然科学や社会科学はいずれ多くの哲学的問題を解決するだろう',
  },
  {
    id: 13, //高いと不可知論的傾向、低いと可知論的傾向
    category: '横断的',
    text: '人間に絶対に知りえないことはある',
  },
];
