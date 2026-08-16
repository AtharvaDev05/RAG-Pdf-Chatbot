from app.core.database import engine, Base
from app.models.db_models import User

Base.metadata.create_all(bind = engine)

print("Database tables created successfully!")