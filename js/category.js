Parse.initialize("z3WphiwOtJbwIi10PL65pLBLIt35aDQGj8kFO4MG", "UejR7LXTsAHgsYO5Q7KrgIIbR22yzWNAJB4h0zOu");

var microsecondsPerWeek = 1000 * 60 * 60 * 24 * 14;
var twoWeeksAgo = (new Date).getTime() - microsecondsPerWeek;
var categories = new Array();

//chrome.storage.local.set({'bilibili.com': "Streaming Media and Download"}, function() {
//  // Notify that we saved.
//  alert('Settings saved');
//});
//
//chrome.storage.local.get('bilibili.com', function(result){
//  alert(result["bilibili.com"]);
//  //console.log(result.value);
//});
//localStorage["youtube.com"] = "Streaming Media and Download";
//var test = localStorage["bilibili.com"];
//console.log(test);


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
               if (localStorage[hostName] != null) {                                        //find the category info locally
                   document.write(hostName+"----"+localStorage[hostName]+"</br>");
                   insertCategoryInfoFor(hostName,localStorage[hostName]);
               }else {
                   //find the record in parse
                   var PFCategory = Parse.Object.extend("Category");
                   var query = new Parse.Query(PFCategory);
                   query.equalTo("domain", hostName);
                   query.find({
                       success: function(results) {
                           if (results.length != 0) {
                               var result = results[0];
                               var hostName = result.get("domain");
                               var category = result.get("category");
                               //add it to local storage
                               localStorage[hostName] = category;
                               //add it to categories array
                               insertCategoryInfoFor(hostName, category);
                           }
                       },
                       error: function(error) {
                           alert("Error: " + error.code + " " + error.message);
                       }
                   });

                   //in case of there is no record in parse, send a request to server to update to parse
                   askServerToUpateCategoryFor(hostName);
               }

           }


         }
       }

     });

function insertCategoryInfoFor(hostname, category){
  if (categories[category] == null){
    categories[category] = [hostname];
  }else{
    var tmp = $.inArray(hostname, categories[category]);

    if(tmp == -1){
      categories[category].push(hostname);
    }
  }
}


function createXMLHttpRequest() {
    var xmlHttp;
    if (window.XMLHttpRequest) {
        xmlHttp = new XMLHttpRequest();
        if (xmlHttp.overrideMimeType)
            xmlHttp.overrideMimeType('text/xml');
    } else if (window.ActiveXObject) {
        try {
            xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
        } catch (e) {
            try {
                xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
            } catch (e) {
            }
        }
    }
    return xmlHttp;
}

function askServerToUpateCategoryFor(hostName){
    xmlHttp = createXMLHttpRequest();
    var url = "http://localhost/hci/test.php?data="+hostName
    xmlHttp.open("GET", url, true);
    xmlHttp.setRequestHeader("Content-Type",
        "application/x-www-form-urlencoded;");
    xmlHttp.send();
}
