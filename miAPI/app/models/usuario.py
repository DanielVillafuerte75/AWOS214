#modelo de validacion
from pydantic import BaseModel, Field

class usuario_create(BaseModel):
    nombre: str= Field(..., min_length=3, max_length=50, example="Juanita")
    edad: int = Field(..., ge=0, le=123, description="Edad valida entre 0 y 120")