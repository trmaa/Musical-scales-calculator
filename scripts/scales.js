let output_div = document.querySelector("#notes_div");

const LA_F = 220;
const note_names = [ "Do", "Do#", "Re", "Re#", 
					 "Mi", "Fa", "Fa#", "Sol", 
					 "Sol#", "La", "La#", "Si"];

function pythagorean_new(root_note) {
	return "comming soon";	
}

function just_new(root_note) {
    let scale = {};

    const intervals = [2, 4, 5, 7, 9, 11, 12];

    let root_index = note_names.indexOf(root_note)-2;
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
		if (i == 7 || i == 14) {
            current_octave += 1;
		}

        if (current_index >= note_names.length) {
            current_index -= note_names.length;
        }

        let note_id = note_names[current_index] + current_octave;

        let frequency = root_f * Math.pow(2, intervals[i % intervals.length] / 12);
		frequency += frequency*current_octave;
        scale[note_id] = parseFloat(frequency.toFixed(2));
    }

	let sixth_index = root_index - 1;
	sixth_index +=  sixth_index < 0 ? 12: 0;
	let sixth = note_names[sixth_index];
	scale.name = "Escala de " + root_note + " major o " + sixth + " menor (afinació justa):";

    return scale;
}

function scale_new() {
	let root_note = document.querySelector("#scale_select").value;	
	let tunning_system = document.querySelector("#tunning_select").value;	

	return tunning_system == "Pitagòrica" ?
		pythagorean_new(root_note): just_new(root_note);
} 

const push_new_scale = () => {
	let scale = scale_new();
    
    let html_content = "";
    html_content += "<div class='scale_div'>"
    html_content += `<label>${scale.name}</label> <br></br>`;
	Object.entries(scale).forEach(([key, value]) => {
		if (key != "name") {
			let inner = `<label>${key}:</label> ${parseInt(value)}`;
			html_content += `${inner} <input type="checkbox" value="${value}"></input>, `;
		}
	});
    html_content += "<button class='errase_button'>Eliminar</button>";
    html_content += `<br></br>`;
    html_content += `</div>`;

    output_div.innerHTML += html_content;
    output_div.innerHTML += "<br>";
};

let new_scale_button = document.querySelector("#new_button");
new_scale_button.addEventListener("click", push_new_scale);

output_div.addEventListener("click", function(event) {
    if (event.target.classList.contains("errase_button")) {
        event.target.closest(".scale_div").remove();
    }
});
