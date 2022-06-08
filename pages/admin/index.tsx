import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { AccessTimeOutlined, AttachMoneyOutlined, CancelPresentationOutlined, CategoryOutlined, CreditCardOffOutlined, CreditCardOutlined, DashboardOutlined, GroupOutlined, ProductionQuantityLimitsOutlined } from '@mui/icons-material';
import { Grid, Typography } from '@mui/material';

import { AdminLayout } from '../../components/layouts';
import { SummaryWidget } from '../../components/admin';
import { DashboardSummaryResponse } from '../../interfaces';

const DashboardPage = () => {

    const { data, error } = useSWR<DashboardSummaryResponse>('/api/admin/dashboard', {
        refreshInterval: 30 * 1000 // 30 segundos
    });

    const [refreshIn, setRefreshIn] = useState(30);

    useEffect(() => {
        const interval = setInterval(() => {
            //console.log('Tick');
            setRefreshIn(refreshIn => refreshIn > 0 ? refreshIn - 1 : 30);
        }, 1000);

        return () => clearInterval(interval);
    }, []);



    if (!error && !data ) {
        return <></>
    }

    if (error) {
        console.log(error);
        return <Typography>Error al cargar información</Typography>
    }

    const {
        numberOfOrders,
        paidOrders,
        numberOfClients,
        numberOfProducts,
        productsWithoutInventory,
        lowInventory,
        notPaidOrders,
    } = data!;

    return (
        <AdminLayout
            title="Dashboard"
            subTitle='Estadísticas Generales'
            icon={<DashboardOutlined />}
        >
            <Grid container spacing={2}>

                <SummaryWidget
                    title={numberOfOrders}
                    subTitle="Ordenes totales"
                    icon={<CreditCardOutlined color='secondary' fontSize='large' />}
                />

                <SummaryWidget
                    title={paidOrders}
                    subTitle="Ordenes pagadas"
                    icon={<AttachMoneyOutlined color='success' fontSize='large' />}
                />

                <SummaryWidget
                    title={notPaidOrders}
                    subTitle="Ordenes pendientes"
                    icon={<CreditCardOffOutlined color='error' fontSize='large' />}
                />

                <SummaryWidget
                    title={numberOfClients}
                    subTitle="Clientes"
                    icon={<GroupOutlined color='primary' fontSize='large' />}
                />

                <SummaryWidget
                    title={numberOfProducts}
                    subTitle="Productos"
                    icon={<CategoryOutlined color='warning' fontSize='large' />}
                />

                <SummaryWidget
                    title={productsWithoutInventory}
                    subTitle="Sin existencias"
                    icon={<CancelPresentationOutlined color='error' fontSize='large' />}
                />

                <SummaryWidget
                    title={lowInventory}
                    subTitle="Inventario bajo"
                    icon={<ProductionQuantityLimitsOutlined color='warning' fontSize='large' />}
                />

                <SummaryWidget
                    title={refreshIn}
                    subTitle="Actualización en"
                    icon={<AccessTimeOutlined color='info' fontSize='large' />}
                />

            </Grid>
        </AdminLayout>
    )
}

export default DashboardPage;