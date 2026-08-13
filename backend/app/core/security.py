from datetime import timedelta, datetime, timezone
from jose import jwt, JWTError
import os
from dotenv import load_dotenv
import bcrypt

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.db_models import User

load_dotenv()

oauth_scheme = OAuth2PasswordBearer( tokenUrl = "/auth/login" )

JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")

JWT_ACCESS_TOKEN_EXPIRE_MINUTES = int(
    os.getenv("JWT_ACCESS_TOKEN_EXPIRE_MINUTES", 60)
)


def hash_password(password : str) -> str:
    password_bytes = password.encode("utf8")

    salt = bcrypt.gensalt()

    hashed_password = bcrypt.hashpw(password_bytes, salt)
    return hashed_password.decode("utf8")


def verify_password(plain_password : str, hashed_password : str) -> bool:
    plain_password_bytes = plain_password.encode("utf8")
    hashed_password_byted = hashed_password.encode("utf8")

    return bcrypt.checkpw(plain_password_bytes, hashed_password_byted)


def create_access_token(data : dict):
    to_encode = data.copy()

    expire = datetime.now(timezone.utc) + timedelta(minutes = JWT_ACCESS_TOKEN_EXPIRE_MINUTES)

    to_encode.update({
        "exp" : expire
    })

    encoded_jwt = jwt.encode(
        to_encode,
        JWT_SECRET_KEY,
        JWT_ALGORITHM
    )

    return encoded_jwt


def get_current_user( token : str = Depends(oauth_scheme), db : Session = Depends(get_db) ):

    credential_exception = HTTPException(
        status_code = status.HTTP_401_UNAUTHORIZED,
        detail = "Could not validate credentials",
        headers = {
            "WWW-Authenticate" : "Bearer"
        }
    )

    try:
        payload = jwt.decode(
            token,
            JWT_SECRET_KEY,
            algorithms = [JWT_ALGORITHM]
        )

        user_id = payload.get("sub")

        if user_id is None:
            raise credential_exception

    except JWTError:
        raise credential_exception

    user = db.query(User).filter(
        User.id == int(user_id)
    ).first()

    if user is None:
        raise credential_exception

    return user