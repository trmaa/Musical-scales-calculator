let output_div = document.querySelector("#notes_div");

const LA_F = 440;
const note_names = ["Do", "Do#", "Re", "Re#", "Mi", "Fa", "Fa#", "Sol", "Sol#", "La", "La#", "Si"];

function pythagorean_new(root_note) {
    let scale = {};
    const pythagorean_ratios = [1, 3 / 2, 9 / 8, 3 / 2, 9 / 8, 3 / 2, 9 / 8];
    const root_index = note_names.indexOf(root_note) - 2;
    if (root_index === -1) return {};

    let diff = root_index - note_names.indexOf("La");
    diff -= diff > 0 ? 12 : 0;

    let root_f = LA_F * Math.pow(2, diff / 12);

    let current_index = root_index;
    let current_octave = 0;

    for (let i = 0; i < 15; i++) {
        if (i === 3 || i === 7 || i === 10 || i === 14) {
            current_index += 1;
        } else {
            current_index += 2;
        }
        if (i === 7 || i === 14) {
            current_octave += 1;
        }

        if (current_index >= note_names.length) {
            current_index -= note_names.length;
        }

        let note_id = note_names[current_index] + current_octave;
        
        let frequency = root_f * pythagorean_ratios[i % pythagorean_ratios.length];
        frequency *= Math.pow(2, current_octave);

        scale[note_id] = parseFloat(frequency.toFixed(2));
    }

    scale.name = `Escala de ${root_note} major (afinació pitagòrica):`;

    return scale;
}

function just_new(root_note) {
    let scale = {};
    const intervals = [2, 4, 6, 7, 9, 11, 13];
    let root_index = note_names.indexOf(root_note) - 2;
    if (root_index === -1) return {};
    
    let diff = root_index - note_names.indexOf("La");
    diff -= diff > 0 ? 12 : 0;
    
    let root_f = LA_F * Math.pow(2, diff / 12); 

    let current_index = root_index;
    let current_octave = 0;

    for (let i = 0; i < 15; i++) {
        if (i === 3 || i === 7 || i === 10 || i === 14) {
            current_index += 1;
        } else {
            current_index += 2;
        }
        if (i === 7 || i === 14) {
            current_octave += 1;
        }

        if (current_index >= note_names.length) {
            current_index -= note_names.length;
        }

        let note_id = note_names[current_index] + current_octave;
        
        let frequency = root_f * Math.pow(2, (intervals[i % intervals.length]) / 12);
        frequency *= Math.pow(2, current_octave);

        scale[note_id] = parseFloat(frequency.toFixed(2));
    }

    let sixth_index = root_index - 1;
    sixth_index += sixth_index < 0 ? 12 : 0;
    let sixth = note_names[sixth_index];
    scale.name = `Escala de ${root_note} major o ${sixth} menor (afinació justa):`;

    return scale;
}

function scale_new() {
    let root_note = document.querySelector("#scale_select").value;	
    let tuning_system = document.querySelector("#tunning_select").value;	
    
    return tuning_system === "Pitagòrica" ? pythagorean_new(root_note) : just_new(root_note);
}

function push_new_scale() {
    let scale = scale_new();
    let html_content = "<div class='scale_div'>";
    html_content += `<label>${scale.name}</label><br>`;

    Object.entries(scale).forEach(([key, value]) => {
        if (key !== "name") {
            html_content += `
                <label>${key}:</label> ${parseInt(value)}
                <input class="note_ckeckb" type="checkbox" value="${value}" data-note-id="${key}">
            `;
        }
    });

    html_content += "<button class='erase_button'>Eliminar</button><br></div>";
    output_div.innerHTML += html_content;
}

output_div.addEventListener("click", function(event) {
    if (event.target.classList.contains("erase_button")) {
        let scale_div = event.target.closest(".scale_div");
        scale_div.querySelectorAll(".note_ckeckb:checked").forEach(note_checkb => {
            stop_sound(note_checkb.dataset.noteId);
        });
        scale_div.remove();
    }
});

let new_scale_button = document.querySelector("#new_button");
new_scale_button.addEventListener("click", push_new_scale);

let play_button = document.querySelector("#play_button");
play_button.addEventListener("click", () => {
    playing = !playing;
    play_button.className = playing ? "stop_button" : "play_button";
    play_button.innerHTML = playing ? "Stop" : "Play";

    if (!playing) {
        stop_all_sounds();
    } else {
        document.querySelectorAll(".note_ckeckb:checked").forEach(note_checkb => {
            play_sound(note_checkb.dataset.noteId, parseFloat(note_checkb.value));
        });
    }
});
