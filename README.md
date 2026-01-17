# Customer Churn – Time-to-Exit Prediction (Survival Analysis)

This project implements a time-to-event customer churn prediction system using survival analysis. Instead of predicting churn as a binary outcome (yes or no), the model estimates when a customer is likely to churn and provides survival probabilities over time.

The system is implemented as a full-stack application with a FastAPI backend and a React-based frontend that visualizes survival curves.

## Overview

Traditional churn prediction models answer whether a customer will churn. This project focuses on predicting how long a customer is expected to remain active and the probability of retention at future time points.

## Features

- Individual survival curve prediction
- Survival probability estimation at 30, 90, and 180 days
- Median time-to-churn estimation
- Relative churn risk scoring
- Interactive survival curve visualization

## Tech Stack

Backend:
- Python
- FastAPI
- Lifelines (Cox Proportional Hazards Model)
- Pandas, NumPy
- Pickle

Frontend:
- React (Vite)
- Tailwind CSS
- Axios
- Recharts

Deployment:
- Backend deployed on Render
- Frontend deployed on Vercel

## Project Structure

Customer_churn-TTE/
├── main.py
├── model.py
├── cox_survival_model.pkl
├── columns.pkl
├── frontend/
│   └── src/App.jsx
└── README.md

## Model Details

- Model Type: Survival Analysis
- Estimator: Cox Proportional Hazards
- Rationale:
  - Handles censored data
  - No assumption about baseline hazard
  - Produces interpretable risk scores

## API Reference

Endpoint: POST /predict

Request Body:
{
  "Age": 30,
  "Gender": "Male",
  "Usage_Frequency": 14,
  "Support_Calls": 5,
  "Total_Spend": 932,
  "Subscription_Type": "Standard",
  "Contract_Length": "Monthly"
}

Response:
{
  "median_survival_time": 142.3,
  "risk_score": 1.27,
  "survival_at_horizons": {
    "30": 0.92,
    "90": 0.81,
    "180": 0.63
  },
  "survival_curve": [
    { "time": 1, "probability": 0.99 },
    { "time": 2, "probability": 0.99 }
  ]
}

## Running Locally

Backend:
- pip install -r requirements.txt
- uvicorn main:app --reload

Backend URL:
- http://localhost:8000

Swagger UI:
- http://localhost:8000/docs

Frontend:
- cd frontend
- npm install
- npm run dev

Frontend URL:
- http://localhost:5173

## Environment Variables

Frontend (.env):
- VITE_API_URL=http://localhost:8000

Backend (.env):
- FRONTEND_URL=http://localhost:5173

## Notes

- The model is loaded from pre-trained pickle files.
- No retraining occurs during runtime.
- Designed for academic and demonstration purposes.

## Limitations

- Static features only
- Single-customer prediction per request
- Not intended for large-scale production use

## License

This project is provided for educational use only.