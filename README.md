INSTRUCCIONES - Mini aula virtual
---------------------------------
Archivos incluidos:
- index.html
- deber.html
- script.js
- deberes.json

PASOS RÁPIDOS (manera recomendada usando servidor local):
1) Abre una terminal/cmd.
2) Navega a la carpeta donde descomprimiste o copiaste estos archivos.
   Ejemplo: cd ruta/al/directorio/aula
3) Si tienes Python 3 instalado, ejecuta:
     python3 -m http.server 8000
   (en Windows puede ser: py -3 -m http.server 8000)
   Alternativa con Node (si tienes npm):
     npx http-server -p 8000
   O usa la extensión Live Server en VSCode.
4) Abre en tu navegador: http://localhost:8000/index.html

NOTA SOBRE fetch() y archivos locales:
- El archivo script.js usa fetch('deberes.json') para cargar las preguntas.
  Muchos navegadores bloquean fetch cuando se abre el HTML con file://.
  Por eso es mejor usar un servidor local (pasos arriba).

OPCIÓN SIN SERVIDOR:
- Si no quieres usar un servidor, abre script.js y reemplaza la llamada fetch(...)
  por:
    const data = /* pega aquí el JSON completo (contenido de deberes.json) */;
    const deber = data[tema];
  y continua con el resto del código (esto evita la necesidad de fetch).

¿Quieres que haga una versión que guarde resultados en localStorage o que genere un ZIP listo para descargar?  
