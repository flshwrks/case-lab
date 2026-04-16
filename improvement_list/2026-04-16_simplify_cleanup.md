# コードレビュー・クリーンアップ（simplify）

## 対象
- `src/data/cases.ts`
- `src/components/sparring/CaseSelector.tsx`, `FeedbackPanel.tsx`
- `src/app/model-answer/page.tsx`, `src/app/history/page.tsx`
- `src/hooks/useSparringSession.ts`, `src/hooks/useModelAnswer.ts`
- `src/lib/storage.ts`
- `src/app/model-answer/[caseId]/page.tsx`
- `src/components/sparring/ChatWindow.tsx`

## 変更内容

3エージェント（再利用・品質・効率）の並列レビューに基づいて修正。

### 重複定数の統合（Reuse）
- `DIFFICULTY_COLORS`、`READINESS_CONFIG` を `cases.ts` に一元化
- CaseSelector、model-answer/page、FeedbackPanel、history/page の各ローカル定義を削除してimport化
- `readinessConfig` のラベル不統一（"ボーダー" vs "ボーダーライン"）も解消

### ロジック重複の統合（Quality）
- `useSparringSession`: `sendMessage` と `requestHint` の共通ロジックを `addUserMessageAndRespond` に集約（60行削減）
- `updateSession` callback（1箇所でしか使われていなかった）を削除し `setSession` の関数形式で直接記述
- `FeedbackPanel`: `dimensionLabels` を `Record<DimensionKey, string>` で型安全化

### 安全性・効率改善（Efficiency）
- `useSparringSession`、`useModelAnswer`: `useEffect` unmount cleanup を追加（AbortController リーク防止）
- `storage.ts`: `typeof window === "undefined"` ガードを追加（SSR安全化）、失敗時に `dbPromise` をリセット
- `model-answer/[caseId]/page.tsx`: `hasLoaded` state を削除し 2つの `useEffect` を1つに統合
- `ChatWindow.tsx`: scroll trigger を `messages.length` のみに変更（`isThinking` 変化による余分なスクロール解消）

## 理由

3エージェントの並列レビューで検出した重複・リーク・型安全性の問題を修正。ロジック削減で保守性向上。
