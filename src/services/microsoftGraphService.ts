import { graphConfig } from '../config/msalConfig';

/**
 * Interfaz para los datos del usuario de Microsoft
 */
export interface MicrosoftUser {
  id: string;
  displayName: string;
  givenName: string;
  surname: string;
  userPrincipalName: string;
  mail: string;
  jobTitle?: string;
  officeLocation?: string;
  mobilePhone?: string;
  businessPhones?: string[];
}

/**
 * Obtiene los datos del perfil del usuario desde Microsoft Graph API
 * @param accessToken Token de acceso de Microsoft
 */
export async function callMsGraph(accessToken: string): Promise<MicrosoftUser> {
  const headers = new Headers();
  const bearer = `Bearer ${accessToken}`;

  headers.append('Authorization', bearer);

  const options = {
    method: 'GET',
    headers: headers,
  };

  try {
    const response = await fetch(graphConfig.graphMeEndpoint, options);
    
    if (!response.ok) {
      throw new Error(`Error al obtener datos del usuario: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al llamar a Microsoft Graph:', error);
    throw error;
  }
}

/**
 * Obtiene la foto de perfil del usuario desde Microsoft Graph API
 * @param accessToken Token de acceso de Microsoft
 */
export async function getUserPhoto(accessToken: string): Promise<string | null> {
  const headers = new Headers();
  const bearer = `Bearer ${accessToken}`;

  headers.append('Authorization', bearer);

  const options = {
    method: 'GET',
    headers: headers,
  };

  try {
    const response = await fetch(graphConfig.graphMePhotoEndpoint, options);
    
    if (!response.ok) {
      console.warn('No se pudo obtener la foto del usuario');
      return null;
    }

    const blob = await response.blob();
    const imageUrl = URL.createObjectURL(blob);
    return imageUrl;
  } catch (error) {
    console.error('Error al obtener foto del usuario:', error);
    return null;
  }
}

