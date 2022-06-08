import { ConfirmationNumberOutlined } from '@mui/icons-material';
import { Chip, Grid } from '@mui/material';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import useSWR from 'swr';

import { AdminLayout } from '../../components/layouts';
import { IOrder, IUser } from '../../interfaces';

const columns: GridColDef[] = [
    { field: 'id', headerName: 'Orden ID', width: 250 },
    { field: 'email', headerName: 'Correo', width: 250 },
    { field: 'name', headerName: 'Nombre Completo', width: 300 },
    { field: 'total', headerName: 'Monto Total', width: 150 },
    {
        field: 'isPaid',
        headerName: 'Pagada',
        renderCell: ({ row }: GridValueGetterParams) => {
            return row.isPaid
                ? (<Chip variant='outlined' label='Pagada' color='success' />)
                : (<Chip variant='outlined' label='Pendiente' color='error' />)
        },
        width: 120
    },
    { field: 'noProducts', headerName: 'No. Productos', align: 'center', width: 150 },
    {
        field: 'check',
        headerName: 'Ver orden',
        renderCell: ({ row }: GridValueGetterParams) => {
            return (
                <a href={`/admin/orders/${row.id}`} target='_blank' rel='noreferrer'>
                    Ver orden
                </a>
            )
        }
    },
    { field: 'createdAt', headerName: 'Creada en', width: 250 },
];

const OrdersPage = () => {

    const { data, error } = useSWR<IOrder[]>('/api/admin/orders');

    if (!data && !error) return (<></>)

    // console.table(data);

    const rows = data!.map(o => ({
        id: o._id,
        email: (o.user as IUser).email,
        name: (o.user as IUser).name,
        total: o.total,
        isPaid: o.isPaid,
        noProducts: o.numberOfItems,
        createdAt: o.createdAt
    }));


    return (
        <AdminLayout
            title={'Ordenes'}
            subTitle={'Mantenimiento de ordenes'}
            icon={<ConfirmationNumberOutlined />}
        >

            <Grid container className="fadeIn">
                <Grid item xs={12} sx={{ height: 650, width: '100%' }}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        pageSize={10}
                        rowsPerPageOptions={[10]}
                    />
                </Grid>
            </Grid>

        </AdminLayout>
    )
}

export default OrdersPage;