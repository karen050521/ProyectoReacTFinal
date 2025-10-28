"use client"
import { Session } from '../../models/Session';
import SessionFormValidator from '../../components/session/sessionForm'; 

import Swal from 'sweetalert2';
import  { createSession }  from "../../services/sessionService";
import Breadcrumb from '../../components/Breadcrumb';
import { useNavigate } from "react-router-dom";

const CreateSessionPage = () => {
    const navigate = useNavigate();

    // Lógica de creación
    const handleCreateSession = async (session: Session) => {
        try {
            const createdSession = await createSession(session);
            if (createdSession) {
                Swal.fire({
                    title: "Completado",
                    text: "Se ha creado correctamente el registro",
                    icon: "success",
                    timer: 3000
                })
                console.log("Sesión creada con éxito:", createdSession);
                navigate("/sessions");
            } else {
                Swal.fire({
                    title: "Error",
                    text: "Existe un problema al momento de crear el registro",
                    icon: "error",
                    timer: 3000
                })
            }
        } catch (error) {
            Swal.fire({
                title: "Error",
                text: "Existe un problema al momento de crear el registro",
                icon: "error",
                timer: 3000
            })
        }
    };

    return (
        <div>
            <h2>Create Session</h2>
            <Breadcrumb pageName="Crear Sesión" />
            <SessionFormValidator
                handleCreate={handleCreateSession}
                mode={1} // 1 significa creación
            />
        </div>
    );
};

export default CreateSessionPage;
