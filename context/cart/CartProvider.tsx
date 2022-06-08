import { FC, useEffect, useReducer } from 'react';
import Cookies from 'js-cookie';

import { CartContext, cartReducer } from './';
import { ICartProduct, IOrder, IShippingAddress } from '../../interfaces';
import { tesloAPI } from '../../api';
import axios from 'axios';


export interface CartState {
    isLoaded: boolean;
    cart: ICartProduct[];
    numberOfItems: number;
    subTotal: number;
    tax: number;
    total: number;

    shippingAddress?: IShippingAddress;
};

const CART_INITIAL_STATE: CartState = {
    isLoaded: false,
    cart: [],
    numberOfItems: 0,
    subTotal: 0,
    tax: 0,
    total: 0,
    shippingAddress: undefined,
};

interface Props {
    children: any;
}

export const CartProvider: FC<Props> = ({ children }) => {

    const [state, dispatch] = useReducer(cartReducer, CART_INITIAL_STATE);

    useEffect(() => {
        try {
            const cart = (Cookies.get('cart')) ? JSON.parse(Cookies.get('cart')!) : [];
            dispatch({ type: '[Cart] - LoadCart from cookies | storage', payload: cart });            
        } catch (error) {
            dispatch({ type: '[Cart] - LoadCart from cookies | storage', payload: [] });
        }
    }, []);

    useEffect(() => {
        if (Cookies.get('firstName')) {
            const shippingAddress = {
                firstName   : Cookies.get('firstName') || '',
                lastName    : Cookies.get('lastName') || '',
                address     : Cookies.get('address') || '',
                address2    : Cookies.get('address2') || '',
                zip         : Cookies.get('zip') || '',
                city        : Cookies.get('city') || '',
                country     : Cookies.get('country') || '',
                phone       : Cookies.get('phone') || '',
            };
            dispatch({ type: '[Cart] - LoadAddress from cookies', payload: shippingAddress });
        }
    }, []);

    useEffect(() => {
        Cookies.set('cart', JSON.stringify(state.cart));
    }, [state.cart]);

    useEffect(() => {
        const numberOfItems = state.cart.reduce((prev, current) => current.quantity + prev, 0);
        const subTotal = state.cart.reduce((prev, current) => (current.price * current.quantity) + prev, 0);
        const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0);

        const orderSummary = {
            numberOfItems,
            subTotal,
            tax: subTotal * taxRate,
            total: subTotal * (taxRate + 1)
        };

        dispatch({ type: '[Cart] - UpdateOrderSummary', payload: orderSummary });

    }, [state.cart]);

    
    const addProductToCart = (product: ICartProduct) => {
        const cart = [...state.cart];
        const productIdx = cart.findIndex(p =>
                                    p._id === product._id &&
                                    p.size === product.size
                                );

        if (productIdx === -1) {
            cart.push(product);
        }
        else {
            cart[productIdx].quantity += product.quantity;
        }

        dispatch({ type: '[Cart] - UpdateCart', payload: cart });
    }

    const updateCartQuantity = (product: ICartProduct) => {
        dispatch({ type: '[Cart] - UpdateCartQuantity', payload: product });
    }

    const removeProductCart = (product: ICartProduct) => {
        dispatch({ type: '[Cart] - RemoveProductCart', payload: product });
    }

    const updateAddress = (address : IShippingAddress) => {
        Cookies.set('firstName', address.firstName);
        Cookies.set('lastName', address.lastName);
        Cookies.set('address', address.address);
        Cookies.set('address2', address.address2 || '');
        Cookies.set('zip', address.zip);
        Cookies.set('city', address.city);
        Cookies.set('country', address.country);
        Cookies.set('phone', address.phone);

        dispatch({ type: '[Cart] - UpdateAddress', payload: address });
    }

    const createOrder = async (): Promise<{ hasError: boolean; result: string; }> => {

        if (!state.shippingAddress) {
            throw new Error('No hay dirección de entrega');
        }

        const body: IOrder = {
            orderItems:  state.cart.map(p => ({...p, size: p.size!})),
            shippingAddress: state.shippingAddress,
            numberOfItems: state.numberOfItems,
            subTotal: state.subTotal,
            tax: state.tax,
            total: state.total,
            isPaid: false
        };

        try {
            const { data } = await tesloAPI.post<IOrder>('/orders', body);

            dispatch({ type: '[Cart] - Order complete' });

            return {
                hasError: false,
                result: data._id!
            };
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const errorResp: any = error.response;
                return {
                    hasError: true,
                    result: errorResp.data.message
                };
            }
            return {
                hasError: true,
                result: 'Error no controlado, comuniquese con el administrador'
            };
        }
    }

    return (
        <CartContext.Provider value={{
            ...state,

            // Methods
            addProductToCart,
            updateCartQuantity,
            removeProductCart,
            updateAddress,
            createOrder,
        }}>
            { children }
        </CartContext.Provider>
    );
};