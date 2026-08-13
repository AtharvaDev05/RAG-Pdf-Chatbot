from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.models.db_models import User
from app.core.database import get_db
from app.core.security import hash_password
from app.core.security import get_current_user
from app.models.request_models import ( RegisterRequest, LoginRequest )

from app.core.security import ( verify_password, create_access_token )

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

    return {
        "message": "User registered successfully",
        "user_id": new_user.id
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


@router.post("/me")
def get_me( current_user : User = Depends(get_current_user) ):
    return {
        "id": current_user.id,
        "email": current_user.email,
        "username": current_user.username
    }