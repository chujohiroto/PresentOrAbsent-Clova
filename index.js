const clova = require('@line/clova-cek-sdk-nodejs');
const express = require('express');
const bodyParser = require('body-parser');

const clovaSkillHandler = clova.Client
  .configureSkill()
  .onLaunchRequest(responseHelper => {
    responseHelper.setSimpleSpeech({
      lang: 'ja',
      type: 'PlainText',
      value: '遅刻チェック',
    });
  })
  .onIntentRequest(async responseHelper => {
    const intent = responseHelper.getIntentName();
    const sessionId = responseHelper.getSessionId();
    console.log("intent:" + intent);

    switch (intent) {
      case 'class_set':
        console.log(intent.value);
        // Build speechObject directly for response
        responseHelper.setSimpleSpeech({
          lang: 'ja',
          type: 'PlainText',
          value: getMessage(intent.value),
        });
        break;

      case 'Clova.NoIntent':
        // Or build speechObject with SpeechBuilder for response
        responseHelper.setSimpleSpeech(
          clova.SpeechBuilder.createSpeechText('何限か言ってください')
        );
        break;
    }
  })
  .onSessionEndedRequest(responseHelper => {
    const sessionId = responseHelper.getSessionId();

    // Do something on session end
  })
  .handle();

const app = new express();
const clovaMiddleware = clova.Middleware({ applicationId: process.env.APPLICATION_ID });
// Use `clovaMiddleware` if you want to verify signature and applicationId.
// Please note `applicationId` is required when using this middleware.
app.post('/bot', clovaMiddleware, clovaSkillHandler);

// Or you can simply use `bodyParser.json()` to accept any request without verifying, e.g.,
app.post('/bot', bodyParser.json(), clovaSkillHandler);

const PORT = process.env.PORT || 8080;

/* 2. listen()メソッドを実行して3000番ポートで待ち受け。*/
var server = app.listen(PORT, function () {
  console.log("Node.js is listening to PORT:" + server.address().port);
});


function getMessage(t) {
  var dtl = getTimeLesson(t);

  dtl.setMinutes(dtl.getMinutes() - 30);

  var h = dtl.getTime() - getnow().getTime();

  var t = getnow().getTime() - getToday().getTime();

  var ti = h - t;
  //var ti = dtl.getTime() - getnow().getTime();

  console.log(ti);
  //秒数で判定
  if (ti > 0) {
    return "間に合うよ";
  } else {
    return "諦めろ";
  }
}


function getTimeLesson(t) {
  var lesson;
  var tint = Number(t)
  switch (tint) {
    case 1:
      lesson = new Date(new Date().setHours(9, 0, 0, 0));
      break;
    case 2:
      lesson = new Date(new Date().setHours(10, 30, 0, 0));
      break;
    case 3:
      lesson = new Date(new Date().setHours(13, 0, 0, 0));
      break;
    case 4:
      lesson = new Date(new Date().setHours(14, 30, 0, 0));
      break;
    case 5:
      lesson = new Date(new Date().setHours(16, 0, 0, 0));
      break;
    case 6:
      lesson = new Date(new Date().setHours(17, 30, 0, 0));
      break;
    case 7:
      lesson = new Date(new Date().setHours(19, 0, 0, 0));
      break;
    case 8:
      lesson = new Date(new Date().setHours(21, 30, 0, 0));
      break;
    default:
      break;
  }
  return lesson;
}

function getToday() {
  var today = new Date(new Date().setHours(0, 0, 0, 0));
  return today;
}

function getnow() {
  var now = new Date();
  return now;
}
