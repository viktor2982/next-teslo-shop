import { useContext, useState } from "react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { AppBar, Badge, Box, Button, IconButton, Input, InputAdornment, Link, Toolbar, Typography } from "@mui/material";
import { ClearOutlined, SearchOutlined, ShoppingCartOutlined } from "@mui/icons-material";

import { CartContext, UIContext } from "../../context";

export const Navbar = () => {

    const { route, push } = useRouter();
    const { toggleSideMenu } = useContext(UIContext);
    const { numberOfItems } = useContext(CartContext);
    const [ searchTerm, setSearchTerm ] = useState('');
    const [ isSearchVisible, setIsSearchVisible ] = useState(false);

    const onSearchTerm = () => {
        if (searchTerm.trim().length === 0) return;
        push(`/search/${searchTerm}`);
    }

    return (
        <AppBar>
            <Toolbar>
                <NextLink href='/' passHref>
                    <Link display='flex' alignItems='center'>
                        <Typography variant='h6'>Teslo |</Typography>
                        <Typography sx={{ ml: 0.5 }}>Shop</Typography>
                    </Link>
                </NextLink>

                <Box flex={1} />

                <Box
                    sx={{ display: isSearchVisible ? 'none' : { xs: 'none', sm: 'block' } }}
                    className="fadeIn"
                >
                    <NextLink href='/category/men' passHref>
                        <Link>
                            <Button color={route.includes('/men') ? 'secondary' : 'primary'}>Hombres</Button>
                        </Link>
                    </NextLink>
                    <NextLink href='/category/women' passHref>
                        <Link>
                            <Button color={route.includes('/women') ? 'secondary' : 'primary'}>Mujeres</Button>
                        </Link>
                    </NextLink>
                    <NextLink href='/category/kids' passHref>
                        <Link>
                            <Button color={route.includes('/kid') ? 'secondary' : 'primary'}>Niños</Button>
                        </Link>
                    </NextLink>
                </Box>

                <Box flex={1} />

                {/* Pantallas grandes */}
                {
                    isSearchVisible
                        ? (
                            <Input
                                sx={{ display: { xs: 'none', sm: 'flex' } }}
                                className="fadeIn"
                                autoFocus
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' ? onSearchTerm() : null}
                                type='text'
                                placeholder="Buscar..."
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setIsSearchVisible(false)}
                                        >
                                            <ClearOutlined />
                                        </IconButton>
                                    </InputAdornment>
                                }
                            />
                        )
                        : (
                            <IconButton
                                sx={{ display: { xs: 'none', sm: 'flex' } }}
                                onClick={() => setIsSearchVisible(true)}
                                className="fadeIn"
                            >
                                <SearchOutlined />
                            </IconButton>
                        )
                }

                {/* Pantallas pequeñas */}
                <IconButton
                    sx={{ display: { xs: 'flex', sm: 'none' } }}
                    onClick={toggleSideMenu}
                >
                    <SearchOutlined />
                </IconButton>

                <NextLink href='/cart' passHref>
                    <Link>
                        <IconButton>
                            <Badge badgeContent={numberOfItems} color='secondary'>
                                <ShoppingCartOutlined />
                            </Badge>
                        </IconButton>
                    </Link>
                </NextLink>

                <Button
                    onClick={toggleSideMenu}
                >
                    Menú
                </Button>
            </Toolbar>
        </AppBar>
    )
}
