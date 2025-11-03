import React from 'react';
import {
    Box,
    Typography,
    Button,
    CircularProgress
} from '@mui/material';

interface EmptyStateProps {
    icon: React.ReactElement;
    title: string;
    description: string;
    actionButton?: {
        text: string;
        onClick: () => void;
        icon?: React.ReactElement;
    };
    loading?: boolean;
}

const EmptyState: React.FC<EmptyStateProps> = ({
    icon,
    title,
    description,
    actionButton,
    loading = false
}) => {
    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ textAlign: 'center', p: 4 }}>
            {React.cloneElement(icon, { 
                sx: { fontSize: 64, color: 'text.disabled', mb: 2 } 
            })}
            <Typography variant="h6" color="text.secondary" gutterBottom>
                {title}
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
                {description}
            </Typography>
            {actionButton && (
                <Button
                    variant="contained"
                    startIcon={actionButton.icon}
                    onClick={actionButton.onClick}
                    size="large"
                >
                    {actionButton.text}
                </Button>
            )}
        </Box>
    );
};

export default EmptyState;