import util
import models
import sqlmodel

def main():

    engine = util.get_db_engine()
    with sqlmodel.Session(engine) as session:
        warehouse = models.Warehouse(name='BCN')
        session.add(warehouse)

        session.commit()

if __name__ == '__main__':
    main()