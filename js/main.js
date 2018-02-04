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

function buildCryptonatorAutocompleteData(result){
    // transform data into appropriate autocomplete format
    // and connect it to autocomplete field
    var currencies = [];
    for (i = 0; i < result.rows.length; i++) {
        var auto_entry = { value: result.rows[i].code , data: result.rows[i].name };
        currencies.push(auto_entry);
    }
    $('#cryptonator-autocomplete').autocomplete({
        lookup: currencies,
        lookupLimit: 20,
        onSelect: function (suggestion) {
            selectFromCryptonatorList(suggestion);
        }
    });
}

function selectFromCryptonatorList(currency){
	console.log("You selected " + currency.value + " " + currency.data);
}

$(document).ready( function () {
  fetchCryptonatorList();
});
