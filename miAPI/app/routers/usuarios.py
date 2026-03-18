
#endpoint de usuarios

from fastapi import Depends, HTTPException, status, APIRouter
from app.models.usuario import usuario_create 
from app.data.database import usuarios
from app.security.auth import verificar_Peticion

router = APIRouter(
    prefix="/v1/usuarios", tags=["CRUD HTTP"]
)



@router.get("/")
async def leer_usuarios( ):
    return{
        "status": "200",
        "total": len(usuarios),
        "usuarios":usuarios
    }

@router.post("/",status_code=status.HTTP_201_CREATED)
async def crear_usuario(usuario: usuario_create):
    for Usr in usuarios:
        if Usr["id"] == usuario.id:
            raise HTTPException(
                status_code=400,
                 detail="El id ya existe"
            )
    usuarios.append(usuario)
    return{
        "mensaje": "Usuario agregado",
        "usuario": usuario
    }

@router.put("/{id}",status_code=status.HTTP_200_OK)
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


@router.delete("/{id}",status_code=status.HTTP_200_OK)
async def eliminar_usuario(id: int, userAuth: str = Depends(verificar_Peticion)):
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
