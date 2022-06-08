import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database';
import { Order, Product, User } from '../../../models';

type Data = {
    numberOfOrders: number;
    paidOrders: number;
    notPaidOrders: number;
    numberOfClients: number;
    numberOfProducts: number;
    productsWithoutInventory: number;
    lowInventory: number; // productos con 10 o menos
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    
    await db.connect();
    // const numberOfOrders = await Order.count();
    // const paidOrders = await Order.countDocuments({ isPaid: true });
    // const numberOfClients = await User.countDocuments({ role: 'client' });
    // const numberOfProducts = await Product.count();
    // const productsWithoutInventory = await Product.countDocuments({ inStock: 0 });
    // const lowInventory = await Product.countDocuments({ inStock: { $lte: 10 } });

    const [
        numberOfOrders,
        paidOrders,
        numberOfClients,
        numberOfProducts,
        productsWithoutInventory,
        lowInventory,
    ] = await Promise.all([
        Order.count(),
        Order.countDocuments({ isPaid: true }),
        User.countDocuments({ role: 'client' }),
        Product.count(),
        Product.countDocuments({ inStock: 0 }),
        Product.countDocuments({ inStock: { $lte: 10 } }),
    ]);

    await db.disconnect();
    
    res.status(200).json({
        numberOfOrders,
        paidOrders,
        numberOfClients,
        numberOfProducts,
        productsWithoutInventory,
        lowInventory,
        notPaidOrders: numberOfOrders - paidOrders
    })
}


