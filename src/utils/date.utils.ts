export class DateUtils {
  /**
   * 現在の日付をYYYY-MM-DD形式で取得
   */
  static getCurrentDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  /**
   * 日付文字列をDate型に変換
   */
  static parseDate(dateString: string): Date {
    return new Date(dateString);
  }

  /**
   * 日付が有効かチェック
   */
  static isValidDate(dateString: string): boolean {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  }

  /**
   * 日付が今日以降かチェック
   */
  static isDateTodayOrFuture(dateString: string): boolean {
    const targetDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return targetDate >= today;
  }

  /**
   * 日付をフォーマット（YYYY-MM-DD）
   */
  static formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }
} 