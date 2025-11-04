import React from "react";
import { UserStorageManager } from "../utils/userStorageManager";
import { useAuth } from "../context/AuthContext";

const AuthTestComponent: React.FC = () => {
  const { currentUser } = useAuth();

  const testAndShowInfo = () => {
    console.log("🔍 Testing UserStorageManager...");
    UserStorageManager.debugInfo();
    
    console.log("🔍 AuthContext currentUser:", currentUser);
    
    console.log("🔍 Has valid user:", UserStorageManager.hasValidUser());
  };

  return (
    <div style={{ 
      background: '#e3f2fd', 
      padding: '15px', 
      margin: '10px', 
      borderRadius: '8px',
      border: '1px solid #1976d2'
    }}>
      <h4 style={{ color: '#1976d2', marginBottom: '10px' }}>🔧 Auth Testing (Opción 3)</h4>
      
      <div style={{ marginBottom: '10px' }}>
        <strong>Email desde AuthContext:</strong> {currentUser?.email || "No disponible"}
      </div>
      
      <div style={{ marginBottom: '10px' }}>
        <strong>¿Usuario válido?:</strong> {UserStorageManager.hasValidUser() ? "✅ Sí" : "❌ No"}
      </div>
      
      <button 
        onClick={testAndShowInfo}
        style={{
          background: '#1976d2',
          color: 'white',
          padding: '8px 16px',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        🔍 Debug Info en Consola
      </button>
    </div>
  );
};

export default AuthTestComponent;