import app.models as models
from fastapi import FastAPI
import app.util as util
import typing as tp
import sqlmodel

engine = util.get_db_engine()
app = FastAPI()

@app.get('/ping')
async def pong():
    return {'ping': 'pong!'}


@app.get('/{warehouse_id}/categories')
async def categories(warehouse_id: int) -> tp.List[models.CategorySimple]:
    '''
    Get all categories
    '''
    with sqlmodel.Session(engine) as session:
        statement = sqlmodel.select(
            models.Product.category_name, sqlmodel.func.sum(models.Product.stock).label('stock')
        ).where(
            models.Product.warehouse_id == warehouse_id
        ).group_by(models.Product.category_name)

        results = session.exec(statement).all()

        return [models.CategorySimple(warehouse_id=warehouse_id, name=result[0], stock=result[1]) for result in results]

@app.get('/{warehouse_id}/categories/{category_id}')
async def get_category(warehouse_id: int, category_id: str) -> None:
    '''
    Get category by ID
    '''

    with sqlmodel.Session(engine) as session:
        statement = sqlmodel.select(models.Category.min_stock).where(
            models.Category.warehouse_id == warehouse_id,
            models.Category.name==category_id
        )
        min_stock = session.exec(statement).first()

        statement = sqlmodel.select(models.Product).where(
            models.Product.warehouse_id == warehouse_id,
            models.Product.category_name==category_id
        )
        products = session.exec(statement).all()

        return models.CategoryDetail(warehouse_id=warehouse_id, name=category_id, min_stock=min_stock, products=products)


@app.get('/{warehouse_id}/products/{ean_code}')
async def get_product(warehouse_id: int, ean_code: str) -> models.Product:
    '''
    Get product by ID
    '''

    with sqlmodel.Session(engine) as session:
        statement = sqlmodel.select(
            models.Product
        ).where(
            models.Product.warehouse_id == warehouse_id,
            models.Product.ean_code == ean_code
        )
        result = session.exec(statement)
        product = result.first()

    if product is None:
        product_name = util.get_product_name_from_ean_search(ean_code)

        product = models.Product(
            ean_code=ean_code,
            warehouse_id=warehouse_id,
            category_name=product_name
        )

    return product

@app.post('/{warehouse_id}/product')
def set_product(product: models.Product):
    '''
    Save or update product
    '''
    
    with sqlmodel.Session(engine) as session:
        # Check if category exists
        statement = sqlmodel.select(models.Category).where(
            models.Category.warehouse_id==product.warehouse_id,
            models.Category.name==product.category_name
        )
        category = session.exec(statement).first()

        # If category does not exist, create it
        if category is None:
            category = models.Category(warehouse_id=product.warehouse_id, name=product.category_name)
            session.add(category)
        
        # Check if product exists
        statement = sqlmodel.select(models.Product).where(
            models.Product.warehouse_id==product.warehouse_id,
            models.Product.ean_code==product.ean_code
        )
        db_product = session.exec(statement).first()

        # If product already exists, update
        if db_product is not None:
            for k, v in dict(product).items():
                setattr(db_product, k, v)

            product = db_product

        session.add(product)
        session.commit()
