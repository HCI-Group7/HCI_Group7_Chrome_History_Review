/**
 * Created by Benny on 14/12/11.
 */
$(document).ready(function(){
    $("#firstpane .menu_body:eq(0)").show();
    $("#firstpane p.menu_head").click(function(){
        $(this).addClass("current").next("div.menu_body").slideToggle(300).siblings("div.menu_body").slideUp("slow");
        $(this).siblings().removeClass("current");
    });
    $("#secondpane .menu_body:eq(0)").show();
    $("#secondpane p.menu_head").mouseover(function(){
        $(this).addClass("current").next("div.menu_body").slideDown(500).siblings("div.menu_body").slideUp("slow");
        $(this).siblings().removeClass("current");
    });

});





//generate page contents

(function display() {

    var microsecondsPerWeek = 1000 * 60 * 60 * 24 * 14;
    var twoWeeksAgo = (new Date).getTime() - microsecondsPerWeek;

    var url = decodeURI(document.location.href);
    var arrStr = url.substring(url.indexOf("?") + 1).split("&");
    var domain;
    var timePeroid;
    var frequency;

    for (var index in arrStr) {
        var arr = arrStr[index];
        if (arr.split("=")[0] == "domain") {
            domain = arr.split("=")[1]
            console.log(domain);
            console.log(localStorage[domain]);
        }

        if (arr.split("=")[0] == "timePeriod") {
            timePeroid = arr.split("=")[1]
        }

        if (arr.split("=")[0] == "frequency") {
            frequency = arr.split("=")[1]
        }

    }

    //prepare frequency data
    var frequencyOfDomain = new Array();
    var frequencyReady = false;
    chrome.history.search({
            'text': '',             // Return every history item....
            'startTime': twoWeeksAgo  // that was accessed less than one week ago.
        },
        function(historyItems) {

            for(var i = 0; i < historyItems.length; i++){
                // document.write("<a href='" + historyItems[i].url + "'>" + historyItems[i].title +"</a> -- " + historyItems[i].url + "</br>");
                var domain = historyItems[i].url.match(/http[s]?:\/\/(.*?)([:\/]|$)/);
                if (domain != null) {

                    console.log(domain);
                    //document.write(historyItems[i].url+"-------"+tldjs.getDomain(historyItems[i].url)+"</br>");
                    var hostName = tldjs.getDomain(historyItems[i].url);
                    //search for category info in local storage
                    if (hostName != null){

                        if (frequencyOfDomain[hostName] == null) {
                            frequencyOfDomain[hostName] = historyItems[i].visitCount + historyItems[i].typedCount;
                        }else {
                            frequencyOfDomain[hostName] += historyItems[i].visitCount + historyItems[i].typedCount;
                        }

                    }


                }
            }

            frequencyReady = true;
        });

    var microSecondPerDay = 1000 * 60 * 60 * 24;
    //add content for today part
    var today = (new Date).getTime() - microSecondPerDay;
    chrome.history.search({
            'text': '',             // Return every history item....
            'startTime': today  // that was accessed less than one week ago.
        },
        function (historyItems) {

            var results = new Array();
            for (var i = 0; i < historyItems.length; i++) {
                // document.write("<a href='" + historyItems[i].url + "'>" + historyItems[i].title +"</a> -- " + historyItems[i].url + "</br>");
                var tmp = historyItems[i].url.match(/http[s]?:\/\/(.*?)([:\/]|$)/);
                if (tmp != null) {
                    if (historyEligible(historyItems[i], domain, frequency, frequencyOfDomain)) {
                        results.push(historyItems[i]);
                    }

                }
            }

            for (var i in results) {

                if(results[i].title != "") {
                    document.getElementById("result1").innerHTML += "<a href='" + results[i].url + "'>" + results[i].title + "</a>";
                }
            }

        });

    //add content for two days
    if (timePeroid != "today") {
        var today = (new Date).getTime() - microSecondPerDay;
        var twoDays = (new Date).getTime() - microSecondPerDay*2;

        chrome.history.search({
                'text': '',             // Return every history item....
                'startTime': twoDays,  // that was accessed less than one week ago.
                'endTime': today
            },
            function (historyItems) {

                var results = new Array();
                for (var i = 0; i < historyItems.length; i++) {
                    // document.write("<a href='" + historyItems[i].url + "'>" + historyItems[i].title +"</a> -- " + historyItems[i].url + "</br>");
                    var tmp = historyItems[i].url.match(/http[s]?:\/\/(.*?)([:\/]|$)/);
                    if (tmp != null) {
                        if (historyEligible(historyItems[i], domain, frequency, frequencyOfDomain)) {
                            results.push(historyItems[i]);
                        }

                    }
                }

                for (var i in results) {

                    if(results[i].title != "") {
                        document.getElementById("result2").innerHTML += "<a href='" + results[i].url + "'>" + results[i].title + "</a>";
                    }
                }

            });
    }

    //add content for 1 week
    if (timePeroid != "today" && timePeroid != "oneDayAgo") {
        var twoDays = (new Date).getTime() - microSecondPerDay*2;
        var oneWeek = (new Date).getTime() - microSecondPerDay*7;

        chrome.history.search({
                'text': '',             // Return every history item....
                'startTime': oneWeek,  // that was accessed less than one week ago.
                'endTime': twoDays
            },
            function (historyItems) {

                var results = new Array();
                for (var i = 0; i < historyItems.length; i++) {
                    // document.write("<a href='" + historyItems[i].url + "'>" + historyItems[i].title +"</a> -- " + historyItems[i].url + "</br>");
                    var tmp = historyItems[i].url.match(/http[s]?:\/\/(.*?)([:\/]|$)/);
                    if (tmp != null) {
                        if (historyEligible(historyItems[i], domain, frequency, frequencyOfDomain)) {
                            results.push(historyItems[i]);
                        }

                    }
                }

                for (var i in results) {

                    if(results[i].title != "") {
                        document.getElementById("result3").innerHTML += "<a href='" + results[i].url + "'>" + results[i].title + "</a>";
                    }
                }

            });
    }

    //add content for 1 week
    if (timePeroid != "today" && timePeroid != "oneDayAgo" && timePeroid != "oneWeekAgo") {
        var oneWeek = (new Date).getTime() - microSecondPerDay*7;
        var twoWeeks = (new Date).getTime() - microSecondPerDay*14;


        chrome.history.search({
                'text': '',             // Return every history item....
                'startTime': twoWeeks,  // that was accessed less than one week ago.
                'endTime': oneWeek
            },
            function (historyItems) {

                var results = new Array();
                for (var i = 0; i < historyItems.length; i++) {
                    // document.write("<a href='" + historyItems[i].url + "'>" + historyItems[i].title +"</a> -- " + historyItems[i].url + "</br>");
                    var tmp = historyItems[i].url.match(/http[s]?:\/\/(.*?)([:\/]|$)/);
                    if (tmp != null) {
                        if (historyEligible(historyItems[i], domain, frequency, frequencyOfDomain)) {
                            results.push(historyItems[i]);
                        }

                    }
                }

                for (var i in results) {

                    if(results[i].title != "") {
                        document.getElementById("result4").innerHTML += "<a href='" + results[i].url + "'>" + results[i].title + "</a>";
                    }
                }

            });
    }

})();

function historyEligible(historyItem, domain, frequency, frequencyOfDomain) {

    var result = true;
    var historyDomain = tldjs.getDomain(historyItem.url);

    if (historyItem.title == ""){
        result = false;
    }

    if (domain != null) {
        if (historyDomain != domain) {
            result = false;
        }
    }

    if (frequency != null) {
        var historyFrequency = frequencyOfDomain[historyDomain];

        if(frequency == "often") {
            if (historyFrequency <= 20) {
                result = false;
            }
        }else if (frequency == "sometimes") {
            if (historyFrequency > 20 || historyFrequency <= 3) {
                result = false;
            }
        }else if (frequency == "occasionally") {
            if (historyFrequency > 3) {
                result = false;
            }
        }
    }

    return result;
}



















