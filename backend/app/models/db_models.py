from sqlalchemy import Column, Integer, String
from app.core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key = True, index = True)
    email = Column(String, unique = True, nullable = False, index = True)
    username = Column(String, nullable = False)
    display_name = Column(String, nullable = True)
    hashed_password = Column(String, nullable = True)
    google_id = Column(
        String,
        unique=True,
        nullable=True,
        index=True
    )
    profile_picture = Column(
        String,
        nullable=True
    )
    auth_provider = Column(
        String,
        nullable=False,
        default="local"
    )