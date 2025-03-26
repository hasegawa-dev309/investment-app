import streamlit as st
import pandas as pd
import yfinance as yf
import matplotlib.pyplot as plt

st.title("投資判断アプリ(ベータ版)")
st.subheader("企業コードまたはティッカーを入力してください")

market = st.radio("市場を選択",("日本株","米国株"))

stock_code = st.text_input("企業コード(例:7203、AAPL など)","")

if stock_code:
    if market =="日本株":
        ticker_symbol = f"{stock_code}.T"
    else:
        ticker_symbol = stock_code.upper()

    st.write(f"「{ticker_symbol}」に関する情報を取得中です...")

    ticker = yf.Ticker(ticker_symbol)
    info = ticker.info

    hist = ticker.history(period="30y")
    st.subheader("過去30年間の株価推移")

    fig, ax = plt.subplots()
    ax.plot(hist.index, hist["Close"])
    ax.set_xlabel("日付")
    ax.set_ylabel("終値(Close)")
    ax.set_title(f"{ticker_symbol}の株価推移(30年)")
    st.pyplot(fig)

    st.subheader("企業情報")
    st.write(f"企業名:{info.get('longName','情報なし')}")
    st.write(f"現在の株価:{info.get('currentPrice','取得失敗')}円")

    hist["MA50"] = hist["Close"].rolling(window=50).mean()
    hist["MA200"] = hist["Close"].rolling(window=200).mean()

    st.subheader("移動平均線で見るトレンド")

    fig_ma, ax_ma = plt.subplots()
    ax_ma.plot(hist.index, hist["Close"], label="終値", alpha=0.6)
    ax_ma.plot(hist.index, hist["MA50"], label="50日移動平均", linestyle="--")
    ax_ma.plot(hist.index, hist["MA200"], label="200日移動平均", linestyle=":")
    ax_ma.set_xlabel("日付")
    ax_ma.set_ylabel("価格")
    ax_ma.set_title(f"{ticker_symbol}の移動平均線")
    ax_ma.legend()
    ax_ma.grid(True)
    st.pyplot(fig_ma)

    st.subheader("売却アドバイス")

    current_price = hist["Close"].iloc[-1]
    ma50 = hist["MA50"].iloc[-1]
    ma200 = hist["MA200"].iloc[-1]

    st.write(f"現在の株価:{current_price:.2f}")
    st.write(f"50日移動平均：{ma50:.2f}")
    st.write(f"200日移動平均：{ma200:.2f}")

    if current_price < ma50 < ma200:
        st.warning("📉 株価は下落トレンドにあります。売却を検討してもよいかもしれません。")
    elif current_price > ma50 > ma200:
        st.success("📈 上昇トレンド中！ホールド or 買い増しが検討できます。")
    else:
        st.info("🔄 トレンドは不安定です。しばらく様子を見ましょう。")

    st.subheader("売上高・純利益の推移")

    financials = ticker.financials.T
    financials = financials[::-1]

    if 'Total Revenue' in financials.columns and 'Net Income' in financials.columns:
        revenue = financials['Total Revenue'] / 1e8
        net_income = financials['Net Income'] / 1e8

        years = len(revenue)
        revenue_cagr = (revenue.iloc[-1] / revenue.iloc[0]) ** (1 / years) - 1
        profit_cagr = (net_income.iloc[-1] / net_income.iloc[0]) ** (1 / years) - 1

        st.subheader("成長率の診断")

        st.write(f"売上高の年平均成長率: {revenue_cagr:.2%}")
        st.write(f"純利益の年平均成長率: {profit_cagr:.2%}")

        if revenue_cagr > 0.1 and profit_cagr > 0.1:
            st.success("✅ 売上も利益も右肩上がり！急成長企業です！")
        elif revenue_cagr > 0.05 and profit_cagr > 0:
            st.info("⚠️ 安定成長中の企業です。今後に注目です。")
        elif profit_cagr < 0:
            st.warning("❌ 利益が減少傾向にあります。注意が必要です。")
        else:
            st.info("ℹ️ 成長が停滞しています。")

        fig2, ax2 = plt.subplots()
        ax2.plot(revenue.index, revenue.values, label="売上高(億円)", marker='o')
        ax2.plot(net_income.index, net_income.values, label="純利益(億円)", marker="o")
        ax2.set_title(f"{info.get('longName', ticker_symbol)}の売上・利益の推移")
        ax2.set_xlabel("年度")
        ax2.set_ylabel("金額(億円)")
        ax2.legend()
        ax2.grid(True)
        st.pyplot(fig2)

        st.subheader("追加の成長率診断")

        def calculate_growth_rate(series):
            if len(series) < 2:
                return None
            return ((series.iloc[-1] - series.iloc[0]) / series.iloc[0]) * 100

        if len(revenue) >=2 and len(net_income) >= 2:
            revenue_growth = calculate_growth_rate(revenue)
            net_income_growth = calculate_growth_rate(net_income)

            st.write(f"📈 売上高の成長率（直近{len(revenue)}年）: {revenue_growth:.2f}%")
            st.write(f"📈 純利益の成長率（直近{len(net_income)}年）: {net_income_growth:.2f}%")

            def interpret_growth(growth):
                if growth > 50:
                    return"🚀 急成長企業です！"
                elif growth > 10:
                    return "✅ 成長傾向にあります。"
                elif growth > -10:
                    return "😐 横ばい傾向です。"
                else:
                    return "⚠️ 減少傾向にあります。"

            st.info(f"売上高の評価: {interpret_growth(revenue_growth)}")
            st.info(f"純利益の評価: {interpret_growth(net_income_growth)}")

        st.subheader("赤字・黒字の傾向")

        if len(net_income) >= 1:
            negative_years = (net_income < 0).sum()
            total_years = len(net_income)

            if negative_years == 0:
                status = "🟢 黒字が継続しています（安定企業）"
            elif negative_years < total_years / 2:
                status = "🟡 一部の年で赤字があります"
            else:
                status = "🔴 赤字が多く、業績に不安があります"

            st.write(f"【分析結果】{total_years}年中 {negative_years}年が赤字")
            st.info(status)

        st.subheader("投資診断：この企業は買い？")

        if len(net_income) >= 3:
            latest_profit = net_income.iloc[-1]
            negative_years = (net_income < 0).sum()
            total_years = len(net_income)

            if latest_profit > 0 and negative_years == 0:
                advice ="✅ 安定して黒字が続いています。投資候補として検討できます。"
            elif latest_profit > 0 and negative_years < total_years / 2:
                advice = "⚠️ 黒字化していますが、過去に赤字もあるため注意が必要です。"
            else:
                advice = "❌ 赤字が多く、投資は慎重に判断すべきです。"

            st.success(advice)
        else:
            st.warning("十分なデータがないため、投資判断ができませんでした。")

    else:
        st.warning("売上高や純利益のデータが取得できませんでした。")