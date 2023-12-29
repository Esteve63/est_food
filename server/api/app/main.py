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
    Get all products
    '''
    with sqlmodel.Session(engine) as session:
        statement = sqlmodel.select(
            models.Product.category_name, sqlmodel.func.sum(models.Product.stock).label('stock')
        ).where(
            models.Product.warehouse_id == warehouse_id
        ).group_by(models.Product.category_name)

        results = session.exec(statement).all()

        return [models.CategorySimple(warehouse_id=warehouse_id, name=result[0], stock=result[1]) for result in results]



@app.get('/products/{id}')
async def get_product(id: str) -> models.Product:
    '''
    Get product by ID
    '''

    with sqlmodel.Session(engine) as session:
        statement = sqlmodel.select(models.Product).where(models.Product.id==id)
        result = session.exec(statement)
        product = result.first()

    if product is None:
        product_name = util.get_product_name_from_ean_search(id)

        product = models.Product(id=id, name=product_name, stock=0)

    return product

@app.post('/product')
def set_product(product: models.Product):
    '''
    Save or update product
    '''
    
    with sqlmodel.Session(engine) as session:
        
        # Check if product exists
        statement = sqlmodel.select(models.Product).where(models.Product.id==product.id)
        result = session.exec(statement)
        db_product = result.first()

        # If exists, update
        if db_product is not None:
            db_product.stock = product.stock
            db_product.name = product.name
            product = db_product

        session.add(product)
        session.commit()
