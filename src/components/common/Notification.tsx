import React from 'react';
import {
    Snackbar,
    Alert
} from '@mui/material';

interface NotificationProps {
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'warning' | 'info';
    onClose: () => void;
    autoHideDuration?: number;
    position?: {
        vertical: 'top' | 'bottom';
        horizontal: 'left' | 'center' | 'right';
    };
}

const Notification: React.FC<NotificationProps> = ({
    open,
    message,
    severity,
    onClose,
    autoHideDuration = 6000,
    position = { vertical: 'bottom', horizontal: 'right' }
}) => {
    return (
        <Snackbar
            open={open}
            autoHideDuration={autoHideDuration}
            onClose={onClose}
            anchorOrigin={position}
        >
            <Alert severity={severity} variant="filled" onClose={onClose}>
                {message}
            </Alert>
        </Snackbar>
    );
};

export default Notification;