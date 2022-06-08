import { Typography, Grid, Card, CardContent, Divider, Box, Chip } from '@mui/material';
import { CreditCardOffOutlined, CreditScoreOutlined, ConfirmationNumberOutlined } from '@mui/icons-material';
import { GetServerSideProps, NextPage } from 'next'

import { CartList, OrderSummary } from '../../../components/cart';
import { AdminLayout } from '../../../components/layouts';
import { dbOrders } from '../../../database';
import { IOrder } from '../../../interfaces';
import { countries } from '../../../utils';

interface Props {
    order: IOrder;
}

const OrderDetailPage: NextPage<Props> = ({ order }) => {

    return (
        <AdminLayout
            title='Resumen de Orden'
            subTitle={`Orden ID: ${order._id}`}
            icon={<ConfirmationNumberOutlined />}
        >
            {
                order.isPaid
                    ? (
                        <Chip
                            sx={{ my: 2 }}
                            label='Pagada'
                            variant='outlined'
                            color='success'
                            icon={<CreditScoreOutlined />}
                        />
                    )
                    : (
                        <Chip
                            sx={{ my: 2 }}
                            label='Pendiente de pago'
                            variant='outlined'
                            color='error'
                            icon={<CreditCardOffOutlined />}
                        />
                    )
            }            

            <Grid container className="fadeIn">
                <Grid item xs={12} sm={7}>
                    <CartList products={order.orderItems} />
                </Grid>
                <Grid item xs={12} sm={5}>
                    <Card className='summary-card'>
                        <CardContent>
                            <Typography variant='h2'>Resumen ({ order.numberOfItems } {order.numberOfItems > 1 ? 'productos' : 'producto'})</Typography>
                            <Divider sx={{ my: 1 }} />

                            <Box display='flex' justifyContent='space-between'>
                                <Typography variant='subtitle1'>Dirección de entrega</Typography>
                            </Box>

                            <Typography>{order.shippingAddress.firstName} {order.shippingAddress.lastName}</Typography>
                            <Typography>{order.shippingAddress.address}{order.shippingAddress.address2 ? `, ${order.shippingAddress.address}` : ''}</Typography>
                            <Typography>{order.shippingAddress.zip}, {order.shippingAddress.city}</Typography>
                            <Typography>{countries.find(c => c.code === order.shippingAddress.country)?.name}</Typography>
                            <Typography>{order.shippingAddress.phone}</Typography>

                            <Divider sx={{ my: 1 }} />

                            <OrderSummary order={order} />

                            <Box sx={{ mt: 3 }} display="flex" flexDirection='column'>

                                <Box flexDirection='column' sx={{ display: 'flex', flex: 1 }}>
                                    {
                                        order.isPaid
                                            ? (
                                                <Chip
                                                    sx={{ my: 2 }}
                                                    label='Pagada'
                                                    variant='outlined'
                                                    color='success'
                                                    icon={<CreditScoreOutlined />}
                                                />
                                            )
                                            : (
                                                <Chip
                                                    sx={{ my: 2 }}
                                                    label='Pendiente de pago'
                                                    variant='outlined'
                                                    color='error'
                                                    icon={<CreditCardOffOutlined />}
                                                />
                                            )
                                    }                                
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </AdminLayout>
    )
}


export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {

    const { id = '' } = query;
    const order = await dbOrders.getOrderById(id.toString());

    if (!order) {
        return {
            redirect: {
                destination: '/orders/history',
                permanent: false,
            }
        };
    }

    return {
        props: {
            order
        }
    }
}

export default OrderDetailPage;