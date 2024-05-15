// const WebSocket = require('ws');

// // Initialize the WebSocket server on port 8080
// const wss = new WebSocket.Server({ port: 8080 });

// // Connect to another WebSocket server on port 5052
// const wsClient = new WebSocket('ws://localhost:5052');

// wsClient.on('open', function open() {
//   console.log('Connected to the WebSocket server on port 5052 as a client');
// });

// wsClient.on('message', function incoming(data) {
//   console.log('Received data from the server on port 5052:', data);
// });

// wsClient.on('close', function close() {
//   console.log('Disconnected from the server on port 5052');
// });

// wsClient.on('error', function error(err) {
//   console.error('Connection error to the server on port 5052:', err);
// });

// wss.on('connection', function connection(ws) {
//   console.log('A new client connected to the server on port 8080!');

//   ws.on('message', function incoming(message) {
//     console.log('Received from client on port 8080:', message);
//     // Forward the message to the WebSocket server on port 5052
//     if (wsClient.readyState === WebSocket.OPEN) {
//       wsClient.send(message);
//       console.log('Forwarded message to server on port 5052');
//     } else {
//       console.log('WebSocket client is not connected to server on port 5052');
//     }
//   });

//   // Optionally, handle messages from the server on port 5052 to send back to the client connected on port 8080
//   wsClient.on('message', function incoming(data) {
//     // Forward messages from port 5052 server to this client, if needed
//     ws.send(data);
//   });

//   ws.send('Welcome to the WebSocket server on port 8080!');
// });



// console.log('WebSocket server started on ws://localhost:8080');

// ---------------------------------------------


// const WebSocket = require('ws');

// const wss = new WebSocket.Server({ port: 8080 });
// const wss2 = new WebSocket.Server({ port: 5052 });

// let data = '';
// // const wsClient = new WebSocket('ws://localhost:5052');

// wss.on('connection', function connection(ws) {
//   console.log('A new client connected on 8080!');
  
//   ws.on('message', function incoming(message) {
//     data = message;
//     // console.log('Message Received: %s', data);
//     // Echo back messages to the client
//     // ws.send(`Server received: ${message}`);
//     wss2.send(data);
//     console.log('Sent to 5052: %s', data);
//   });

//   // Send a message to the client
//   ws.send('Welcome to the WebSocket server!');
// });

// wss2.on('connection', function connection(ws) {
//   console.log('A new client connected to the server on port 5052!');
//   if (data) {
//     console.log('sent: %s', data);
//     wss2.send(data);
//   }
// });

// console.log('WebSocket server started on ws://localhost:8080');

// ---------------------------------------------

const { createClient } = require('@supabase/supabase-js');
const WebSocket = require('ws');
const supabaseUrl = 'https://xrkxesapeuwadzskvmmj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhya3hlc2FwZXV3YWR6c2t2bW1qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTQ3NjE3MTYsImV4cCI6MjAzMDMzNzcxNn0.o7s4TAPCe9XFQsqWl651wEic3npClQpQp_pkvzqSKUM';

const wss = new WebSocket.Server({ port: 8080 });
const wss2 = new WebSocket.Server({ port: 5052 });

const supabase = createClient(supabaseUrl, supabaseKey);
let data = '';

async function sendToSupabase(data) {
  const { things, errors } = await supabase
  .from('game')
  .select()
  console.log('things:', things)
  // Assuming you have a table named 'messages' in your Supabase database
  const parts = data.split(';'); // Assuming data is in format "name;score;game"
  const name_1 = parts[0];
  console.log("name:", name_1)
  const score_1 = parseInt(parts[1]);
  console.log("score:", score_1)
  const game_1 = parts[2];
  console.log("game:", game_1)
  // supabase
  //     .from('game')
  //     .insert({ name:name, score:score, game:game})
  //     .then((response) => {
  //         console.log('Data sent to Supabase:', response);
  //     })
  //     .catch((error) => {
  //         console.error('Error sending data to Supabase:', error);
  //     });
  const { thingy, error } = await supabase
  .from('game')
  // .insert([
  //   { name: name_1, score: score_1, game: game_1},
  // ])
  .insert([
    { name: name_1, score: score_1, game: game_1},
  ])
  .select()
}

wss.on('connection', function connection(ws) {
  console.log('A new client connected on 8080!');

  ws.on('message', function incoming(incomingMessage) {
    let message = incomingMessage.toString();
    const firstChar = message.charAt(0);
    
    // Remove the first character from the message
    const data = message.slice(1);
    // Check if the first character of the message is '0'
    if (firstChar === '0') {
      console.log('Received on 8080 and sending to all clients on 5052: %s', data);
        // Broadcast to all clients connected to wss2
        wss2.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {
                client.send(data);
            }
        });
    } else if (firstChar === '1') {
        // Send the data to supabase
        // Assuming you have some function to handle this, replace 'sendToSupabase(data)' with your actual function call
        sendToSupabase(data);
      } else if (firstChar === '2') {
        console.log('Received on 8080: %s', data);
        wss.clients.forEach(function each(client) {
              client.send(data);
        });
      }
    });
  // Send a welcome message to the client
  ws.send('Welcome to the WebSocket server!');
});

wss2.on('connection', function connection(ws) {
  console.log('A new client connected on 5052!');

  // Optionally, if you want to send existing data immediately upon a new connection
  if (data && ws.readyState === WebSocket.OPEN) {
    console.log('Sending existing data to a newly connected client on 5052: %s', data);
    ws.send(data);
  }
});

console.log('WebSocket servers started on ws://localhost:8080 and ws://localhost:5052');
