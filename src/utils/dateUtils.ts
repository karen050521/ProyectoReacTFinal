/**
 * Utilidades para formateo de fechas reutilizables
 * Usadas en UserRole, Password y otras entidades
 */

/**
 * Formatea una fecha del servidor para mostrar en la UI
 * @param dateString Fecha en formato ISO del servidor
 * @returns Fecha formateada para mostrar (ej: "03 nov 2025, 14:20")
 */
export const formatDateForDisplay = (dateString?: string): string => {
    if (!dateString) return 'N/A';
    
    try {
        // Limpieza de zona horaria como en otros formularios
        const cleanDateString = dateString
            .replace('Z', '')
            .replace(/[+-]\d{2}:\d{2}$/, '');
        
        const date = new Date(cleanDateString);
        
        if (isNaN(date.getTime())) return 'Fecha inválida';
        
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch {
        return 'Fecha inválida';
    }
};

/**
 * Formatea una fecha para input datetime-local
 * @param dateString Fecha del servidor
 * @returns Fecha en formato "YYYY-MM-DDTHH:mm" para inputs
 */
export const formatDateForInput = (dateString?: string): string => {
    if (!dateString) return '';
    
    try {
        // Limpieza de zona horaria
        const cleanDateString = dateString
            .replace('Z', '')
            .replace(/[+-]\d{2}:\d{2}$/, '');
        
        const date = new Date(cleanDateString);
        
        if (isNaN(date.getTime())) return '';
        
        // Convertir a formato datetime-local (YYYY-MM-DDTHH:mm)
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    } catch {
        return '';
    }
};

/**
 * Formatea una fecha para enviar al backend
 * @param dateTimeLocal Fecha desde input datetime-local
 * @returns Fecha en formato "YYYY-MM-DD HH:mm:00" para el backend
 */
export const formatDateForBackend = (dateTimeLocal: string): string => {
    if (!dateTimeLocal) return '';
    
    try {
        // Si ya viene en formato "YYYY-MM-DD HH:mm:SS", devolverlo tal como está
        if (dateTimeLocal.match(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/)) {
            return dateTimeLocal;
        }
        
        // Si viene en formato "YYYY-MM-DDTHH:mm", convertir a "YYYY-MM-DD HH:mm:00"
        if (dateTimeLocal.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/)) {
            return dateTimeLocal.replace('T', ' ') + ':00';
        }
        
        // Si viene en formato "YYYY-MM-DD HH:mm", agregar segundos
        if (dateTimeLocal.match(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/)) {
            return dateTimeLocal + ':00';
        }
        
        console.error('formatDateForBackend: Formato no reconocido:', dateTimeLocal);
        return dateTimeLocal;
        
    } catch (error) {
        console.error('Error formateando fecha:', error);
        return dateTimeLocal;
    }
};