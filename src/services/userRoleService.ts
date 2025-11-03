import api from "../interceptors/axiosInterceptor";
import type { UserRole } from "../models/UserRole";

const RAW_API_BASE_UR: string | undefined = (import.meta as any).env?.VITE_API_URL || (import.meta as any).VITE_API_URL || (import.meta as any).env?.CLASES_NUBES || (import.meta as any).CLASES_NUBES || undefined;
const API_BASE_UR = RAW_API_BASE_UR ? RAW_API_BASE_UR.replace(/\/$/, '') : '';
const API_URL = API_BASE_UR ? `${API_BASE_UR}/user-roles` : '/user-roles';

class UserRoleService {
    async getUserRoles(): Promise<UserRole[]> {
        try {
            console.debug('UserRoleService.getUserRoles -> API_URL=', API_URL);
            const response = await api.get<UserRole[]>(API_URL);
            console.debug('UserRoleService.getUserRoles -> status=', response.status, 'count=', Array.isArray(response.data) ? response.data.length : 0);
            return response.data;
        } catch (error) {
            console.error("Error al obtener roles de usuario:", error);
            return [];
        }
    }

    async getUserRoleById(id: string): Promise<UserRole | null> {
        try {
            const response = await api.get<UserRole>(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error("Role de usuario no encontrado:", error);
            return null;
        }
    }

    async createUserRole(userRole: Omit<UserRole, "id">): Promise<UserRole | null> {
        try {
            const response = await api.post<UserRole>(API_URL, userRole);
            return response.data;
        } catch (error) {
            console.error("Error al crear rol de usuario:", error);
            return null;
        }
    }

    async updateUserRole(id: string, userRole: Partial<UserRole>): Promise<UserRole | null> {
        try {
            // 🔍 VALIDACIONES PRE-ENVÍO
            if (!id || id.trim() === '') {
                throw new Error('ID de UserRole es requerido');
            }

            if (!userRole || Object.keys(userRole).length === 0) {
                throw new Error('No hay datos para actualizar');
            }

            // Validar que al menos tengamos los campos críticos
            if (userRole.user_id === undefined && userRole.role_id === undefined && 
                !userRole.startAt && !userRole.endAt) {
                throw new Error('Debe proporcionar al menos un campo para actualizar');
            }

            console.log('🔄 Actualizando UserRole:');
            console.log('  📋 ID:', id);
            console.log('  📦 Original Payload:', userRole);
            console.log('  🔍 Payload Details:');
            console.log('    - user_id:', userRole.user_id, '(type:', typeof userRole.user_id, ')');
            console.log('    - role_id:', userRole.role_id, '(type:', typeof userRole.role_id, ')');
            console.log('    - startAt:', userRole.startAt, '(type:', typeof userRole.startAt, ')');
            console.log('    - endAt:', userRole.endAt, '(type:', typeof userRole.endAt, ')');
            console.log('  🌐 URL:', `${API_URL}/${id}`);
            console.log('  📤 JSON Payload:', JSON.stringify(userRole, null, 2));
            
            const response = await api.put<UserRole>(`${API_URL}/${id}`, userRole);
            console.log('✅ Update Response:', response.data);
            return response.data;
        } catch (error: any) {
            console.error("❌ Error al actualizar rol de usuario:", error);
            
            // 🔍 ANÁLISIS DETALLADO DEL ERROR
            if (error.response) {
                // Error del servidor (4xx, 5xx)
                const status = error.response.status;
                const errorData = error.response.data;
                
                console.error("  📊 Server Error Details:");
                console.error("    - Status:", status);
                console.error("    - Status Text:", error.response.statusText);
                console.error("    - Response Data:", errorData);
                console.error("    - Request Headers:", error.config?.headers);
                console.error("    - Request Data:", error.config?.data);
                console.error("    - Request URL:", error.config?.url);
                
                // Manejar errores específicos
                switch (status) {
                    case 400:
                        console.error("  ❌ Bad Request: Datos inválidos enviados al servidor");
                        if (errorData?.message) {
                            console.error("  📝 Backend Message:", errorData.message);
                        }
                        break;
                    case 404:
                        console.error("  ❌ Not Found: UserRole con ID", id, "no existe");
                        break;
                    case 422:
                        console.error("  ❌ Unprocessable Entity: Error de validación");
                        if (errorData?.errors) {
                            console.error("  📝 Validation Errors:", errorData.errors);
                        }
                        break;
                    case 500:
                        console.error("  ❌ Internal Server Error: Error en el backend");
                        console.error("  🔧 Posibles causas:");
                        console.error("    - Formato de fechas incorrecto");
                        console.error("    - Campos requeridos faltantes");
                        console.error("    - Error en el controlador del backend");
                        if (errorData?.message) {
                            console.error("  📝 Backend Error:", errorData.message);
                        }
                        break;
                    default:
                        console.error("  ❌ Unexpected HTTP Error:", status);
                }
            } else if (error.request) {
                // Error de red
                console.error("  📊 Network Error Details:");
                console.error("    - No response received from server");
                console.error("    - Request:", error.request);
                console.error("  🔧 Posibles causas:");
                console.error("    - Servidor backend no está corriendo");
                console.error("    - Problemas de conectividad");
                console.error("    - CORS bloqueando la petición");
            } else {
                // Error en la configuración de la petición
                console.error("  📊 Request Setup Error:");
                console.error("    - Message:", error.message);
                console.error("  🔧 Posibles causas:");
                console.error("    - Error en validación pre-envío");
                console.error("    - Configuración incorrecta de axios");
            }
            
            return null;
        }
    }

    async deleteUserRole(id: string): Promise<boolean> {
        try {
            await api.delete(`${API_URL}/${id}`);
            return true;
        } catch (error) {
            console.error("Error al eliminar rol de usuario:", error);
            return false;
        }
    }

    // POST /api/user-roles/user/{userId}/role/{roleId} → asignar rol a usuario con fechas
    async assignRoleToUser(userId: number, roleId: number, data?: { startAt: string; endAt?: string }): Promise<UserRole | null> {
        try {
            // 🔧 FIX: No asignar fecha actual si endAt es undefined
            const formattedData: any = {
                startAt: data?.startAt ? this.formatDateForBackend(data.startAt) : new Date().toISOString().slice(0, 19).replace('T', ' ')
            };
            
            // Solo agregar endAt si realmente tiene valor
            if (data?.endAt && data.endAt.trim() !== '') {
                formattedData.endAt = this.formatDateForBackend(data.endAt);
            }
            // Si no hay endAt, no lo incluimos en el payload (será null en el backend)
            
            console.log('🚀 Enviando datos al backend:', formattedData);
            console.log('📅 Debug fechas:', {
                'original_startAt': data?.startAt,
                'formatted_startAt': formattedData.startAt,
                'original_endAt': data?.endAt,
                'formatted_endAt': formattedData.endAt || 'NO_INCLUIDO',
                'endAt_presente': 'endAt' in formattedData
            });
            
            const response = await api.post<UserRole>(`${API_URL}/user/${userId}/role/${roleId}`, formattedData);
            
            console.log('✅ Response from backend:', response.data);
            return response.data;
        } catch (error) {
            console.error("Error al asignar rol a usuario:", error);
            throw error;
        }
    }

    // Formatear fecha de datetime-local a formato del backend
    private formatDateForBackend(dateTimeLocal: string): string {
        try {
            // 🔧 FIX: NO usar toISOString() para evitar problemas de zona horaria
            // El input ya viene en formato: "2025-11-03 16:21:00"
            // Solo necesitamos agregarlo :00 al final si no tiene segundos
            
            console.log('🔧 formatDateForBackend input:', dateTimeLocal);
            
            // Si ya viene en formato "YYYY-MM-DD HH:mm:SS", devolverlo tal como está
            if (dateTimeLocal.match(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/)) {
                console.log('🔧 formatDateForBackend: Ya tiene formato correcto:', dateTimeLocal);
                return dateTimeLocal;
            }
            
            // Si viene en formato "YYYY-MM-DDTHH:mm", convertir a "YYYY-MM-DD HH:mm:00"
            if (dateTimeLocal.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/)) {
                const formatted = dateTimeLocal.replace('T', ' ') + ':00';
                console.log('🔧 formatDateForBackend: Convertido de datetime-local:', formatted);
                return formatted;
            }
            
            // Si viene en formato "YYYY-MM-DD HH:mm", agregar segundos
            if (dateTimeLocal.match(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/)) {
                const formatted = dateTimeLocal + ':00';
                console.log('🔧 formatDateForBackend: Agregados segundos:', formatted);
                return formatted;
            }
            
            console.error('🔧 formatDateForBackend: Formato no reconocido:', dateTimeLocal);
            return dateTimeLocal; // Devolver tal como está si no reconocemos el formato
            
        } catch (error) {
            console.error('Error formateando fecha:', error);
            return dateTimeLocal; // Devolver el original en caso de error
        }
    }

    // GET /api/user-roles/role/{roleId} → obtener usuarios por rol
    async getUsersByRole(roleId: number): Promise<UserRole[]> {
        try {
            const response = await api.get<UserRole[]>(`${API_URL}/role/${roleId}`);
            return response.data;
        } catch (error) {
            console.error("Error al obtener usuarios por rol:", error);
            return [];
        }
    }

    // GET /api/user-roles/user/{userId} → obtener roles por usuario
    async getRolesByUser(userId: number): Promise<UserRole[]> {
        try {
            const response = await api.get<UserRole[]>(`${API_URL}/user/${userId}`);
            return response.data;
        } catch (error) {
            console.error("Error al obtener roles por usuario:", error);
            return [];
        }
    }
}

// Exportamos una instancia de la clase para reutilizarla
export const userRoleService = new UserRoleService();

// Named exports para compatibilidad con imports existentes
export const getUserRoles = () => userRoleService.getUserRoles();
export const getUserRoleById = (id: string) => userRoleService.getUserRoleById(id);
export const createUserRole = (userRole: Omit<UserRole, "id">) => userRoleService.createUserRole(userRole);
export const updateUserRole = (id: string, userRole: Partial<UserRole>) => userRoleService.updateUserRole(id, userRole);
export const deleteUserRole = (id: string) => userRoleService.deleteUserRole(id);
export const assignRoleToUser = (userId: number, roleId: number, data?: { startAt: string; endAt?: string }) => userRoleService.assignRoleToUser(userId, roleId, data);
export const getUsersByRole = (roleId: number) => userRoleService.getUsersByRole(roleId);
export const getRolesByUser = (userId: number) => userRoleService.getRolesByUser(userId);
