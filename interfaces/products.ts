export interface IProduct {
    _id         : string;
    description : string;
    images      : string[];
    inStock     : number;
    price       : number;
    sizes       : SizeT[];
    slug        : string;
    tags        : string[];
    title       : string;
    type        : TypeT;
    gender      : 'men'|'women'|'kid'|'unisex';

    createdAt   : string;
    updatedAt   : string;
}

export type SizeT = 'XS'|'S'|'M'|'L'|'XL'|'XXL'|'XXXL';
export type TypeT = 'shirts'|'pants'|'hoodies'|'hats';