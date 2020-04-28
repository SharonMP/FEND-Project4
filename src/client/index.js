import { checkForName } from './js/nameChecker'
import { handleSubmit } from './js/formHandler'

import './styles/base.scss'
import './styles/footer.scss'
import './styles/form.scss'
import './styles/header.scss'
import './styles/resets.scss'

const formInputValidationReasonCode = {
    EMPTY: 'empty',
    URL_PARSE_ERROR: 'url_parse_error',
    OK: 'ok',
}

function validateFormInput(url) {
  // Pattern: http|https:www.example.com
  // TODO: Test
  const pattern = new RegExp('^https?:\/\/[a-zA-Z0-9]+.[a-zA-Z0-9]+.[a-zA-Z0-9]+\/[a-zA-Z0-9-]+$');

  if (url.length <= 0) {
    console.log("Empty input provided. Please enter a URL");
    return formInputValidationReasonCode.EMPTY;
  }

  const isUrlPatternMatched = pattern.test(url);
  if(!isUrlPatternMatched) {
    return formInputValidationReasonCode.URL_PARSE_ERROR;
  }

  return formInputValidationReasonCode.OK;
}

// Call local server to post the results
const getSummary = async(localUrl, apiUrl) => {
  const request = await fetch(localUrl, {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(apiUrl)
  });

  try {
    const response = await request.json();

    return response;
  } catch(error) {
    console.log("Error: ", error);
  }
}

// Call local server to post the results
const postData = async(url, data) => {
  const response = await fetch(url, {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  try {
    const response = await response.json();

    return response;
  } catch(error) {
    console.log("Error: ", error);
  }
}

// Call local server to get the results and render on page
const updateUI = async() => {
  try {
    const request = await fetch('/all');
    const response = await request.json();

    document.getElementById('results').innerHTML = 'Summary: ' + response.sentences;
  } catch(error) {
    console.log("Error: ", error);
  }
}

// Button handler that chains a series of Promises (async calls) using `then`
function performAction(event) {
  event.preventDefault();
  const url = document.getElementById('name').value;

  const validationResult = validateFormInput(url);
  if (!validationResult) {
    // Update form to indicate error
    console.log('validation failed');
  } else {
    getSummary('/summarize', {url: url})
    .then(function(data) {
        const sentencesCollection = data.sentences;
        const sentences = sentencesCollection.join(' ');
        postData('/add', {sentences: sentences});
    })
    .then(function() {
      return updateUI();
    });
  }
}

// Using event listener per mentor advice at https://knowledge.udacity.com/questions/82043
// Accepts both keypress and button clicks.
const form = document.getElementById('form');
form.addEventListener('submit', performAction);
