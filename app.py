import streamlit as st
import pandas as pd
import datetime
import os

st.title("就活スケジュール管理アプリ")

csv_file = "schedule.csv"

st.subheader("新しい選考を追加")

with st.form(key="entry_form"):
    company = st.text_input("企業名")
    applied_date = st.date_input("応募日", value=datetime.date.today())
    status = st.selectbox("ステータス", ["ES提出", "一次面接", "二次面接", "最終面接", "内定", "不合格"])
    next_interview = st.date_input("次回面接日", value=datetime.date.today())
    submit = st.form_submit_button(label="登録する")

    if submit:
        new_data = pd.DataFrame([[company, applied_date, status, next_interview]],
                                columns=["企業名", "応募日", "ステータス", "次回面接日"])
        if os.path.exists(csv_file):
            new_data.to_csv(csv_file, mode="a", header=False, index=False)
        else:
            new_data.to_csv(csv_file, index=False)
        st.success(f"{company} を追加しました！")

st.subheader("現在の選考状況")

if os.path.exists(csv_file):
    df = pd.read_csv(csv_file)
    df["応募日"] = pd.to_datetime(df["応募日"])
    df = df.sort_values("応募日")
    st.dataframe(df)

    st.subheader("選考情報の削除")
    if len(df) > 0:
        selected_company = st.selectbox("削除したい企業を選んできださい", df["企業名"].unique())
        if st.button("削除する"):
            df = df[df["企業名"] != selected_company]
            df.to_csv(csv_file, index=False)
            st.success(f"{selected_company}を削除しました！")
            st.experimental_rerun()
    def highlight_status(row):
        color = ""
        if row["ステータス"] == "内定":
            color = "background-color: lightgreen"
        elif row["ステータス"] == "不合格":
            color = "background-color: pink"
        return [color] * len(row)
    st.dataframe(df.style.apply(highlight_status, axis=1))
else:
    st.info("まだ選考情報が登録されていません。")