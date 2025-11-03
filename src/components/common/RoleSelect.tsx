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
import { AdminPanelSettings as RoleIcon } from '@mui/icons-material';
import { roleService } from '../../services/roleService';
import type { Role } from '../../models/Role';

interface RoleSelectProps {
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

const RoleSelect: React.FC<RoleSelectProps> = ({
    value,
    onChange,
    label = "Rol",
    error = false,
    helperText,
    disabled = false,
    required = false,
    fullWidth = true,
    size = 'medium',
    placeholder = "Selecciona un rol"
}) => {
    const [roles, setRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [loadError, setLoadError] = useState<string | null>(null);

    // 📥 CARGAR ROLES DESDE API
    const fetchRoles = async () => {
        setLoading(true);
        setLoadError(null);
        try {
            const rolesData = await roleService.getRoles();
            setRoles(rolesData);
        } catch (err) {
            console.error('Error al cargar roles:', err);
            setLoadError('Error al cargar roles');
            setRoles([]);
        } finally {
            setLoading(false);
        }
    };

    // 🔄 CARGAR ROLES AL MONTAR COMPONENTE
    useEffect(() => {
        fetchRoles();
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
                        <RoleIcon />
                    </InputAdornment>
                }
            >
                {/* 📋 OPCIÓN PLACEHOLDER */}
                <MenuItem value="" disabled>
                    {loading 
                        ? 'Cargando roles...' 
                        : loadError 
                            ? 'Error al cargar' 
                            : placeholder
                    }
                </MenuItem>

                {/* 🔄 INDICADOR DE CARGA */}
                {loading && (
                    <MenuItem disabled>
                        <CircularProgress size={20} sx={{ mr: 1 }} />
                        Cargando roles...
                    </MenuItem>
                )}

                {/* 🚨 MENSAJE DE ERROR */}
                {loadError && (
                    <MenuItem disabled>
                        <em>Error: {loadError}</em>
                    </MenuItem>
                )}

                {/* 🎭 LISTA DE ROLES */}
                {!loading && !loadError && roles.map((role) => (
                    <MenuItem key={role.id} value={role.id}>
                        <strong>{role.name}</strong>
                        {role.description && (
                            <span style={{ marginLeft: 8, color: '#666', fontWeight: 'normal' }}>
                                - {role.description}
                            </span>
                        )}
                    </MenuItem>
                ))}

                {/* 📭 ESTADO VACÍO */}
                {!loading && !loadError && roles.length === 0 && (
                    <MenuItem disabled>
                        <em>No hay roles disponibles</em>
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

export default RoleSelect;
