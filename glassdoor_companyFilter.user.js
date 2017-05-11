// ==UserScript==
// @name        glassdoor_companyFilter
// @namespace   Glassdoor
// @include     https://www.glassdoor.com/Job/*
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @require     https://gist.github.com/raw/2625891/waitForKeyElements.js
// @grant       GM_xmlhttpRequest
// @grant       unsafeWindow
// ==/UserScript==

var DATA_HOST = "http://192.168.1.104/glassdoor_companyFilter";

// isEnabled - Holds 'enabled' state of company filtering (set by 'enable()' and 'disable()')
isEnabled = true;

// makeClassName - Takes a company name and makes a unique class name from it
function makeClassName(name) {
  name = name.
      toLowerCase().
      replace(/ /g, "_").
      replace(/\W/g, '');
  name = "companyFilter_" + name;
  return name;
}

// initialize - Called to setup the glassdoor page for filtering and turn filtering on
function initialize() {
  window.console.log("Company filter: initializing...");
  // if already initialized, just enable (tested by looking for bindings)
  if ($(".companyFilter_item").length > 0) {
    companyFilter_enable();
    window.console.log("Company filter: initialized");
    return;
  }

  // Hide the jobs list while initializing (to avoid showing companies to be filtered)
  hideJobList();

  // Inject companyFilter bindings into the html (add classes, data and button)
  // also collect list of company names to check for filtering
  var companyNamesString = "";  // used later to find filtered items
  var companyNamePrefix = "?";  // Used to separate comopany names with '&' for url
  $("div.flexbox.empLoc").children("div:not(.alignRt)").each(function() {
    // Get name and add it to 'companyNamesString'
    var curCompanyName = this.innerText.substring(0, this.innerText.indexOf(" –"));
    curCompanyName = curCompanyName.toLowerCase().replace("'", "").replace("&", "");
    companyNamesString += companyNamePrefix + "in[]=" + curCompanyName;
    companyNamePrefix = "&";
    // Add classes, data and button for companyFilter to work with
    var curItem = $(this).parent().parent().parent();
    curItem.addClass(makeClassName(curCompanyName));
    curItem.addClass("companyFilter_item");
    curItem.data("name", curCompanyName);
    curItem.data("companyFiltered", false);
    curItem.prepend(
      "<button class='companyFilter_toggleCompany' onclick='companyFilter_toggleCompany(\"" +
      curCompanyName +
      "\");' style='height: 0%;'>Filter<br/>company</button>");
  });

  // Get a list of the filtered companies from the companies list from the jobs list
  // 1. url for data request
  var dataRequest_url = DATA_HOST + "/" + companyNamesString;
  // 2. What to do with request results
  var dataRequest_successFunctionality = function(response) {
    // Get list of companies to filter
    var filteredCompanies = JSON.parse(response.responseText);
    // Add filter data to all job posts for those companies
    var length = filteredCompanies.length;
    for (var i = 0; i < length; ++i) {
      var current = $("." + makeClassName(filteredCompanies[i]));
      current.data("companyFiltered", true);
      current.children(".companyFilter_toggleCompany").html("Unfilter<br/>company");
    }
    // Add a button to toggle company filtering altogether
    $("#JobSearchFilters").after(
      "<button id='companyFilter_toggleFiltering' onclick='companyFilter_toggleFiltering()'>" +
      "Disable company filtering</button>");
    window.console.log("Company filter: initialized");
    // Done with data, show/hide jobs based on it.  Then unhide job list
    enable();
    unhideJobList();
  };
  // 3. What to do with request error
  var dataRequest_errorFunctionality = function(response) {
    // Notify user
    alert("Company filter: data request failed");
    window.console.log("Company filter: data request failed");
    // Remove bindings
    $(".companyFilter_item").removeClass("companyFilter_item");
    $(".companyFilter_toggleCompany").remove();
    // Unhide job list
    unhideJobList();
  };
  // 4. Make data request
  GM_xmlhttpRequest({
    method:    "GET",
    url:       dataRequest_url,
    onload:    dataRequest_successFunctionality,
    onerror:   dataRequest_errorFunctionality,
    ontimeout: dataRequest_errorFunctionality});
}

// hideJobList - Place a div over job list to hide it. Prevents user from seeing filtered jobs
// while filtering is being setup.
function hideJobList() {
  if ($("#filterCompany_blankout").length == 0) {
    $("#MainCol").prepend(
        "<div id='filterCompany_blankout' style='" +
        "background-color: white; left:0; top: 0; width: 100%; height: 100%; " +
        "position: absolute; z-index: 1; text-align: center;'></div>");
  }
}

// unhideJobList - Remove the div that hides the job list (created by 'hideJobList()').
function unhideJobList() {
  $("#filterCompany_blankout").remove();
}

// enable - Called to hide all job posts that are for filtered companies.
function enable() {
  window.console.log("Company filtering: enabling...");
  var toFilter = $(".companyFilter_item");
  toFilter.each(function() {
    var $this = $(this);
    if ($this.data("companyFiltered") == true) {
      $this.hide();
    }
  });
  $("#companyFilter_toggleFiltering").html("Disable company filtering");
  isEnabled = true;
  window.console.log("Company filter: enabled");
}

// disable - Called to show all job posts (even for filtered companies).
function disable() {
  window.console.log("Company filter: disabling...");
  $(".companyFilter_item").show();
  $("#companyFilter_toggleFiltering").html("Enable company filtering");
  isEnabled = false;
  window.console.log("Company filter: disabled");
}

// toggleFiltering - Flips company filter from between being enabled and disabled.
function toggleFiltering() {
  if (isEnabled) {
    disable();
  } else {
    enable();
  }
}

// toggleCompany - Called to flip the filtered state for an individual company.
function toggleCompany(title) {
  var item = $("." + makeClassName(title));
  var filtered = !item.data("companyFiltered");
  window.console.log(
      "Company filter: " +
      filtered?"Filtering":"Unfiltering" +
      " company '" + title + "'...");
  item.data("companyFiltered", filtered);
  var updateUrl = DATA_HOST + "/";
  if (filtered) {
    item.children("button").html("Unfilter<br/>company");
    if (isEnabled) { item.hide(); }
    updateUrl += "addFilter";
  } else {
    item.children("button").html("Filter<br/>company");
    item.show();
    updateUrl += "removeFilter";
  }
  updateUrl += ".php?name=" + title;
window.console.log(updateUrl);
  GM_xmlhttpRequest({method: "POST", url: updateUrl});
  window.console.log("Company filter: company " + filtered?"filtered":"unfiltered");
}



// Hide the job list immediately on load (until company filter is done)
hideJobList();

// Inject public methods into page's js (methods are called by buttons added by this script)
unsafeWindow.companyFilter_toggleFiltering = exportFunction(toggleFiltering, unsafeWindow);
unsafeWindow.companyFilter_toggleCompany = exportFunction(toggleCompany, unsafeWindow);

// Handle all updates to the job post list (through onload, filter changes, etc)
var waitingForJobListUpdates = true;
waitForKeyElements (".jl", function() {
  if (waitingForJobListUpdates) {
    waitingForJobListUpdates = false;
    window.console.log("Company filter: job list changed... reinitializing");
    initialize();
    setTimeout(
        function() {
          waitingForJobListUpdates = true;
        },
        2000);
  }
});

