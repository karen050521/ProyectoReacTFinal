import React, { useState, useEffect } from 'react';
import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    CircularProgress,
    FormHelperText,
    InputAdornment
} from '@mui/material';
import { Person as PersonIcon } from '@mui/icons-material';
import api from '../../interceptors/axiosInterceptor';

export interface User {
    id: number;
    name: string;
    email: string;
}

interface UserSelectProps {
    value: number | string | '';
    onChange: (value: number) => void;
    label?: string;
    error?: boolean;
    helperText?: string;
    disabled?: boolean;
    required?: boolean;
    fullWidth?: boolean;
    size?: 'small' | 'medium';
    placeholder?: string;
}

const UserSelect: React.FC<UserSelectProps> = ({
    value,
    onChange,
    label = "Usuario",
    error = false,
    helperText,
    disabled = false,
    required = false,
    fullWidth = true,
    size = 'medium',
    placeholder = "Selecciona un usuario"
}) => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [loadError, setLoadError] = useState<string | null>(null);

    // 📥 CARGAR USUARIOS DESDE API
    const fetchUsers = async () => {
        setLoading(true);
        setLoadError(null);
        try {
            const response = await api.get('/users');
            setUsers(response.data);
        } catch (err) {
            console.error('Error al cargar usuarios:', err);
            setLoadError('Error al cargar usuarios');
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    // 🔄 CARGAR USUARIOS AL MONTAR COMPONENTE
    useEffect(() => {
        fetchUsers();
    }, []);

    // 🎯 MANEJAR CAMBIO DE SELECCIÓN
    const handleChange = (event: any) => {
        const selectedValue = event.target.value;
        if (selectedValue !== '' && !isNaN(selectedValue)) {
            onChange(Number(selectedValue));
        }
    };

    return (
        <FormControl 
            fullWidth={fullWidth} 
            error={error || !!loadError}
            disabled={disabled}
            size={size}
        >
            <InputLabel required={required}>
                {label}
            </InputLabel>
            <Select
                value={value}
                label={label}
                onChange={handleChange}
                startAdornment={
                    <InputAdornment position="start">
                        <PersonIcon />
                    </InputAdornment>
                }
            >
                {/* 📋 OPCIÓN PLACEHOLDER */}
                <MenuItem value="" disabled>
                    {loading 
                        ? 'Cargando usuarios...' 
                        : loadError 
                            ? 'Error al cargar' 
                            : placeholder
                    }
                </MenuItem>

                {/* 🔄 INDICADOR DE CARGA */}
                {loading && (
                    <MenuItem disabled>
                        <CircularProgress size={20} sx={{ mr: 1 }} />
                        Cargando usuarios...
                    </MenuItem>
                )}

                {/* 🚨 MENSAJE DE ERROR */}
                {loadError && (
                    <MenuItem disabled>
                        <em>Error: {loadError}</em>
                    </MenuItem>
                )}

                {/* 👥 LISTA DE USUARIOS */}
                {!loading && !loadError && users.map((user) => (
                    <MenuItem key={user.id} value={user.id}>
                        <strong>{user.name}</strong> ({user.email})
                    </MenuItem>
                ))}

                {/* 📭 ESTADO VACÍO */}
                {!loading && !loadError && users.length === 0 && (
                    <MenuItem disabled>
                        <em>No hay usuarios disponibles</em>
                    </MenuItem>
                )}
            </Select>

            {/* 💬 TEXTO DE AYUDA */}
            {(helperText || loadError) && (
                <FormHelperText>
                    {loadError || helperText}
                </FormHelperText>
            )}
        </FormControl>
    );
};

export default UserSelect;
