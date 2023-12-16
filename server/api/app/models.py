from sqlmodel import Field, SQLModel


class Product(SQLModel, table=True):
    id: str = Field(default=None, primary_key=True, max_length=13)
    name: str = None
    stock: int = 0