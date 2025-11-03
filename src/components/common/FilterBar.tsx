import React from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@mui/material';
import { FilterList as FilterIcon, Refresh as RefreshIcon } from '@mui/icons-material';

interface FilterOption {
    value: string | number | '';
    label: string;
}

interface FilterBarProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    searchLabel?: string;
    searchPlaceholder?: string;
    filters?: Array<{
        label: string;
        value: string | number | '';
        onChange: (value: any) => void;
        options: FilterOption[];
        component?: React.ReactNode; // Para componentes custom como UserSelect
    }>;
    onRefresh?: () => void;
    loading?: boolean;
}

const FilterBar: React.FC<FilterBarProps> = ({
    searchTerm,
    onSearchChange,
    searchLabel = "Buscar",
    searchPlaceholder = "Escribe para buscar...",
    filters = [],
    onRefresh,
    loading = false
}) => {
    return (
        <Card sx={{ mb: 3 }}>
            <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <FilterIcon />
                    Filtros de Búsqueda
                </Typography>
                
                <Box sx={{ 
                    display: 'flex', 
                    flexDirection: { xs: 'column', md: 'row' }, 
                    gap: 2, 
                    alignItems: { xs: 'stretch', md: 'center' } 
                }}>
                    {/* 🔍 Búsqueda general */}
                    <Box sx={{ flex: { xs: 1, md: 2 } }}>
                        <TextField
                            fullWidth
                            label={searchLabel}
                            variant="outlined"
                            value={searchTerm}
                            onChange={(e) => onSearchChange(e.target.value)}
                            size="small"
                            placeholder={searchPlaceholder}
                        />
                    </Box>

                    {/* 🎛️ Filtros dinámicos */}
                    {filters.map((filter, index) => (
                        <Box key={index} sx={{ flex: { xs: 1, md: 1 } }}>
                            {filter.component || (
                                <FormControl fullWidth size="small">
                                    <InputLabel>{filter.label}</InputLabel>
                                    <Select
                                        value={filter.value}
                                        label={filter.label}
                                        onChange={(e) => filter.onChange(e.target.value)}
                                    >
                                        {filter.options.map((option) => (
                                            <MenuItem key={option.value} value={option.value}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            )}
                        </Box>
                    ))}

                    {/* 🔄 Botón refrescar */}
                    {onRefresh && (
                        <Box sx={{ flex: { xs: 1, md: 0 }, minWidth: { md: 'auto' } }}>
                            <Button
                                variant="outlined"
                                startIcon={<RefreshIcon />}
                                onClick={onRefresh}
                                sx={{ textTransform: 'none', width: { xs: '100%', md: 'auto' } }}
                                disabled={loading}
                            >
                                Refrescar
                            </Button>
                        </Box>
                    )}
                </Box>
            </CardContent>
        </Card>
    );
};

export default FilterBar;