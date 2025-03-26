import streamlit as st
import pandas as pd
import datetime

st.title("就活スケジュール管理アプリ - デモ版")

data = [
    ["サンプル株式会社", "2025-03-01", "一次面接", "2025-03-15"],
    ["テックカンパニー", "2025-03-05", "二次面接", "2025-03-20"],
    ["ナイス企業", "2025-03-10", "内定", "2025-03-30"],
    ["落ちた株式会社", "2025-03-08", "不合格", "2025-03-08"]
]
df = pd.DataFrame(data, columns=["企業名","応募日","ステータス","次回面接日"])
df["応募日"] = pd.to_datetime(df["応募日"])
df = df.sort_values("応募日")

def highlight_status(row):
    color = ""
    if row["ステータス"] =="内定":
        color = "background-color: lightgreen"
    elif row["ステータス"] =="不合格":
        color = "background-color: pink"
    return [color] * len(row)

st.dateframe(df.style.apply(highlight_status, axis=1))