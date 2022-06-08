import { createContext } from 'react';

import { ICartProduct, IShippingAddress } from '../../interfaces';


export interface CartContextProps {
    isLoaded: boolean;
    cart: ICartProduct[];
    numberOfItems: number;
    subTotal: number;
    tax: number;
    total: number;

    shippingAddress?: IShippingAddress;

    // Methods
    addProductToCart: (product: ICartProduct) => void;
    updateCartQuantity: (product: ICartProduct) => void;
    removeProductCart: (product: ICartProduct) => void;
    updateAddress: (address: IShippingAddress) => void;
    createOrder: () => Promise<{ hasError: boolean; result: string; }>;
}

export const CartContext = createContext({} as CartContextProps);