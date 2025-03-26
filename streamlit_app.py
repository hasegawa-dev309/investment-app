import streamlit as st
import pandas as pd
import yfinance as yf
import matplotlib.pyplot as plt

st.title("投資判断アプリ（ベータ＋機能拡張版）")
st.subheader("企業コードまたはティッカーを入力してください")

market = st.radio("市場を選択", ("日本株", "米国株"))
stock_code = st.text_input("企業コード（例: 7203, AAPL など）", "")

if stock_code:
    ticker_symbol = f"{stock_code}.T" if market == "日本株" else stock_code.upper()
    st.write(f"「{ticker_symbol}」に関する情報を取得中です...")

    ticker = yf.Ticker(ticker_symbol)
    info = ticker.info

    hist = ticker.history(period="30y")

    if hist.empty:
        st.error("株価データが取得できませんでした。コードが正しいかご確認ください。")
    else:
        st.subheader("過去30年間の株価推移")
        fig, ax = plt.subplots()
        ax.plot(hist.index, hist["Close"])
        ax.set_title(f"{ticker_symbol}の株価推移（30年）")
        ax.set_xlabel("日付")
        ax.set_ylabel("終値（Close）")
        st.pyplot(fig)

        st.subheader("企業情報")
        st.write(f"企業名: {info.get('longName', '情報なし')}")
        st.write(f"現在の株価: {info.get('currentPrice', '取得失敗')}円")
        st.write(f"PER（株価収益率）: {info.get('trailingPE', '情報なし')}")

        st.subheader("移動平均線（トレンド分析）")
        hist["MA50"] = hist["Close"].rolling(window=50).mean()
        hist["MA200"] = hist["Close"].rolling(window=200).mean()

        fig_ma, ax_ma = plt.subplots()
        ax_ma.plot(hist.index, hist["Close"], label="終値", alpha=0.6)
        ax_ma.plot(hist.index, hist["MA50"], label="50日移動平均", linestyle="--")
        ax_ma.plot(hist.index, hist["MA200"], label="200日移動平均", linestyle=":")
        ax_ma.legend()
        ax_ma.set_title(f"{ticker_symbol}の移動平均線")
        st.pyplot(fig_ma)

        if not hist["MA50"].isna().all() and not hist["MA200"].isna().all():
            current_price = hist["Close"].dropna().iloc[-1]
            ma50 = hist["MA50"].dropna().iloc[-1]
            ma200 = hist["MA200"].dropna().iloc[-1]

            st.subheader("売却アドバイス")
            st.write(f"現在の株価: {current_price:.2f}")
            st.write(f"50日移動平均: {ma50:.2f}")
            st.write(f"200日移動平均: {ma200:.2f}")

            if current_price < ma50 < ma200:
                st.warning("📉 下落トレンドです。売却も検討を。")
            elif current_price > ma50 > ma200:
                st.success("📈 上昇トレンド中。ホールドまたは買い増しが検討可。")
            else:
                st.info("🔄 トレンドが読みにくい状況です。様子見を推奨します。")

        st.subheader("売上高・純利益の推移")
        financials = ticker.financials.T[::-1]
        if 'Total Revenue' in financials.columns and 'Net Income' in financials.columns:
            revenue = financials['Total Revenue'] / 1e8
            net_income = financials['Net Income'] / 1e8

            fig2, ax2 = plt.subplots()
            ax2.plot(revenue.index, revenue.values, label="売上高（億円）", marker="o")
            ax2.plot(net_income.index, net_income.values, label="純利益（億円）", marker="x")
            ax2.set_title(f"{info.get('longName', ticker_symbol)}の売上・利益推移")
            ax2.legend()
            ax2.grid(True)
            st.pyplot(fig2)

            st.subheader("成長率の診断")
            def growth(series):
                if len(series) < 2:
                    return None
                return ((series.iloc[-1] / series.iloc[0]) ** (1 / len(series)) - 1) * 100

            rev_growth = growth(revenue)
            prof_growth = growth(net_income)

            st.write(f"売上高の年平均成長率: {rev_growth:.2f}%" if rev_growth else "データ不足")
            st.write(f"純利益の年平均成長率: {prof_growth:.2f}%" if prof_growth else "データ不足")

            st.subheader("投資判断まとめ")
            if rev_growth and prof_growth:
                if rev_growth > 10 and prof_growth > 10:
                    st.success("✅ 急成長中の優良企業。投資に向いています！")
                elif prof_growth > 0:
                    st.info("↗️ 安定した成長。中長期投資におすすめ。")
                elif prof_growth < 0:
                    st.warning("⚠️ 利益が減少傾向。リスクをよく確認してください。")
                else:
                    st.info("成長率は横ばいです。")
        else:
            st.warning("財務データが取得できませんでした。")
