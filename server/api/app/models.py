from sqlmodel import Field, SQLModel
import typing as tp

'''
DB models
'''
class Warehouse(SQLModel, table=True):
    id: tp.Optional[int] = Field(default_factory=None, primary_key=True)
    name: str = Field(max_length=20)

class Category(SQLModel, table=True):
    id: tp.Optional[int] = Field(default_factory=None, primary_key=True)
    warehouse_id: int = Field(foreign_key="warehouse.id")
    name: str = Field()
    min_stock: int = Field(default=0)

class Product(SQLModel, table=True):
    id: tp.Optional[int] = Field(default_factory=None, primary_key=True)
    ean_code: str = Field(default=None, max_length=13)
    category_id: int = Field(foreign_key="category.id")
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
