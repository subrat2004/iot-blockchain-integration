'use strict';

const { Gateway, Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const path = require('path');
const { buildCAClient, registerAndEnrollUser, enrollAdmin } = require('../../test-application/javascript/CAUtil.js');
const { buildCCPOrg1, buildWallet } = require('../../test-application/javascript/AppUtil.js');
const channelName = 'mychannel';
const chaincodeName = 'ledger';
const mspOrg1 = 'Org1MSP';
const mail=require('./email.js');
const walletPath = path.join(__dirname, 'wallet');
const userId = 'appUser1';
const express=require('express');
let lentemp=0;
let lenevent=0;
const MainUrl='http://10.29.8.91/';
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJTdWJyYXQiLCJleHAiOjE3MTI4Mjg0MDIsImlhdCI6MTcxMjgyNDc5Mn0.yxF5dqkD0Vq5ohQdUy36wHV0IBzLsdFVBvE3wx3lYyw';
require('dotenv').config();
// const ip = "10.29.8.91";
// const apiUrl = `http://${ip}/metadata/all`;

// const datao=await fetch(apiUrl, {
//   headers: {
//     Authorization: `Bearer ${token}`
//   }
// })
// .then(response => {
//   if (!response.ok) {
//     throw new Error('Network response was not ok');
//   }
//   return response.json(); // Parse response as JSON
// })
// .then(data => {
//   console.log(data); // Print the JSON data to the console
// })
// .catch(error => {
//   console.error('There was a problem with the fetch operation:', error);
// });


// Wrap the application logic in an async function
async function startServer() {
	try {
		// Dynamically import node-fetch
		const app = express();
		const PORT = 3005;
		const API_URL = 'http://10.29.8.91/event/all';

		app.get('/', async (req, res) => {
			try {
				const response = await fetch(API_URL,{
					headers: {
						Authorization: `Bearer ${token}` // Include the token in the Authorization header
					}
				}); // Use .default since we're importing an ES module
				const data = await response.json();

				// Render HTML to display events
				let html = `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Shipment events</title>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
            <style>
              body {
                font-family: 'Arial', sans-serif;
                background-color: #f7f7f7;
                margin: 0;
                padding: 0;
                color: #333;
              }
              .container {
                max-width: 800px;
                margin: 50px auto;
                background: #fff;
                padding: 20px;
                border-radius: 10px;
                box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
              }
              h1 {
                text-align: center;
                margin-bottom: 20px;
                color: #009688;
              }
              .event {
                border-bottom: 1px solid #eee;
                padding: 20px 0;
              }
              .event:last-child {
                border-bottom: none;
              }
              .event p {
                margin: 5px 0;
                color: #666;
              }
              .icon {
                margin-right: 10px;
                color: #009688;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>Notification dashboard</h1>
        `;

				data.forEach(({ event, shipment,timestamp }) => {
					html += `
            <div class="event">
			  <p><i class="fas fa-calendar-alt icon"></i><strong>Event:</strong> ${timestamp}</p>
              <p><i class="fas fa-calendar-alt icon"></i><strong>Event:</strong> ${event}</p>
              <p><i class="fas fa-box icon"></i><strong>Shipment:</strong> ${shipment}</p>
            </div>
          `;
				});

				html += `
              </div>
            </body>
          </html>
        `;

				res.send(html);
			} catch (error) {
				res.status(500).send(`<h1>Error</h1><p>${error.message}</p>`);
			}
		});

		app.listen(PORT, () => {
			console.log(`Server is running on http://localhost:${PORT}`);
		});
	} catch (err) {
		console.error('Error importing node-fetch:', err);
	}
}



async function addTemp(contract){
	const url1=MainUrl+'metadata/all';
	const fetchedData1=await fetch(url1,{
		method:'GET',
		headers: {
			Authorization: `Bearer ${token}` // Include the token in the Authorization header
		}
	});
	const data1=await fetchedData1.json();
	let len=data1.length;
	for(let i=lentemp;i<len;i++){
		await contract.submitTransaction('storeTemp',data1[i]);
		console.log(`${data1[i].timestamp} stored in blockchain`);
	} lentemp=len;
}
async function addEvent(contract){const url2=MainUrl+'event/all';
	const fetchedData2=await fetch(url2,{
		Method:'GET',
		headers: {
			Authorization: `Bearer ${token}` // Include the token in the Authorization header
		}
	});
	const data2=await fetchedData2.json();
	let len=data2.length;
	for(let i=lenevent;i<len;i++){
		await contract.submitTransaction('storeEvents',data2[i]);
		//const mailed=await mailer.sendMail(data2[i]);
		await mail(data2[i]);

		console.log(`${data2[i].event} of ${data2[i].shipment} stored in blockchain`);
	} lenevent=len;
	startServer();

}
async function connection() {
	let skipInit = false;
	if (process.argv.length > 2) {
		if (process.argv[2] === 'skipInit') {
			skipInit = true;
		}
	}

	try {
		// build an in memory object with the network configuration (also known as a connection profile)
		const ccp = buildCCPOrg1();

		// build an instance of the fabric ca services client based on
		// the information in the network configuration
		const caClient = buildCAClient(FabricCAServices, ccp, 'ca.org1.example.com');

		// setup the wallet to hold the credentials of the application user
		const wallet = await buildWallet(Wallets, walletPath);

		// in a real application this would be done on an administrative flow, and only once
		await enrollAdmin(caClient, wallet, mspOrg1);

		// in a real application this would be done only when a new user was required to be added
		// and would be part of an administrative flow
		await registerAndEnrollUser(caClient, wallet, mspOrg1, userId, 'org1.department1');

		// Create a new gateway instance for interacting with the fabric network.
		// In a real application this would be done as the backend server session is setup for
		// a user that has been verified.
		const gateway = new Gateway();

		try {
			// setup the gateway instance
			// The user will now be able to create connections to the fabric network and be able to
			// submit transactions and query. All transactions submitted by this gateway will be
			// signed by this user using the credentials stored in the wallet.
			await gateway.connect(ccp, {
				wallet,
				identity: userId,
				discovery: { enabled: true, asLocalhost: true } // using asLocalhost as this gateway is using a fabric network deployed locally
			});

			// Build a network instance based on the channel where the smart contract is deployed
			const network = await gateway.getNetwork(channelName);

			// Get the contract from the network.
			const contract = network.getContract(chaincodeName);

			// Initialize a set of asset data on the channel using the chaincode 'InitLedger' function.
			// This type of transaction would only be run once by an application the first time it was started after it
			// deployed the first time. Any updates to the chaincode deployed later would likely not need to run
			// an "init" type function.
			if (!skipInit) {
				try {
					console.log('\n--> Submit Transaction: InitLedger, function creates the initial set of assets on the ledger');
					await contract.submitTransaction('InitLedger');
					console.log('*** Result: committed');
				} catch (initError) {
					// this is error is OK if we are rerunning this app without restarting
					console.log(`******** initLedger failed :: ${initError}`);
				}
			} else {
				console.log('*** not executing "InitLedger');
			}
			await addEvent(contract);
			await addTemp(contract);
			// setInterval(async () => {
			// 	await addEvent(contract);
			// 	await addTemp(contract);
			// }, 60000); // 60000 milliseconds = 1 minute

		}
		catch(error){
			console.log(`error:${error.message}`);
		}
	}catch (error) {
		console.error(`******** FAILED to run the application: ${error}`);
		process.exit(1);
	}

	console.log('*** application ending');

} connection();