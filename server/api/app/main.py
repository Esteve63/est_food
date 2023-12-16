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


@app.get('/products')
async def products() -> tp.List[models.Product]:
    '''
    Get all products
    '''

    with sqlmodel.Session(engine) as session:
        statement = sqlmodel.select(models.Product)
        results = session.exec(statement)

        return results.all()


@app.get('/products/{id}')
async def get_product(id: str) -> models.Product:
    '''
    Get product by ID
    '''
    
    with sqlmodel.Session(engine) as session:
        statement = sqlmodel.select(models.Product).where(models.Product.id==id)
        result = session.exec(statement)
        product = result.one()

    if product is None:
        product_name = util.get_product_name_from_ean_search(id)

        product = models.Product(id=id, name=product_name, stock=0)

    return product

@app.post('/product')
def set_product(product: models.Product):
    '''
    Save or update product
    '''
    print(product, type(product))

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
