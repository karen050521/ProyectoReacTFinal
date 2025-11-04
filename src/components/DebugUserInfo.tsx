import React from "react";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { useAuth } from "../context/AuthContext";

const DebugUserInfo: React.FC = () => {
  const { currentUser, email, sources } = useCurrentUser();
  const { currentUser: authUser } = useAuth();
  
  return (
    <div style={{ 
      background: '#f0f0f0', 
      padding: '10px', 
      margin: '10px', 
      borderRadius: '5px',
      fontSize: '12px'
    }}>
      <h4>🔍 Debug Info Usuario:</h4>
      <p><strong>Email:</strong> {email || "No disponible"}</p>
      <p><strong>AuthContext User:</strong> {authUser ? JSON.stringify(authUser, null, 2) : "null"}</p>
      <p><strong>Current User:</strong> {currentUser ? JSON.stringify(currentUser, null, 2) : "null"}</p>
      <p><strong>Fuentes disponibles:</strong></p>
      <ul>
        <li>AuthContext: {sources.authContext ? "✅" : "❌"}</li>
        <li>Redux Store: {sources.reduxStore ? "✅" : "❌"}</li>
        <li>LocalStorage: {sources.localStorage ? "✅" : "❌"}</li>
      </ul>
      
      <h5>LocalStorage actual:</h5>
      <pre style={{ fontSize: '10px', overflow: 'auto', maxHeight: '100px' }}>
        {JSON.stringify({
          user: localStorage.getItem("user"),
          profile: localStorage.getItem("profile"),
          auth: localStorage.getItem("auth"),
          session: localStorage.getItem("session")
        }, null, 2)}
      </pre>
    </div>
  );
};

export default DebugUserInfo;