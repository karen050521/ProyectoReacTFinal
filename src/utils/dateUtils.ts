/**
 * 📅 Utilidades centralizadas para manejo de fechas
 * 
 * Estas funciones eliminan la duplicación de código entre:
 * - UserRoleForm.tsx
 * - PasswordForm.tsx
 * - Y cualquier futuro formulario que maneje fechas
 */

/**
 * Convierte una fecha del servidor al formato requerido por inputs datetime-local
 * @param dateString - Fecha en formato ISO del servidor
 * @returns Fecha en formato YYYY-MM-DDTHH:mm para inputs
 */
export const formatDateForInput = (dateString?: string): string => {
    if (!dateString) {
        console.log('📅 formatDateForInput: dateString vacío');
        return '';
    }
    
    console.log('📅 formatDateForInput: Input =', dateString);
    
    try {
        // Limpieza de zona horaria como en otros formularios
        const cleanDateString = dateString
            .replace('Z', '')
            .replace(/[+-]\d{2}:\d{2}$/, '')
            .replace('+00:00', '');
        
        console.log('📅 formatDateForInput: Cleaned =', cleanDateString);
        
        const date = new Date(cleanDateString);
        
        if (isNaN(date.getTime())) {
            console.error('📅 formatDateForInput: Fecha inválida después de limpieza');
            return '';
        }
        
        // Convertir a formato datetime-local (YYYY-MM-DDTHH:mm)
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        
        const result = `${year}-${month}-${day}T${hours}:${minutes}`;
        console.log('📅 formatDateForInput: Output =', result);
        
        return result;
    } catch (error) {
        console.error('📅 formatDateForInput: Error:', error);
        return '';
    }
};

/**
 * Convierte una fecha de input datetime-local al formato que espera el backend
 * @param dateString - Fecha en formato YYYY-MM-DDTHH:mm del input
 * @returns Fecha en formato YYYY-MM-DD HH:mm:ss para el backend
 */
export const formatDateForBackend = (dateString: string): string => {
    if (!dateString) return '';
    
    try {
        // El input datetime-local da formato: 2024-11-02T10:00
        // El backend espera: 2024-11-02 10:00:00
        
        // Validar que la fecha tenga el formato correcto
        if (!dateString.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/)) {
            console.error('📅 formatDateForBackend: Formato de fecha inválido:', dateString);
            return '';
        }
        
        // Crear objeto Date para validar que la fecha sea válida
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            console.error('📅 formatDateForBackend: Fecha inválida:', dateString);
            return '';
        }
        
        // Convertir T por espacio y agregar :00 para los segundos
        const result = dateString.replace('T', ' ') + ':00';
        console.log('📅 formatDateForBackend: Input =', dateString, 'Output =', result);
        
        return result;
    } catch (error) {
        console.error('📅 formatDateForBackend: Error:', error);
        return '';
    }
};

/**
 * Formatea una fecha para mostrar en la UI de manera legible
 * @param dateString - Fecha en formato ISO
 * @returns Fecha formateada para visualización (DD/MM/YYYY HH:mm)
 */
export const formatDateForDisplay = (dateString?: string): string => {
    if (!dateString) return 'No establecida';
    
    try {
        const cleanDateString = dateString
            .replace('Z', '')
            .replace(/[+-]\d{2}:\d{2}$/, '')
            .replace('+00:00', '');
            
        const date = new Date(cleanDateString);
        
        if (isNaN(date.getTime())) {
            return 'Fecha inválida';
        }
        
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        
        return `${day}/${month}/${year} ${hours}:${minutes}`;
    } catch (error) {
        console.error('📅 formatDateForDisplay: Error:', error);
        return 'Error en fecha';
    }
};