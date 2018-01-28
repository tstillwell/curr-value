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
