# 🚨 SOLUCIÓN CORS - Backend Flask

## Opción 1: Instalar flask-cors
```bash
pip install flask-cors
```

## Opción 2: Agregar en tu app.py o __init__.py

```python
from flask import Flask
from flask_cors import CORS

app = Flask(__name__)

# ✅ Configuración CORS para desarrollo
CORS(app, origins=[
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:3000'  # Por si usas otros puertos
])

# 🔄 O configuración más específica
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:5173"],
        "methods": ["GET", "POST", "PUT", "DELETE"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})
```

## Opción 3: Headers manuales (si no puedes instalar flask-cors)

```python
from flask import Flask

app = Flask(__name__)

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', 'http://localhost:5173')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

# Manejar OPTIONS requests (preflight)
@app.before_request
def handle_preflight():
    if request.method == "OPTIONS":
        response = make_response()
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:5173")
        response.headers.add('Access-Control-Allow-Headers', "Content-Type,Authorization")
        response.headers.add('Access-Control-Allow-Methods', "GET,PUT,POST,DELETE,OPTIONS")
        return response
```

## 🎯 Aplicar la solución:

1. Abre tu backend en `ms_security/`
2. Encuentra el archivo principal (app.py o __init__.py)
3. Agrega la configuración CORS
4. Reinicia tu servidor Flask
5. Intenta crear una contraseña de nuevo

## ✅ Verificar que funciona:
- El dropdown debe mostrar usuarios reales de tu API
- No debe haber errores de CORS en consola
- La creación de contraseñas debe funcionar