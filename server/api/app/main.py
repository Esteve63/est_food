import app.models as models
from fastapi import FastAPI
import app.util as util
import time

app = FastAPI()

@app.get('/ping')
async def pong():
    return {'ping': 'pong!'}

@app.get('/get_product')
async def get_product(id: str) -> models.Product:

    tic = time.time()
    product_name = util.get_product_name_from_ean_search(id)
    toc = time.time()

    print(f'Scraping took {(toc - tic) * 1000 :.2f} ms')

    return models.Product(id=id, name=product_name)