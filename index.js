
let express = require('express');
let app = express();

let sqlite = require('sqlite');
let fetch = require('node-fetch');

// authentication middleware, uses access token from google
function auth(req, res, next) {
	// retrieve access token and verify
	if (req.headers.authorization) {
	  
	  let token = req.headers.authorization.indexOf('Bearer') == 0 ?
		    req.headers.authorization.split(' ')[1] : null;
	  
	  console.log(token);
	  
	  url = `https://oauth2.googleapis.com/tokeninfo?access_token=${token}`;

    fetch(url).then( res => {
      return res.json();
    }).then( json => {
      console.log('token valid', json);
      next();
    }).catch( err => {
		  let body = JSON.parse(body);
		  if (body.error) {
			  res.status(401);
			  res.send(body);            
      }      
    });
  } else {
	  res.status(401);
	  res.send('Missing auth header');
  }    

}

function setupServer(db) {

  // This is a test frontend - uncomment to check it out
  app.use(express.static('public'));

  app.use(auth);    
    
  app.get('/info', (req, res) => {
		res.send('Full stack example');    
  });

  // retrieve all unique stree names
  app.get('/streets', (req, res) => {
    db.all(`SELECT DISTINCT(name) FROM BikeRackData`)
      .then( data => {
        console.log(data);
        res.send(data);
      });
  });

  app.get('/streets/:street/', (req, res) => {
    let streetName = req.params.street;
    // query based on street
	  // NOTE: this is open to SQL injection attack
    db.all(`SELECT * FROM BikeRackData WHERE name = '${streetName}'`)
      .then( data => {
        res.send(data);              
      });
    

  });

  

  let server = app.listen(8080, () => {
    console.log('Server ready', server.address().port);
  });
  
}

sqlite.open('database.sqlite').then( db => {
	//console.log('database opened', db);

  setupServer(db);
  //return db.all('SELECT * from TEST');
  
});

