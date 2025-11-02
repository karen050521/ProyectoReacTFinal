// Test de zona horaria para verificar el fix
const testDate = "2024-11-02T10:00:00";

// Método anterior (problemático)
const originalDate = new Date(testDate);

// Método nuevo (corregido)
const cleanDateString = testDate.replace('Z', '').replace('+00:00', '');
const correctedDate = new Date(cleanDateString);

console.log("Fecha original del servidor:", testDate);
console.log("Método anterior (problemático):", originalDate.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
}));
console.log("Método nuevo (corregido):", correctedDate.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
}));

// Test para formateo de input
function formatDateForInput(dateString) {
    if (!dateString) return new Date().toISOString().slice(0, 16);
    
    try {
        const cleanDateString = dateString.replace('Z', '').replace('+00:00', '');
        const date = new Date(cleanDateString);
        
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    } catch {
        return new Date().toISOString().slice(0, 16);
    }
}

console.log("Para input datetime-local:", formatDateForInput(testDate));