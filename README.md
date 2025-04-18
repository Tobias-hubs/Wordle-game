#B7, inlämning 2: Wordle-spel med highscore-lista

#Important notices
-Using Local mongoDB 
-In root package.json "install": "npm install --legacy-peer-deps && npm run install-client",
    "install-client": "cd client && npm install"
    should enable to install dependencies for both client and root. as i have two package.json for front and backend. 
-TSX is used in frontend. 
-Logic that is easy to cheat like finishing time, correctWord is only on backend and frontend receives this only if game is won via API. 
-When submit highscore buttons is initialized the filtering logic in backend app.get("/highscores/:wordLength/:allowRepeats") takes the user to for example "http://localhost:5080/highscores/8/false" and only shows the filtered parameters choosen when the game started.
There is also /highscore route to show all highscores from the button highscore page. 

-Testing the gameflow with integration test. Controls the start, check-guess and endgame api. Using experimental function jest.unstable_mockModule to write over chooseWord in gameLogic.js. Mocking chooseWord to always return "APPLE". The test is run with in-memory mongoDB instance by mongomemoryserver. and this is also redirected from if statement in server.js to only use in memory when NPM test is initialized. 