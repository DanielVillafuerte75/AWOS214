#Zona de Importaciones
from fastapi import FastAPI
from app.routers import usuarios, varios

#Zona de Instancias del servidor
app = FastAPI(
    title="Mi primer API", 
    description= "Esta api esta creada por Daniel Villafuerte",
    version="1.0.0"
    )

app.include_router(usuarios.router)
app.include_router(varios.router)
