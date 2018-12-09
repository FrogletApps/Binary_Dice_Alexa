/* eslint-disable  func-names */
/* eslint-disable  no-console */

const Alexa = require('ask-sdk');
//const apl = require('apl.json');

const RollADiceHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'LaunchRequest'
      || (request.type === 'IntentRequest'
        && request.intent.name === 'rollADiceIntent');
  },
  handle(handlerInput) {
    var diceResults = [];
    var rolls;
    var diceSum = 0;

    rolls = handlerInput.requestEnvelope.request.intent.slots.numberOfDice.value;
    
    if (rolls === undefined){
      rolls = 1;
    }

    //console.log("Number of rolls: " + rolls);
    
    for(let i = 0; i < rolls; i++){
        diceResults[i] = dice();
        //console.log("Roll " + i + ": " + diceResults[i]);

        //Add the rolls together
        diceSum += parseInt(diceResults[i], 10);
        //console.log("diceSum: " + diceSum);
    }
    
    var intro = "Let's roll!  ";
    var introRoll;
    var cardTitle;
    var outputWritten;
    var outputSpeech;
    
    if (dice() == 0){
      introRoll = "<audio src='https://s3-eu-west-1.amazonaws.com/frogletappsalexa/binaryDice/coin1.mp3' />";
    }else{
      introRoll = "<audio src='https://s3-eu-west-1.amazonaws.com/frogletappsalexa/binaryDice/coin2.mp3' />";
    }
    
    if (rolls == 1){
      cardTitle = "You rolled 1 die";
      outputWritten = "You rolled a " + diceResults[0];
      outputSpeech = intro + introRoll + outputWritten;
    }
    else {
      cardTitle = "You rolled " + rolls + " dice";
      outputWritten = "You rolled a " + diceResults[0];
      for (let i = 1; i < diceResults.length - 1; i++){
        outputWritten += ", a " + diceResults[i];
      }
      outputWritten += ", and a " + diceResults[diceResults.length - 1];
      outputWritten += ".  Your total is " + parseInt(diceSum, 10);
      outputSpeech = intro + introRoll + outputWritten;
      //console.log(diceSum);
    }
    
    console.log("Card: " + outputWritten);
    //console.log("Output: " + speechText);

    return handlerInput.responseBuilder
      .speak(outputSpeech)
      .withSimpleCard(cardTitle, outputWritten)
      /*.addDirective({
          type: 'Alexa.Presentation.APL.RenderDocument',
          version: '1.0',
          document: apl,
          datasources: {}
      })*/
      .getResponse();
  },
};

const HelpHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest' &&
      request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(HELP_MESSAGE)
      .reprompt(HELP_REPROMPT)
      .getResponse();
  },
};

const ExitHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest' &&
      (request.intent.name === 'AMAZON.CancelIntent' ||
        request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak('Sorry, an error occurred.')
      .reprompt('Sorry, an error occurred.')
      .getResponse();
  },
};

const SKILL_NAME = 'Binary Dice';
const HELP_MESSAGE = 'You can ask me to roll a binary die, or, you can say exit... What can I help you with?';
const HELP_REPROMPT = 'What can I help you with?';

const skillBuilder = Alexa.SkillBuilders.standard();

exports.handler = skillBuilder
  .addRequestHandlers(
    RollADiceHandler,
    HelpHandler,
    ExitHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();
  
  
  
//Generates a random number between 0 and 1 then rounds it to the nearest one
function dice(){
    return Math.round(Math.random());
}