import React from "react";
import GenericTable from "../../components/GenericTable";
import { Permission } from "../../models/Permission";
import { usePermissionController } from "../../controllers/usePermissionController";

import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const ListPermissions: React.FC = () => {
    const { 
        permissions, 
        loading, 
        error, 
        deletePermission,
        clearError 
    } = usePermissionController();
    
    const navigate = useNavigate();

    const handleAction = async (action: string, item: Permission) => {
        if (action === "edit") {
            console.log("Edit permission:", item);
            navigate(`/permissions/update/${item.id}`);
        } else if (action === "delete") {
            console.log("Delete permission:", item);
            Swal.fire({
                title: "Eliminación",
                text: "Está seguro de querer eliminar el registro?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Si, eliminar",
                cancelButtonText: "No"
            }).then(async (result) => {
                if (result.isConfirmed) {
                    const success = await deletePermission(item.id!);
                    if (success) {
                        Swal.fire({
                            title: "Eliminado",
                            text: "El registro se ha eliminado",
                            icon: "success"
                        });
                    } else {
                        Swal.fire({
                            title: "Error",
                            text: "No se pudo eliminar el registro",
                            icon: "error"
                        });
                    }
                }
            });
        }
    };

    return (
        <div>
            <h2>Permission List</h2>
            {error && (
                <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                    <button onClick={clearError} className="ml-2 underline">
                        Cerrar
                    </button>
                </div>
            )}
            
            {loading ? (
                <div className="flex justify-center items-center py-8">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
                    <span className="ml-2">Cargando permisos...</span>
                </div>
            ) : (
                <GenericTable
                    data={permissions}
                    columns={["id", "url", "method", "entity", "created_at", "updated_at"]}
                    actions={[
                        { name: "edit", label: "Edit" },
                        { name: "delete", label: "Delete" },
                    ]}
                    onAction={handleAction}
                />
            )}
        </div>
    );
};

export default ListPermissions;