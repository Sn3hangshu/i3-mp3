// import * as ko from "scripts/knockout-3.5.1.js";
load();

function load()
{
    var viewModel = {
        lines: GetLines(),
        currentActive: ko.observable(0),
        selectedTab: ko.observable(0),
        draggedDiv: ko.observable(null),
        bookmarks: ko.observable([])
    }

    viewModel.onParaDrag = function(context){
        viewModel.draggedDiv(context);
        if(viewModel.draggedDiv() !== null && !viewModel.bookmarks().map(x => x.Id).includes(context.Id)){
            var bmArray = viewModel.bookmarks();
            bmArray.push(context);
            viewModel.bookmarks(bmArray);
        }
    }

    viewModel.GetTime = function(context){
        var timeStart = GetDate(context.StartTime);
        return timeStart.getMinutes() + ":" + timeStart.getSeconds();
    }

    viewModel.showContext = function(context){
        $("#Context"+context.Id).css('display', 'block');
    }

    viewModel.removeBookmark = function(context){
        var bmArray = viewModel.bookmarks().map(x => x).filter(x => x.Id !== context.Id);
        viewModel.bookmarks(bmArray);
    }

    viewModel.StartTime = GetStartTime(viewModel);

    viewModel.currentSpeaker = ko.computed(function(){
        return this.lines[this.currentActive()].Speaker;
    }, viewModel);

    viewModel.nextSpeaker = ko.computed(function(){
        if(this.currentActive() == this.lines.length - 1) {
            return null;
        } else {
            return this.lines[this.currentActive() + 1].Speaker;
        }
    }, viewModel);

    viewModel.activateTab = function(value){
        if (value) {
            return 'activeTab';
        }else{
            return 'inactiveTab'
        }
    };

    viewModel.callParticipants = ko.computed(function(){
        return this.lines.map(x => x.Speaker).filter((x, i, a) => a.indexOf(x) == i)
    }, viewModel);

    viewModel.callDetails = ko.computed(function(){
        return {
            Time: this.lines[0].StartTime,
            Type: 'Company Conference Presentation',
            PresentationAvailable: 'available'
        }
    }, viewModel);

    viewModel.openBookMarks = function() {
        viewModel.selectedTab(0);
        document.getElementById("Tab0").style.display = "block";
        document.getElementById("Tab1").style.display = "none";
        document.getElementById("Tab2").style.display = "none";

        document.getElementById("TabButton0").className = "activeTab";
        document.getElementById("TabButton1").className = "inactiveTab";
        document.getElementById("TabButton2").className = "inactiveTab";
    }

    viewModel.openParticipants = function() {
        viewModel.selectedTab(1);
        document.getElementById("Tab0").style.display = "none";
        document.getElementById("Tab1").style.display = "block";
        document.getElementById("Tab2").style.display = "none";

        document.getElementById("TabButton0").className = "inactiveTab";
        document.getElementById("TabButton1").className = "activeTab";
        document.getElementById("TabButton2").className = "inactiveTab";
    }


    viewModel.openDetails = function() {
        viewModel.selectedTab(2);
        document.getElementById("Tab0").style.display = "none";
        document.getElementById("Tab1").style.display = "none";
        document.getElementById("Tab2").style.display = "block";

        document.getElementById("TabButton0").className = "inactiveTab";
        document.getElementById("TabButton1").className = "inactiveTab";
        document.getElementById("TabButton2").className = "activeTab";
    }

    function stream(){
        if(viewModel.currentActive() < viewModel.lines.length) {
            var lineStart = GetDate(viewModel.lines[viewModel.currentActive()].StartTime);
            var lineEnd = GetDate(viewModel.lines[viewModel.currentActive()].EndTime);
            var transcriptStart = viewModel.StartTime;
            transcriptStart.setMilliseconds(transcriptStart.getMilliseconds() + 500);

            if(transcriptStart - lineStart >= 0 && transcriptStart - lineEnd > 0){
                if(viewModel.currentActive() === viewModel.lines.length - 1){
                }else{
                    $("#Sentence"+ (viewModel.currentActive() + 1)).addClass('inactive')
                    viewModel.currentActive(viewModel.currentActive() + 1);
                    $("#Sentence"+ (viewModel.currentActive() + 1)).removeClass('inactive')
                    $(".left").animate({scrollTop: $(".left").scrollTop() + ($("#Sentence"+viewModel.currentActive()).offset().top - $(".left").offset().top)});
                }
            } 
            
            
            viewModel.StartTime = transcriptStart;
        }
    }

    $(document).ready(function() {
        document.getElementById("Tab1").style.display = "none";
        document.getElementById("Tab2").style.display = "none";
        viewModel.lines.map(x => x.Id).forEach(disableLine);
        setInterval(stream, 500);
    });
    

    function disableLine(index){
        if(index > 1){
            $("#Sentence"+index).addClass('inactive')
        }
    }

    ko.applyBindings(viewModel);
};

function GetDate(dateString){
    let reggie = /(\d{2})-(\d{2})-(\d{4}) (\d{2}):(\d{2}):(\d{2})/
    , [, year, month, day, hours, minutes, seconds] = reggie.exec(dateString)
    , dateObject = new Date(year, month-1, day, hours, minutes, seconds);

    return dateObject;
}

function GetStartTime(context){
    return GetDate(context.lines[context.currentActive()].StartTime);
}