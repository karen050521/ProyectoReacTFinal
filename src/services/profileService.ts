import api from "../interceptors/axiosInterceptor";
import type { Profile } from "../models/Profile";

const RAW_API_BASE_PROF: string | undefined = (import.meta as any).env?.VITE_API_URL || (import.meta as any).VITE_API_URL || (import.meta as any).env?.CLASES_NUBES || (import.meta as any).CLASES_NUBES || undefined;
const API_BASE_PROF = RAW_API_BASE_PROF ? RAW_API_BASE_PROF.replace(/\/$/, '') : '';
const API_URL = API_BASE_PROF ? `${API_BASE_PROF}/profiles` : '/profiles';

/**
 * Helper function to convert Profile data to FormData
 * Usado porque el backend espera multipart/form-data para manejar archivos
 */
function profileToFormData(profile: Partial<Profile>, photoFile?: File): FormData {
    const formData = new FormData();
    
    if (profile.user_id !== undefined) {
        formData.append('user_id', profile.user_id.toString());
    }
    
    if (profile.phone !== undefined && profile.phone !== null) {
        formData.append('phone', profile.phone);
    }
    
    // Si hay un archivo de foto, agregarlo
    if (photoFile) {
        formData.append('photo', photoFile);
    } else if (profile.photo !== undefined && profile.photo !== null && typeof profile.photo === 'string') {
        // Si solo hay una URL de foto (string), agregarla
        formData.append('photo', profile.photo);
    }
    
    return formData;
}

class ProfileService {
    async getProfiles(): Promise<Profile[]> {
        try {
            console.debug('ProfileService.getProfiles -> API_URL=', API_URL);
            const response = await api.get<Profile[]>('/profiles');
            console.debug('ProfileService.getProfiles -> status=', response.status, 'count=', Array.isArray(response.data) ? response.data.length : 0);
            return response.data;
        } catch (error) {
            console.error("Error al obtener perfiles:", error);
            return [];
        }
    }

    async getProfileById(id: number): Promise<Profile | null> {
        try {
            const response = await api.get<Profile>(`/profiles/${id}`);
            return response.data;
        } catch (error) {
            console.error("Perfil no encontrado:", error);
            return null;
        }
    }

    async getProfileByUserId(userId: number): Promise<Profile | null> {
        try {
            console.debug('ProfileService.getProfileByUserId -> userId=', userId);
            const endpoint = `/profiles/user/${userId}`;
            console.debug('ProfileService.getProfileByUserId -> endpoint=', endpoint);
            const response = await api.get<Profile>(endpoint);
            console.debug('ProfileService.getProfileByUserId -> status=', response.status, 'data=', response.data);
            return response.data;
        } catch (error) {
            console.error("Perfil de usuario no encontrado:", error);
            return null;
        }
    }

    async createProfile(profile: Omit<Profile, "id">, photoFile?: File): Promise<Profile | null> {
        try {
            console.debug('ProfileService.createProfile -> profile=', profile);
            const formData = profileToFormData(profile, photoFile);
            
            // Log FormData entries for debugging
            console.debug('FormData entries:');
            for (const [key, value] of formData.entries()) {
                console.debug(`  ${key}:`, value);
            }
            
            const response = await api.post<Profile>('/profiles', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.debug('ProfileService.createProfile -> success, data=', response.data);
            return response.data;
        } catch (error: any) {
            console.error("Error al crear perfil:", error);
            console.error("Error details:", error.response?.data);
            return null;
        }
    }

    async updateProfile(id: number, profile: Partial<Profile>, photoFile?: File): Promise<Profile | null> {
        try {
            console.debug('ProfileService.updateProfile -> id=', id, 'profile=', profile);
            const formData = profileToFormData(profile, photoFile);
            
            // Log FormData entries for debugging
            console.debug('FormData entries:');
            for (const [key, value] of formData.entries()) {
                console.debug(`  ${key}:`, value);
            }
            
            const response = await api.put<Profile>(`/profiles/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.debug('ProfileService.updateProfile -> success, data=', response.data);
            return response.data;
        } catch (error: any) {
            console.error("Error al actualizar perfil:", error);
            console.error("Error details:", error.response?.data);
            return null;
        }
    }

    async createProfileByUserId(userId: number, profile: Omit<Profile, "id" | "user_id">, photoFile?: File): Promise<Profile | null> {
        try {
            console.debug('ProfileService.createProfileByUserId -> userId=', userId, 'profile=', profile);
            const profileWithUserId = { ...profile, user_id: userId };
            const formData = profileToFormData(profileWithUserId, photoFile);
            
            // Log FormData entries for debugging
            console.debug('FormData entries:');
            for (const [key, value] of formData.entries()) {
                console.debug(`  ${key}:`, value);
            }
            
            const response = await api.post<Profile>(`/profiles/user/${userId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.debug('ProfileService.createProfileByUserId -> success, data=', response.data);
            return response.data;
        } catch (error: any) {
            console.error("Error al crear perfil por userId:", error);
            console.error("Error details:", error.response?.data);
            return null;
        }
    }

    async updateProfileByUserId(userId: number, profile: Partial<Profile>, photoFile?: File): Promise<Profile | null> {
        try {
            console.debug('ProfileService.updateProfileByUserId -> userId=', userId, 'profile=', profile);
            const formData = profileToFormData(profile, photoFile);
            
            // Log FormData entries for debugging
            console.debug('FormData entries:');
            for (const [key, value] of formData.entries()) {
                console.debug(`  ${key}:`, value);
            }
            
            // Usar POST en /profiles/user/:userId para actualizar (algunos backends usan POST para updates)
            const response = await api.post<Profile>(`/profiles/user/${userId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.debug('ProfileService.updateProfileByUserId -> success, data=', response.data);
            return response.data;
        } catch (error: any) {
            console.error("Error al actualizar perfil por userId:", error);
            console.error("Error details:", error.response?.data);
            return null;
        }
    }

    async deleteProfile(id: number): Promise<boolean> {
        try {
            await api.delete(`/profiles/${id}`);
            return true;
        } catch (error) {
            console.error("Error al eliminar perfil:", error);
            return false;
        }
    }
}

// Exportamos una instancia de la clase para reutilizarla
export const profileService = new ProfileService();

// Named exports para compatibilidad con imports existentes
export const getProfiles = () => profileService.getProfiles();
export const getProfileById = (id: number) => profileService.getProfileById(id);
export const getProfileByUserId = (userId: number) => profileService.getProfileByUserId(userId);
export const createProfile = (profile: Omit<Profile, "id">, photoFile?: File) => 
    profileService.createProfile(profile, photoFile);
export const updateProfile = (id: number, profile: Partial<Profile>, photoFile?: File) => 
    profileService.updateProfile(id, profile, photoFile);
export const createProfileByUserId = (userId: number, profile: Omit<Profile, "id" | "user_id">, photoFile?: File) => 
    profileService.createProfileByUserId(userId, profile, photoFile);
export const updateProfileByUserId = (userId: number, profile: Partial<Profile>, photoFile?: File) => 
    profileService.updateProfileByUserId(userId, profile, photoFile);
export const deleteProfile = (id: number) => profileService.deleteProfile(id);
