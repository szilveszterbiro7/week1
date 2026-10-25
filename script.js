const soundcards=document.querySelectorAll ('.sound-card');
const mastervolume=document.getElementById ('master-volume');
const mastertoggle=document.getElementById ('master-toggle');
const presets=document.querySelectorAll ('preset-btn');
const timers=document.querySelectorAll ('timer-buttons button');
const timerdisplay=document.getElementById ('timer-display');
let mastermuted=false;
let activetimer=null;
soundcards.forEach(card=> {
    const audio=card.querySelector('audio');
    const slider=card.querySelector('volume-slider');
    const togglebutton=card.querySelector('toggle-btn');
    const soundname=card.dataset.sound;
    slider.addEventListener('input', () =>{
        const volume=slider.value/100;
        const mastervol=mastervolume.value/100;
        audio.volume=volume*mastervol;
        if (slider.value>0) {
            if (audio.paused) {
                audio.play().catch(error=>console.log("Audio blocked:", error));            
            }
            togglebutton.classList.add('active');
            togglebutton.textContent="Playing";
        } 
        else {
            audio.pause();
            togglebutton.classList.remove('active');
            togglebutton.textContent="Play";
        }
        updateDynamicBackground();
    });
    togglebutton.addEventListener('click',()=>{
        if (slider.value==0) {
            slider.value=50;
        }
        else {
            slider.value=0;
        }
        slider.dispatchEvent(new Event('input'));
    });
});
mastervolume.addEventListener('input', ()=>{
    soundcards.forEach(card =>{
        const audio=card.querySelector('audio');
        const slider=card.querySelector('.volume-slider');
        const mastervol=mastervolume.value/100;
        audio.volume=(slider.value/100)*mastervol;
    });
});
mastertoggle.addEventListener('click', () =>{
    mastermuted=!mastermuted;
    soundcards.forEach(card=>{
        const audio=card.querySelector('audio');
        audio.muted=mastermuted;
    });
    if (mastermuted) {
        mastertoggle.innerHTML='<span>🔇</span> Unmute All';
        mastertoggle.classList.add('active');
    }
    else {
        mastertoggle.innerHTML='<span>🔊</span> Mute All';
        mastertoggle.classList.remove('active');
    }
});