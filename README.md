# curr-value

Simple realtime currency conversion lookup
browser app.

- Finds currency values via the Cryptonator API.

- Auto-refreshes current lookup periodically
to provide updated data.

To use the app locally, open `index.html` in a browser.

Built with HTML5, CSS3, javascript and jQuery.

### Lookups Explained

Currency lookups are performed using
`js/cryptonator-lookup.js`

First, the list of currencies
supported by the API is loaded.

This is handled using
`fetchCryptonatorList()`

Second, the autocomplete fields are populated
with the currencies from this list.

`buildCryptonatorAutocompleteData()`

performs this populating using
jQuery Autocomplete.

Once those two steps are done,
queries can be performed.

`fetchCryptonatorTicker()`

performs 'simple ticker' queries
using the cryptonator API

`populateCurrencyInfo()`

updates & display data retrieved from
the API response

#### jQuery-Autocomplete

https://github.com/devbridge/jQuery-Autocomplete

#### html5 boilerplate

https://github.com/h5bp/html5-boilerplate

#### Cryptonator API

https://www.cryptonator.com/api/

### LICENSE

MIT license

See LICENSE file for full license text