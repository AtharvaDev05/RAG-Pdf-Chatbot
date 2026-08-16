from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session

from app.models.db_models import User
from app.core.database import get_db
from app.core.security import hash_password
from app.core.security import get_current_user
from app.models.request_models import ( RegisterRequest, LoginRequest )

from app.core.security import ( verify_password, create_access_token )

from authlib.integrations.starlette_client import OAuth
import os
from dotenv import load_dotenv

load_dotenv()

oauth = OAuth()

oauth.register(
    name = "google",
    client_id=os.getenv("GOOGLE_CLIENT_ID"),
    client_secret=os.getenv("GOOGLE_CLIENT_SECRET"),
    server_metadata_url="https://accounts.google.com/.well-known/openid-configuration",
    client_kwargs={
        "scope": "openid email profile"
    }
)

router = APIRouter( prefix="/auth", tags=["Authentication"] )

@router.post("/register")
def register( user_data : RegisterRequest, db : Session = Depends(get_db) ):

    existing_user = db.query(User).filter(
        User.email == user_data.email
    ).first()

    if existing_user:
        raise HTTPException(
            status_code = 400,
            detail = "Email already registered."
        )

    hashed_password = hash_password( user_data.password )

    new_user = User(
        email = user_data.email,
        username = user_data.username,
        display_name = user_data.username,
        hashed_password = hashed_password,
        auth_provider = "local"
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    access_token = create_access_token({
        "sub" : str(new_user.id)
    })
    return {
        "message": "User registered successfully",
        "user_id": new_user.id,
        "access_token": access_token,
        "token_type": "bearer"
    }


@router.post("/login")
def login( form_data : OAuth2PasswordRequestForm = Depends(), db : Session = Depends(get_db) ):
    user = db.query(User).filter(
        User.email == form_data.username
    ).first()

    if not user:
        raise HTTPException(
            status_code = 400,
            detail = "Invalid email or password"
        )

    if not user.hashed_password:
        raise HTTPException(
            status_code = 401,
            detail = "This account uses Google login"
        )

    password_correct = verify_password(form_data.password, user.hashed_password)

    if not password_correct:
        raise HTTPException (
            status_code = 401,
            detail = "Invalid email or password"
        )

    access_token = create_access_token({
        "sub" : str(user.id)
    })

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }


@router.get("/me")
def get_me( current_user : User = Depends(get_current_user) ):
    return {
        "id": current_user.id,
        "email": current_user.email,
        "username": current_user.username,
        "profile_picture": current_user.profile_picture
    }


@router.get("/google")
async def google_login(request: Request):

    redirect_url = os.getenv("GOOGLE_REDIRECT_URI")

    return await oauth.google.authorize_redirect(
        request,
        redirect_url
    )


@router.get("/google/callback")
async def google_callback(
    request: Request,
    db: Session = Depends(get_db)
):

    token = await oauth.google.authorize_access_token(request)

    user_info = token.get("userinfo")

    if not user_info:
        raise HTTPException(
            status_code=400,
            detail="Could not retrieve Google user information."
        )

    google_id = user_info["sub"]
    email = user_info["email"]
    name = user_info.get("name", email.split("@")[0])
    picture = user_info.get("picture")

    user = db.query(User).filter(
        User.google_id == google_id
    ).first()

    if not user:
        user = db.query(User).filter(
            User.email == email
        ).first()

        if user:
            user.google_id = google_id
            user.profile_picture = picture
            user.auth_provider = "google"

        else:
            user = User(
                email=email,
                username=name,
                display_name=name,
                hashed_password=None,
                google_id=google_id,
                profile_picture=picture,
                auth_provider="google"
            )

        db.add(user)
    db.commit()
    db.refresh(user)

    access_token = create_access_token({
        "sub" : str(user.id)
    })
    return RedirectResponse(
        url=f"http://localhost:5173/login?token={access_token}"
    )