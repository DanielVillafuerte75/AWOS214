
#zona de imports
from fastapi import FastAPI, status, HTTPException, Depends
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from typing import List
from pydantic import BaseModel, Field
import secrets


#Seguridad HTTP Basic
security = HTTPBasic()
def authenticate(credentials: HTTPBasicCredentials = Depends(security)):
    sopAuth = secrets.compare_digest(credenciales.username, "Soporte")
    passAuth = secrets.compare_digest(credenciales.password, "4321")

    if not (sopAuth and passAuth):
        raise HTTPException(
            status_code=401, detail="Credenciales incorrectas")
    return credenciales.username

#Zona de instancias del servidor
app = FastAPI(title="API de Tickets de Soporte Técnico",
 description="API para gestionar tickets de soporte técnico", 
 version="1.0.0")

#BD ficticia
tickets_db = [
{id: 1, nombre_usuario: "Hector", descripcion_problema: "No puedo acceder a mi correo electrónico", prioridad: "alta", estado: "pendiente"},
{id: 2, nombre_usuario: "Joel", descripcion_problema: "Mi impresora no imprime", prioridad: "media", estado: "pendiente"},
{id: 3, nombre_usuario: "Maria", descripcion_problema: "El sistema operativo se congela", prioridad: "alta", estado: "resuelto"},
]


#modelo de validacion
class Ticket(BaseModel):
    id: int
    nombre_usuario: str = Field(..., min_length=5, description="Nombre de usuario con mínimo 5 caracteres")
    descripcion_problema: str = Field(..., min_length=20, max_length=200, description="Descripción del problema entre 20 y 200 caracteres")
    prioridad: str = Field(..., regex="^(baja|media|alta)$", description="Prioridad del ticket: baja, media o alta")
    estado: str = Field(default="pendiente", description="Estado del ticket, por defecto será pendiente")


#zona de endpoints
@app.get("/", tags=["Inicio"])
async def bienvenida():
    return {"mensaje": "Bienvenido a la API de Tickets de Soporte Técnico"}

@app.post("/tickets/", response_model=Ticket, tags=["Tickets"])
async def crear_ticket(ticket: Ticket, username: str = Depends(authenticate)):
    if any(t.id == ticket.id for t in tickets_db):
        raise HTTPException(status_code=400, detail="ID de ticket ya existe")
    tickets_db.append(ticket)
    return ticket

@app.get("/tickets/", response_model=List[Ticket], tags=["Tickets"])
async def listar_tickets(username: str = Depends(authenticate)):
    return tickets_db

@app.get("/tickets/{ticket_id}", response_model=Ticket, tags=["Tickets"])
async def consultar_ticket(ticket_id: int, username: str = Depends(authenticate)):
    for ticket in tickets_db:
        if ticket.id == ticket_id:
            return ticket
    raise HTTPException(status_code=404, detail="Ticket no encontrado")

@app.put("/tickets/{ticket_id}", response_model=Ticket, tags=["Tickets"])
async def cambiar_estado(ticket_id: int, nuevo_estado: str = Field(..., regex="^(pendiente|resuelto)$", description="Nuevo estado del ticket: pendiente o resuelto"), username: str = Depends(authenticate)):
    for ticket in tickets_db:
        if ticket.id == ticket_id:
            if ticket.estado == "resuelto":
                raise HTTPException(status_code=400, detail="No se pueden cambiar el estado de un ticket resuelto")
            ticket.estado = nuevo_estado
            return ticket
    raise HTTPException(status_code=404, detail="Ticket no encontrado")

@app.delete("/tickets/{ticket_id}", tags=["Tickets"])
async def eliminar_ticket(ticket_id: int, username: str = Depends(authenticate)):
    for ticket in tickets_db:
        if ticket.id == ticket_id:
            if ticket.estado == "resuelto":
                raise HTTPException(status_code=400, detail="No se pueden eliminar tickets resueltos")
            tickets_db.remove(ticket)
            return {"mensaje": "Ticket eliminado"}
    raise HTTPException(status_code=404, detail="Ticket no encontrado")


