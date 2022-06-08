import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react';
import { db } from '../../../database';
import { IOrder } from '../../../interfaces';
import { Order, Product } from '../../../models';

type Data = 
    | { message: string }
    | IOrder;

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch (req.method) {
        case 'POST':
            return createOrder(req, res);
    
        default:
            return res.status(400).json({ message: 'Bad request' });
    }

}

const createOrder = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    
    const { orderItems, total } = req.body as IOrder;

    // Verificar que tengamos un usuario
    const session: any = await getSession({ req });

    if (!session) {
        return res.status(401).json({ message: 'No está autenticado' });
    }

    const productsIds = orderItems.map(p => p._id);

    await db.connect();
    const dbProducts = await Product.find({ _id: { $in: productsIds } });

    try {
        const subTotal = orderItems.reduce((prev, current) => {
            const currentPrice = dbProducts.find(p => p.id === current._id)?.price;
            if (!currentPrice) {
                throw new Error('Verifique el carrito nuevamente, un producto no existe');
            }

            return (currentPrice * current.quantity) + prev;
        }, 0);

        const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0);
        const totalBackend = subTotal * (taxRate + 1);

        if (total !== totalBackend) {
            throw new Error('El total del carrito no cuadra con el monto de productos');
        }

        // Todo OK
        const userId = session.user._id;
        const newOrder = new Order({...req.body, isPaid: false, user: userId});
        newOrder.total = Math.round(newOrder.total * 100) / 100; // 2 decimales
        
        await newOrder.save();
        await db.disconnect();

        return res.status(200).json(newOrder);

    } catch (error: any) {
        await db.disconnect();
        console.log(error);
        res.status(400).json({
            message: error.message || 'Revise logs del servidor'
        });
    }
}
