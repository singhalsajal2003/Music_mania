const wrapper= document.querySelector(".wrapper"),
musicImg= document.querySelector(".cover-art img"),
musicName= document.querySelector(".song-details .song-name"),
musicArtist= document.querySelector(".song-details .artist-name"),
mainAudio= document.querySelector("#main-audio"),
playPauseBtn=wrapper.querySelector(".pause"),
prevBtn=wrapper.querySelector("#prev"),
nextBtn=wrapper.querySelector("#next"),
progressBar=wrapper.querySelector(".prog-bar"),
progressArea=wrapper.querySelector(".prog-area"),
musicList = wrapper.querySelector(".music-list"),
showMoreBtn = wrapper.querySelector("#more"),
hideMusicBtn = wrapper.querySelector("#close");

showMoreBtn.addEventListener("click", ()=>{
    musicList.classList.toggle("show");
});

hideMusicBtn.addEventListener("click", ()=>{
    showMoreBtn.click();
})

let musicIndex=1;
window.addEventListener("load", ()=>{
    loadMusic(musicIndex);
    playingSong();
})

function loadMusic(indexNumb){
    musicName.innerText=allMusic[indexNumb - 1].name;
    musicArtist.innerText=allMusic[indexNumb - 1].artist;
    musicImg.src=allMusic[indexNumb - 1].img;
    mainAudio.src=allMusic[indexNumb - 1].src;
}

function playMusic(){
    wrapper.classList.add("paused");
    playPauseBtn.querySelector("i").innerText="pause";
    mainAudio.play();
}

function pauseMusic(){
    wrapper.classList.remove("paused");
    playPauseBtn.querySelector("i").innerText="play_arrow";
    mainAudio.pause();
}

function nextMusic(){
    musicIndex++;
    (musicIndex>allMusic.length)?musicIndex=1:musicIndex;
    loadMusic(musicIndex);
    playMusic();
    playingSong();
}

function prevMusic(){
    musicIndex--;
    (musicIndex<1)?musicIndex=allMusic.length:musicIndex;
    loadMusic(musicIndex);
    playMusic();
    playingSong();
}

playPauseBtn.addEventListener("click", ()=>{
    const isMusicPaused = wrapper.classList.contains("paused");
    isMusicPaused?pauseMusic():playMusic();
    playingSong();
})

nextBtn.addEventListener("click", ()=>{
    nextMusic();
})

prevBtn.addEventListener("click", ()=>{
    prevMusic();
});

mainAudio.addEventListener("timeupdate", (e)=>{
    const currentTime= e.target.currentTime;
    const duration= e.target.duration;
    let progressWidth= (currentTime/duration)*100;
    progressBar.style.width=`${progressWidth}%`;

    let musicCurrentTime= wrapper.querySelector(".curr-time"),
        musicDuration= wrapper.querySelector(".max-duration");
        //update total duration
        let audioDuration= mainAudio.duration;
        let totalMin= Math.floor(audioDuration/60);
        let totalSec= Math.floor(audioDuration%60);
        if (totalSec<10){
            totalSec=`0${totalSec}`;
        }
        musicDuration.innerText=`${totalMin}:${totalSec}`;

        //update current song playing time
        let currentMin= Math.floor(currentTime/60);
        let currentSec= Math.floor(currentTime%60);
        if (currentSec<10){
            currentSec=`0${currentSec}`;
        }
        musicCurrentTime.innerText=`${currentMin}:${currentSec}`;
});    

progressArea.addEventListener("click", (e)=>{
    let progressWidthVal = progressArea.clientWidth;
    let clickedOffSetX = e.offsetX;
    let songDuration = mainAudio.duration;

    mainAudio.currentTime = (clickedOffSetX / progressWidthVal)* (songDuration);
    playMusic();
    playingSong();
});

const repeatBtn = wrapper.querySelector("#repeat");
repeatBtn.addEventListener("click", ()=>{
    let getText= repeatBtn.innerText;

    switch(getText){
        case "repeat":
            repeatBtn.innerText= "repeat_one";
            repeatBtn.setAttribute("title", "Song Looped");
            break;
        case "repeat_one":
            repeatBtn.innerText= "shuffle";
            repeatBtn.setAttribute("title", "Playback Shuffled");
            break;
        case "shuffle":
            repeatBtn.innerText= "repeat";
            repeatBtn.setAttribute("title", "Playlist Looped");
            break;
    }
});

mainAudio.addEventListener("ended", ()=>{
    let getText = repeatBtn.innerText;

    switch(getText){
        case "repeat":
            nextMusic();
            break;
        case "repeat_one":
            mainAudio.currentTime = 0;
            loadMusic(musicIndex);
            playMusic();
            break;
        case "shuffle":
            let randIndex= Math.floor((Math.random()*allMusic.length)+1 );
            do{
                randIndex= Math.floor((Math.random()*allMusic.length)+1 );
            }while(musicIndex=randIndex);
            musicIndex=randIndex
            loadMusic(musicIndex);
            playMusic();
            break;
    }
});

const ulTag = wrapper.querySelector("ul");
for (let i=0;i<allMusic.length;i++) {
    let liTag=`<li li-index="${i+1}">
        <div class="row">
        <span>${allMusic[i].name}</span>
        <p>${allMusic[i].artist}</p>
        </div>
        <audio class="${allMusic[i].id}" src="${allMusic[i].src}"></audio>
        <span id="${allMusic[i].id}" class="audio-duration">3:05</span>
        </li>`;
    console.log(liTag);
    ulTag.insertAdjacentHTML("beforeend", liTag);

    let liAudioDuration= ulTag.querySelector(`#${allMusic[i].id}`);
    let liAudioTag= ulTag.querySelector(`.${allMusic[i].id}`);
    liAudioTag.addEventListener("loadeddata", ()=>{
        let audioDuration= liAudioTag.duration;
        let totalMin= Math.floor(audioDuration/60);
        let totalSec= Math.floor(audioDuration%60);
        if (totalSec<10){
            totalSec=`0${totalSec}`;
        }
        liAudioDuration.innerText=`${totalMin}:${totalSec}`;
        liAudioDuration.setAttribute("t-duration", `${totalMin}:${totalSec}`);
    });
}

const allLiTag= ulTag.querySelectorAll("li");



function playingSong(){
    const allLiTag = ulTag.querySelectorAll("li");
    for (let j = 0; j < allLiTag.length; j++) {
      let audioTag = allLiTag[j].querySelector(".audio-duration");

      if(allLiTag[j].classList.contains("playing")){
        allLiTag[j].classList.remove("playing");
        let adDuration = audioTag.getAttribute("t-duration");
        audioTag.innerText = adDuration;
      }
      if(allLiTag[j].getAttribute("li-index") == musicIndex){
        allLiTag[j].classList.add("playing");
        audioTag.innerText = "Playing";
      }
      allLiTag[j].setAttribute("onclick", "clicked(this)");
    }
}


function clicked(element){
    let getLiIndex=element.getAttribute("li-index");
    console.log(element);
    musicIndex=getLiIndex;
    loadMusic(musicIndex);
    playMusic();
    playingSong();
}