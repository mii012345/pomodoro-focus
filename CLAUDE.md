# Pomodoro Focus Timer

## プロジェクト概要
シンプルで美しいポモドーロタイマー + タスク管理Webアプリ。
ローカルストレージでデータ永続化。外部API不要。

## 技術スタック
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS v4
- localStorage でデータ永続化

## 機能要件
1. ポモドーロタイマー（25分作業 / 5分休憩 / 15分長休憩）
2. タスクリスト（追加・完了・削除）
3. 現在のタスクとタイマーの連携
4. 完了ポモドーロ数の記録
5. 通知音 + ブラウザ通知
6. 今日の統計（完了ポモドーロ数、合計集中時間）

## デザイン方針
- ダークモード基調
- ミニマルでフォーカスしやすいUI
- モバイルファースト
- 作業中は赤系、休憩中は緑系のカラー

## ファイル構成
- src/app/page.tsx — メインページ
- src/components/Timer.tsx — タイマーコンポーネント
- src/components/TaskList.tsx — タスクリストコンポーネント
- src/components/Stats.tsx — 統計コンポーネント
- src/hooks/useTimer.ts — タイマーロジック
- src/hooks/useLocalStorage.ts — localStorage永続化
- src/types.ts — 型定義
