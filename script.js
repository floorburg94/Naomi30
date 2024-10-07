// Controleer of het script geladen is
console.log("Script geladen!");

// Probeer de kaart te initialiseren
var map = L.map('map').setView([52.3676, 4.9041], 13);  // Amsterdam coördinaten
console.log("Kaart succesvol geïnitialiseerd!");

// Voeg OpenStreetMap tegels toe aan de kaart
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    errorTileUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e0/SNice.svg'  // Tijdelijke fout-tegel
}).addTo(map);
console.log("Tegels succesvol geladen!");

// Array van locaties met coördinaten, titels, beschrijvingen en audiobestanden
var locations = [
    {
        coords: [52.373169, 4.890660], 
        title: 'Locatie 1',
        description: 'Beschrijving voor locatie 1.',
        audio: 'audio/audio1.mp3'
    },
    {
        coords: [52.370216, 4.895168], 
        title: 'Locatie 2',
        description: 'Beschrijving voor locatie 2.',
        audio: 'audio/audio2.mp3'
    }
];

// Voeg markers toe en verbind deze met de pop-up met audiocontroller
locations.forEach(function(location) {
    var marker = L.marker(location.coords).addTo(map);
    console.log("Marker toegevoegd op coördinaten:", location.coords);

    // HTML inhoud voor de pop-up
    var popupContent = `
        <div class="popup-container">
            <h2>${location.title}</h2>
            <p>${location.description}</p>
            <audio id="audio-${location.coords[0]}" src="${location.audio}" preload="auto"></audio>
            <div class="audio-controls">
                <button class="play-btn" onclick="playPause('${location.coords[0]}')">Play</button>
                <input type="range" class="slider" id="slider-${location.coords[0]}" value="0" max="100" onchange="seekAudio('${location.coords[0]}')">
            </div>

        </div>
    `;

    // Voeg pop-up toe aan de marker
    marker.bindPopup(popupContent);

    // Voeg event toe wanneer de pop-up wordt geopend om de slider te beheren
    marker.on('popupopen', function() {
        var audio = document.getElementById(`audio-${location.coords[0]}`);
        var slider = document.getElementById(`slider-${location.coords[0]}`);

        audio.ontimeupdate = function() {
            var value = (audio.currentTime / audio.duration) * 100;
            slider.value = value || 0;
        };
    });
});

// Functie om play/pause van audio te beheren
function playPause(id) {
    var audio = document.getElementById(`audio-${id}`);
    var playButton = document.querySelector(`.play-btn`);

    if (audio.paused) {
        audio.play();
        playButton.textContent = 'Pause';
    } else {
        audio.pause();
        playButton.textContent = 'Play';
    }
}

// Functie om audio te zoeken met slider
function seekAudio(id) {
    var audio = document.getElementById(`audio-${id}`);
    var slider = document.getElementById(`slider-${id}`);

    var seekTime = (slider.value / 100) * audio.duration;
    audio.currentTime = seekTime;
}

// // Functie om de pop-up te sluiten
// function closePopup() {
//     map.closePopup();
// }
