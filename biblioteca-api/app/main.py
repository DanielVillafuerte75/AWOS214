# Zona de Importaciones
from fastapi import FastAPI, status, HTTPException
from pydantic import BaseModel, Field, validator
from datetime import datetime, date
from typing import Optional, List
import re

# Zona de Instancias del servidor
app = FastAPI(
    title="API Biblioteca Digital",
    description="API para gestión de biblioteca digital",
    version="1.0.0"
)

# TB ficticia
libros = []
usuarios = []
prestamos = []

# Contadores para IDs
contador_libros = 1
contador_usuarios = 1
contador_prestamos = 1

# Modelos de validacion
class LibroCreate(BaseModel):
    nombre: str = Field(..., min_length=2, max_length=100, description="Nombre del libro entre 2 y 100 caracteres")
    autor: str = Field(..., min_length=3, max_length=100, description="Nombre del autor")
    año_publicacion: int = Field(..., description="Año de publicación")
    paginas: int = Field(..., gt=1, description="Número de páginas, debe ser mayor a 1")
    estado: str = Field(default="disponible", description="Estado del libro: disponible o prestado")

    @validator('año_publicacion')
    def validar_año(cls, v):
        año_actual = datetime.now().year
        if v < 1450:
            raise ValueError('El año debe ser mayor a 1450')
        if v > año_actual:
            raise ValueError(f'El año no puede ser mayor al actual ({año_actual})')
        return v

    @validator('estado')
    def validar_estado(cls, v):
        if v not in ["disponible", "prestado"]:
            raise ValueError('El estado debe ser "disponible" o "prestado"')
        return v

class UsuarioCreate(BaseModel):
    nombre: str = Field(..., min_length=3, max_length=50, description="Nombre del usuario")
    email: str = Field(..., description="Correo electrónico válido")

    @validator('email')
    def validar_email(cls, v):
        patron = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if not re.match(patron, v):
            raise ValueError('El correo electrónico no es válido')
        return v

class PrestamoCreate(BaseModel):
    libro_id: int = Field(..., gt=0, description="ID del libro a prestar")
    usuario_id: int = Field(..., gt=0, description="ID del usuario que solicita el préstamo")
    fecha_prestamo: date = Field(default_factory=date.today, description="Fecha del préstamo")
    fecha_devolucion: Optional[date] = None
    estado: str = Field(default="activo", description="Estado del préstamo: activo o devuelto")

    @validator('estado')
    def validar_estado_prestamo(cls, v):
        if v not in ["activo", "devuelto"]:
            raise ValueError('El estado debe ser "activo" o "devuelto"')
        return v

# Funciones auxiliares
def buscar_libro_por_nombre(nombre: str):
    for libro in libros:
        if libro["nombre"].lower() == nombre.lower():
            return libro
    return None

def buscar_libro_por_id(libro_id: int):
    for libro in libros:
        if libro["id"] == libro_id:
            return libro
    return None

def buscar_usuario_por_id(usuario_id: int):
    for usuario in usuarios:
        if usuario["id"] == usuario_id:
            return usuario
    return None

def buscar_prestamo_activo(libro_id: int):
    for prestamo in prestamos:
        if prestamo["libro_id"] == libro_id and prestamo["estado"] == "activo":
            return prestamo
    return None

def buscar_prestamo_por_id(prestamo_id: int):
    for prestamo in prestamos:
        if prestamo["id"] == prestamo_id:
            return prestamo
    return None

# Zona de Endpoints

@app.get("/", tags=["Inicio"])
async def bienvenida():
    return {
        "mensaje": "¡Bienvenido a la API de Biblioteca Digital!",
        "documentacion": "/docs"
    }

# Endpoints para Libros
@app.post("/v1/libros/", tags=["Libros"], status_code=status.HTTP_201_CREATED)
async def registrar_libro(libro: LibroCreate):
    global contador_libros
    
    # Validar que el nombre no esté vacío
    if not libro.nombre or libro.nombre.strip() == "":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El nombre del libro no es válido"
        )
    
    # Verificar si el libro ya existe
    libro_existente = buscar_libro_por_nombre(libro.nombre)
    if libro_existente:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Ya existe un libro con ese nombre"
        )
    
    # Crear nuevo libro
    nuevo_libro = libro.dict()
    nuevo_libro["id"] = contador_libros
    contador_libros += 1
    libros.append(nuevo_libro)
    
    return {
        "mensaje": "Libro registrado exitosamente",
        "libro": nuevo_libro
    }

@app.get("/v1/libros/", tags=["Libros"])
async def listar_libros_disponibles():
    disponibles = [libro for libro in libros if libro["estado"] == "disponible"]
    return {
        "status": "200",
        "total": len(disponibles),
        "libros": disponibles
    }

@app.get("/v1/libros/{nombre}", tags=["Libros"])
async def buscar_libro(nombre: str):
    libro = buscar_libro_por_nombre(nombre)
    if not libro:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Libro no encontrado"
        )
    return {
        "status": "200",
        "libro": libro
    }

# Endpoints para Usuarios
@app.post("/v1/usuarios/", tags=["Usuarios"], status_code=status.HTTP_201_CREATED)
async def registrar_usuario(usuario: UsuarioCreate):
    global contador_usuarios
    
    # Verificar si el email ya existe
    for usr in usuarios:
        if usr["email"] == usuario.email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="El email ya está registrado"
            )
    
    # Crear nuevo usuario
    nuevo_usuario = usuario.dict()
    nuevo_usuario["id"] = contador_usuarios
    contador_usuarios += 1
    usuarios.append(nuevo_usuario)
    
    return {
        "mensaje": "Usuario registrado exitosamente",
        "usuario": nuevo_usuario
    }

@app.get("/v1/usuarios/", tags=["Usuarios"])
async def listar_usuarios():
    return {
        "status": "200",
        "total": len(usuarios),
        "usuarios": usuarios
    }

# Endpoints para Préstamos
@app.post("/v1/prestamos/", tags=["Préstamos"], status_code=status.HTTP_201_CREATED)
async def registrar_prestamo(prestamo: PrestamoCreate):
    global contador_prestamos
    
    # Verificar que el libro existe
    libro = buscar_libro_por_id(prestamo.libro_id)
    if not libro:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Libro no encontrado"
        )
    
    # Verificar que el usuario existe
    usuario = buscar_usuario_por_id(prestamo.usuario_id)
    if not usuario:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado"
        )
    
    # Verificar si el libro ya está prestado
    if libro["estado"] == "prestado":
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="El libro ya está prestado"
        )
    
    # Verificar si ya existe un préstamo activo para este libro
    prestamo_activo = buscar_prestamo_activo(prestamo.libro_id)
    if prestamo_activo:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Ya existe un préstamo activo para este libro"
        )
    
    # Actualizar estado del libro
    libro["estado"] = "prestado"
    
    # Crear préstamo
    nuevo_prestamo = prestamo.dict()
    nuevo_prestamo["id"] = contador_prestamos
    contador_prestamos += 1
    prestamos.append(nuevo_prestamo)
    
    return {
        "mensaje": "Préstamo registrado exitosamente",
        "prestamo": nuevo_prestamo
    }

@app.put("/v1/prestamos/{prestamo_id}/devolver", tags=["Préstamos"])
async def marcar_devuelto(prestamo_id: int):
    prestamo = buscar_prestamo_por_id(prestamo_id)
    
    if not prestamo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Préstamo no encontrado"
        )
    
    if prestamo["estado"] != "activo":
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="El préstamo ya no está activo"
        )
    
    # Actualizar préstamo
    prestamo["estado"] = "devuelto"
    prestamo["fecha_devolucion"] = date.today()
    
    # Actualizar estado del libro
    libro = buscar_libro_por_id(prestamo["libro_id"])
    if libro:
        libro["estado"] = "disponible"
    
    return {
        "status": "200",
        "mensaje": "Libro devuelto exitosamente"
    }

@app.delete("/v1/prestamos/{prestamo_id}", tags=["Préstamos"])
async def eliminar_prestamo(prestamo_id: int):
    for i, prestamo in enumerate(prestamos):
        if prestamo["id"] == prestamo_id:
            # Si el préstamo está activo, actualizar estado del libro
            if prestamo["estado"] == "activo":
                libro = buscar_libro_por_id(prestamo["libro_id"])
                if libro:
                    libro["estado"] = "disponible"
            
            prestamos.pop(i)
            return {
                "mensaje": "Préstamo eliminado exitosamente",
                "prestamo": prestamo
            }
    
    raise HTTPException(
        status_code=status.HTTP_409_CONFLICT,
        detail="El registro de préstamo no existe"
    )

@app.get("/v1/prestamos/", tags=["Préstamos"])
async def listar_prestamos():
    return {
        "status": "200",
        "total": len(prestamos),
        "prestamos": prestamos
    }

# Endpoint para probar validaciones
@app.get("/v1/validaciones/", tags=["Información"])
async def informar_validaciones():
    return {
        "mensaje": "Validaciones implementadas en la API",
        "validaciones": {
            "libros": {
                "nombre": "Longitud entre 2 y 100 caracteres",
                "año_publicacion": "Mayor a 1450 y menor o igual al año actual",
                "paginas": "Número entero positivo mayor a 1",
                "estado": "Solo 'disponible' o 'prestado'"
            },
            "usuarios": {
                "nombre": "Longitud entre 3 y 50 caracteres",
                "email": "Debe ser un correo electrónico válido"
            },
            "prestamos": {
                "estado": "Solo 'activo' o 'devuelto'"
            }
        }
    }

# Este bloque es para ejecutar directamente con python (opcional)
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)