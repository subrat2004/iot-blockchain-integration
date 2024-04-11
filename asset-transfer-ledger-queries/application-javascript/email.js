//this file contains code of sending mail and notification to the users about any event added into the database
'use strict';
const nodemailer=require('nodemailer');
let users;
require('dotenv').config();
const url='http://10.29.8.91/';
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJwcm9mZmFwdCIsImV4cCI6MTcxMjgxNzU4MSwiaWF0IjoxNzEyODEzOTcxfQ.Mxj8qH7gfneN9xfGLvXFXOP3bGb1nzbC_3JJTp3-b0I';
async function sendMail(activity){
	try{
		const response= await fetch(url+'person/all',{
			method:'GET',
			headers: {
				Authorization: `Bearer ${token}` // Include the token in the Authorization header
			}
		});
		users=await response.json();
		const message = `${activity.shipment} ${activity.event} at time ${activity.timestamp}`;
		//created nodemailer transporter
		const transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				user: process.env.USER_EMAIL,
				pass: process.env.USER_PASS // Ensure this is the correct password or app password if 2FA is enabled
			}
		});
		//Iterate over users and send emails
		for (const user of users) {
			// Send mail with defined transport object
			await transporter.sendMail({
				from: process.env.USER_EMAIL,
				to: user.email,
				subject: 'update on the shipment',
				text: message
			});

			console.log(`Email sent to ${user.email}`);
			return true;
		}
	}
	catch(error){
		console.error('error sending email',error);
		return false;}



}
module.exports= sendMail;