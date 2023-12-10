from fastapi import Depends, FastAPI
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession

app = FastAPI()

@app.get("/ping")
async def pong():
    return {"ping": "pong!"}