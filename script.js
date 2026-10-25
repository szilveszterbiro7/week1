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
function updateDynamicBackground() {
    let rainvol=document.getElementById('vol-rain').value;
    let campfirevol=document.getElementById('vol-campfire').value
    let windvol=document.getElementById('vol-wind').value;
    if (rainvol>50){
        document.body.style.backgroundColor='#2d3d52';
    }
    else if (campfirevol>50){
        document.body.style.backgroundColor='#ac4722';
    }
    else if (windvol>50){
        document.body.style.backgroundColor='#99dee3';
    }
    else{
        document.body.style.backgroundColor='#2c3e2e';
    }
}
presets.forEach(btn=>{
    btn.addEventListener('click',()=>{
        soundcards.forEach(card=>{
            card.querySelector('.volume-slider').value=0;
            card.querySelector('audio').pause();
            card.querySelector('.toggle-btn').classList.remove('active');
            card.querySelector('.toggle-btn').textContent="Play";
        });
        const text=btn.textContent;
        if (text.includes('Deep Forest')) {
            slidervalue('birds', 60);
            slidervalue('river', 40);
            slidervalue('wind', 30);
        }
        else if (text.includes('Cozy Campfire')) {
            slidervalue('campfire', 80);
            slidervalue('wind', 20);
        }
        else if (text.includes('Mountain Rain')) {
            slidervalue('rain', 90);
            slidervalue('wind', 50);
        }
    });
});
function slidervalue(soundname, v){
    const card=document.querySelector('[data-sound="${soundname}"]');
    if (card){
        const slider=card.querySelector('.volme-slider');
        slider.value=v;
        slider.dispatchEvent(new Event('input'));
    }
}
timers.forEach(btn=>{
    btn.addEventListener('click', ()=>{
        const minutes=parseInt(btn.dataset.time);
        let left=minutes*60;
        if(activetimer)
            clearInterval(activetimer);
        timerdisplay.textContent="Timer Active: ${minutes} min. remaining";
        activetimer=setInterval(()=>{
            left--;
            let mins=Math.floor(left/60);
            let secs=left%60;
            timerdisplay.textContent="Time Left: ${mins}m ${secs<10 ? '0':' '}${secs}s";
            if(left<=0) {
                clearInterval(activetimer);
                timerdisplay.textContent="Timer ended.";
                soundcards.forEach(card=>{
                    card.querySelector('volume-slider').value=0;
                    card.querySelector('audio').pause();
                    card.querySelector('.toggle-btn').classList.remove('active');
                    card.querySelector('.toggle-btn').textContent="Play;";
                });
                document.body.style.backgroundColor='#2c3e2e';
            }
        }, 1000);
    });
});
