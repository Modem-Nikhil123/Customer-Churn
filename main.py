from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import pickle
import os
from dotenv import load_dotenv

load_dotenv()

FRONTEND_URL = os.getenv("FRONTEND_URL")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

cph = pickle.load(open("cox_survival_model.pkl", "rb"))
COLUMNS = pickle.load(open("columns.pkl", "rb"))


class CustomerInput(BaseModel):
    Age: float
    Gender: str
    Usage_Frequency: float
    Support_Calls: float
    Total_Spend: float
    Subscription_Type: str
    Contract_Length: str


def preprocess(data: dict):
    df = pd.DataFrame([data])

    df = df.rename(columns={
        "Usage_Frequency": "Usage Frequency",
        "Support_Calls": "Support Calls",
        "Total_Spend": "Total Spend",
        "Subscription_Type": "Subscription Type",
        "Contract_Length": "Contract Length"
    })

    df["Gender"] = df["Gender"].map({"Male": 1, "Female": 0})

    df = pd.get_dummies(
        df,
        columns=["Subscription Type", "Contract Length"],
        drop_first=True
    )

    for col in COLUMNS:
        if col not in df:
            df[col] = 0

    return df[COLUMNS]


@app.post("/predict")
def predict(customer: CustomerInput):
    data = {
        "Age": customer.Age,
        "Gender": customer.Gender,
        "Usage_Frequency": customer.Usage_Frequency,
        "Support_Calls": customer.Support_Calls,
        "Total_Spend": customer.Total_Spend,
        "Subscription_Type": customer.Subscription_Type,
        "Contract_Length": customer.Contract_Length,
    }

    X = preprocess(data)

    survival_curve = cph.predict_survival_function(X)

    horizons = [30, 90, 180]
    survival_at_horizons = {
        str(t): float(survival_curve.loc[t].values[0])
        for t in horizons
        if t in survival_curve.index
    }

    median_time = float(cph.predict_median(X))
    risk_score = float(cph.predict_partial_hazard(X).values[0])

    curve_data = [
        {"time": int(t), "probability": float(p)}
        for t, p in survival_curve.iloc[:, 0].items()
    ]

    return {
        "median_survival_time": round(median_time, 2),
        "risk_score": round(risk_score, 3),
        "survival_at_horizons": survival_at_horizons,
        "survival_curve": curve_data
    }
