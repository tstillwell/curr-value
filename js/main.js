function fetchCryptonatorList(){
    // consume currency list from cryptonator API
    var url = "https://www.cryptonator.com/api/currencies";
    $.ajax({
        url: url,
        method: "GET",
        accepts: "application/json",
        }).done(function(result){
            console.log(result);
            buildAutocompleteData(result);
        }).fail(function(err) {
            console.log("failed to retrieve data");
            throw err;
        });
}

function buildAutocompleteData(result){
    // transform data into appropriate autocomplete format
    // and connect it to autocomplete field
    var currencies = [];
    for (i = 0; i < result.rows.length; i++) {
        var auto_entry = { value: result.rows[i].code , data: result.rows[i].name };
        currencies.push(auto_entry);
    }
    $('#autocomplete').autocomplete({
        lookup: currencies,
        lookupLimit: 20,
        onSelect: function (suggestion) {
            console.log('You selected: ' + suggestion.value + ', ' + suggestion.data);
    }
    });
}
