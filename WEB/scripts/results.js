
function ResultsViewModel() {

    var self = this;
    self.rowData = ko.observable(rowData);

    self.mediaPlayervm = ko.observable(new mediaPlayerViewModel());

    self.playAudio = function(data){
        $('#mediaPlayer').css('display','block');
        let playAudioInf = {
            key: data.play,
            value: data.what,
        };

        self.mediaPlayervm(new mediaPlayerViewModel(playAudioInf));
    };

    self.close = function(){
        $('#mediaPlayer').css('display','none');
        self.mediaPlayervm(new mediaPlayerViewModel());

        //Audio
        audioEl['pause']();
        audioEl.currentTime = 0;
    };

    self.maxim = function(){
        $('#mediaPlayer').css('display','none');
        $('#mediaPlayerM').css('display','block');
    };

    
// MAXIMIZED SCREEN

self.lines= GetLines();
self.currentActive= ko.observable(0);
self.selectedTab= ko.observable(0);
self.draggedDiv= ko.observable(null);
self.bookmarks= ko.observable([]);

self.onParaDrag = function(context){
    self.draggedDiv(context);
    if(self.draggedDiv() !== null && !self.bookmarks().map(x => x.Id).includes(context.Id)){
        var bmArray = self.bookmarks();
        bmArray.push(context);
        self.bookmarks(bmArray);
    }
};

self.GetTime = function(context){
    var timeStart = GetDate(context.StartTime);
    return timeStart.getMinutes() + ":" + timeStart.getSeconds();
};

self.showContext = function(context){
    $("#Context"+context.Id).css('display', 'block');
};

self.removeBookmark = function(context){
    var bmArray = self.bookmarks().map(x => x).filter(x => x.Id !== context.Id);
    self.bookmarks(bmArray);
};

self.StartTime = GetStartTime(self);

self.currentSpeaker = ko.computed(function(){
    return this.lines[this.currentActive()].Speaker;
}, self);

self.nextSpeaker = ko.computed(function(){
    if(this.currentActive() == this.lines.length - 1) {
        return null;
    } else {
        return this.lines[this.currentActive() + 1].Speaker;
    }
}, self);

self.activateTab = function(value){
    if (value) {
        return 'activeTab';
    }else{
        return 'inactiveTab'
    }
};

self.callParticipants = ko.computed(function(){
    return this.lines.map(x => x.Speaker).filter((x, i, a) => a.indexOf(x) == i)
}, self);

self.callDetails = ko.computed(function(){
    return {
        Time: this.lines[0].StartTime,
        Type: 'Company Conference Presentation',
        PresentationAvailable: 'available'
    }
}, self);

self.openBookMarks = function() {
    self.selectedTab(0);
    document.getElementById("Tab0").style.display = "block";
    document.getElementById("Tab1").style.display = "none";
    document.getElementById("Tab2").style.display = "none";

    document.getElementById("TabButton0").className = "activeTab";
    document.getElementById("TabButton1").className = "inactiveTab";
    document.getElementById("TabButton2").className = "inactiveTab";
};

self.openParticipants = function() {
    self.selectedTab(1);
    document.getElementById("Tab0").style.display = "none";
    document.getElementById("Tab1").style.display = "block";
    document.getElementById("Tab2").style.display = "none";

    document.getElementById("TabButton0").className = "inactiveTab";
    document.getElementById("TabButton1").className = "activeTab";
    document.getElementById("TabButton2").className = "inactiveTab";
};


self.openDetails = function() {
    self.selectedTab(2);
    document.getElementById("Tab0").style.display = "none";
    document.getElementById("Tab1").style.display = "none";
    document.getElementById("Tab2").style.display = "block";

    document.getElementById("TabButton0").className = "inactiveTab";
    document.getElementById("TabButton1").className = "inactiveTab";
    document.getElementById("TabButton2").className = "activeTab";
};

function stream(){
    if(self.currentActive() < self.lines.length) {
        var lineStart = GetDate(self.lines[self.currentActive()].StartTime);
        var lineEnd = GetDate(self.lines[self.currentActive()].EndTime);
        var transcriptStart = self.StartTime;
        transcriptStart.setMilliseconds(transcriptStart.getMilliseconds() + 500);

        if(transcriptStart - lineStart >= 0 && transcriptStart - lineEnd > 0){
            if(self.currentActive() === self.lines.length - 1){
            }else{
                $("#Sentence"+ (self.currentActive() + 1)).addClass('inactive')
                self.currentActive(self.currentActive() + 1);
                $("#Sentence"+ (self.currentActive() + 1)).removeClass('inactive')
                $(".left").animate({scrollTop: $(".left").scrollTop() + ($("#Sentence"+self.currentActive()).offset().top - $(".left").offset().top)});
            }
        } 
        
        
        self.StartTime = transcriptStart;
    }
};

$(document).ready(function() {
    document.getElementById("Tab1").style.display = "none";
    document.getElementById("Tab2").style.display = "none";
    self.lines.map(x => x.Id).forEach(disableLine);
    setInterval(stream, 500);
});


function disableLine(index){
    if(index > 1){
        $("#Sentence"+index).addClass('inactive')
    }
};



}

function mediaPlayerViewModel(settings){
    settings = settings || {};
    var self = this;
    self.info = ko.observable(settings.key);
    self.title = ko.observable(settings.value);

    return self;
};

function GetDate(dateString){
    let reggie = /(\d{2})-(\d{2})-(\d{4}) (\d{2}):(\d{2}):(\d{2})/
    , [, year, month, day, hours, minutes, seconds] = reggie.exec(dateString)
    , dateObject = new Date(year, month-1, day, hours, minutes, seconds);

    return dateObject;
};

function GetStartTime(context){
    return GetDate(context.lines[context.currentActive()].StartTime);
};






 
ko.applyBindings(new ResultsViewModel());