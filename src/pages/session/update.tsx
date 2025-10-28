import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { getSessionById, updateSession } from "../../services/sessionService";
import Swal from "sweetalert2";

import { Session } from '../../models/Session';
import SessionFormValidator from '../../components/session/sessionForm';
import Breadcrumb from "../../components/Breadcrumb";

const UpdateSessionPage = () => {
    const { id } = useParams(); // Obtener el ID de la URL
    
    const navigate = useNavigate();
    const [session, setSession] = useState<Session | null>(null);

    // Cargar datos de la sesión después del montaje
    useEffect(() => {
        console.log("Id->"+id)
        const fetchSession = async () => {
            if (!id) return; // Evitar errores si el ID no está disponible
            const sessionData = await getSessionById(id);
            setSession(sessionData);
        };

        fetchSession();
    }, [id]);

    const handleUpdateSession = async (theSession: Session) => {
        try {
            const updatedSession = await updateSession(theSession.id || "", theSession);
            if (updatedSession) {
                Swal.fire({
                    title: "Completado",
                    text: "Se ha actualizado correctamente el registro",
                    icon: "success",
                    timer: 3000
                });
                navigate("/sessions"); // Redirección en React Router
            } else {
                Swal.fire({
                    title: "Error",
                    text: "Existe un problema al momento de actualizar el registro",
                    icon: "error",
                    timer: 3000
                });
            }
        } catch (error) {
            Swal.fire({
                title: "Error",
                text: "Existe un problema al momento de actualizar el registro",
                icon: "error",
                timer: 3000
            });
        }
    };

    if (!session) {
        return <div>Cargando...</div>; // Muestra un mensaje de carga mientras se obtienen los datos
    }

    return (
        <>
            <Breadcrumb pageName="Actualizar Sesión" />
            <SessionFormValidator
                handleUpdate={handleUpdateSession}
                mode={2} // 2 significa actualización
                session={session}
            />
        </>
    );
};

export default UpdateSessionPage;
