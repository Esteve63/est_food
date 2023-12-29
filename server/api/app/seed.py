import util
import models
import sqlmodel

def main():

    engine = util.get_db_engine()
    with sqlmodel.Session(engine) as session:
        bcn = models.Warehouse(name='BCN')
        pdm = models.Warehouse(name='PREMIÀ DE MAR')

        session.add(bcn)
        session.add(pdm)

        session.commit()

if __name__ == '__main__':
    main()