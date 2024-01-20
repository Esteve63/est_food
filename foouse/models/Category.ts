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

interface FuseSearchMatch {
    key: string;
    indices: [number, number][];
  }

interface FuseSearchCategory {
    item: CategoryStock,
    refIndex: number,
    score: number
}

export { CategoryStock, Category, FuseSearchCategory }