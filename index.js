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

    switch (intent) {
      case 'Clova.YesIntent':
        // Build speechObject directly for response
        responseHelper.setSimpleSpeech({
          lang: 'ja',
          type: 'PlainText',
          value: 'はいはい',
        });
        break;
      case 'Clova.NoIntent':
        // Or build speechObject with SpeechBuilder for response
        responseHelper.setSimpleSpeech(
          clova.SpeechBuilder.createSpeechText('いえいえ')
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
