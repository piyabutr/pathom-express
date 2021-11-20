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
- upload new mapping
- enhance user exp displaying more data
- deploy on windows server and run as a background service