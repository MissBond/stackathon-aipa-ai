'use strict';

const socket = io();

const outputYou = document.querySelector('.output-you');
const outputBot = document.querySelector('.output-bot');
const recipeList = document.querySelector('.recipes');
const infoList = document.querySelector('.info');

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

document.querySelector('button#speak-button').addEventListener('click', () => {
  recognition.start();
});

function show (elem) {
	elem.style.display = 'flex';
};

recognition.addEventListener('speechstart', () => {
  console.log('Speech has been detected.');
});

recognition.addEventListener('result', (e) => {
  console.log('Chat detected.');

  let last = e.results.length - 1;
  let text = e.results[last][0].transcript;
  outputYou.textContent = text;

  console.log('me', e.results[0][0].transcript)
  console.log('Confidence: ' + e.results[0][0].confidence);

  socket.emit('chat message', text);
});

recognition.addEventListener('speechend', () => {
  recognition.stop();
});

recognition.addEventListener('error', (e) => {
  outputBot.textContent = 'Error: ' + e.error;
});

function synthVoice(text) {
  const synth = window.speechSynthesis;
  const utterance = new SpeechSynthesisUtterance();
  utterance.voice = speechSynthesis.getVoices().filter(function(voice) {
    return voice.name == "Google UK English Female"
  })[0];;
  utterance.text = text;
  synth.speak(utterance);
}

socket.on('bot reply', function(replyText) {
  synthVoice(replyText);
  console.log('reply', replyText)

  if(replyText == '') replyText = '(No answer...)';
  if (replyText === 'Information saved!') {
    console.log('saved info!')
    show(infoList);
  }
  if (replyText === 'Recipe saved!') {
    console.log('saved recipe!')
    show(recipeList);
  }
  outputBot.textContent = replyText;
});

