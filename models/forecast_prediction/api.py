from fastapi import FastAPI , File, UploadFile, Request
import numpy as np
from pydantic import BaseModel
from typing import List, Optional
from fastapi.middleware.cors import CORSMiddleware
from return_forecast import return_forecast

api = FastAPI()

# GET - to get information
# POST - submitting new information
# PUT - updating information 
# DELETE - deleting information

class Transaction(BaseModel):
    amount: float
    type: str  
    date: str

class BalanceRequest(BaseModel):
    initialBalance: float  # matches your camelCase input
    transactions: List[Transaction]

    

api.add_middleware(
    CORSMiddleware,
    allow_origins=[
    "https://forecash.vercel.app",  # deployed site
    "http://localhost:3000",
    "http://localhost:5173",
    "http://localhost:8080",
    "http://localhost:8000",
    "https://call2roast.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@api.get('/')
def index():
    return {"message":"Hello World"}


@api.post('/predict_forecast')
async def predict(request: BalanceRequest):
    inital_balance = request.initialBalance
    transactions = request.transactions
    prediction = return_forecast(inital_balance,transactions)
    return {"received_data": prediction}


