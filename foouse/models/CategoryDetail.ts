import Product from "./Product";

export default interface CategoryDetail {
    warehouse_id: number,
    name: string,
    min_stock: number,
    products: Product[]
}