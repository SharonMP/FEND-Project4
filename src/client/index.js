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
    markUIWithError('There was an unexpected error with summarizing the text');
  }
}

// Call local server to post the results
const postData = async(url, data) => {

  if (data === "ERROR") {
    return "ERROR";
  }
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
    console.log("Error in postData: ", error);
  }
}

// Call local server to get the results and render on page
const updateUI = async(data) => {
  try {

    if (data === "ERROR") {
      markUIWithError('There was an unexpected error with summarizing the text');
      return;
    }
    const request = await fetch('/all');
    const response = await request.json();

    if (typeof(response) !== 'undefined') {
      document.getElementById('results').innerHTML = 'Summary: ' + response.sentences;
    } else {
      markUIWithError('There was an unexpected error with summarizing the text');
      return;
    }
  } catch(error) {
    console.log("Error in updateUI: ", error);
    markUIWithError('There was an unexpected error with summarizing the text');
    return;
  }
}

function markUIWithError(message) {
  const inputElement = document.getElementById('name');
  inputElement.style.backgroundColor = 'red';
  document.getElementById('results').innerHTML = message;
}

// Button handler that chains a series of Promises (async calls) using `then`
function performAction(event) {
  event.preventDefault();
  const inputElement =  document.getElementById('name');
  const url = inputElement.value;

  const validationResult = validateFormInput(url);
  if (validationResult === formInputValidationReasonCode.URL_PARSE_ERROR) {
    markUIWithError('URL is not valid');
  } else if (validationResult === formInputValidationReasonCode.EMPTY) {
    markUIWithError('Blank URL is not allowed');
  } else {
    getSummary('/summarize', {url: url})
    .then(function(data) {
      if (typeof(data) !== 'undefined') {
        const sentencesCollection = data.sentences;
        const sentences = sentencesCollection.join(' ');
        postData('/add', {sentences: sentences});
      } else {
        markUIWithError('There was an unexpected error with summarizing the text');
        return "ERROR";
      }
    })
    .then(function(data) {
      return updateUI(data);
    });
  }
}

// Using event listener per mentor advice at https://knowledge.udacity.com/questions/82043
// Accepts both keypress and button clicks.
const form = document.getElementById('form');
form.addEventListener('submit', performAction);
