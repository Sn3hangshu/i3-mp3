var listOfWords = [];
function ResultsViewModel() {

    var self = this;
    self.rowData = ko.observable(rowData);
    self.transcriptsRawData = GetTranscriptData();
    self.listOfWords = [];
    self.filterRawData = function filterRawTranscriptData() {

        for (var i = 0; i < self.transcriptsRawData.length; i++) {

            for (var j = 0; j < self.transcriptsRawData[i].Alternatives[0].Words.length; j++) {
                var word = self.transcriptsRawData[i].Alternatives[0].Words[j];
                var wordData = {
                    id: "span" + self.listOfWords.length,
                    word: word.Word,
                    startTime: word.StartTime.Seconds + "." + word.StartTime.Nanos,
                    endTime: word.EndTime.Seconds + "." + word.EndTime.Nanos
                };
                self.listOfWords.push(wordData);
            }
        }
    };
    listOfWords = self.listOfWords;
    self.filterRawData();
    self.mediaPlayervm = ko.observable(new mediaPlayerViewModel());

    self.playAudio = function(data){
        $('#mediaPlayer').css('display','block');
        $('#mediaPlayer').css('margin-bottom','0%');
        $('#audioControl_maxim')[0].className = 'fa fa-chevron-up';
        let playAudioInf = {
            key: data.audio,
            value: data.type,
        };

        self.mediaPlayervm(new mediaPlayerViewModel(playAudioInf));
    };

    self.close = function(){
        $('#mediaPlayer').css('display','none');
        self.mediaPlayervm(new mediaPlayerViewModel());

        //Audio
        audioEl['pause']();
        audioEl.currentTime = 0;

        $('#mediaPlayerM').css('display','none');
    };

    self.maxim = function(){

        var tag = $('#audioControl_maxim')[0].className;

        if(tag === 'fa fa-chevron-up'){
            $('#mediaPlayer').css('margin-bottom','26%');
            $('#mediaPlayerM').css('display','block');
            $('#audioControl_maxim')[0].className = 'fa fa-chevron-down';
        }else{
            $('#mediaPlayerM').css('display','none');
            $('#mediaPlayer').css('margin-bottom','0%');
            $('#audioControl_maxim')[0].className = 'fa fa-chevron-up';
        }

    };

    
// MAXIMIZED SCREEN

self.lines= GetLines();
self.currentActive= ko.observable(0);
self.selectedTab= ko.observable(0);
self.draggedDiv= ko.observable(null);
self.bookmarks= ko.observableArray([]);

self.onclick = function (data) {
    playWord(data.startTime);
};

self.onBookmarkClick = function (data) {

    playBookmarks(data.StartTime, data.EndTime);
};


self.GetTime = function (time) {
    var formattedTime = time;
    var mins = 0, secs = 0;
    if (parseFloat(time) >= 60) {
        mins = Math.floor(parseInt(time) / 60);
        if (mins < 10) {
            mins = "0" + mins;
        }
        secs = parseInt(time) % 60;
        if (secs < 10) {
            secs = "0" + secs;
        }
        return formattedTime = mins + ":" + secs;
    }
    else {
        if (mins < 10) {
            mins = "0" + mins;
        }
        if (secs < 10) {
            secs = "0" + secs;
        }
        return formattedTime = mins + ":" + Math.floor(time);
    }

};

self.showContext = function(context){
    $("#Context"+context.Id).css('display', 'block');
};

self.removeBookmark = function () {
    self.bookmarks.remove(this);
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
                $("#Sentence"+ (self.currentActive() + 1)).removeClass('active')
                $("#Sentence"+ (self.currentActive() + 1)).addClass('inactive')
                self.currentActive(self.currentActive() + 1);
                $("#Sentence"+ (self.currentActive() + 1)).removeClass('inactive')
                $("#Sentence"+ (self.currentActive() + 1)).addClass('active')
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
    //setInterval(stream, 500);
    $('.transcriptdiv').on('contextmenu', function (e) {
        var top = e.pageY - 10;
        var left = e.pageX - 90;
        $("#context-menu").css({
            display: "block",
            top: top,
            left: left
        }).addClass("show");
        return false; //blocks default Webbrowser right click menu
    }).on("click", function () {
        $("#context-menu").removeClass("show").hide();
    });
    var getAllBetween = function (firstEl, lastEl) {
        var firstElement = $(firstEl); // First Element
        var lastElement = $(lastEl); // Last Element
        var collection = new Array(); // Collection of Elements
        collection.push(firstElement.attr('id')); // Add First Element to Collection
        $(firstEl).nextAll().each(function () { // Traverse all siblings
            var siblingID = $(this).attr('id'); // Get Sibling ID
            if (siblingID !== $(lastElement).attr('id')) { // If Sib is not LastElement
                collection.push($(this).attr('id')); // Add Sibling to Collection
            } else { // Else, if Sib is LastElement
                collection.push(lastElement.attr('id')); // Add Last Element to Collection
                return false; // Break Loop
            }
        });
        return collection; // Return Collection
    }
    $("#context-menu a").on("click", function (data) {
        var listofselectedspans = [];
        var selectionText = window.getSelection().toString();
        if (this.innerText === "BookMark") {
            if (window.getSelection) { // non-IE
                userSelection = window.getSelection();
                rangeObject = userSelection.getRangeAt(0);
                if (rangeObject.startContainer === rangeObject.endContainer) {
                    listofselectedspans = rangeObject.startContainer.parentNode.id;
                } else {
                    listofselectedspans = getAllBetween(
                        rangeObject.startContainer.parentNode,
                        rangeObject.endContainer.parentNode);
                }
            } else if (document.selection) { // IE lesser
                userSelection = document.selection.createRange();
                var ids = new Array();

                if (userSelection.htmlText.toLowerCase().indexOf('span') >= 0) {
                    $(userSelection.htmlText).filter('span').each(function (index, span) {
                        ids.push(span.id);
                    });
                    alert(ids);
                } else {
                    alert(userSelection.parentElement().id);
                }
            }
            //  window.getSelection().addRange(range1);

        }
        else if (this.innerText === "GoTo Here") {
            var x = data;
        }
        var spanDetailsStart = listOfWords.find(x => x.id === listofselectedspans[0]);
        var spanDetailsEnd = listOfWords.find(x => x.id === listofselectedspans[listofselectedspans.length - 1]);
        if(selectionText.length>50)
        {
            selectionText=selectionText.substring(0,50)+"..." ;
        }
        self.bookmarks.push({ StartTime: spanDetailsStart.startTime, EndTime: spanDetailsEnd.endTime, Text: selectionText });
        $(this).parent().removeClass("show").hide();
    });
});


function disableLine(index){
    if(index > 1){
        $("#Sentence"+index).addClass('inactive')
    }
    else {
        $("#Sentence"+index).addClass('active')
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