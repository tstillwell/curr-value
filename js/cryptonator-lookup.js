// cryptonator-lookup.js
// https://github.com/tstillwell/curr-value
// MIT License

function fetchCryptonatorList(){ 
    // retrieve supported currencies list
    if (localStorage.cryptonator_list) {
        // check local storage for currency list
        // avoid query if list is in localStorage
        let list = JSON.parse(localStorage.getItem("cryptonator_list"));
        return buildCryptonatorAutocompleteData(list);
    }
    // consume currency list from cryptonator API
    let url = "https://www.cryptonator.com/api/currencies/";
    $.ajax({
        url: url,
        method: "GET",
        }).done(function(result){
            localStorage.setItem("cryptonator_list", JSON.stringify(result));
            buildCryptonatorAutocompleteData(result);
        }).fail(function(err) {
            let error = "Unable to retrieve currency list via Cryptonator API";
            $(".cryptonator-api-error").html(error);
            throw err;
        });
}

function fetchCryptonatorTicker(target, base) {
    // retrieve currency "simple ticker" data from cryptonator API
    // base is the currency to compare the target to
    // both must be currency codes listed on crypotonator api currency list
    let url = "https://www.cryptonator.com/api/ticker/";
    url += base + "-" + target;  // ex: btc-usd
    $.ajax({
        url: url,
        method: "GET",
        }).done(function(result){
            populateCurrencyInfo(result);
        }).fail(function(err) {
            let error = "Failed to obtain updated data from Cryptonator API";
            $(".cryptonator-api-error").html(error);
            throw err;
        });
}

function populateCurrencyInfo(response){
    // display ticker data to user via updating the DOM
    // "response" argument is API response containing valid ticker data
    let attribution_link = "<a href=\"https://www.cryptonator.com/\">Cryptonator API</a>";
    $(".attribution").html("Data from " + attribution_link);
    if (typeof response.ticker !== "undefined"){  // verify valid result
        $(".cryptonator-api-error").html("");  // hide older API errors
        $(".currency-price").html(response.ticker.price);
        $(".currency-1hr-change").html("1hr change: " + response.ticker.change);
        let updated_date = new Date(response.timestamp * 1000);
        $(".currency-timestamp").html(updated_date.toUTCString());
        document.title = response.ticker.base + " " + response.ticker.price;
        }
        else {  // show error if result response is missing ticker data
            $("currency-price").html("Info Unavailable");
        }
}

function buildCryptonatorAutocompleteData(cryptonator_list){
    // transform list data into appropriate autocomplete format
    // implementation uses jquery autocomplete
    // https://github.com/devbridge/jQuery-Autocomplete
    let currencies = [];
    currencies = cryptonator_list.rows.map(function (currency){
        return ({value: currency.code , data: currency.name});
    });
    // connect currencies to autocomplete fields
    $("#cryptonator-autocomplete").autocomplete({
        lookup: currencies,
        minChars: 0,
        search: "",  // 'empty' search - all results show on click
        onSelect: function (suggestion) {
            let base_currency = $("#cryptonator-autocomplete-base")[0];
            if (base_currency.value != "") {  // prevent empty/invalid lookups
                selectFromCryptonatorList(suggestion, base_currency.value);
            }
        }
    });
    $("#cryptonator-autocomplete-base").autocomplete({
        lookup: currencies,
        minChars: 0,
        search: "",  // 'empty' search - all results show on click
        onSelect: function (suggestion) {
            let target_currency = $("#cryptonator-autocomplete")[0];
            if (target_currency.value != "") {  // prevent empty/invalid lookups
                selectFromCryptonatorList(target_currency, suggestion.value);
            }
        }
    });
}

function selectFromCryptonatorList(currency, base){
    // populate the currency info div and apply class which displays it
    $(".currency-price").html(""); //blank price div
    $(".currency-1hr-change").html(""); //blank change div
    $(".currency-code").html(currency.value);
    $(".currency-name").html(currency.data);
    fetchCryptonatorTicker(base, currency.value);
    $(".cryptonator-currency-info").addClass("populated-currency-info");
}

function refreshLookup() {
    // obtrain new data for existing lookup
    let base_currency = $("#cryptonator-autocomplete-base")[0];
    let target_currency = $("#cryptonator-autocomplete")[0];
    if (target_currency.value != "" && base_currency.value != "") {
        selectFromCryptonatorList(target_currency, base_currency.value);
    }
}

$(document).ready( function () {
  fetchCryptonatorList();
  let refresh_timer = 120000; // time in ms between updates
  setInterval(function(){ refreshLookup() }, refresh_timer);
});
