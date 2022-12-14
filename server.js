const express = require( 'express' )
const jwt = require( 'jsonwebtoken' )
const cors = require( 'cors' )
const bodyParser = require( 'body-parser' )
const fs = require( 'fs' )
const events = require( './db/events.json' )

const app = express()

app.use( cors(  ))
app.use( bodyParser.json(  ))

app.get( '/', ( req, res ) => {
  res.json( {
    message: 'Welcome to the API.'
  })
})

app.get( '/dashboard', verifyToken, ( req, res ) => {
  jwt.verify( req.token, 'the_secret_key', err => {
    if ( err ) {
      res.sendStatus( 401 )
    } else {
      res.json({
        events: events
      })
    }
  })
})

app.post( '/register', ( req, res ) => {
  console.log( 'body: ', req.body );
  if ( req.body ) {
    const user = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
      // In a production app, you'll want to encrypt the password
    }
    console.log( user.password );
    const data = JSON.stringify( user, null, 2 )
    const dbUserEmail = require( './db/user.json' ).email
    const errorsToSend = []

    if ( dbUserEmail === req.body.email ) {
      errorsToSend.push( "An account with this email already exists" )
    }

    console.log( user.password.length );
    console.log( user.password );

    if ( user.password.length < 5 ) {
      console.log( 'How long is your password', user.password.length );
      errorsToSend.push( "Password too short." )
    }

    if ( errorsToSend.length > 0 ) {
      res.status( 400 ).json( { errors: errorsToSend } )
    } else {
      fs.writeFile( './db/user.json', data, err => {
        if ( err ) {
          console.log( err + data )
        } else {
          const token = jwt.sign( { user }, 'the_secret_key' )
          // In a production app, you'll want the secret key to be an environment variable
          res.json( {
            token,
            email: user.email,
            name: user.name
          })
        }
      })
    }
  }
})

app.post( '/login', ( req, res ) => {
  const userDB = fs.readFileSync( './db/user.json' )
  const userInfo = JSON.parse( userDB )
  if (
    req.body &&
    req.body.email === userInfo.email &&
    req.body.password === userInfo.password
   ) {
    const token = jwt.sign({ userInfo }, 'the_secret_key' )
    // In a production app, you'll want the secret key to be an environment variable
    res.json( {
      token,
      email: userInfo.email,
      name: userInfo.name
    })
  } else {
    console.log( 'Something went wrong' )
    res.status( 401 ).json({ error: "Invalid login. Please try again." })
  }
})

// MIDDLEWARE
function verifyToken ( req, res, next ) {
  const bearerHeader = req.headers['authorization']

  if ( typeof bearerHeader !== 'undefined' ) {
    const bearer = bearerHeader.split( ' ' )
    const bearerToken = bearer[1]
    req.token = bearerToken
    next()
  } else {
    res.sendStatus( 401 )
  }
}

app.listen( 3000, (  ) => {
  console.log( 'Server started on port 3000' )
} )
