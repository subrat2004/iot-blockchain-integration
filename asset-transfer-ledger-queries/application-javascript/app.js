'use strict';
const connection=require('./connection');
const mail=require('./email');
const MainUrl='http://10.29.8.91/';
async function addTemp(){const contract=await connection();
	const url1=MainUrl+'metadata/all';
	const data1=await fetch(url1,{
		method:'GET'
	});
	let len=data1.length;
	for(let i=0;i<len;i++){
		await contract.submitTransaction('storeTemp',data1[i]);
		console.log(`${data1[i].timestamp} stored in blockchain`);
	}
} addTemp();
async function addEvent(){const url2=MainUrl+'event/all';
	const data2=await fetch(url2,{
		Method:'GET'
	}); const contract=await connection();
	let len=data2.length;
	for(let i=0;i<len;i++){
		await contract.submitTransaction('storeEvents',data2[i]);
		//const mailed=await mailer.sendMail(data2[i]);
		await mail(data2[i]);

		console.log(`${data2[i].event} of ${data2[i].shipment} stored in blockchain`);
	}

} addEvent();
