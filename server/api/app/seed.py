import util
import models
import sqlmodel

def main():

    engine = util.get_db_engine()
    with sqlmodel.Session(engine) as session:
        try:
            bcn = models.Warehouse(id=1, name='BCN')

            session.add(bcn)
            session.commit()
        except:
            print('Did not perfrom Warehouse Seeding')

    with sqlmodel.Session(engine) as session:
        try:
            rice = models.Category(warehouse_id=1, name='Arròs', min_stock=1)

            session.add(rice)
            session.commit()
        except:
            print('Did not perfrom Category Seeding')

    with sqlmodel.Session(engine) as session:
        try:
            rice_product = models.Product(
                ean_code='3560070826292',
                warehouse_id=1,
                category_name='Arròs',
                value=1,
                units='kg',
                stock=1
            )

            session.add(rice_product)
            session.commit()
        except:
            print('Did not perfrom Category Seeding')


if __name__ == '__main__':
    main()