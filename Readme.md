# Blockchain-IOT-Integration
We are using HyperLedger-Fabric to build the network
followe these steps to install the pre-requisites.
---------------------------------------------------------
https://hyperledger-fabric.readthedocs.io/en/latest/prereqs.html

Pulling Github Repo
---------------------------------------------------------
A working directory is required - for example, Go Developers use the $HOME/go/src/github.com/<your_github_userid> directory.  This is a Golang Community recommendation for Go projects.

```
mkdir -p $HOME/go/src/github.com/<your_github_userid>
cd $HOME/go/src/github.com/<your_github_userid>
```
To get the install script:
```
curl -sSLO https://raw.githubusercontent.com/hyperledger/fabric/main/scripts/install-fabric.sh && chmod +x install-fabric.sh
```
Run the script with the -h option to see the options:
```
./install-fabric.sh -h
```
```
Usage: ./install-fabric.sh [-f|--fabric-version <arg>] [-c|--ca-version <arg>] <comp-1> [<comp-2>] ... [<comp-n>] ...
        <comp>: Component to install one or more of  d[ocker]|b[inary]|s[amples]. If none specified, all will be installed
        -f, --fabric-version: FabricVersion (default: '2.5.6')
        -c, --ca-version: Fabric CA Version (default: '1.5.9')

```
now pull Our HLF-repo
```
git clone --single-branch --branch master https://github.com/subrat2004/iot-blockchain-integration.git
```
Setting up the network
---------------------------------------------------------
- fabric-sample two organization test-network setup with two peers, ordering service,
  and 2 certificate authorities, with the state database using couchdb

 => from directory /fabric-samples/test-network
```
./network.sh up createChannel -ca -s couchdb
```
 - Use any of the asset-transfer-ledger-queries chaincodes deployed on the channel "mychannel"
   with the chaincode name of "ledger". The following deploy command will package,
   install, approve, and commit the javascript chaincode, all the actions it takes
   to deploy a chaincode to a channel.

===> from directory /fabric-samples/test-network
```
./network.sh deployCC -ccn ledger -ccp ../asset-transfer-ledger-queries/chaincode-javascript/ -ccl javascript
```
 - Be sure that node.js is installed

===> from directory /fabric-samples/asset-transfer-ledger-queries/application-javascript
```
node -v
```
 - npm installed code dependencies

===> from directory /fabric-samples/asset-transfer-ledger-queries/application-javascript
```
npm install
```
 - to run this test application

===> from directory /fabric-samples/asset-transfer-ledger-queries/application-javascript
```
node app.js
```
   
Setting up the environment
---------------------------------------------------------
Create an .env file similar to this
```
   USER_EMAIL= MAILID
   USER_PASS=PASSWORD
   USER_JWT_TOKEN=JWT TOKEN

  PASSWORD MUST BE GENERATED USING GOOGLE TWO FACTOR AUTHENTICATION.
```
JWT TOKEN GENERATION
---------------------------------------------------------
Signup
The endpoints concerning signup is 
```
http://{ip/domain}/signup.
```
Send a post request on the endpoint (/signup) with following JSON (application/json) data in request body:
```
{
  "username": "proffapt",
  "email": "proffapt@gmail.com",
  "password": "proffapt@scmb",
  "first_name": "Arpit",
  "last_name": "Bhardwaj",
  "address": "F-211 JCB Hall",
  "phone": "1234567890",
  "organisation": "IS LAB"
}
```
cURL example:
```
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{
        "username": "proffapt",
        "email": "proffapt@gmail.com",
        "password": "proffapt@scmb",
        "first_name": "Arpit",
        "last_name": "Bhardwaj",
        "address": "F-211 JCB Hall",
        "phone": "1234567890",
        "organisation": "IS LAB"
      }' \
  http://{ip/domain}/signup

```
Login

The endpoints concerning login is 
```
http://{ip/domain}/login.
```
Send a post request on the endpoint (/login) with following JSON (application/json) data in request body:
```
{
  "username": "proffapt",
  "password": "proffapt@scmb"
}
```
         
   

