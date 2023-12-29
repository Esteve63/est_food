from sqlmodel import Field, SQLModel
import typing as tp

'''
DB models
'''
class Warehouse(SQLModel, table=True):
    id: tp.Optional[int] = Field(default_factory=None, primary_key=True)
    name: str = Field(max_length=20)

class Category(SQLModel, table=True):
    warehouse_id: int = Field(primary_key=True, foreign_key="warehouse.id")
    name: str = Field(primary_key=True)
    min_stock: int = Field(default=0)

class Product(SQLModel, table=True):
    ean_code: str = Field(default=None, primary_key=True, max_length=13)
    warehouse_id: int = Field() # foreign_key="category.warehouse_id"
    category_name: str = Field() # foreign_key="category.name"
    value: int = 0
    units: str = ''
    stock: int = 0

'''
Helper models
'''
class CategorySimple(SQLModel):
    warehouse_id: int
    name: str
    stock: int

class CategoryDetail(SQLModel):
    warehouse_id: int
    name: str
    min_stock: int
    products: tp.List[Product]
