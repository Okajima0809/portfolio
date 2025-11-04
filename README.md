# portfolio
## アプリ概要
例：Next.jsとSupabaseを用いたブログアプリです。  
↑  
面接官が一目で分かるように、使用技術とアプリ概要を端的に記述しましょう。

## サイトイメージ
メインページの画像を貼れると良いです。

![アプリ画面](https://github.com/aihat9161/PortfolioExample_WorX_ENGINEER-CLASS/blob/f72a921271bddc8d47744118a0838061c302a9d7/docs/%E3%82%A2%E3%83%97%E3%83%AA%E3%81%AE%E3%83%A1%E3%82%A4%E3%83%B3%E3%83%9A%E3%83%BC%E3%82%B8%E7%94%BB%E5%83%8F.jpg?raw=true)

## サイトURL

デプロイした後のアプリのメインページURLを貼りましょう。  
https://blogapp-forlecture.vercel.app/


「画面中部のゲストログインボタンから、メールアドレスとパスワードを入力せずにログインできます。」といった仕様を作れれば、面接官も試しやすいと思います。

## 使用技術
- フロントエンド：Next.js 15.3
- バックエンド：Next.js 15.3、~Python 3.13.3（FastAPI0.115.12）~
- データベース：Supabase
- デプロイ：Vercel
- バージョン管理：Git、GitHub
- テスト・デバッグ：DevTools（Chrome）
- CI/CD：GitHub Actions（ESLint）

※箇条書きは「-」のあとに空白を入れて本文を始めることで可能です。

## 設計ドキュメント
[要件定義・基本設計・詳細設計の一覧_Googleスプレッドシート](https://docs.google.com/spreadsheets/d/1lAt60RcbFcefG2Vv6cXEfLrz2AEGKd1Nk4eXur7rBag/edit?gid=983827669#gid=983827669)

詳細設計時のワイヤーフレーム、ER図、ワークフロー図の画像はdocsディレクトリに格納しています。（[こちらからアクセス](./docs)）

※[]の中に表示文を書き、その後ろで()の中にURLを入れればハイパーリンク化できます。

## 機能一覧
- ユーザー認証機能(メンバー別でのアカウント管理)
- 試合結果登録機能(試合ごとのスコア・対戦相手・日付などを登録)
- 打者成績登録機能(個人打撃成績を登録・更新)
- 投手成績登録機能(個人投手成績を登録・更新)
- 自動集計機能(登録した成績を自動で集計)
- 成績表示機能(個人成績一覧の表示、ランキング形式での表示)
- メンバー一覧機能(メンバーの基本情報を登録)
- 権限管理(管理者／一般ユーザー)
- レスポンシブ対応


## テスト・修正の設計及び実施書
[テスト・修正の設計及び実施書_Googleスプレッドシート](https://docs.google.com/spreadsheets/d/1ph7XaLu4a2k_kDBEpj_ySTBPETJvg5143ZMk5G90DUA/edit?usp=sharing)

## アプリの改善案
[アプリの改善案_Googleスプレッドシート](https://docs.google.com/spreadsheets/d/1fgynpBKhx8zaNkMweeYVQl52bP6Z8dJZOmmY8MHXjQM/edit?usp=sharing)

## 備考
[ESLintの実行結果_GitHub Actions](https://github.com/aihat9161/PortfolioExample_Next.js_BlogAppWorX_ENGINEER-CLASS/actions/runs/14956271682/job/42012343864)

- 活用した生成AIとその用途
  - ChatGPT：要件定義、設計、各種リサーチ
  - v0：アプリのモック作成
  - GitHub Copilot Chat：ローカル環境でのコードの修正相談
    

- リファクタリングの規則
  - 2つ以上のファイルで使う、行数が10以上のUIコンポーネントはcomponentsフォルダに移行
  - 2つ以上のファイルで使う、行数が10以上の関数はlibフォルダに移行
  - 変数名で2つ以上の単語が入る場合は、「isPublished」のように二つ目以降の単語の頭を大文字とする
