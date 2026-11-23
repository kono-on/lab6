/* Initialize values and placeholders; */
let dropdown1 = document.getElementById("currency1");
let dropdown2 = document.getElementById("currency2");
let swap = document.getElementById("swap");
let submit = document.getElementById('submit');
let input = document.getElementById("inputbox");
let result = document.getElementById("result");

/* Retrieves all country info, uses names and code to fill menu. */
function getCountries(dropdown) {

  fetch("https://countries.dev/countries?fields=name,currencies")

    .then(function(response) {
      if (!response.ok) {
        throw new Error("API request failed");
      }
      return response.json();
    })

    .then(function(data) {
      let currencies = new Map();

      data.forEach(function(country) {
        /* Only select countries with data*/
        if (!country.currencies) return;
            country.currencies.forEach(function(currency) {

            /* ensures no duplicates, populates option under dropdown. */
            if (!currencies.has(currency.code)) {
                currencies.set(currency.code, currency.name);

                let option = document.createElement("option");

                option.value = currency.code;
                option.textContent = currency.name + " (" +
                currency.code + ")" ;

                dropdown.appendChild(option);
          }
        });
      });
    })
    .catch(function(error) {
      console.log("Could not load currencies:", error);
    });

}

/* Submit value to be exchanged */
submit.onclick = function () {
    let val = input.value;
    from = dropdown1.selectedOptions[0]
    to = dropdown2.selectedOptions[0]
    if (isNaN(val)) {
        input.value = "";
        input.placeholder = "Please enter a number!";
    } else {
        input.placeholder = "Type the amount to convert.";
        
        /* Second API for conversion rates, interacts with
        currency codes received from first api/ */
        fetch("https://api.frankfurter.dev/v2/rate/"+ from.value
            + "/" + to.value)

        .then(function(response) {
        if (!response.ok) {
            throw new Error("Exchange rate not found.");
        }
        return response.json();
        })

        /* Convert empty to 0, then display result. */
        .then(function(data) {
            if (!val) {val = 0};
            updateResult(val, data);
        })
    }
}

/* Format solution with values */
function updateResult(val, exchange) {
    result.textContent = "Result: " + Number(val).toFixed(2) + " " + from.value + " = "
    + (val * exchange.rate).toFixed(2) + " " + to.value;
}

/* Swap currency exchange */
swap.onclick = function() {
    [dropdown1.value, dropdown2.value] = [dropdown2.value, dropdown1.value];
    submit.click();
};

/* Populate dropdown menus */
getCountries(dropdown1);
getCountries(dropdown2);