from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os

#definimos la URL de la BD
DATABASE_URL = os.getenv(
    "DATABASE_URL",
     "postgresql://admin:123456@localhost:5432/miapi"
     )

 #creamos el motor de conexion
engine = create_engine(DATABASE_URL)

#creamos el gestionador de sesiones
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine)

 #clase declarativa para modelos
Base= declarative_base()

#Funcion para la sesion en cada peticion
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
