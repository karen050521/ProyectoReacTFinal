export interface Password {
    id?: number;              // Identificador único del registro
    user_id: number;          // Usuario propietario de esta contraseña
    content: string;          // Contraseña encriptada/hasheada
    startAt: string;          // Cuándo INICIA la validez de esta contraseña
    endAt?: string | null;    // Cuándo EXPIRA esta contraseña (opcional)
    created_at?: string;      // Metadatos: cuándo se creó el registro
    updated_at?: string;      // Metadatos: última modificación
}