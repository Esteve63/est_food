type EAN13 = string

export default interface Product {
    id: EAN13,
    name: string,
    stock: number
}