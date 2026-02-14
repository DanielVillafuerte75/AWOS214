#Zona de Importaciones
from fastapi import FastAPI, status, HTTPException
import asyncio
from typing import Optional

#Zona de Instancias del servidor
app = FastAPI(
    title="Mi primer API", 
    description= "Esta api esta creada por Daniel Villafuerte",
    version="1.0.0"
    )

#TB ficticia
usuarios=[
        {"id":1, "nombre":"Juan","edad":21},
        {"id":2, "nombre":"Israel","edad":21},
        {"id":3, "nombre":"Sofi","edad":21},
    ]

#Zona de Endpoints
@app.get("/",tags=["Inicio"])
async def bienvenida():
    return {"mensaje": "!Bienvenido a mi API!"}

@app.get("/HolaMundo", tags=["Bienvenida Asincrona"])
async def hola():
    await asyncio.sleep(3) #simulacion de una peticion
    return {
        "mensaje": "!Hola Mundo FastAPI!",
        "estatus":"200"
        }
@app.get("/v1/parametroOb/{id}",tags=["Parametro Obligatorio"])
async def consultaUno(id:int):
    return {"Se encontro usuario": id}



@app.get("/v1/parametroOp/",tags=["Parametro Opcional"])
async def consultaTodos(id:Optional[int]=None):
    if id is not None:
        for usuariok in usuarios:
            if usuariok ["id"] == id:
                return{"mensaje": "usuario encontrado", "usuario": usuariok}
            return {"mensaje": "usuario no encontrado", "usuario":id}
        else:
                return {"mensaje": "No se proporciono id"}



@app.get("/v1/usuarios/",tags=["CRUD HTTP"])
async def leer_usuarios( ):
    return{
        "status": "200",
        "total": len(usuarios),
        "usuarios":usuarios
    }

@app.post("/v1/usuarios/",tags=['CRUD HTTP'],status_code=status.HTTP_201_CREATED)
async def crear_usuario(usuario: dict):
    for Usr in usuarios:
        if Usr["id"] == usuario.get("id"):
            raise HTTPException(
                status_code=400,
                 detail="El id ya existe"
            )
    usuarios.append(usuario)
    return{
        "mensaje": "Usuario agregado",
        "usuario": usuario
    }

@app.put("/v1/usuarios/",tags=['CRUD HTTP'])
async def actualizar_usuario(id: int, usuario: dict):
     for Usr in usuarios:
        if Usr["id"] == id:
            Usr.update(usuario)
            return {
                "mensaje": "Usuario actualizado",
                "usuario": Usr
            }
     raise HTTPException(
        status_code=204,
        detail="Usuario no encontrado"
    )


@app.delete("/v1/usuarios/",tags=['CRUD HTTP'])
async def eliminar_usuario(id: int):
    for usuario in usuarios:
        if usuario["id"] == id:
            usuarios.remove(usuario)
            return {
                "mensaje": "Usuario eliminado",
                "usuario": usuario
            }
    raise HTTPException(
        status_code=204,
        detail="Usuario no encontrado"
    )
