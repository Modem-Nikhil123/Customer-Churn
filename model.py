import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from lifelines import CoxPHFitter, KaplanMeierFitter
import pickle

df = pd.read_csv("churn.csv")
df = df.drop([
    "CustomerID",
    "Last Interaction",
    "Payment Delay"
], axis=1)
df = df.dropna(subset=["Churn", "Tenure"])
df.fillna(df.mean(numeric_only=True), inplace=True)
df["Gender"] = df["Gender"].map({"Male": 1, "Female": 0})
df = pd.get_dummies(
    df,
    columns=["Subscription Type", "Contract Length"],
    drop_first=True
)

df = df.rename(columns={
    "Tenure": "duration",
    "Churn": "event"
})
bool_cols = [
    "Subscription Type_Premium",
    "Subscription Type_Standard",
    "Contract Length_Monthly",
    "Contract Length_Quarterly"
]

df[bool_cols] = df[bool_cols].astype(int)
kmf = KaplanMeierFitter()
kmf.fit(
    durations=df["duration"],
    event_observed=df["event"]
)
cph = CoxPHFitter()
cph.fit(
    df,
    duration_col="duration",
    event_col="event"
)

pickle.dump(cph, open("cox_survival_model.pkl", "wb"))

pickle.dump(
    df.drop(["duration", "event"], axis=1).columns.tolist(),
    open("columns.pkl", "wb")
)