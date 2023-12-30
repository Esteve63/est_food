type EAN13 = string

export default interface Product {
    ean_code: EAN13,
    warehouse_id: number,
    category_name: string,
    value: number,
    units: string,
    stock: number
}