import { ICartProduct, IShippingAddress } from '../../interfaces';
import { CartState } from './';

type CartActionType = 
   | { type: '[Cart] - LoadCart from cookies | storage', payload: ICartProduct[] }
   | { type: '[Cart] - UpdateCart', payload: ICartProduct[] }
   | { type: '[Cart] - UpdateCartQuantity', payload: ICartProduct }
   | { type: '[Cart] - RemoveProductCart', payload: ICartProduct }
   | { type: '[Cart] - LoadAddress from cookies', payload: IShippingAddress }
   | { type: '[Cart] - UpdateAddress', payload: IShippingAddress }
   | {
       type: '[Cart] - UpdateOrderSummary',
       payload: {
        numberOfItems: number;
        subTotal: number;
        tax: number;
        total: number;
       }
    }
    | { type: '[Cart] - Order complete' }


export const cartReducer = ( state: CartState, action: CartActionType ): CartState => {

    switch (action.type) {
        case '[Cart] - LoadCart from cookies | storage':
            return {
                ...state,
                isLoaded: true,
                cart: [...action.payload]
            };
        
        case '[Cart] - UpdateCart':
            return {
                ...state,
                cart: action.payload
            };
        
        case '[Cart] - UpdateCartQuantity':
            return {
                ...state,
                cart: state.cart.map(product => {
                    if (product._id !== action.payload._id) return product;
                    if (product.size !== action.payload.size) return product;

                    return action.payload;
                })
            };

        case '[Cart] - RemoveProductCart':
            return {
                ...state,
                cart: state.cart.filter(product =>
                    product._id !== action.payload._id || product.size !== action.payload.size
                )
            };

        case '[Cart] - UpdateOrderSummary':
            return {
                ...state,
                ...action.payload
            };

        case '[Cart] - UpdateAddress':
        case '[Cart] - LoadAddress from cookies':
            return {
                ...state,
                shippingAddress: {...action.payload}
            };

        case '[Cart] - Order complete':
            return {
                ...state,
                cart: [],
                numberOfItems: 0,
                subTotal: 0,
                tax: 0,
                total: 0,
            };

        default:
            return state;
    }
}