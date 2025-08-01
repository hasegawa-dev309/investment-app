# お化け屋敷受付システム API

文化祭用の整理券予約アプリのバックエンドAPIです。

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

<p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>

## 機能

- 来場者が整理券を予約できる
- 予約番号は自動で「A-001」のように連番で生成（日付ごとにリセット）
- 予約完了時に確認メールを自動送信
- 呼び出し番号が「10組前」になったときに通知メールを自動送信
- 管理者がチェックイン状況や番号進行を管理できる
- メンテナンス中は来場者にそれを表示する
- 全ての予約・呼び出し・システム状況は日付で管理（1日目・2日目の混在を防止）

## 技術スタック

- NestJS（TypeScript）
- TypeORM
- PostgreSQL
- SendGrid（メール送信）
- RESTful API構成

## セットアップ

### 1. 依存関係のインストール

```bash
$ npm install
```

### 2. 環境変数の設定

`env.example`をコピーして`.env`ファイルを作成し、必要な値を設定してください：

```bash
cp env.example .env
```

### 3. データベースの設定

PostgreSQLデータベースを作成し、`schema-new.sql`を実行してください：

```sql
CREATE DATABASE obakeyashiki_uketuke;
\c obakeyashiki_uketuke
\i schema-new.sql
```

### 4. アプリケーションの起動

```bash
# 開発モード
$ npm run start:dev

# 本番モード
$ npm run start:prod
```

## API エンドポイント

### 来場者側API

- `POST /reserve` - 整理券を予約する（予約完了メールを自動送信）
- `GET /status` - 現在呼び出している番号とメンテナンス状況を表示

### 管理者側API

- `GET /admin/reservations` - 予約一覧（当日分）を取得
- `PATCH /admin/call-status` - 現在呼び出す番号を手動更新（10組前の予約者に自動通知）
- `PATCH /admin/checkin/:id` - チェックイン状況を更新（来た／来なかった）
- `PATCH /admin/system-status` - メンテナンスモードをON/OFFに設定

### リクエスト例

#### 予約作成
```json
POST /reserve
{
  "email": "user@example.com",
  "number_of_people": 2,
  "age_group": "UNIVERSITY",
  "reservation_date": "2024-10-15"
}
```

**レスポンス例:**
```json
{
  "id": 1,
  "email": "user@example.com",
  "number_of_people": 2,
  "age_group": "UNIVERSITY",
  "reservation_number": "A-001",
  "reservation_date": "2024-10-15",
  "status": "WAITING",
  "checkin_time": null,
  "created_at": "2024-10-15T10:30:00Z",
  "updated_at": "2024-10-15T10:30:00Z"
}
```

#### 呼び出し番号更新
```json
PATCH /admin/call-status
{
  "current_number": "A-012",
  "date": "2024-10-15"
}
```

#### チェックイン更新
```json
PATCH /admin/checkin/1
{
  "status": "CHECKED_IN",
  "checkin_time": "2024-10-15T14:30:00Z"
}
```

#### システム状態更新
```json
PATCH /admin/system-status
{
  "is_under_maintenance": true,
  "message": "システムメンテナンス中です",
  "date": "2024-10-15"
}
```

## 環境変数

| 変数名 | 説明 | 必須 |
|--------|------|------|
| DB_HOST | データベースホスト | ○ |
| DB_PORT | データベースポート | ○ |
| DB_USERNAME | データベースユーザー名 | ○ |
| DB_PASSWORD | データベースパスワード | ○ |
| DB_DATABASE | データベース名 | ○ |
| SENDGRID_API_KEY | SendGrid APIキー | ○ |
| SENDGRID_FROM_EMAIL | 送信元メールアドレス | ○ |
| PORT | アプリケーションポート | × |
| NODE_ENV | 環境（development/production） | × |

## テスト

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## デプロイ

本番環境へのデプロイについては、[NestJS デプロイメントドキュメント](https://docs.nestjs.com/deployment)を参照してください。

## 作成者

hasegawashion  
GitHub: https://github.com/hasegawa-dev309

## ライセンス

MIT
