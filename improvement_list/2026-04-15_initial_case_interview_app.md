# ケース面接対策アプリ 初期実装

## 対象
- `src/types/index.ts`
- `src/data/cases.ts`
- `src/lib/anthropic.ts`, `src/lib/prompts.ts`, `src/lib/storage.ts`
- `src/app/api/chat/route.ts`, `src/app/api/feedback/route.ts`, `src/app/api/model-answer/route.ts`
- `src/hooks/useSparringSession.ts`, `src/hooks/useModelAnswer.ts`
- `src/components/layout/Header.tsx`
- `src/components/sparring/` (CaseSelector, ChatWindow, InputBar, FeedbackPanel)
- `src/components/model-answer/` (ModelAnswerDisplay, CompareView)
- `src/app/page.tsx`, `src/app/layout.tsx`
- `src/app/sparring/page.tsx`
- `src/app/model-answer/page.tsx`, `src/app/model-answer/[caseId]/page.tsx`
- `src/app/history/page.tsx`

## 変更内容

Next.js 16 + Claude API を使ったケース面接対策Webアプリを新規構築。

- **壁打きモード**: AI面接官（McKinseyペルソナ「Alex」）と対話。非ストリーミング（完全テキスト表示）でリアル面接感を実現。5軸フィードバック（MECE・仮説思考・定量・構成・コミュニケーション）＋McKinsey準備度バッジ。
- **模範解答モード**: ストリーミング表示でMBB水準のモデルアンサーを生成。壁打き後の比較ビュー（2カラム）にも対応。
- **設計上の判断**（批評家エージェントの壁打きを反映）:
  - 面接ターンは非ストリーミング（リアル面接感のため）
  - 永続化はIndexedDB (`idb`)でスキーマ管理（localStorage migration回避）
  - 各ケースにJSON固定ドキュメント（数値・業界情報）を注入しAIの数値発散を防止
  - MVP: 3ケース（収益性・市場規模・成長戦略）

## 理由

戦略コンサル（MBB水準）の面接に対応できる能力育成のため。AIと批評家ペルソナのAgent Teamsで設計を壁打きして品質を高めた。
