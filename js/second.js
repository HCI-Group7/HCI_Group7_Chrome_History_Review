/**
 * Created by Benny on 14/12/10.
 */
function Request() {
    var url = document.location.href;
    var arrStr = url.substring(url.indexOf("?") + 1).split("&");
    // return arrStr;
    var topTab = arrStr[0];
    //topTab = topTab.split("=");
    var contentTab = arrStr[1];
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

    setMenuItems();


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

    var microsecondsTwoWeeks = 1000 * 60 * 60 * 24 * 14;
    var twoWeeksAgo = (new Date).getTime() - microsecondsTwoWeeks;
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

function setMenuItems(){

    var microsecondsPerWeek = 1000 * 60 * 60 * 24 * 14;
    var twoWeeksAgo = (new Date).getTime() - microsecondsPerWeek;
    var cateGoryFrequency = new Array();


    chrome.history.search({
            'text': '',             // Return every history item....
            'startTime': twoWeeksAgo  // that was accessed less than one week ago.
        },
        function (historyItems) {

            for(var i = 0; i < historyItems.length; i++){
                // document.write("<a href='" + historyItems[i].url + "'>" + historyItems[i].title +"</a> -- " + historyItems[i].url + "</br>");
                var domain = historyItems[i].url.match(/http[s]?:\/\/(.*?)([:\/]|$)/);
                if (domain != null) {
                    //document.write(historyItems[i].url+"-------"+tldjs.getDomain(historyItems[i].url)+"</br>");
                    var hostName = tldjs.getDomain(historyItems[i].url);
                    //search for category info in local storage
                    if (hostName != null){
                        if (localStorage[hostName] != null) {
                            if (cateGoryFrequency[localStorage[hostName]] == null){
                                cateGoryFrequency[localStorage[hostName]] = 1;
                            }else{
                                cateGoryFrequency[localStorage[hostName]] += 1;
                            }
                        }

                    }

                }

            }

            //sort the result
            var top3Categoryies = findTop3Category(cateGoryFrequency);

            //set contents
            $("#categoryMenu p#item1 input").attr("name",top3Categoryies[0]);
            $("#categoryMenu p#item2 input").attr("name",top3Categoryies[1]);
            $("#categoryMenu p#item3 input").attr("name",top3Categoryies[2]);

            $("#categoryMenu p#item1 a").html(top3Categoryies[0]);
            $("#categoryMenu p#item2 a").html(top3Categoryies[1]);
            $("#categoryMenu p#item3 a").html(top3Categoryies[2]);
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

function findTop3Category(frequencies){
    var result = new Array();

    //find max
    var max = 0
    for(var key in frequencies){
        if (frequencies[key] > max){
            max = frequencies[key];
            result[0] = key;
        }
    }

    //find second
    var second = 0
    for(var key in frequencies){
        if (frequencies[key] > second && key != result[0]){
            second = frequencies[key];
            result[1] = key;
        }
    }

    //find third
    var third = 0
    for(var key in frequencies){
        if (frequencies[key] > third && key != result[0] && key != result[1]){
            third = frequencies[key];
            result[2] = key;
        }
    }

    return result;
}

function onClickSearchButton(){

    var keyword = $("#input_keyword").attr("value");
    var categoryStr ="";
    var otherCategory = false;
    var exceptCategoryStr = "";
    var timePeriod = $("input[name='timePeriod']:checked").val();
    var frequency = $("input[name='frequency']:checked").val();

    if ($("#categoryMenu p#item4 input").attr("checked") == undefined) {

        if ($("#categoryMenu p#item1 input").attr("checked") != undefined) {
            if (categoryStr.length == 0) {
                categoryStr = $("#categoryMenu p#item1 input").attr("name");
            } else {
                categoryStr += ("|" + $("#categoryMenu p#item1 input").attr("name"));
            }
        }


        if ($("#categoryMenu p#item2 input").attr("checked") != undefined) {
            if (categoryStr.length == 0) {
                categoryStr = $("#categoryMenu p#item2 input").attr("name");
            } else {
                categoryStr += ("|" + $("#categoryMenu p#item2 input").attr("name"));
            }
        }

        if ($("#categoryMenu p#item3 input").attr("checked") != undefined) {
            if (categoryStr.length == 0) {
                categoryStr = $("#categoryMenu p#item3 input").attr("name");
            } else {
                categoryStr += ("|" + $("#categoryMenu p#item3 input").attr("name"));
            }
        }

    }else {
        otherCategory = true;

        if ($("#categoryMenu p#item1 input").attr("checked") == undefined) {
            if (exceptCategoryStr.length == 0) {
                exceptCategoryStr = $("#categoryMenu p#item1 input").attr("name");
            } else {
                exceptCategoryStr += ("|" + $("#categoryMenu p#item1 input").attr("name"));
            }
        }


        if ($("#categoryMenu p#item2 input").attr("checked") == undefined) {
            if (exceptCategoryStr.length == 0) {
                exceptCategoryStr = $("#categoryMenu p#item2 input").attr("name");
            } else {
                exceptCategoryStr += ("|" + $("#categoryMenu p#item2 input").attr("name"));
            }
        }

        if ($("#categoryMenu p#item3 input").attr("checked") == undefined) {
            if (exceptCategoryStr.length == 0) {
                exceptCategoryStr = $("#categoryMenu p#item3 input").attr("name");
            } else {
                exceptCategoryStr += ("|" + $("#categoryMenu p#item3 input").attr("name"));
            }
        }


    }

    //generate url
    var parameters = "";

    if(otherCategory == false) {

        if (keyword != null && keyword != "") {
            keyword = "keyword=" + keyword;
            parameters = (parameters == "") ? keyword : parameters + "&" + keyword;
        }

        if (timePeriod != null && timePeriod != "") {
            timePeriod = "timePeriod=" + timePeriod;
            parameters = (parameters == "") ? timePeriod : parameters + "&" + timePeriod;
        }

        if (frequency != null && frequency != "") {
            frequency = "frequency=" + frequency;
            parameters = (parameters == "") ? frequency : parameters + "&" + frequency;
        }

        if (categoryStr != null && categoryStr != "") {
            categoryStr = "categoryStr=" + categoryStr;
            parameters = (parameters == "") ? categoryStr : parameters + "&" + categoryStr;
        }
    }else {

        if (keyword != null && keyword != "") {
            keyword = "keyword=" + keyword;
            parameters = (parameters == "") ? keyword : parameters + "&" + keyword;
        }

        if (timePeriod != null && timePeriod != "") {
            timePeriod = "timePeriod=" + timePeriod;
            parameters = (parameters == "") ? timePeriod : parameters + "&" + timePeriod;
        }

        if (frequency != null && frequency != "") {
            frequency = "frequency=" + frequency;
            parameters = (parameters == "") ? frequency : parameters + "&" + frequency;
        }

        parameters = (parameters == "") ? "otherCategory=true" : parameters + "&otherCategory=true";

        if (exceptCategoryStr != null && exceptCategoryStr != "") {
            exceptCategoryStr = "exceptCategoryStr=" + exceptCategoryStr;
            parameters = (parameters == "") ? exceptCategoryStr : parameters + "&" + exceptCategoryStr;
        }
    }

    var url = "./ListResult.html?" + parameters;
    url = encodeURI(url);

    window.location.href = url;

}

document.addEventListener('DOMContentLoaded', function () {
    var submitBtn = document.querySelector("#submitButton");
    submitBtn.addEventListener('click', onClickSearchButton);





})