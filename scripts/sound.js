let scales = document.getElementsByClassName("scale_div");

let playing = false;

const play_or_pause = () => {
    playing = !playing;

    console.log(scales[0])

    let class_name = play_button.className;
    if (class_name == "play_button") {
        play_button.className = "stop_button";
        play_button.innerHTML = "Stop";
    } else if (class_name == "stop_button") { 
        play_button.className = "play_button";
        play_button.innerHTML = "Play";
    }
};

let play_button = document.querySelector("#play_button");
play_button.addEventListener("click", play_or_pause);
