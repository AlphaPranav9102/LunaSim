from fastapi import APIRouter, FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from src.api.auth import router as auth_router
from src.api.user import router as user_router
from src.constants import PROD


app = FastAPI(
    title="Equinox REST API",
    version="1.0.0",
)

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


router = APIRouter()

@router.get("/")
async def read_root():
    return {"Hello": "World"}


@router.get("/info")
def get_info():
    return {"PROD": PROD}


app.include_router(router, prefix="", include_in_schema=False)
app.include_router(auth_router, prefix="/auth")
app.include_router(user_router, prefix="/user")