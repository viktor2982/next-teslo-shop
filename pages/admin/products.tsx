import NextLink from 'next/link';
import { AddOutlined, CategoryOutlined } from '@mui/icons-material';
import { Box, Button, CardMedia, Grid, Link } from '@mui/material';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import useSWR from 'swr';
import { AdminLayout } from '../../components/layouts';
import { IProduct } from '../../interfaces';

const columns: GridColDef[] = [
    { 
        field: 'img', 
        headerName: 'Imagen',
        renderCell: ({ row }: GridValueGetterParams) => {
            return (
                <a href={`/product/${row.slug}`} target='_blank' rel='noreferrer'>
                    <CardMedia
                        component='img'
                        className='fadeIn'
                        image={row.img}
                        alt={row.title}
                        title={row.title}
                    />
                </a>
            )
        }
    },
    { 
        field: 'title', 
        headerName: 'Producto', 
        width: 250,
        renderCell: ({ row }: GridValueGetterParams) => {
            return (
                <NextLink href={`/admin/products/${row.slug}`} passHref>
                    <Link underline='always'>
                        {row.title}
                    </Link>
                </NextLink>
            )
        }
    },
    { field: 'gender', headerName: 'Género', width: 150 },
    { field: 'type', headerName: 'Tipo', width: 150 },
    { field: 'inStock', headerName: 'Stock', width: 100 },
    { field: 'price', headerName: 'Precio', width: 100 },
    { field: 'sizes', headerName: 'Tallas', width: 250 },
];

const ProductsPage = () => {

    const { data, error } = useSWR<IProduct[]>('/api/admin/products');

    if (!data && !error) return (<></>)

    // console.table(data);

    const rows = data!.map(p => ({
        id: p._id,
        img: p.images[0],
        title: p.title,
        gender: p.gender,
        type: p.type,
        inStock: p.inStock,
        price: p.price,
        sizes: p.sizes.join(', '),
        slug: p.slug,
    }));


    return (
        <AdminLayout
            title={`Productos (${ data?.length })`}
            subTitle={'Mantenimiento de productos'}
            icon={<CategoryOutlined />}
        >
            <Box display='flex' justifyContent='end' sx={{ mb: 2 }}>
                <Button
                    startIcon={<AddOutlined />}
                    color='secondary'
                    href='/admin/products/new'
                >
                    Crear producto
                </Button>
            </Box>

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

export default ProductsPage;