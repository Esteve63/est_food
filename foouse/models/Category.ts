interface CategoryStock {
    id: number,
    name: string,
    stock: number
}

interface Category {
    id?: number,
    warehouse_id: number,
    name: string,
    min_stock: number
}

export { CategoryStock, Category }