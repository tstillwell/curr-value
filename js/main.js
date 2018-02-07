function fetchCryptonatorList(){ // retrieve currencies list
    // check local storage
    if (localStorage.cryptonator_list) {
        list = JSON.parse(localStorage.getItem('cryptonator_list'));
        return buildCryptonatorAutocompleteData(list);
    }
    // consume currency list from cryptonator API
    var url = "https://www.cryptonator.com/api/currencies";
    $.ajax({
        url: url,
        method: "GET",
        accepts: "application/json",
        }).done(function(result){
            console.log(result);
            localStorage.setItem('cryptonator_list', JSON.stringify(result));
            buildCryptonatorAutocompleteData(result);
        }).fail(function(err) {
            console.log("failed to retrieve data");
            throw err;
        });
}

function fetchCryptonatorTicker(base, target) {
    // retrieve currency ticker data from cryptonator API
    // base is the currency to compare the target to
    // both must be listed on api currency list
    var url = "https://www.cryptonator.com/api/ticker/"
    url += base + "-" + target;
    $.ajax({
        url: url,
        method: "GET",
        accepts: "application/json",
        }).done(function(result){
            console.log(result);
        }).fail(function(err) {
            console.log("failed to retrieve currency exchange data");
            throw err;
        });
};

function buildCryptonatorAutocompleteData(cryptonator_list){
    // transform data into appropriate autocomplete format
    // and connect it to autocomplete field
    var currencies = [];
    cryptonator_list.rows.forEach(function(item){
        currencies.push({value: item.code , data: item.name});
    });
    $('#cryptonator-autocomplete').autocomplete({
        lookup: currencies,
        lookupLimit: 20,
        onSelect: function (suggestion) {
            selectFromCryptonatorList(suggestion);
        }
    });
}

function selectFromCryptonatorList(currency){
    $('.cryptonator-currency-info').html(currency.data + " - " + currency.value);
}

$(document).ready( function () {
  fetchCryptonatorList();
});
