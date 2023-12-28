from sqlmodel import Field, SQLModel
import typing as tp
import uuid

class Warehouse(SQLModel, table=True):
    id: tp.Optional[uuid.UUID] = Field(default_factory=uuid.uuid4, primary_key=True)
    name: str = Field(max_length=20)

class Category(SQLModel, table=True):
    warehouse_id: uuid.UUID = Field(primary_key=True, foreign_key="warehouse.id")
    name: str = Field(primary_key=True)
    min_stock: int = Field(default=0)

class Product(SQLModel, table=True):
    ean_code: str = Field(default=None, primary_key=True, max_length=13)
    warehouse_id: uuid.UUID = Field() # foreign_key="category.warehouse_id"
    category_name: str = Field() # foreign_key="category.name"
    value: int = 0
    units: str = ''
    stock: int = 0