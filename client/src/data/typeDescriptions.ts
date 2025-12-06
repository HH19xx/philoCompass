// 16タイプの説明データ（docs/16type.mdより）

export type TypeDescription = {
  label: string;
  composition: string;
  tendency: string;
  strengths: string;
  weaknesses: string;
  distance: string;
};

export const typeDescriptions: Record<string, TypeDescription> = {
  NVOP: {
    label: "NVOP",
    composition: "物語 × 徳 × 存在 × ポストモダン",
    tendency: "経験・物語・倫理的成熟を重視しつつ、多元的な世界観を肯定。",
    strengths: "他者理解が柔らかく、多様な価値の共存に強い。",
    weaknesses: "基準が曖昧になりやすく、実践的な判断が揺れやすい。",
    distance: "SAEM（構造・行為・認識・モダン）とは価値基盤が最も遠い。"
  },
  NVOM: {
    label: "NVOM",
    composition: "物語 × 徳 × 存在 × モダン",
    tendency: "物語的理解を保持しながら、伝統的・普遍的秩序にも寄り添う。",
    strengths: "調和志向が強く、倫理観が安定。",
    weaknesses: "物語と普遍性の折り合いが難しく、中庸に見えやすい。",
    distance: "SAEP や SAOP など構造・行為系とは摩擦が出やすい。"
  },
  NVEP: {
    label: "NVEP",
    composition: "物語 × 徳 × 認識 × ポストモダン",
    tendency: "価値・物語・認識の諸相を相対的に捉え、柔らかい思考体系を好む。",
    strengths: "多角的、調停的、融和的。",
    weaknesses: "決断力に欠ける場合がある。",
    distance: "SVEM のような体系・普遍主義系とは隔たりが大きい。"
  },
  NVEM: {
    label: "NVEM",
    composition: "物語 × 徳 × 認識 × モダン",
    tendency: "物語的理解・徳倫理・認識論的美学を古典的枠内で整理したがる。",
    strengths: "道徳と認識論のつながりを直観的に扱いやすい。",
    weaknesses: "全体像の説明が抽象に寄りやすい。",
    distance: "SAOP（構造・行為・存在）とは基調が異なる。"
  },
  NAOP: {
    label: "NAOP",
    composition: "物語 × 行為 × 存在 × ポストモダン",
    tendency: "現実の具体的行為を物語的・存在論的に読み解く志向。",
    strengths: "状況理解力が高く、倫理判断が柔軟。",
    weaknesses: "基準が揺らぎやすい。",
    distance: "SVEM・SAEM など普遍主義系は対極。"
  },
  NAOM: {
    label: "NAOM",
    composition: "物語 × 行為 × 存在 × モダン",
    tendency: "直観・行為・存在の3点を、古典的秩序の中で統合しようとする。",
    strengths: "道徳判断が分かりやすく、バランスが良い。",
    weaknesses: "説明が\"雰囲気的\"になりやすい。",
    distance: "詳細な体系化を好む SAEP・SVEP とは差が出る。"
  },
  NAEP: {
    label: "NAEP",
    composition: "物語 × 行為 × 認識 × ポストモダン",
    tendency: "行為と認識の結びつきを軽快に扱い、世界を相対的に見る。",
    strengths: "視野が広く、創造性が高い。",
    weaknesses: "判断の一貫性が弱い場合あり。",
    distance: "SAOM（構造・行為・存在・モダン）など安定重視型と噛み合いにくい。"
  },
  NAEM: {
    label: "NAEM",
    composition: "物語 × 行為 × 認識 × モダン",
    tendency: "認識の構造を気にしつつ、物語性と実践性を古典的秩序に置く。",
    strengths: "常識的な倫理観と、柔らかい認識論の両立。",
    weaknesses: "美学的・価値論的基盤が説明しづらい。",
    distance: "SAOP（構造・行為・存在）とは価値の読み方が異なる。"
  },
  SVOP: {
    label: "SVOP",
    composition: "構造 × 徳 × 存在 × ポストモダン",
    tendency: "体系性と存在論的視点を持ちながら、価値は多様性を認める。",
    strengths: "理論と経験の折衷が得意。",
    weaknesses: "説明に抽象度が出やすい。",
    distance: "NAEP・NVEP とは方向性がずれがち。"
  },
  SVOM: {
    label: "SVOM",
    composition: "構造 × 徳 × 存在 × モダン",
    tendency: "いわゆる\"正統派の哲学的姿勢\"に近い安定型。",
    strengths: "体系性・道徳性・存在論の3点がきれいに並ぶ。",
    weaknesses: "柔軟さに欠ける印象を与える場合あり。",
    distance: "極端なポストモダン系（NVOPなど）とは遠い。"
  },
  SVEP: {
    label: "SVEP",
    composition: "構造 × 徳 × 認識 × ポストモダン",
    tendency: "認識論的整理と道徳、そして多元性を組み合わせる穏当な相対主義。",
    strengths: "理論・倫理・価値観の折衷が得意。",
    weaknesses: "立場表明が弱く見える。",
    distance: "SAOM や SAEM のような普遍系とは距離。"
  },
  SVEM: {
    label: "SVEM",
    composition: "構造 × 徳 × 認識 × モダン",
    tendency: "伝統的・普遍的価値観を、認識論的精密さで支えるタイプ。",
    strengths: "理論的で筋が通る。",
    weaknesses: "融通が利きにくい場面がある。",
    distance: "NVOP・NAOP など物語・相対主義系とは真逆。"
  },
  SAOP: {
    label: "SAOP",
    composition: "構造 × 行為 × 存在 × ポストモダン",
    tendency: "行為の根拠を世界の構造で説明しつつ、多元的価値観も受容。",
    strengths: "実践と理論の接続がうまい。",
    weaknesses: "立場が複雑で誤解されやすい。",
    distance: "NVOM（物語・徳・古典）とは方向が異なる。"
  },
  SAOM: {
    label: "SAOM",
    composition: "構造 × 行為 × 存在 × モダン",
    tendency: "古典的規範と構造理解を背景に、行為を正しく位置づける。",
    strengths: "倫理判断が明確で、一貫性が高い。",
    weaknesses: "柔軟性が少ない印象を与えることも。",
    distance: "NAEP のような相対系とは合わない。"
  },
  SAEP: {
    label: "SAEP",
    composition: "構造 × 行為 × 認識 × ポストモダン",
    tendency: "行為・認識・構造を多元的に扱う、柔軟な実践派。",
    strengths: "状況に即した幅広い判断ができる。",
    weaknesses: "全体観がまとまりにくい。",
    distance: "NVOM（徳・物語・モダン）とは相性が悪い。"
  },
  SAEM: {
    label: "SAEM",
    composition: "構造 × 行為 × 認識 × モダン",
    tendency: "最も\"硬派で伝統的\"な構成。体系・行為・認識論が一直線に結びつく。",
    strengths: "安定・整合性・普遍性に強い。",
    weaknesses: "独創性や相対的視点が入りにくい。",
    distance: "NVOP（物語・徳・存在・ポストモダン）とは最大距離。"
  }
};
