/**
 * Created by Benny on 14/12/10.
 */
function Request() {
    var url = document.location.href;
    var arrStr = url.substring(url.indexOf("?") + 1).split("&");
    // return arrStr;
    var topTab = arrStr[0];

    topTab = topTab.substring(topTab.indexOf("=")+1);
    var contentTab = arrStr[1];
    contentTab = contentTab.substring(contentTab.indexOf("=") + 1);
    contentTab = decodeURIComponent(contentTab);
    console.log(topTab);
    console.log(contentTab);

    // if the current page is socialnetwork result
    if(topTab == "topTab=category" && contentTab == "contentTab=socialNetwork"){
        console.log("change the content of this page to fit socialNetwork");
        document.getElementById("contentFirstImage").src="./image/facebook.jpg";
        document.getElementById("contentSecondImage").src="./image/twitter.jpg";
        document.getElementById("contentThirdImage").src="./image/tumblr.png";
        document.getElementById("contentOthersImage").src="./image/others.gif";
    }else if(topTab=="topTab=category" && contentTab == "contentTab=shopping"){
        console.log("change the content of this page to fit shopping");
        document.getElementById("contentFirstImage").src="./image/amazon.jpg";
        document.getElementById("contentSecondImage").src="./image/ebay.png";
        document.getElementById("contentThirdImage").src="./image/best_buy.jpg";
        document.getElementById("contentOthersImage").src="./image/others.gif";
    }

    // change the path list
    if(topTab == "category"){
        document.getElementById("topTab").innerHTML = topTab.toUpperCase();
        document.getElementById("topTab").href = "index.html";
    }else if(topTab == "timePeriod"){
        document.getElementById("topTab").innerHTML = topTab.toUpperCase();
        document.getElementById("topTab").href = "index.html#tab2";
    }else if(topTab == "frequency"){
        document.getElementById("topTab").innerHTML = topTab.toUpperCase();
        document.getElementById("topTab").href = "index.html#tab3";
    }




    document.getElementById("contentTab").innerHTML = contentTab.toUpperCase();

}

Request();

(function display(){
    var url = decodeURI(document.location.href);
    var arrStr = url.substring(url.indexOf("?") + 1).split("&");
    var topTab = arrStr[0];
    var contentTab = arrStr[1];

    if (topTab == "topTab=category") {                              //category
        var category = contentTab.split("=")[1];
        if (category != "other"){
            findDomainsOfCategory(category);
        }else{
            var excepts = (arrStr[2].split("=")[1]).split("|");
            findDomainsOfCategoryExcept(excepts);
        }
    }else if (topTab == "topTab=timePeriod"){
        var timePeriod = contentTab.split("=")[1];
        findDomainsOfTimePeriod(timePeriod);
    }else if (topTab == "topTab=frequency"){
        var frequency = contentTab.split("=")[1];
        findDomainsOfFrequency(frequency);
    }




})();

function findDomainsOfCategory(category){

    var domains = new Array();

    var microsecondsPerWeek = 1000 * 60 * 60 * 24 * 14;
    var twoWeeksAgo = (new Date).getTime() - microsecondsPerWeek;
    chrome.history.search({
            'text': '',             // Return every history item....
            'startTime': twoWeeksAgo  // that was accessed less than one week ago.
        },
        function(historyItems) {

            for(var i = 0; i < historyItems.length; i++){
                // document.write("<a href='" + historyItems[i].url + "'>" + historyItems[i].title +"</a> -- " + historyItems[i].url + "</br>");
                var domain = historyItems[i].url.match(/http[s]?:\/\/(.*?)([:\/]|$)/);
                if (domain != null) {
                    //document.write(historyItems[i].url+"-------"+tldjs.getDomain(historyItems[i].url)+"</br>");
                    var hostName = tldjs.getDomain(historyItems[i].url);
                    //search for category info in local storage
                    if (hostName != null){
                        if (localStorage[hostName] == category) {                                        //find the category info locally
                            if(domains[hostName] == null){
                                domains[hostName] = [historyItems[i]];
                            }else{
                                domains[hostName].push(historyItems[i]);
                            }
                        }

                    }


                }
            }
            console.log(domains);
            var top3Domains = findTop3Domains(domains);

            //set contents
            $("#square1 a").attr("href", "./ListResult.html?domain="+top3Domains[0]);
            $("#square2 a").attr("href", "./ListResult.html?domain="+top3Domains[1]);
            $("#square3 a").attr("href", "./ListResult.html?domain="+top3Domains[2]);
        });

}

function findDomainsOfCategoryExcept(categories){
    var domains = new Array();

    var microsecondsPerWeek = 1000 * 60 * 60 * 24 * 14;
    var twoWeeksAgo = (new Date).getTime() - microsecondsPerWeek;
    chrome.history.search({
            'text': '',             // Return every history item....
            'startTime': twoWeeksAgo  // that was accessed less than one week ago.
        },
        function(historyItems) {

            for(var i = 0; i < historyItems.length; i++){
                // document.write("<a href='" + historyItems[i].url + "'>" + historyItems[i].title +"</a> -- " + historyItems[i].url + "</br>");
                var domain = historyItems[i].url.match(/http[s]?:\/\/(.*?)([:\/]|$)/);
                if (domain != null) {
                    //document.write(historyItems[i].url+"-------"+tldjs.getDomain(historyItems[i].url)+"</br>");
                    var hostName = tldjs.getDomain(historyItems[i].url);
                    //search for category info in local storage
                    if (hostName != null){
                        if ($.inArray(localStorage[hostName], categories) == -1) {                                        //find the category info locally
                            if(domains[hostName] == null){
                                domains[hostName] = [historyItems[i]];
                            }else{
                                domains[hostName].push(historyItems[i]);
                            }
                        }

                    }


                }
            }
            console.log(domains);
            var top3Domains = findTop3Domains(domains);

            //set contents
            $("#square1 a").attr("href", "./ListResult.html?domain="+top3Domains[0]);
            $("#square2 a").attr("href", "./ListResult.html?domain="+top3Domains[1]);
            $("#square3 a").attr("href", "./ListResult.html?domain="+top3Domains[2]);
        });

}

function findDomainsOfTimePeriod(timePeriod){

    var domains = new Array();

    var time = 0;
    if (timePeriod == "today") {
        var microSecondPerDay = 1000*60*60*24;
        time = (new Date).getTime() - microSecondPerDay;
    }else if (timePeriod == "oneDayAgo") {
        var microSecondPerDay = 1000*60*60*24;
        time = (new Date).getTime() - microSecondPerDay * 2;
    }else if (timePeriod == "oneWeekAgo") {
        var microSecondPerDay = 1000*60*60*24;
        time = (new Date).getTime() - microSecondPerDay * 7;
    }else if (timePeriod == "twoWeeksAgo") {
        var microSecondPerDay = 1000 * 60 * 60 * 24;
        time = (new Date).getTime() - microSecondPerDay * 14;
    }

    chrome.history.search({
            'text': '',             // Return every history item....
            'startTime': time  // that was accessed less than one week ago.
        },
        function(historyItems) {

            for(var i = 0; i < historyItems.length; i++){
                // document.write("<a href='" + historyItems[i].url + "'>" + historyItems[i].title +"</a> -- " + historyItems[i].url + "</br>");
                var domain = historyItems[i].url.match(/http[s]?:\/\/(.*?)([:\/]|$)/);
                if (domain != null) {
                    //document.write(historyItems[i].url+"-------"+tldjs.getDomain(historyItems[i].url)+"</br>");
                    var hostName = tldjs.getDomain(historyItems[i].url);
                    //search for category info in local storage
                    if (hostName != null){
                        if(domains[hostName] == null){
                            domains[hostName] = [historyItems[i]];
                        }else{
                            domains[hostName].push(historyItems[i]);
                        }
                    }


                }
            }
            console.log(domains);
            var top3Domains = findTop3Domains(domains);

            //set contents
            $("#square1 a").attr("href", "./ListResult.html?domain="+top3Domains[0]+"&timePeriod="+timePeriod);
            $("#square2 a").attr("href", "./ListResult.html?domain="+top3Domains[1]+"&timePeriod="+timePeriod);
            $("#square3 a").attr("href", "./ListResult.html?domain="+top3Domains[2]+"&timePeriod="+timePeriod);
        });

}

function findDomainsOfFrequency(frequency){

    var domains = new Array();
    var frequencyOfDomain = new Array();

    var microsecondsPerWeek = 1000 * 60 * 60 * 24 * 14;
    var twoWeeksAgo = (new Date).getTime() - microsecondsPerWeek;
    chrome.history.search({
            'text': '',             // Return every history item....
            'startTime': twoWeeksAgo  // that was accessed less than one week ago.
        },
        function(historyItems) {

            for(var i = 0; i < historyItems.length; i++){
                // document.write("<a href='" + historyItems[i].url + "'>" + historyItems[i].title +"</a> -- " + historyItems[i].url + "</br>");
                var domain = historyItems[i].url.match(/http[s]?:\/\/(.*?)([:\/]|$)/);
                if (domain != null) {
                    //document.write(historyItems[i].url+"-------"+tldjs.getDomain(historyItems[i].url)+"</br>");
                    var hostName = tldjs.getDomain(historyItems[i].url);
                    //search for category info in local storage
                    if (hostName != null){

                        if (frequencyOfDomain[hostName] == null) {
                            frequencyOfDomain[hostName] = historyItems[i].visitCount + historyItems[i].typedCount;
                        }else {
                            frequencyOfDomain[hostName] += historyItems[i].visitCount + historyItems[i].typedCount;
                        }

                        if(domains[hostName] == null){
                            domains[hostName] = [historyItems[i]];
                        }else{
                            domains[hostName].push(historyItems[i]);
                        }
                    }


                }
            }
            console.log(domains);
            console.log(frequencyOfDomain);

            var resultDomains = new Array;
            if (frequency == "often") {
                for (var key in frequencyOfDomain) {
                    if (frequencyOfDomain[key] > 20){
                        resultDomains[key] = domains[key];
                    }
                }
            }else if (frequency == "sometimes") {
                for (var key in frequencyOfDomain) {
                    if (frequencyOfDomain[key] <= 20 && frequencyOfDomain[key] > 3) {
                        resultDomains[key] = domains[key];
                    }
                }
            }else if (frequency == "occasionally") {
                for (var key in frequencyOfDomain) {
                    if (frequencyOfDomain[key] <= 3) {
                        resultDomains[key] = domains[key];
                    }
                }
            }

            var top3Domains = findTop3Domains(resultDomains);

            //set contents
            $("#square1 a").attr("href", "./ListResult.html?domain="+top3Domains[0]+"&frequency="+frequency);
            $("#square2 a").attr("href", "./ListResult.html?domain="+top3Domains[1]+"&frequency="+frequency);
            $("#square3 a").attr("href", "./ListResult.html?domain="+top3Domains[2]+"&frequency="+frequency);
        });

}


function findTop3Domains(domains){
    var result = new Array();

    //find max
    var max = 0
    for(var key in domains){
        if (domains[key].length > max){
            max = domains[key].length;
            result[0] = key;
        }
    }

    //find second
    var second = 0
    for(var key in domains){
        if (domains[key].length > second && key != result[0]){
            second = domains[key].length;
            result[1] = key;
        }
    }

    //find third
    var third = 0
    for(var key in domains){
        if (domains[key].length > third && key != result[0] && key != result[1]){
            third = domains[key].length;
            result[2] = key;
        }
    }

    console.log(result);
    return result;

}
