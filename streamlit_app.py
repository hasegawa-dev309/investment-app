import streamlit as st
import pandas as pd
import yfinance as yf
import matplotlib.pyplot as plt

st.title("投資判断アプリ（ベータ＋機能拡張版）")
st.subheader("企業コードまたはティッカーを入力してください")

market = st.radio("市場を選択", ("日本株", "米国株"))
stock_code = st.text_input("企業コード（例:7203, AAPL など）", "")

if stock_code:
    if market == "日本株":
        ticker_symbol = f"{stock_code}.T"
    else:
        ticker_symbol = stock_code.upper()

    st.write(f"「{ticker_symbol}」に関する情報を取得中です...")

    ticker = yf.Ticker(ticker_symbol)

    try:
        hist = ticker.history(period="30y")
        if hist.empty:
            st.error("株価データが取得できませんでした。コードが正しいかご確認ください。")
        else:
            st.subheader("過去30年間の株価推移")
            fig, ax = plt.subplots()
            ax.plot(hist.index, hist["Close"], label="終値")
            ax.set_xlabel("日付")
            ax.set_ylabel("終値(Close)")
            ax.set_title(f"{ticker_symbol}の株価推移(30年)")
            st.pyplot(fig)

            hist["MA50"] = hist["Close"].rolling(window=50).mean()
            hist["MA200"] = hist["Close"].rolling(window=200).mean()

            st.subheader("移動平均線で見るトレンド")
            fig_ma, ax_ma = plt.subplots()
            ax_ma.plot(hist.index, hist["Close"], label="終値", alpha=0.6)
            ax_ma.plot(hist.index, hist["MA50"], label="50日移動平均", linestyle="--")
            ax_ma.plot(hist.index, hist["MA200"], label="200日移動平均", linestyle=":")
            ax_ma.set_title(f"{ticker_symbol}の移動平均線")
            ax_ma.legend()
            ax_ma.grid(True)
            st.pyplot(fig_ma)

            st.subheader("売却アドバイス")
            try:
                current_price = hist["Close"].dropna().iloc[-1]
                ma50 = hist["MA50"].dropna().iloc[-1]
                ma200 = hist["MA200"].dropna().iloc[-1]

                st.write(f"現在の株価: {current_price:.2f}")
                st.write(f"50日移動平均: {ma50:.2f}")
                st.write(f"200日移動平均: {ma200:.2f}")

                if current_price < ma50 < ma200:
                    st.warning("📉 下落トレンドです。売却を検討してもよいかもしれません。")
                elif current_price > ma50 > ma200:
                    st.success("📈 上昇トレンド中！ホールドや買い増しの検討を。")
                else:
                    st.info("🔄 トレンドは不安定です。様子を見ましょう。")
            except:
                st.warning("売却アドバイスを出すための株価情報が不足しています。")

        info = ticker.info
        st.subheader("企業情報")
        st.write(f"企業名: {info.get('longName', '情報なし')}")
        st.write(f"現在の株価: {info.get('currentPrice', '取得失敗')}")

        if "trailingPE" in info:
            st.write(f"PER（株価収益率）: {info['trailingPE']:.2f}")
        else:
            st.write("PER: 情報が取得できませんでした。")

        st.subheader("売上高・純利益の推移")
        financials = ticker.financials.T
        financials = financials[::-1]

        if 'Total Revenue' in financials.columns and 'Net Income' in financials.columns:
            revenue = financials['Total Revenue'].dropna() / 1e8
            net_income = financials['Net Income'].dropna() / 1e8

            fig2, ax2 = plt.subplots()
            ax2.plot(revenue.index, revenue.values, label="売上高(億円)", marker='o')
            ax2.plot(net_income.index, net_income.values, label="純利益(億円)", marker='x')
            ax2.set_title(f"{info.get('longName', ticker_symbol)}の売上・利益推移")
            ax2.set_xlabel("年度")
            ax2.set_ylabel("金額（億円）")
            ax2.legend()
            ax2.grid(True)
            st.pyplot(fig2)

            st.subheader("成長率の診断")

            if len(revenue) >= 2 and len(net_income) >= 2:
                years = len(revenue)
                revenue_cagr = (revenue.iloc[-1] / revenue.iloc[0]) ** (1 / years) - 1
                profit_cagr = (net_income.iloc[-1] / net_income.iloc[0]) ** (1 / years) - 1

                st.write(f"売上高の年平均成長率: {revenue_cagr:.2%}")
                st.write(f"純利益の年平均成長率: {profit_cagr:.2%}")

                if revenue_cagr > 0.1 and profit_cagr > 0.1:
                    st.success("✅ 売上・利益ともに急成長企業です！")
                elif revenue_cagr > 0.05 and profit_cagr > 0:
                    st.info("⚠️ 安定成長中の企業です。今後に注目です。")
                elif profit_cagr < 0:
                    st.warning("❌ 利益が減少傾向にあります。注意しましょう。")
                else:
                    st.info("ℹ️ 成長がやや停滞しています。")
            else:
                st.warning("成長率を計算するのに十分なデータがありません。")

            st.subheader("赤字・黒字の傾向")
            negative_years = (net_income < 0).sum()
            total_years = len(net_income)

            if total_years >= 1:
                if negative_years == 0:
                    st.success("🟢 黒字が継続しています（安定企業）")
                elif negative_years < total_years / 2:
                    st.info("🟡 一部の年で赤字あり")
                else:
                    st.warning("🔴 赤字が多く、業績に注意が必要です")

                st.write(f"{total_years}年中 {negative_years}年が赤字")
            else:
                st.warning("純利益のデータが十分ではありませんでした。")

            st.subheader("投資判断：この企業は買い？")
            if total_years >= 3:
                latest_profit = net_income.iloc[-1]
                if latest_profit > 0 and negative_years == 0:
                    st.success("✅ 安定して黒字！投資候補として検討できます。")
                elif latest_profit > 0 and negative_years < total_years / 2:
                    st.info("⚠️ 黒字化していますが注意も必要です。")
                else:
                    st.warning("❌ 赤字傾向あり。慎重な判断が必要です。")
            else:
                st.warning("投資判断を下すのに十分な年数のデータがありません。")
        else:
            st.warning("売上高や純利益の情報が取得できませんでした。")

    except Exception as e:
        st.error(f"エラーが発生しました: {e}")
