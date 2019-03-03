let randomCountryElement = document.querySelector('#random-country')
let userAnswerElement = document.querySelector("#user-answer")
let submitButton = document.querySelector("#submit-answer")
let resultTextElement = document.querySelector('#result')
let playAgainButton = document.querySelector('#playAgainButton')

var userAnswer = ""
const urlFront = 'http://api.worldbank.org/v2/country/'
var urlMiddle = ""      // eg 'br'.
const urlBack = '?format=json'
var url = ""
var capital = ""
var randomCountryCode = ""



// TODONE when the page loads, select an element at random from the countriesAndCodes array
// This array is defined in the countries.js file. Your browser treats all 
// JavaScript files as one big file, organized in the order of the script tags
// so countriesAndCodes is available to this file

var randomIndex
randomIndex = Math.floor(Math.random() * countriesAndCodes.length)
console.log(countriesAndCodes[randomIndex])

//console.log(countriesAndCodes[0].name)
//console.log(countriesAndCodes)  // You don't need to log countriesAndCodes - just proving it is available

// TODONE display the country's name in the randomCountryElement

randomCountryElement.innerHTML = countriesAndCodes[randomIndex].name

// The previous thre lines of code could now be replaced with a call to "newQuestion()".

function newQuestion() {
    randomIndex = Math.floor(Math.random() * countriesAndCodes.length)
    randomCountryElement.innerHTML = countriesAndCodes[randomIndex].name
}

// TODONE add a click event handler to the submitButton.  When the user clicks the button,
//  * read the text from the userAnswerElement 
//  * Use fetch() to make a call to the World Bank API with the country code (from countriesAndCodes)
//  * Extract the capital city from the World Bank API response
//  * Compare it to the user's answer. 
//      You can decide how correct you require the user to be. A basic solution requires 
//      the user's answer to be exactly the same as the World Bank answer. If you want 
//      to be more flexible, include and use a string similarity library such as https://github.com/hiddentao/fast-levenshtein 
//  * Display an appropriate result in the resultTextElement. 
//      For example "Correct! The capital of Germany is Berlin" or "Wrong - the capital of Germany is not G, it is Berlin"

submitButton.addEventListener("click", submitOnClick)
function submitOnClick() {
    userAnswer = userAnswerElement.value
    compareUserAnswerToWorldBankData(3)
}


function compareUserAnswerToWorldBankData(attemptsRemaining) {
    if (attemptsRemaining <= 0) {
        console.log("Too many failed requests, abandoning requests to World Bank API.")
        return
    }

    let randomCountryCode = countriesAndCodes[randomIndex]["alpha-2"]
    console.log("random country code is:  " + randomCountryCode)

    urlMiddle = randomCountryCode
    url = urlFront + urlMiddle + urlBack
    console.log(url)

    fetch(url)
        .then( res => res.json() )
        .then( wbData => {
            let metaData = wbData[0]    // never used.
            let countryData = wbData[1]

            console.log("COUNTRY_DATA:  " + countryData)
            if (countryData == undefined) {
                console.log("fetching new question")
                resultTextElement.innerHTML = "Sorry, an error occurred; the World Bank API does not have a page for this region"
                return
            }

            capital = countryData[0].capitalCity

            if (capital == "") {
                // The following error occurs for Taiwan (and maybe others):
                resultTextElement.innerHTML = "Sorry, an error occurred; the World Bank API does not list a capital for this region"
                return
            }

            console.log("True capital of " + randomCountryCode + " is:  " + capital)
            var message = ""
            if (userAnswer.trim() == "") {
                message = "The capital of " + countriesAndCodes[randomIndex].name + " is " + capital
            } else if (capital.toLowerCase() == userAnswer.toLowerCase().trim()) {
                message = "Correct!  The capital of " + countriesAndCodes[randomIndex].name + " is indeed " + capital
            } else {
                message = "Sorry, the capital of " + countriesAndCodes[randomIndex].name + " is not " + userAnswer
                + "; it is " + capital
            }
            resultTextElement.innerHTML = message
        })
        .catch( err => {
            attemptsRemaining--
            console.log(err)
            setTimeout(compareUserAnswerToWorldBankData, 1000, attemptsRemaining)
        })
}

playAgainButton.addEventListener("click", playAgainOnClick)
function  playAgainOnClick() {
    // Clear out the user answer and feedback:
    userAnswerElement.value = ""
    resultTextElement.innerHTML = ""

    // Get a new question:
    newQuestion()
}