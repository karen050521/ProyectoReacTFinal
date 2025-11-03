import { useState, useEffect } from "react";
import { userRoleService } from "../services/userRoleService";
import { roleService } from "../services/roleService";
import api from "../interceptors/axiosInterceptor";
import type { UserRole } from "../models/UserRole";
import type { Role } from "../models/Role";

export const useUserRoleController = () => {
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  //  FUNCIÓN PARA BUSCAR USUARIO POR EMAIL (reutilizar patrón de Address)
  const findUserByEmail = async (email: string) => {
    try {
      const response = await api.get('/users');
      const users = response.data;
      return users.find((user: any) => user.email === email);
    } catch (error) {
      console.error('Error al buscar usuario por email:', error);
      return null;
    }
  };

  //  CARGAR TODAS LAS ASIGNACIONES
  const fetchUserRoles = async () => {
    setLoading(true);
    setError(null);
    try {
      const userRolesData = await userRoleService.getUserRoles();
      console.log("UserRoles cargados:", userRolesData);
      setUserRoles(userRolesData);
    } catch (err) {
      setError("Error al cargar asignaciones de roles");
      console.error(err);
      setUserRoles([]);
    } finally {
      setLoading(false);
    }
  };

  // ➕ ASIGNAR ROL A USUARIO CON FECHAS
  const assignRole = async (userId: number, roleId: number, startAt: string, endAt?: string) => {
    setLoading(true);
    setError(null);
    try {
      console.log('Asignando rol:', { userId, roleId, startAt, endAt });
      
      const data = {
        startAt,
        endAt: endAt || undefined
      };

      const newUserRole = await userRoleService.assignRoleToUser(userId, roleId, data);
      if (newUserRole) {
        await fetchUserRoles(); // Recargar lista
        return newUserRole;
      }
      return null;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al asignar rol";
      setError(errorMessage);
      console.error('Error en assignRole:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  //  ACTUALIZAR FECHAS DE ASIGNACIÓN
  const updateUserRole = async (id: string, data: Partial<UserRole>) => {
    setLoading(true);
    setError(null);
    try {
      // 🔍 VALIDACIONES PRE-SERVICIO
      if (!id || id.trim() === '') {
        throw new Error("ID de UserRole es requerido para actualizar");
      }

      if (!data || Object.keys(data).length === 0) {
        throw new Error("No hay datos para actualizar");
      }

      console.log('🔄 Controller.updateUserRole - ID:', id, 'Data:', data);
      console.log('🔍 Controller - Validating data before service call...');
      
      // Validar tipos de datos críticos
      if (data.user_id !== undefined && (typeof data.user_id !== 'number' || data.user_id <= 0)) {
        throw new Error(`user_id debe ser un número positivo, recibido: ${typeof data.user_id} ${data.user_id}`);
      }
      
      if (data.role_id !== undefined && (typeof data.role_id !== 'number' || data.role_id <= 0)) {
        throw new Error(`role_id debe ser un número positivo, recibido: ${typeof data.role_id} ${data.role_id}`);
      }

      if (data.startAt && typeof data.startAt !== 'string') {
        throw new Error(`startAt debe ser una cadena de fecha, recibido: ${typeof data.startAt}`);
      }

      if (data.endAt && typeof data.endAt !== 'string') {
        throw new Error(`endAt debe ser una cadena de fecha, recibido: ${typeof data.endAt}`);
      }

      console.log('✅ Controller - Data validation passed, calling service...');
      const updated = await userRoleService.updateUserRole(id, data);
      console.log('🔄 Controller.updateUserRole - Result:', updated);
      
      if (updated) {
        console.log('✅ Controller - Update successful, reloading data...');
        await fetchUserRoles(); // Recargar lista
        return updated;
      } else {
        console.warn('⚠️ Controller - Service returned null (update failed)');
        setError("La actualización falló: el servicio no devolvió datos");
        return null;
      }
    } catch (err: any) {
      console.error('❌ Controller Error in updateUserRole:', err);
      
      // Proporcionar mensajes de error más específicos
      let errorMessage = "Error al actualizar asignación de rol";
      
      if (err.message?.includes('user_id')) {
        errorMessage = "Error: ID de usuario inválido";
      } else if (err.message?.includes('role_id')) {
        errorMessage = "Error: ID de rol inválido";
      } else if (err.message?.includes('fecha') || err.message?.includes('date')) {
        errorMessage = "Error: Formato de fecha inválido";
      } else if (err.message?.includes('requerido')) {
        errorMessage = err.message;
      } else if (err.message?.includes('500')) {
        errorMessage = "Error interno del servidor: verifique los logs del backend";
      } else if (err.message?.includes('400')) {
        errorMessage = "Datos inválidos: verifique los campos del formulario";
      } else if (err.message?.includes('404')) {
        errorMessage = "UserRole no encontrado: puede haber sido eliminado";
      }
      
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  //  ELIMINAR ASIGNACIÓN DE ROL
  const removeRole = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const success = await userRoleService.deleteUserRole(id);
      if (success) {
        await fetchUserRoles(); // Recargar lista
      }
      return success;
    } catch (err) {
      setError("Error al quitar rol");
      console.error('Error en removeRole:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  //  OBTENER ASIGNACIÓN POR ID
  const getUserRoleById = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const userRole = await userRoleService.getUserRoleById(id);
      return userRole;
    } catch (err) {
      setError("Error al obtener asignación");
      console.error('Error en getUserRoleById:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  //  OBTENER ROLES DE UN USUARIO
  const getRolesByUser = async (userId: number) => {
    setLoading(true);
    setError(null);
    try {
      const roles = await userRoleService.getRolesByUser(userId);
      return roles;
    } catch (err) {
      setError("Error al obtener roles del usuario");
      console.error('Error en getRolesByUser:', err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  //  OBTENER USUARIOS CON UN ROL
  const getUsersByRole = async (roleId: number) => {
    setLoading(true);
    setError(null);
    try {
      const users = await userRoleService.getUsersByRole(roleId);
      return users;
    } catch (err) {
      setError("Error al obtener usuarios del rol");
      console.error('Error en getUsersByRole:', err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  //  OBTENER USUARIOS PARA SELECT (función auxiliar)
  const getUsers = async () => {
    try {
      const response = await api.get('/users');
      return response.data;
    } catch (err) {
      console.error('Error al obtener usuarios:', err);
      return [];
    }
  };

  //  OBTENER ROLES PARA SELECT (función auxiliar)
  const getRoles = async (): Promise<Role[]> => {
    try {
      const roles = await roleService.getRoles();
      return roles;
    } catch (err) {
      console.error('Error al obtener roles:', err);
      return [];
    }
  };

  //  LIMPIAR ERROR
  const clearError = () => {
    setError(null);
  };

  //  REFRESCAR DATOS
  const refreshUserRoles = async () => {
    await fetchUserRoles();
  };

  //  CARGAR DATOS INICIALES
  useEffect(() => {
    fetchUserRoles();
  }, []);

  return {
    // Estados
    userRoles,
    loading,
    error,
    
    // Operaciones CRUD
    assignRole,
    updateUserRole,
    removeRole,
    getUserRoleById,
    
    //  Consultas especiales
    getRolesByUser,
    getUsersByRole,
    
    //  Datos auxiliares
    getUsers,
    getRoles,
    findUserByEmail,
    
    //  Utilidades
    fetchUserRoles,
    refreshUserRoles,
    clearError
  };
};