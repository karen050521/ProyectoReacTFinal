import type { UserRole } from '../models/UserRole';

/**
 * Utilidades específicas para UserRole
 */

/**
 * Determina el estado de una asignación de rol
 * @param userRole La asignación de rol a evaluar
 * @returns Estado con label y color para UI
 */
export const getAssignmentStatus = (userRole: UserRole): { 
    status: 'active' | 'expired' | 'expiring' | 'future';
    label: string;
    color: 'success' | 'error' | 'warning' | 'info';
} => {
    const now = new Date();
    const startDate = new Date(userRole.startAt);
    const endDate = userRole.endAt ? new Date(userRole.endAt) : null;

    // 🔮 FUTURO: Aún no ha iniciado
    if (startDate > now) {
        return { status: 'future', label: 'Futuro', color: 'info' };
    }

    // 🔴 EXPIRADO: Ya venció
    if (endDate && endDate < now) {
        return { status: 'expired', label: 'Expirado', color: 'error' };
    }

    // 🟡 POR EXPIRAR: Expira en menos de 7 días
    if (endDate) {
        const daysUntilExpiry = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        if (daysUntilExpiry <= 7) {
            return { status: 'expiring', label: `Expira en ${daysUntilExpiry}d`, color: 'warning' };
        }
    }

    // 🟢 ACTIVO: Vigente
    return { status: 'active', label: 'Activo', color: 'success' };
};

/**
 * Calcula la duración de una asignación de rol
 * @param startAt Fecha de inicio
 * @param endAt Fecha de fin (opcional)
 * @returns Descripción de la duración
 */
export const getAssignmentDuration = (startAt: string, endAt?: string): string => {
    if (!startAt) return '';
    
    const start = new Date(startAt);
    const end = endAt ? new Date(endAt) : null;
    
    if (!end) return 'Sin fecha de expiración';
    
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 día';
    if (diffDays < 30) return `${diffDays} días`;
    if (diffDays < 365) return `${Math.round(diffDays / 30)} meses aproximadamente`;
    
    return `${Math.round(diffDays / 365)} años aproximadamente`;
};

/**
 * Filtra asignaciones de UserRole por criterios
 * @param userRoles Lista de asignaciones
 * @param filters Criterios de filtrado
 * @returns Lista filtrada
 */
export const filterUserRoles = (
    userRoles: UserRole[],
    filters: {
        searchTerm?: string;
        userId?: number | '';
        roleId?: number | '';
        status?: string;
        getUserName?: (userId: number) => string;
        getRoleName?: (roleId: number) => string;
    }
): UserRole[] => {
    return userRoles.filter((userRole) => {
        // Filtro por término de búsqueda
        if (filters.searchTerm && filters.getUserName && filters.getRoleName) {
            const userName = filters.getUserName(userRole.user_id).toLowerCase();
            const roleName = filters.getRoleName(userRole.role_id).toLowerCase();
            const matchesSearch = userName.includes(filters.searchTerm.toLowerCase()) || 
                roleName.includes(filters.searchTerm.toLowerCase());
            
            if (!matchesSearch) return false;
        }

        // Filtro por usuario
        if (filters.userId !== undefined && filters.userId !== '' && userRole.user_id !== filters.userId) {
            return false;
        }

        // Filtro por rol
        if (filters.roleId !== undefined && filters.roleId !== '' && userRole.role_id !== filters.roleId) {
            return false;
        }

        // Filtro por estado
        if (filters.status && getAssignmentStatus(userRole).status !== filters.status) {
            return false;
        }

        return true;
    });
};