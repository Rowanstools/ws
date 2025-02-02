let winesData = [];
let selectedWines = [];

// Load the CSV data when the page loads
window.onload = function () {
    Papa.parse('wines.csv', {
        download: true,
        header: true,
        complete: function (results) {
            winesData = results.data;
            console.log(winesData);
        }
    });

    document.getElementById('vintageInput').addEventListener('input', function (e) {
        this.value = this.value.replace(/[^0-9]/g, '').slice(0, 4);
    });

    document.getElementById('wineSearch').addEventListener('input', function (e) {
        const query = e.target.value.toLowerCase();
        const suggestions = winesData.filter(wine => wine.wine_name.toLowerCase().includes(query));
        const dropdown = document.getElementById('searchSuggestions');

        dropdown.innerHTML = '';

        if (query && suggestions.length) {
            dropdown.style.display = 'block';
            suggestions.forEach(suggestion => {
                const option = document.createElement('div');
                option.textContent = suggestion.wine_name;
                option.className = 'suggestion-item';

                option.addEventListener('click', function () {
                    document.getElementById('wineSearch').value = suggestion.wine_name;
                    dropdown.innerHTML = '';
                    dropdown.style.display = 'none';
                });

                dropdown.appendChild(option);
            });
        } else {
            dropdown.style.display = 'none';
        }
    });

    document.getElementById('lookupButton').addEventListener('click', function () {
        const wineName = document.getElementById('wineSearch').value.trim();
        const vintageYear = document.getElementById('vintageInput').value.trim();
        const numberOfBottles = parseInt(document.getElementById('bottlesInput').value.trim());

        if (!/^\d{4}$/.test(vintageYear)) {
            alert("Please enter a valid four-digit Vintage Year.");
            return;
        }

        if (isNaN(numberOfBottles) || numberOfBottles <= 0) {
            alert("Please enter a valid number of bottles.");
            return;
        }

        const wineInfo = winesData.find(wine => wine.wine_name.toLowerCase() === wineName.toLowerCase());

        if (wineInfo) {
            let bottlesInWords = numberToWords(numberOfBottles);
            let bottleText = numberOfBottles === 1 ? "bottle" : "bottles";
            let description = `${wineInfo.wine_name} ${vintageYear}, ${wineInfo.description} (${bottlesInWords} ${bottleText})`;

            let firstCommaIndex = description.indexOf(",");
            if (firstCommaIndex !== -1) {
                description = `<b>${description.substring(0, firstCommaIndex + 1)}</b>${description.substring(firstCommaIndex + 1)}`;
            }

            selectedWines.push({ description, numberOfBottles });

            let totalBottles = selectedWines.reduce((sum, wine) => sum + wine.numberOfBottles, 0);
            let outputText = selectedWines.map(wine => wine.description).join(' ');
            
            if (selectedWines.length > 1) {
                outputText += ` (${totalBottles})`;
            }
            
            document.getElementById('outputText').innerHTML = outputText;
        } else {
            document.getElementById('outputText').textContent = 'Please provide valid input for all fields.';
        }
    });

    document.getElementById('clearButton').addEventListener('click', function () {
        document.getElementById('wineSearch').value = '';
        document.getElementById('vintageInput').value = '';
        document.getElementById('bottlesInput').value = '';
        document.getElementById('outputText').textContent = '';
        selectedWines = [];
    });

    document.getElementById('copyButton').addEventListener('click', function () {
        const outputDiv = document.getElementById('outputText');
        const range = document.createRange();
        range.selectNode(outputDiv);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
        document.execCommand('copy');
        window.getSelection().removeAllRanges();
        alert('Copied to clipboard!');
    });
};

function numberToWords(num) {
    const ones = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
    const teens = ["", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
    const tens = ["", "ten", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];

    if (num === 0) return "zero";

    let word = "";

    if (num >= 1000) {
        word += ones[Math.floor(num / 1000)] + " thousand ";
        num %= 1000;
    }

    if (num >= 100) {
        word += ones[Math.floor(num / 100)] + " hundred ";
        num %= 100;
    }

    if (num > 10 && num < 20) {
        word += teens[num - 10];
    } else {
        word += tens[Math.floor(num / 10)] + " ";
        word += ones[num % 10];
    }

    return word.trim();
}
