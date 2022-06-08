import { SizeT, TypeT } from "./products";

export interface ICartProduct {
    _id: string;
    image: string;
    price: number;
    size?: SizeT;
    slug: string;
    title: string;
    gender: 'men'|'women'|'kid'|'unisex';
    quantity: number;
}
