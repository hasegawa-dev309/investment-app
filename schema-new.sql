-- ==============================================
-- 新しいお化け屋敷受付システムのDBスキーマ
-- ==============================================

-- PostgreSQL拡張機能の有効化（UUIDサポート）
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 年齢層のenum型
CREATE TYPE age_group_enum AS ENUM ('HIGH_SCHOOL', 'UNIVERSITY', 'OTHER');

-- 予約ステータスのenum型
CREATE TYPE reservation_status_enum AS ENUM ('WAITING', 'CANCELED', 'CHECKED_IN', 'NO_SHOW');

-- 予約テーブル
CREATE TABLE reservations_new (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  number_of_people INTEGER NOT NULL CHECK (number_of_people > 0 AND number_of_people <= 10),
  age_group age_group_enum NOT NULL,
  reservation_number VARCHAR(20) NOT NULL,
  reservation_date DATE NOT NULL,
  status reservation_status_enum DEFAULT 'WAITING',
  checkin_time TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT uq_reservation_per_date UNIQUE (reservation_date, reservation_number),
  CONSTRAINT chk_email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- 呼び出し番号管理テーブル
CREATE TABLE call_status_new (
  id SERIAL PRIMARY KEY,
  current_number VARCHAR(20) NOT NULL,
  call_date DATE NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- システム状態管理テーブル
CREATE TABLE system_status_new (
  id SERIAL PRIMARY KEY,
  is_under_maintenance BOOLEAN DEFAULT FALSE,
  message TEXT DEFAULT '',
  status_date DATE NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- インデックス作成
CREATE INDEX idx_reservations_new_date ON reservations_new(reservation_date);
CREATE INDEX idx_reservations_new_email ON reservations_new(email);
CREATE INDEX idx_reservations_new_status ON reservations_new(status);
CREATE INDEX idx_reservations_new_number ON reservations_new(reservation_number);
CREATE INDEX idx_reservations_new_date_status ON reservations_new(reservation_date, status);

CREATE INDEX idx_call_status_new_date ON call_status_new(call_date);
CREATE INDEX idx_system_status_new_date ON system_status_new(status_date);

-- updated_atカラムの自動更新用トリガー関数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language plpgsql;

-- 各テーブルにupdated_at自動更新トリガーを追加
CREATE TRIGGER trigger_reservations_new_updated_at
    BEFORE UPDATE ON reservations_new
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_call_status_new_updated_at
    BEFORE UPDATE ON call_status_new
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_system_status_new_updated_at
    BEFORE UPDATE ON system_status_new
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- コメント付加
COMMENT ON TABLE reservations_new IS '予約情報テーブル（新設計）';
COMMENT ON TABLE call_status_new IS '呼び出し番号管理テーブル（新設計）';
COMMENT ON TABLE system_status_new IS 'システム状態管理テーブル（新設計）';
COMMENT ON TYPE age_group_enum IS '年齢層のenum型';
COMMENT ON TYPE reservation_status_enum IS '予約ステータスのenum型'; 