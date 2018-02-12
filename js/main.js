function fetchCryptonatorList(){ // retrieve currencies list
    // check local storage before API query
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

function fetchCryptonatorTicker(target, base) {
    // retrieve currency ticker data from cryptonator API
    // base is the currency to compare the target to
    // both must be currency codes listed on crypotonator api currency list
    var url = "https://www.cryptonator.com/api/ticker/"
    url += base + "-" + target;  // ex: btc-usd
    $.ajax({
        url: url,
        method: "GET",
        accepts: "application/json",
        }).done(function(result){
			$('.cryptonator-currency-price').html(result.ticker.price);
			$('.cryptonator-currency-1hr-change').html("1hr change: " + result.ticker.change);
        }).fail(function(err) {
            console.log("failed to retrieve currency exchange data");
            throw err;
        });
};

function buildCryptonatorAutocompleteData(cryptonator_list){
    // transform list data into appropriate autocomplete format
    var currencies = [];
    cryptonator_list.rows.forEach(function(item){
        currencies.push({value: item.code , data: item.name});
    });
    // connect currencies to autocomplete field
    $('#cryptonator-autocomplete').autocomplete({
        lookup: currencies,
		minChars: 0,
        onSelect: function (suggestion) {
            selectFromCryptonatorList(suggestion);
        }
    });
	// enable 'empty' search - all results show on click
	$('#cryptonator-autocomplete').autocomplete( "search", "" );
}

function selectFromCryptonatorList(currency){
	$('.cryptonator-currency-price').html(""); //blank price div
    $('.cryptonator-currency-code').html(currency.value);
	$('.cryptonator-currency-name').html(currency.data);
	fetchCryptonatorTicker("USD", currency.value);
}

$(document).ready( function () {
  fetchCryptonatorList();
});
