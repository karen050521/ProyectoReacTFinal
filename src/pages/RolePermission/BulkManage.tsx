import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { permissionService } from '../../services/permissionService';
import { rolePermissionService } from '../../services/rolePermissionService';
import { roleService } from '../../services/roleService';
import { usePermissions } from '../../hooks/usePermissions';
import { usePermissionUpdate } from '../../context/PermissionUpdateContext';
import { Permission } from '../../models/Permission';
import { Role } from '../../models/Role';
import Swal from 'sweetalert2';
import Breadcrumb from '../../components/Breadcrumb';
import { AdminGuard } from '../../components/guards/PermissionGuard';

interface PermissionsByEntity {
  [entity: string]: {
    list?: Permission;
    edit?: Permission;
    create?: Permission;
    update?: Permission;
    delete?: Permission;
  };
}

const BulkRolePermissionManager: React.FC = () => {
  const { roleId } = useParams<{ roleId: string }>();
  const navigate = useNavigate();
  const [role, setRole] = useState<Role | null>(null);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [assignedPermissions, setAssignedPermissions] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [permissionsByEntity, setPermissionsByEntity] = useState<PermissionsByEntity>({});

  // Hooks para manejo de permisos
  const { isAdminSafe, enableDynamicMode } = usePermissions();
  const { triggerPermissionUpdate } = usePermissionUpdate();

  useEffect(() => {
    if (roleId) {
      loadData();
    }
  }, [roleId]);

  const loadData = async () => {
    if (!roleId) return;

    try {
      setLoading(true);

      // Cargar datos en paralelo
      const [roleData, allPermissions, currentRolePermissions] = await Promise.all([
        roleService.getRoleById(Number.parseInt(roleId)),
        permissionService.getPermissions(),
        rolePermissionService.getPermissionsByRoleId(Number.parseInt(roleId))
      ]);

      if (!roleData) {
        await Swal.fire({
          title: 'Error',
          text: 'No se encontró el rol',
          icon: 'error',
        });
        navigate('/roles');
        return;
      }

      setRole(roleData);
      setPermissions(allPermissions);

      // Agrupar permisos por entidad
      const grouped = groupPermissionsByEntity(allPermissions);
      setPermissionsByEntity(grouped);

      // Marcar permisos asignados
      const assignedIds = new Set(currentRolePermissions.map(rp => rp.permission_id));
      setAssignedPermissions(assignedIds);

      console.log('📋 Loaded data:', {
        role: roleData,
        totalPermissions: allPermissions.length,
        assignedPermissions: assignedIds.size,
        entitiesFound: Object.keys(grouped).length
      });

    } catch (error) {
      console.error('❌ Error loading data:', error);
      await Swal.fire({
        title: 'Error',
        text: 'Error al cargar los datos',
        icon: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const groupPermissionsByEntity = (permissions: Permission[]): PermissionsByEntity => {
    const grouped: PermissionsByEntity = {};

    permissions.forEach(permission => {
      const entity = permission.entity;
      if (!grouped[entity]) {
        grouped[entity] = {};
      }

      // Clasificar por método y patrón de URL
      if (permission.method === 'GET') {
        if (permission.url.includes(':id') || permission.url.includes('?')) {
          grouped[entity].edit = permission;
        } else {
          grouped[entity].list = permission;
        }
      } else if (permission.method === 'POST') {
        grouped[entity].create = permission;
      } else if (permission.method === 'PUT') {
        grouped[entity].update = permission;
      } else if (permission.method === 'DELETE') {
        grouped[entity].delete = permission;
      }
    });

    return grouped;
  };

  const handlePermissionToggle = (permissionId: number) => {
    setAssignedPermissions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(permissionId)) {
        newSet.delete(permissionId);
      } else {
        newSet.add(permissionId);
      }
      return newSet;
    });
  };

  const handleSaveChanges = async () => {
    if (!roleId) return;

    try {
      setSaving(true);

      const selectedPermissionIds = Array.from(assignedPermissions);
      console.log('💾 Saving permissions for role', roleId, ':', selectedPermissionIds);

      // Intentar actualización bulk primero
      let success = await rolePermissionService.updateRolePermissionsBulk(
        Number.parseInt(roleId),
        selectedPermissionIds
      );

      // Si bulk falla, usar método diff
      if (!success) {
        console.log('⚠️ Bulk update failed, trying diff method...');
        success = await rolePermissionService.updateRolePermissionsDiff(
          Number.parseInt(roleId),
          selectedPermissionIds
        );
      }

      if (success) {
        // Activar modo dinámico y notificar cambios
        await enableDynamicMode();
        triggerPermissionUpdate();

        await Swal.fire({
          title: '¡Éxito!',
          text: 'Los permisos se han actualizado correctamente. Los guards se han sincronizado automáticamente.',
          icon: 'success',
          timer: 3000,
          showConfirmButton: false,
        });

        // Recargar datos para reflejar cambios
        await loadData();
      } else {
        throw new Error('No se pudieron actualizar los permisos');
      }

    } catch (error) {
      console.error('❌ Error saving permissions:', error);
      await Swal.fire({
        title: 'Error',
        text: 'No se pudieron guardar los cambios en los permisos',
        icon: 'error',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleEntityToggle = (entity: string, enable: boolean) => {
    const entityPerms = permissionsByEntity[entity];
    if (!entityPerms) return;

    setAssignedPermissions(prev => {
      const newSet = new Set(prev);
      
      Object.values(entityPerms).forEach(permission => {
        if (permission) {
          if (enable) {
            newSet.add(permission.id);
          } else {
            newSet.delete(permission.id);
          }
        }
      });

      return newSet;
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <AdminGuard fallback={
      <div className="mx-auto max-w-7xl">
        <Breadcrumb pageName="Acceso Denegado" />
        <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Acceso Denegado</h2>
            <p className="text-gray-600 mb-4">No tienes permisos para gestionar roles y permisos.</p>
            <button
              onClick={() => navigate(-1)}
              className="bg-gray-600 text-white py-2 px-4 rounded hover:bg-opacity-90"
            >
              ← Volver
            </button>
          </div>
        </div>
      </div>
    }>
      <div className="mx-auto max-w-7xl">
        <Breadcrumb pageName={`Gestión de Permisos - ${role?.name || 'Rol'}`} />
        
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          {/* Header */}
          <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium text-black dark:text-white text-xl">
                  Configuración de Permisos por Rol
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Rol: <span className="font-semibold">{role?.name}</span>
                </p>
                {role?.description && (
                  <p className="text-sm text-gray-500">{role.description}</p>
                )}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleSaveChanges}
                  disabled={saving}
                  className="bg-primary text-white py-2 px-6 rounded hover:bg-opacity-90 disabled:opacity-50"
                >
                  {saving ? 'Guardando...' : 'Guardar Cambios'}
                </button>
                <button
                  onClick={() => navigate('/roles')}
                  className="border border-stroke py-2 px-4 rounded hover:shadow-1"
                >
                  Volver
                </button>
              </div>
            </div>
          </div>

          {/* Permissions Table */}
          <div className="p-6.5">
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="bg-gray-2 text-left dark:bg-meta-4">
                    <th className="py-4 px-4 font-medium text-black dark:text-white">
                      Entidad
                    </th>
                    <th className="py-4 px-4 font-medium text-black dark:text-white text-center">
                      Listar
                    </th>
                    <th className="py-4 px-4 font-medium text-black dark:text-white text-center">
                      Ver/Editar
                    </th>
                    <th className="py-4 px-4 font-medium text-black dark:text-white text-center">
                      Crear
                    </th>
                    <th className="py-4 px-4 font-medium text-black dark:text-white text-center">
                      Actualizar
                    </th>
                    <th className="py-4 px-4 font-medium text-black dark:text-white text-center">
                      Eliminar
                    </th>
                    <th className="py-4 px-4 font-medium text-black dark:text-white text-center">
                      Todos
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(permissionsByEntity).map(([entity, entityPerms]) => {
                    const allEntityPerms = Object.values(entityPerms).filter(Boolean);
                    const assignedEntityPerms = allEntityPerms.filter(p => assignedPermissions.has(p!.id));
                    const allAssigned = allEntityPerms.length > 0 && assignedEntityPerms.length === allEntityPerms.length;
                    const someAssigned = assignedEntityPerms.length > 0;

                    return (
                      <tr key={entity} className="border-b border-stroke dark:border-strokedark">
                        <td className="py-5 px-4">
                          <span className="text-black dark:text-white font-medium">
                            {entity}
                          </span>
                        </td>
                        <td className="py-5 px-4 text-center">
                          {entityPerms.list && (
                            <input
                              type="checkbox"
                              checked={assignedPermissions.has(entityPerms.list.id)}
                              onChange={() => handlePermissionToggle(entityPerms.list!.id)}
                              disabled={saving}
                              className="w-5 h-5 cursor-pointer"
                            />
                          )}
                        </td>
                        <td className="py-5 px-4 text-center">
                          {entityPerms.edit && (
                            <input
                              type="checkbox"
                              checked={assignedPermissions.has(entityPerms.edit.id)}
                              onChange={() => handlePermissionToggle(entityPerms.edit!.id)}
                              disabled={saving}
                              className="w-5 h-5 cursor-pointer"
                            />
                          )}
                        </td>
                        <td className="py-5 px-4 text-center">
                          {entityPerms.create && (
                            <input
                              type="checkbox"
                              checked={assignedPermissions.has(entityPerms.create.id)}
                              onChange={() => handlePermissionToggle(entityPerms.create!.id)}
                              disabled={saving}
                              className="w-5 h-5 cursor-pointer"
                            />
                          )}
                        </td>
                        <td className="py-5 px-4 text-center">
                          {entityPerms.update && (
                            <input
                              type="checkbox"
                              checked={assignedPermissions.has(entityPerms.update.id)}
                              onChange={() => handlePermissionToggle(entityPerms.update!.id)}
                              disabled={saving}
                              className="w-5 h-5 cursor-pointer"
                            />
                          )}
                        </td>
                        <td className="py-5 px-4 text-center">
                          {entityPerms.delete && (
                            <input
                              type="checkbox"
                              checked={assignedPermissions.has(entityPerms.delete.id)}
                              onChange={() => handlePermissionToggle(entityPerms.delete!.id)}
                              disabled={saving}
                              className="w-5 h-5 cursor-pointer"
                            />
                          )}
                        </td>
                        <td className="py-5 px-4 text-center">
                          <input
                            type="checkbox"
                            checked={allAssigned}
                            ref={(input) => {
                              if (input) input.indeterminate = someAssigned && !allAssigned;
                            }}
                            onChange={(e) => handleEntityToggle(entity, e.target.checked)}
                            disabled={saving}
                            className="w-5 h-5 cursor-pointer"
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Summary */}
            <div className="mt-6 p-4 bg-gray-50 dark:bg-meta-4 rounded">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <strong>Resumen:</strong> {assignedPermissions.size} de {permissions.length} permisos asignados
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Los cambios se aplicarán automáticamente a todos los usuarios con este rol.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AdminGuard>
  );
};

export default BulkRolePermissionManager;