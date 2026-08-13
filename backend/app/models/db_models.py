from sqlalchemy import Column, Integer, String, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key = True, index = True)
    email = Column(String, unique = True, nullable = False, index = True)
    username = Column(String, nullable = False)
    display_name = Column(String, nullable = True)
    hashed_password = Column(String, nullable = False)
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
    
    documents = relationship(
        "Document",
        back_populates = "owner"
    )
    conversations = relationship(
        "Conversation",
        back_populates="owner"
    )


class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, nullable=False)
    document_id = Column(String, unique=True, nullable=False, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    owner = relationship(
        "User",
        back_populates="documents"
    )


class Conversation(Base):

    __tablename__ = "conversations"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    owner = relationship(
        "User",
        back_populates="conversations"
    )

    messages = relationship(
        "Message",
        back_populates="conversation"
    )


class Message(Base):

    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    role = Column(String, nullable=False)
    content = Column(Text, nullable=False)

    conversation_id = Column(
        Integer,
        ForeignKey("conversations.id"),
        nullable=False
    )

    conversation = relationship(
        "Conversation",
        back_populates="messages"
    )