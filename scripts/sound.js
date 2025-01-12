let playing = false;
let volume = 0.5;
let oscillators = {};
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

function play_sound(note_id, frequency) {
    if (oscillators[note_id]) return;

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    gainNode.gain.value = volume;

    oscillator.start();

    oscillators[note_id] = { oscillator, gainNode };
}

function stop_sound(note_id) {
    if (oscillators[note_id]) {
        oscillators[note_id].oscillator.stop();
        oscillators[note_id].oscillator.disconnect();
        oscillators[note_id].gainNode.disconnect();
        delete oscillators[note_id];
    }
}

function stop_all_sounds() {
    Object.keys(oscillators).forEach(note_id => stop_sound(note_id));
}

let volume_slider = document.querySelector("#volume_slider");
volume_slider.addEventListener("input", (e) => {
    volume = e.target.value / 100;
    Object.values(oscillators).forEach(({ gainNode }) => {
        gainNode.gain.value = volume;
    });
});

document.querySelector("#notes_div").addEventListener("change", function (event) {
    if (event.target.classList.contains("note_ckeckb")) {
        const note_id = event.target.dataset.noteId;
        const frequency = parseFloat(event.target.value);

        if (event.target.checked && playing) {
            play_sound(note_id, frequency);
        } else {
            stop_sound(note_id);
        }
    }
});
