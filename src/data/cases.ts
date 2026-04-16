import type { CaseDoc } from "@/types";

export const CASES: CaseDoc[] = [
  {
    id: "c1",
    title: "コンビニチェーンの利益率低下診断",
    company: "大手コンビニエンスストアチェーン（仮称：FreshMart）",
    type: "profitability",
    difficulty: "junior",
    prompt:
      "FreshMartは日本全国に8,000店舗を展開する大手コンビニチェーンです。過去2年間で営業利益率が8%から5%に低下しています。CEOはあなたのチームに原因究明と改善施策の立案を依頼しました。どのようにアプローチしますか？",
    background: {
      overview:
        "FreshMartは年商1兆2,000億円、店舗数8,000店（直営2,000・FC6,000）の大手コンビニ。",
      keyFacts: [
        "2年前の営業利益率: 8%（960億円）",
        "現在の営業利益率: 5%（600億円）、利益減少額360億円",
        "売上は横ばい（1兆2,000億円）",
        "競合他社の利益率は平均6〜7%で維持",
        "人件費が過去2年で15%上昇（最低賃金引き上げの影響）",
        "食品廃棄ロスが売上の3%（業界平均2%）",
        "デリバリー事業への参入コストが年100億円（新規投資）",
      ],
      financials: {
        売上高: "1兆2,000億円",
        "営業利益（現在）": "600億円（利益率5%）",
        "営業利益（2年前）": "960億円（利益率8%）",
        人件費増加分: "約180億円",
        廃棄ロス増加: "約120億円（推定）",
        デリバリー投資: "100億円",
      },
      industry: "コンビニエンスストア業界",
      correctAnswerRange:
        "利益低下360億円の主因: 人件費増（約180億円）＋廃棄ロス増（約80〜120億円）＋デリバリー投資（100億円）の組み合わせが正答域。施策例：廃棄ロス削減（AIによる発注最適化）、FC収益改善（ロイヤリティ体系見直し）、デリバリー事業の収益化加速。",
    },
  },
  {
    id: "c2",
    title: "日本EV充電市場規模推計",
    company: "外資系エネルギー企業（新規参入検討）",
    type: "market_sizing",
    difficulty: "junior",
    prompt:
      "あるエネルギー企業が日本のEV充電ステーション市場への参入を検討しています。2030年における日本のEV公共充電市場の規模（年間売上）を推計してください。",
    background: {
      overview:
        "2030年時点の日本EV普及・充電インフラ市場の推計問題。政府目標や現状データを基に論理的に積み上げる。",
      keyFacts: [
        "日本の乗用車保有台数: 約8,000万台（2023年）",
        "政府の2030年EV普及目標: 新車販売の20〜30%をEV・PHV",
        "現在のEV保有台数: 約30万台（2023年）",
        "2030年のEV保有台数推計: 200〜300万台（控えめ〜政府目標達成シナリオ）",
        "公共充電器の現在の設置数: 約3万基（急速充電3,000基含む）",
        "EV1台あたりの年間公共充電回数: 約24回（月2回想定）",
        "1回の充電単価: 急速1,500円、普通200円",
        "公共充電の利用比率: 全充電の20〜30%（残りは自宅・職場）",
      ],
      financials: {
        "2030年EV保有台数（中央値）": "250万台",
        "年間公共充電回数/台": "24回",
        "平均充電単価": "500円（急速・普通混合）",
        "市場規模推計": "250万台×24回×500円×25% = 約750億円",
        "充電器設置・維持市場": "別途300〜500億円（機器・設置工事・保守）",
      },
      correctAnswerRange:
        "公共充電売上市場: 500〜1,000億円が妥当な推計範囲。上記の積み上げロジックで750億円前後が中央値。充電インフラ設備市場も含めると合計1,000〜1,500億円。",
    },
  },
  {
    id: "c3",
    title: "成熟FMCGブランドの3年20%成長戦略",
    company: "消費財メーカー・健康食品ブランド（仮称：NutriMax）",
    type: "growth_strategy",
    difficulty: "senior",
    prompt:
      "NutriMaxは日本の健康食品市場でシェア15%を持つ成熟ブランドです。主力製品のプロテインドリンクは国内市場で飽和しつつあります。経営陣は3年間で売上を20%成長させる戦略を求めています。どのような戦略を提案しますか？",
    background: {
      overview:
        "NutriMaxは年商500億円、国内プロテイン市場シェア15%のリーダーブランド。市場成長率は年3%に鈍化。",
      keyFacts: [
        "現在の売上: 500億円（国内480億円、海外20億円）",
        "3年後の目標売上: 600億円（20%成長）",
        "成長ギャップ: 100億円の上乗せが必要",
        "国内プロテイン市場: 3,200億円、成長率3%/年",
        "競合: 国内2社（合計シェア40%）、外資系3社（合計30%）",
        "女性向け健康食品市場は年8%成長（未参入）",
        "60歳以上のシニア向け機能性食品市場: 年12%成長（未参入）",
        "東南アジアの健康食品市場: 年15%成長、日本ブランドへの信頼度高い",
        "D2Cチャネルは全売上の10%（成長余地大）",
        "現在の営業利益率: 12%（業界平均10%）",
      ],
      financials: {
        現在売上: "500億円",
        目標売上: "600億円",
        成長ギャップ: "100億円",
        "シナリオ例（案分）": "既存市場深耕30億円＋新セグメント40億円＋海外30億円",
        海外売上: "現在20億円",
        D2C売上: "50億円（10%）",
      },
      correctAnswerRange:
        "成長ギャップ100億円の達成手段: ①既存市場深耕（シェア拡大・D2C強化）で20〜30億円、②新セグメント（女性・シニア）参入で30〜40億円、③海外（東南アジア）展開で30〜40億円、が標準的な優良解。100億円を1つの施策で達成しようとする回答は構造が弱い。",
    },
  },
];

export function getCaseById(id: string): CaseDoc | undefined {
  return CASES.find((c) => c.id === id);
}

export const CASE_TYPE_LABELS: Record<string, string> = {
  profitability: "収益性分析",
  market_sizing: "市場規模推計",
  growth_strategy: "成長戦略",
};

export const DIFFICULTY_LABELS: Record<string, string> = {
  junior: "ジュニア",
  senior: "シニア",
  partner: "パートナー",
};

export const DIFFICULTY_COLORS: Record<string, string> = {
  junior: "bg-green-100 text-green-800 border-green-200",
  senior: "bg-yellow-100 text-yellow-800 border-yellow-200",
  partner: "bg-red-100 text-red-800 border-red-200",
};

export const READINESS_CONFIG: Record<
  import("@/types").McKinseyReadiness,
  { label: string; color: string }
> = {
  not_ready: { label: "準備不足", color: "bg-red-100 text-red-800 border-red-200" },
  borderline: { label: "ボーダーライン", color: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  ready: { label: "合格圏内", color: "bg-green-100 text-green-800 border-green-200" },
  strong: { label: "高評価", color: "bg-blue-100 text-blue-800 border-blue-200" },
};
