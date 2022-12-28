import bot from './assets/bot.svg'
import user from './assets/user.svg'


const form = document.querySelector('form')
const chatContainer = document.querySelector('#chat_container')


let loadInterval;

// loader functionality 

const loader = element => {

  element.textContent = ''

  loadInterval = setInterval(()=>{

    element.textContent += '.'

    if(element.textContent === '....') {

      element.textContent = ''

    }

  } , 300)

}

// typing functionality

const typeText = (element , text) => {

  let index = 0

  let interval = setInterval(()=>{

    if(index < text.length){

      element.innerHTML += text.charAt(index)
      index++
      chatContainer.scrollTop = chatContainer.scrollHeight

    }else{

      clearInterval(interval)

    }

  } , 20)

}

// Generate random ID

const generateUniqueId = () => {

  const timestamp = Date.now()
  const randomNumber = Math.random()
  const hexadecimalString = randomNumber.toString(16)

  return `id-${timestamp}-${hexadecimalString}`

}


const chatStripe = (isAi , value , uniqueId) => {

  return(

    `
    <div class ="wrapper ${isAi && 'ai'}">
      <div class="chat">
        <div class="profile">
          <img
            src = "${ isAi ? bot : user }"
            alt = "${ isAi ? 'bot' : 'user' }"
          />
        </div>

          <div class="message" id="${uniqueId}" >
            ${value}
          </div>

      </divW>
    </div>

    `

  )


}


// Form handler

const handlerSubmit = async (e) => {

  e.preventDefault()

  const data = new FormData(form)

  // user's chatStripe

  chatContainer.innerHTML += chatStripe(false , data.get('prompt'))

  form.reset()

  // bot's chatStripe

  const uniqueId = generateUniqueId()

  chatContainer.innerHTML += chatStripe(true ,"", uniqueId)

  chatContainer.scrollTop = chatContainer.scrollHeight

  const messageDiv = document.getElementById(uniqueId)

  loader(messageDiv)


  // Fetch data from OpenAi API

  const url = "https://oai-mouafak.onrender.com"

  const request = {
    method : "POST",
    headers : {
      "Content-type" : "application/json"
    },

    "body" : JSON.stringify({prompt : data.get('prompt')})
  }

  const response = await fetch(url , request)

  clearInterval(loadInterval)

  messageDiv.innerHTML=""

  if(response.ok){

    const data = await response.json()
    const parsedData = data.bot.trim()

    typeText(messageDiv , parsedData)
  }else{
    const err = await response.text();

    messageDiv.innerHTML = "Something went wrong"
    alert(err)
  }

}

form.addEventListener('submit' , handlerSubmit)

form.addEventListener('keyup' , e => e.keyCode === 13 && handlerSubmit(e))