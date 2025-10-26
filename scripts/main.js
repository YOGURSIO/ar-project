window.addEventListener("load", () => {
    const markers = [
        {
            id: "mark1",
            element: document.getElementById("mark1"),
            clue: "Busca el mural más reciente... tras una buena comida y café claro.",
        },
        {
            id: "mark2",
            element: document.getElementById("mark2"),
            clue: "En la capilla muchos se arrodillan y piden al cielo. Tal vez deberias intentarlo...",
        },
        {
            id: "mark3",
            element: document.getElementById("mark3"),
            clue: "Casi terminas... busca el primero de todos y autor de todo esto.",
        },
    ];
    const marker_sound = new Audio("/assets/sounds/marker-found.mp3");
    marker_sound.volume = 1;
    const success_sound = new Audio("/assets/sounds/success.mp3");
    success_sound.volume = 1;

    let currentIndex = 0;
    let timerInterval = null;
    let startTime = null;

    // Referencias a los elementos ya definidos en el HTML
    const overlay = document.getElementById("overlay");
    const timerDisplay = document.getElementById("timer");
    const progressBar = document.getElementById("progress-bar");

    markers.forEach((m, i) => (m.element.object3D.visible = i === 0));

    const showMessage = (msg) => {
        overlay.textContent = msg;
        overlay.style.opacity = "1";
    };

    const hideMessage = () => {
        overlay.style.opacity = "0";
    };

     // --- Timer helpers ---
    timerInterval = undefined
    function startTimer() {
        if (timerInterval) return; // ya está corriendo
        startTime = Date.now();
        timerInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const minutes = String(Math.floor(elapsed / 60)).padStart(2, "0");
        const seconds = String(elapsed % 60).padStart(2, "0");
        timerDisplay.textContent = `⏱️ ${minutes}:${seconds}`;
        }, 1000);
    }

    function stopTimer() {
        clearInterval(timerInterval);
        timerInterval = null;
    }

    showMessage(
        ""
        + markers[0].clue);

    markers.forEach((marker, index) => {
        const box = marker.element.querySelector("a-box");

        // Cuando el marcador se detecta
        marker.element.addEventListener("markerFound", () => {
            console.log("Detectado:", marker.id);
            if (index === currentIndex) {
                nextMarker();
                marker_sound.currentTime = 0; // reinicia el audio
                marker_sound.play().catch((err) => console.warn("No se pudo reproducir el sonido:", err));
                
                if (index === 0 && !timerInterval) startTimer();
            }
        });
    });
    
    function nextMarker() {
        hideMessage();
        const progressPercent = ((currentIndex + 1) / markers.length) * 100;
        progressBar.style.width = `${progressPercent}%`;

        if (currentIndex + 1 < markers.length) {
            currentIndex++;
            markers[currentIndex].element.object3D.visible = true;
            showMessage("🔍 " + markers[currentIndex].clue);
        } else {
            success_sound.currentTime = 0; // reinicia el audio
            success_sound.play().catch((err) => console.warn("No se pudo reproducir el sonido:", err));
            stopTimer();
            showMessage("¡Felicidades! Has completado el recorrido.");
        }
    }
    alert("¡Bienvenido al Paseo por la UCU! Recuerda usar las escaleras si puedes, ¡Es lo más sano! \n Una vez encuentres el primer marcador el timer empezara a contar, ¡por lo que debes estar listo!")
});

