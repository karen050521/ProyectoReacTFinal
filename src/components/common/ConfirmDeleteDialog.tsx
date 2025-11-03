import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box
} from '@mui/material';

interface ConfirmDeleteDialogProps {
    open: boolean;
    title?: string;
    message?: string;
    itemDetails?: React.ReactNode;
    onConfirm: () => void;
    onCancel: () => void;
    confirmText?: string;
    cancelText?: string;
    loading?: boolean;
}

const ConfirmDeleteDialog: React.FC<ConfirmDeleteDialogProps> = ({
    open,
    title = "Confirmar Eliminación",
    message = "¿Estás seguro de que deseas eliminar este elemento?",
    itemDetails,
    onConfirm,
    onCancel,
    confirmText = "Eliminar",
    cancelText = "Cancelar",
    loading = false
}) => {
    return (
        <Dialog open={open} onClose={onCancel} maxWidth="sm" fullWidth>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <Typography gutterBottom>
                    {message}
                </Typography>
                {itemDetails && (
                    <Box sx={{ mt: 2, p: 2, backgroundColor: 'grey.50', borderRadius: 1 }}>
                        {itemDetails}
                    </Box>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onCancel} disabled={loading}>
                    {cancelText}
                </Button>
                <Button 
                    onClick={onConfirm} 
                    color="error" 
                    variant="contained"
                    disabled={loading}
                >
                    {confirmText}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmDeleteDialog;