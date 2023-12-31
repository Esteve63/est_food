import app.models as models
from fastapi import FastAPI, HTTPException, Depends
import app.util as util
import typing as tp
import sqlmodel
from sqlmodel import Session

engine = util.get_db_engine()
app = FastAPI()

# Dependency to get a SQLModel session
def get_session():
    with sqlmodel.Session(engine) as session:
        yield session

@app.get('/ping')
async def pong():
    return {'ping': 'pong!'}


@app.get('/{warehouse_id}/categories')
async def get_categories(warehouse_id: int, session: Session = Depends(get_session)) -> tp.List[models.CategoryStock]:
    '''
    Get all categories
    '''

    statement = sqlmodel.select(
        models.Category.id, models.Category.name, sqlmodel.func.sum(models.Product.stock).label('stock')
    ).join(
        models.Product,
        models.Product.category_id == models.Category.id
    ).where(
        models.Category.warehouse_id == warehouse_id
    ).group_by(models.Category.id)

    categories = session.exec(statement).all()

    return [models.CategoryStock(id=category[0], name=category[1], stock=category[2]) for category in categories]

@app.get('/{warehouse_id}/category/{category_id}')
async def get_category(warehouse_id: int, category_id: int, session: Session = Depends(get_session)) -> models.Category:
    '''
    Get category by ID
    '''

    statement = sqlmodel.select(models.Category).where(
        models.Category.id==category_id
    )
    category = session.exec(statement).first()

    if category is None:
        raise HTTPException(status_code=404, detail="Category not found")

    return category

@app.post('/{warehouse_id}/category')
def set_category(warehouse_id: int, category: models.Category, session: Session = Depends(get_session)):
    '''
    Save or update category
    '''

    # If category has an ID, look for it
    db_category = None
    if category.id is not None and category.id != 0:
        statement = sqlmodel.select(models.Category).where(
            models.Category.id==category.id
        )
        db_category = session.exec(statement).first()

    # If category already exists, update
    if db_category is not None:
        for k, v in dict(category).items():
            setattr(db_category, k, v)

        category = db_category

    session.add(category)
    session.commit()

@app.get('/{warehouse_id}/{category_id}/products')
async def get_products(warehouse_id: int, category_id: int, session: Session = Depends(get_session)) -> tp.List[models.Product]:
    '''
    Get all products of a category
    '''

    statement = sqlmodel.select(
        models.Product
    ).where(
        models.Product.category_id == category_id
    )

    products = session.exec(statement).all()

    return products


@app.get('/{warehouse_id}/product/{ean_code}')
async def get_product(warehouse_id: int, ean_code: str, session: Session = Depends(get_session)) -> models.Product:
    '''
    Get product by EAN code
    '''

    statement = sqlmodel.select(
        models.Product
    ).join(
        models.Category,
        models.Category.id == models.Product.category_id
    ).where(
        models.Product.ean_code == ean_code,
        models.Category.warehouse_id == warehouse_id
    )
    product = session.exec(statement).first()

    if product is None:
        raise HTTPException(status_code=404, detail="Product not found")

    return product

@app.post('/{warehouse_id}/product')
def set_product(warehouse_id: int, product: models.Product, session: Session = Depends(get_session)):
    '''
    Save or update product
    '''

    # If product has an ID, look for it
    db_product = None
    if product.id is not None and product.id != 0:
        statement = sqlmodel.select(models.Product).where(
            models.Product.id==product.id
        )
        db_product = session.exec(statement).first()

    # If product already exists, update
    if db_product is not None:
        for k, v in dict(product).items():
            setattr(db_product, k, v)

        product = db_product

    session.add(product)
    session.commit()
