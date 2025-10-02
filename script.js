// Importar Firebase desde firebase.js
import { db } from "./firebase.js";
import { collection, addDoc, doc, updateDoc } 
  from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

let segundos = 0;
let intervalo;
let startTime;
let intentoId;

// Obtener tema desde la URL (?tema=nombre)
const params = new URLSearchParams(window.location.search);
const tema = params.get("tema");

// Referencias DOM
const registroForm = document.getElementById("formRegistro");
const registroDiv = document.getElementById("registro");
const contenedorDeber = document.getElementById("contenedorDeber");
const contenedor = document.getElementById("contenedor");
const titulo = document.getElementById("titulo");

// Función de temporizador
function iniciarTimer() {
  intervalo = setInterval(() => {
    segundos++;
    document.getElementById("tiempo").innerText = segundos;
  }, 1000);
}

// Cargar deberes desde JSON local
fetch("deberes.json")
  .then(res => res.json())
  .then(data => {
    const deber = data[tema];
    if (!deber) {
      titulo.innerText = "Deber no encontrado: " + tema;
      return;
    }
    titulo.innerText = deber.titulo;

    // Evento de registro rápido
    registroForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const nombre = document.getElementById("nombre").value.trim();
      const apellido = document.getElementById("apellido").value.trim();
      const correo = document.getElementById("correo").value.trim();

      if (!correo.endsWith("@tudominio.edu")) {
        document.getElementById("mensaje").innerText = 
          "Debes usar tu correo institucional (@tudominio.edu)";
        return;
      }

      try {
        // Crear documento en Firestore
        const docRef = await addDoc(collection(db, "intentos"), {
          nombre,
          apellido,
          correo,
          tema,
          fechaInicio: new Date()
        });
        intentoId = docRef.id;
        startTime = Date.now();

        // Ocultar registro y mostrar deber
        registroDiv.style.display = "none";
        contenedorDeber.style.display = "block";

        // Iniciar temporizador
        iniciarTimer();

        // Renderizar preguntas
        deber.preguntas.forEach((p, i) => {
          const div = document.createElement("div");
          div.classList.add("pregunta");
          div.dataset.correcta = p.correcta;

          const enunciado = document.createElement("p");
          enunciado.innerHTML = (i + 1) + ". " + p.enunciado;
          div.appendChild(enunciado);

          p.opciones.forEach((op, j) => {
            const label = document.createElement("label");
            label.innerHTML = `<input type="radio" name="p${i}" value="${j}"> ${op}`;
            div.appendChild(label);
            div.appendChild(document.createElement("br"));
          });

          const btnPista = document.createElement("button");
          btnPista.innerText = "Ver pista";
          div.appendChild(btnPista);

          const pista = document.createElement("div");
          pista.classList.add("pista");
          pista.innerText = p.pista || "Sin pista.";
          pista.style.display = "none";
          div.appendChild(pista);

          btnPista.onclick = () => { pista.style.display = "block"; };

          const retro = document.createElement("div");
          retro.classList.add("retro");
          div.appendChild(retro);

          contenedor.appendChild(div);
        });

      } catch (error) {
        document.getElementById("mensaje").innerText = "Error al registrar: " + error.message;
      }
    });

    // Botón calificar
    document.getElementById("btnCalificar").onclick = async () => {
      clearInterval(intervalo);
      const endTime = Date.now();
      const tiempo = Math.round((endTime - startTime) / 1000);

      const preguntas = document.querySelectorAll(".pregunta");
      const respuestas = {};
      let calificacion = 0;

      preguntas.forEach((div, i) => {
        const correcta = parseInt(div.dataset.correcta);
        const seleccionada = div.querySelector("input:checked");
        const retro = div.querySelector(".retro");

        if (!seleccionada) {
          retro.innerText = "No respondiste esta pregunta.";
          retro.style.color = "orange";
          respuestas[i] = null;
        } else if (parseInt(seleccionada.value) === correcta) {
          retro.innerText = deber.preguntas[i].retro[correcta] || "¡Correcto!";
          retro.style.color = "green";
          respuestas[i] = parseInt(seleccionada.value);
          calificacion++;
        } else {
          const idx = parseInt(seleccionada.value);
          retro.innerText = deber.preguntas[i].retro[idx] || "Incorrecto.";
          retro.style.color = "red";
          respuestas[i] = idx;
        }
      });

      // Guardar resultados en Firestore
      if (intentoId) {
        try {
          await updateDoc(doc(db, "intentos", intentoId), {
            respuestas,
            calificacion,
            tiempo,
            fechaFin: new Date()
          });
        } catch (err) {
          console.error("Error guardando resultados:", err);
        }
      }

      alert(`Has terminado en ${tiempo} segundos. Calificación: ${calificacion}/${preguntas.length}`);
    };

  })
  .catch(err => {
    console.error(err);
    titulo.innerText = "Error cargando deberes.json. Revisa la consola.";
  });
