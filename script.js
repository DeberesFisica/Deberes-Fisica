// script.js - Lógica para cargar deberes, temporizador, pistas y calificación
let segundos = 0;
let intervalo;
const params = new URLSearchParams(window.location.search);
const tema = params.get("tema");

function iniciarTimer() {
  intervalo = setInterval(() => {
    segundos++;
    document.getElementById("tiempo").innerText = segundos;
  }, 1000);
}

// Intentamos cargar el JSON con fetch. Nota: esto requiere servir los archivos por HTTP.
// Si abres el archivo con file:// en Chrome/Edge puede bloquearse. Usa un servidor local (ver README).
fetch("deberes.json")
  .then(res => {
    if (!res.ok) throw new Error("No se pudo cargar deberes.json: " + res.status);
    return res.json();
  })
  .then(data => {
    const deber = data[tema];
    if (!deber) {
      document.getElementById("titulo").innerText = "Deber no encontrado: " + tema;
      return;
    }

    document.getElementById("titulo").innerText = deber.titulo;
    const contenedor = document.getElementById("contenedor");

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
      div.appendChild(pista);

      btnPista.onclick = () => { pista.style.display = "block"; };

      const retro = document.createElement("div");
      retro.classList.add("retro");
      div.appendChild(retro);

      contenedor.appendChild(div);
    });

    document.getElementById("btnCalificar").onclick = () => {
      clearInterval(intervalo);
      const preguntas = document.querySelectorAll(".pregunta");

      preguntas.forEach((div, i) => {
        const correcta = parseInt(div.dataset.correcta);
        const seleccionada = div.querySelector("input:checked");
        const retro = div.querySelector(".retro");

        if (!seleccionada) {
          retro.innerText = "No respondiste esta pregunta.";
          retro.style.color = "orange";
        } else if (parseInt(seleccionada.value) === correcta) {
          retro.innerText = deber.preguntas[i].retro[correcta] || "Correcto!";
          retro.style.color = "green";
        } else {
          const idx = parseInt(seleccionada.value);
          retro.innerText = deber.preguntas[i].retro[idx] || "Incorrecto.";
          retro.style.color = "red";
        }
      });

      alert("Has terminado en " + segundos + " segundos.");
    };

    iniciarTimer();
  })
  .catch(err => {
    console.error(err);
    document.getElementById("titulo").innerText = "Error cargando deberes.json. Revisa la consola.";
  });
