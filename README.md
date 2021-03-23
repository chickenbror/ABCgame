# ABC Game

![](https://media.giphy.com/media/FLj65JIF1olGbW3Meu/giphy.gif)

[Live demo web app](http://chickenbror.github.io/ABCgame "(http://chickenbror.github.io/ABCgame")

(React component adapted from [github.com/vladmaraev/react-xstate-colourchanger](http://github.com/vladmaraev/react-xstate-colourchanger "github.com/vladmaraev/react-xstate-colourchanger")) 

(React + xstate + Webspeech API & Natural.js)

###### To run locally:
` npm install` (if error occurs, try `npm install --legacy-peer-deps`)

  `npm start`

###### To edit or add more question-sets:
go to src/game_codes/questions.json

## Design notes and diary
##### Made for LT2216 Dialog Systems game project at Göteborgs universitet

##### Collaborators:
- 	Hsien-hao Calvin Liao 
- 	Eirini Tsakiri
----

##### Project diary of who does what and when:

###### 1. Discussed and came up with game concept
- (2021-02-02, Eirini & Calvin)
- Notes for brainstorming the idea & the flow chart


	
	
	
	-![Notes for brainstorming & the flow chart](https://media.giphy.com/media/GayPUtZ3UFPcsGBtxg/giphy.gif "Notes for brainstorming & the flow chart")


###### 2. Made prototype game in Python
- (2021-02-11, Calvin)
- original py codes: https://tinyurl.com/lt2216-project-python

	![Py code](https://media.giphy.com/media/BALZbz6P3BJmUui3jQ/giphy.gif "Py code")


###### 3. Rewrote protopype game in TypeScript
- (2021-03-03, Calvin)
- original ts codes: https://tinyurl.com/lt2216-project

	![ts code](https://media.giphy.com/media/g4mvkk7aZujKuGl4Af/giphy.gif "ts code")

###### 4. Combined Step3 with React & Xstate from Lab2/4 to make a web app with voice interface
- (2021-03-07, Calvin)
- dependencies: Natural (to singularise speech-recognised words)

###### 5. Test/debug/improvement feedback
- (2021-03-08, Eirini)
- "I forget what the letter is during the game" >> Show current letter on the screen as a visual reminder
- "Players don't know what other commands can be said" >> Show prompt messages in the centre button "or say clue/skip...etc"

###### 6. Added React components & updated CSS
- (2021-03-09, Calvin)
- Display prompts, recognised texts, and context on screen
- Confetti effect when winning
- Text animation
- dependencies: react-dom-confetti, react-text-loop, windups, react-reveal

###### 7. Added more question-sets to game to make it playable
- (2021-03-10 ~ 2021-03-16, Eirini & Calvin)
- During testing, we noticed that some words are not be easily recognised, especially when said as a single word, so they were removed from the question-answers.

###### 8. Made the UI prettier
- (2021-03-12 ~ 2021-03-14, Calvin)
- Adjusted layout, colours, and animations

###### 9. Improved on the game
- (2021-03-19, Eirini)
- Added extra context and states in dmGame, eg maximum allowance on skipping the question and asking for clues.
- It also helps saving memery as now each round of game only requires an array of max 10 questions (ie, 5 to win + 5 chances to skip)

###### 10. Presentation & Demo
- (2021-03-23, Calvin & Eirini)
- Presentation for LT2216 course & show the game demo.


## Challenges, Limitations and Future Improvement

##### Challenges during development: 
- Lemmatiser overfits (e.g. philippines>>philippine). We solved this by matching both original and lemmatised inputs.
- The assigned letter is repeated a lot when restarting the game. Wesolved this by adding a guarding state and context.lastLetter so the new letter won't be the same (eg, S>>A>>K>>D>>S... instead of S>>S>>S... in a row).
- Some components show normally on localhost but when deployed on GitHub Pages they become invisible (although when I inspected Elements in the browser, they are definitely there and at the right position, except they become invisible. Might be due to CSS compatibility?) Compromise: We made basic versions of the components for GitHub deployment & components with more CSS styles for demo (running on localhost). Might try deploying to another service, eg Azure/AWS to see what the problem is.

## "Which parts of the course was most useful? how did we apply them?" 
- The lab tasks were the most useful as they involved plenty of work and we gained hands-on experience thanks to them.
- It was an extreme challenge for us to have to suddenly switch to another programming language and framework, that is, TypeScript, React, and XState, without any previous experience, guidance or teaching. Ultimately, we managed, and we acquired more knowledge on programming because of that, but it was a very short time period, which was not ideal.

## "How can the game be developed in the future?" 
##### Programming-wise:
- By using other cloud-based speech APIs?
	Pros: Shorter latency, more configuration choices, wider browser support. 
	Cons: requires paid subscription.
- By applying SSXML, eg "Name a <em>SOMETHING</em>"
- Use web-crawler to automatically create questions, i.e. from Wikipedia's list of things
- Suggest adding a new answer to the database, if many players said it
##### Game-wise:
- Allow choices of question categories, e.g. nerd, movie, geography, music, etc.
- Lose a heart if asking too many hints / skipping to many questions
- Versions in different languages, which will allow localised questions/answers, i.e. place names in local languages
		
- I (Calvin) made an experimental version of the game in Swedish, but with some limitations...
- *Limited support:* yet to find a suitable JS lemmatizer for Swedish.   The availability of TTS voices varies on different environments,
eg, I only managed to run it on my Mac but not on Windows.   On the other hand, speech-to-text was easy to configure by just specifiying the code, eg, 'sv-SE', as it's processed online in Chrome.   Below is the demo of the Swedish version: the ASR can recognise Swedish, but TTS's pronunciation may be awful. For example, in Chrome on my Windows it has a German accent and in Edge it can pronounce in Swedish but I couldn't access the mic, so in the end I could only play it in Chrome on my Mac, where both TTS and ASR worked.
- ![Swedish version](https://media.giphy.com/media/SxBHJI0JoVd5jbmRGB/giphy.gif)
- [Swedish game demo: "ABC-spelet"](https://chickenbror.github.io/ABCspelet) 
