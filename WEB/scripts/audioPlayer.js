var canvasWidth = parseInt(document.getElementById("progress").width);
var audioEl = document.getElementById("audio")
var canvas = document.getElementById("progress").getContext('2d')
var ctrl = document.getElementById('audioControl');

audioEl.addEventListener('loadedmetadata', function() {
  var duration = audioEl.duration
  var currentTime = audioEl.currentTime
  document.getElementById("duration").innerHTML = convertElapsedTime(duration)
  document.getElementById("current-time").innerHTML = convertElapsedTime(currentTime)
  canvas.fillRect(0, 0, canvasWidth, 50);
});

const _canvas = document.querySelector('canvas')
_canvas.addEventListener('mousedown', function(e) {
  updateProgress(_canvas, e)
});

function updateProgress(canvas, event) {
  const rect = canvas.getBoundingClientRect()
  const x = event.clientX - rect.left
  //const y = event.clientY - rect.top
  console.log("x: " + x);

  // var perCentageProgress = canvasWidth/x;
  // var point = (perCentageProgress * audioEl.duration) / 100;

  audioEl.currentTime = (audioEl.duration * x) / canvasWidth;
  audioEl['play']()


}

function togglePlaying() {

  var pause = ctrl.className === 'fa fa-pause-circle'
  var method

  if (pause) {
    ctrl.className = 'fa fa-play-circle'
    method = 'pause'
  } else {
    ctrl.className = 'fa fa-pause-circle'
    method = 'play'
  }

  audioEl[method]()

}

function fastforward(secs){
  audioEl.currentTime = audioEl.currentTime + secs;
  audioEl['play']()
};

function playBookmarks(startTime,endTime) {
  audioEl.currentTime = startTime;
  var duration = endTime - startTime;
  audioEl.duration(duration);
  audioEl['play']();
};

function playWord(secs) {
  audioEl.currentTime = secs;
  audioEl['play']();
};

function updateBar() {
  canvas.clearRect(0, 0, canvasWidth, 50)
  canvas.fillStyle = "#000";
  canvas.fillRect(0, 0, canvasWidth, 50)
  
  var currentTime = audioEl.currentTime
  var duration = audioEl.duration
  
  if (currentTime === duration) {
    ctrl.innerHTML = "Play"
  }
  
  document.getElementById("current-time").innerHTML = convertElapsedTime(currentTime)
  
  var percentage = currentTime / duration
  var progress = (canvasWidth * percentage)
  canvas.fillStyle = "#FF0000"
  canvas.fillRect(0, 0, progress, 50)
}

function convertElapsedTime(inputSeconds) {
  var seconds = Math.floor(inputSeconds % 60)
  if (seconds < 10) {
    seconds = "0" + seconds
  }
  var minutes = Math.floor(inputSeconds / 60)
  return minutes + ":" + seconds
}

// $('#draggable-point').draggable({
//   axis: 'x',
//   containment: "#audio-progress"
// });

// $('#draggable-point').draggable({
//   drag: function() {
//     var offset = $(this).offset();
//     var xPos = (100 * parseFloat($(this).css("left"))) / (parseFloat($(this).parent().css("width"))) + "%";
   
//     $('#audio-progress-bar').css({
//       'width': xPos
//     });
//   }
// });