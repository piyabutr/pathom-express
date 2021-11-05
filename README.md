# pathom-express
: npm install -g express-generator
: express --view=ejs myapp
: cd myapp
: npm install

# config
: www -> change port number
: app.js -> main code

# deploy
: npm install -g nohup
: to start: 
:: nohup npm start &
: to stop
:: add to package.json
	{
		"stop": "killall node"
	}
:: npm stop 

#TODO
- show processing result on screen
- show error if any input mapping data is missing
- show download button
- upload new mapping
- enhance user exp displaying more data