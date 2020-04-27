import { checkForName } from './js/nameChecker'
import { handleSubmit } from './js/formHandler'

import './styles/base.scss'
import './styles/footer.scss'
import './styles/form.scss'
import './styles/header.scss'
import './styles/resets.scss'

//console.log(checkForName);
//console.log(handleSubmit);

function logSubmit(event) {
//   log.textContent = `Form Submitted! Time stamp: ${event.timeStamp}`;
   event.preventDefault();
   console.log('in logSubmit');
   let formText = document.getElementById('name').value;
   console.log('formText: ' + formText);

   postData('/sentiment', {text: formText});
}

// Using event listener per mentor advice at https://knowledge.udacity.com/questions/82043
// Accepts both keypress and button clicks.
const form = document.getElementById('form');
form.addEventListener('submit', logSubmit);

// Call local server to post the results
const postData = async(url, data) => {
  console.log('url: ' + url);
  console.log('data: ' + JSON.stringify(data));
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

