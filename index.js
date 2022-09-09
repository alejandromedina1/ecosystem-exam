const express = require('express');
const { Server } = require('socket.io');
const PORT = 5050;

const app = express();
const httpServer = app.listen(PORT, () => {
    console.table(
        {
            'Controller:' : 'http://localhost:5050/controller',
            'Display:' : 'http://localhost:5050/display',
        }
    )
});
const ioServer = new Server(httpServer, { path: '/real-time' });

//const staticController = express.static('public-controller');
//const staticDisplay = express.static('public-display');

app.use('/controller', express.static('public-controller'));
app.use('/display', express.static('public-display'));
app.use(express.json());

/*___________________________________________

1) Create an endpoint to GET a validation message to test if the endpoint is working
_____________________________________________ */
app.get('/snake', (request, response) => {
    response.send({message: 'We are live and ready to play!'})
})

/*___________________________________________

2) Create the socket methods to listen the events and emit a response
It should listen for directions and emit the incoming data.
_____________________________________________ */

ioServer.on('connection', (socket) => {
    socket.on('movement-direction', direction => {
        socket.broadcast.emit('receive-direction', direction)
    })

});

/*___________________________________________

3) Create an endpoint to POST user score and print it
_____________________________________________ */

let currentScore = 0;
app.post('/score', (request, response) => {
    const { score } = request.body
    currentScore += score;
    response.send({message: `Your current score is ${currentScore}`})
    console.log(`Your current score is ${currentScore}`)

})


