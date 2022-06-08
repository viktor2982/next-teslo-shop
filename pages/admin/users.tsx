import { useState, useEffect } from 'react';
import useSWR from 'swr';
import { PeopleOutline } from '@mui/icons-material';
import { Grid, MenuItem, Select } from '@mui/material';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';

import { tesloAPI } from '../../api';
import { AdminLayout } from '../../components/layouts';
import { IUser } from '../../interfaces';


const UsersPage = () => {

    const { data, error } = useSWR<IUser[]>('/api/admin/users');
    const [users, setUsers] = useState<IUser[]>([]);

    useEffect(() => {
        if (data) {
            setUsers(data);
        }
    }, [data]);


    if (!data && !error) return (<></>)

    const onRoleUpdated = async (userId: string, newRole: string) => {

        const previousUsers = users.map(user => ({...user}));
        const updatedUsers = users.map(user => ({
            ...user,
            role: userId === user._id ? newRole : user.role
        }));
        // console.log({userId});
        // console.table(previousUsers);
        // console.table(updatedUsers);

        setUsers(updatedUsers);

        try {
            await tesloAPI.put('/admin/users', { userId, role: newRole });

        } catch (error) {
            setUsers(previousUsers);
            console.log(error);
        }
    }

    const columns: GridColDef[] = [
        { field: 'email', headerName: 'Correo', width: 250 },
        { field: 'name', headerName: 'Nombre Completo', width: 250 },
        { 
            field: 'role', 
            headerName: 'Rol', 
            width: 250,
            renderCell: ({ row }: GridValueGetterParams) => {
                return (
                    <Select
                        value={ row.role }
                        label='Rol'
                        sx={{ width: '300px' }}
                        onChange={({ target }) => onRoleUpdated(row.id, target.value)}
                    >
                        <MenuItem value='admin'> Admin </MenuItem>
                        <MenuItem value='client'> Cliente </MenuItem>
                        <MenuItem value='super-user'> Super Usuario </MenuItem>
                        <MenuItem value='SEO'> SEO </MenuItem>
                    </Select>
                )
            }
        },
    ];
    
    const rows = data!.map(u => ({
        id: u._id,
        email: u.email,
        name: u.name,
        role: u.role
    }));

    return (
        <AdminLayout
            title='Usuarios'
            subTitle='Mantenimiento de Usuarios'
            icon={<PeopleOutline />}
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

export default UsersPage;