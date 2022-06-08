import { Box, Typography } from '@mui/material';
import type { NextPage, GetServerSideProps } from 'next';

import { ShopLayout } from '../../components/layouts';
import { ProductList } from '../../components/products';
import { dbProducts } from '../../database';
import { IProduct } from '../../interfaces';

interface Props {
    products: IProduct[];
    productsExists: boolean;
    query: string;
}


const SearchPage: NextPage<Props> = ({ products, productsExists, query }) => {

  return (
    <ShopLayout title={'Teslo-Shop - Search'} pageDescription={'Búsqueda de los mejores productos de Teslo'}>
      <Typography variant='h1' component='h1'>Buscar producto</Typography>

      {
          productsExists
            ? <Typography variant='h2' sx={{ mb: 1 }} textTransform='capitalize'>Término: { query }</Typography>
            : (
                <Box display='flex'>
                    <Typography variant='h2' sx={{ mb: 1 }}>No encontramos ningún producto:</Typography>
                    <Typography variant='h2' sx={{ ml: 1 }} color='secondary' textTransform='capitalize'>{ query }</Typography>
                </Box>
            )
      }    

      <ProductList products={products} />

    </ShopLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {

    const { query = '' } = params as { query: string };

    if (query.trim().length === 0) {
        return {
            redirect: {
                destination: '/',
                permanent: true
            }
        };
    }

    let products = await dbProducts.getProductsByTerm(query);
    const productsExists = products.length > 0;

    // TODO: retornar otros productos en caso de que no se encuentre nada en la busqueda
    if (!productsExists) {
        // products = await dbProducts.getAllProducts();
        products = await dbProducts.getProductsByTerm('shirt');
    }

    return {
        props: {
            products,
            productsExists,
            query
        }
    }
}

export default SearchPage;
