export interface Medicine {
    id: string;
    name: string;
    category: string;
    price: number;
    stock: number;
    expiryDate: string;
    minStockAlert: number;
}

export interface CartItem extends Medicine {
    quantity: number;
}

export interface Transaction {
    id: string;
    timestamp: string;
    items: CartItem[];
    totalAmount: number;
}
