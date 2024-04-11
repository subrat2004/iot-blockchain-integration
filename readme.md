# Blockchain-IOT-Integration
We are using HyperLedger-Fabric to build the network
followe these steps to install the pre-requisites.
---------------------------------------------------------
For MAC
---------------------------------------------------------
Homebrew¶
For macOS, we recommend using Homebrew to manage the prereqs.

/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
brew --version # => Homebrew 2.5.2

The Xcode command line tools will be installed as part of the Homebrew installation. Once Homebrew is ready, installing the necessary prerequisites is very easy:
Git¶
Install the latest version of git if it is not already installed.

brew install git
git --version # => git version 2.23.0

cURL¶
Install the latest version of cURL if it is not already installed.

brew install curl
curl --version # => curl 7.64.1 (...)

Docker¶
Install the latest version of Docker Desktop if it is not already installed. Since Docker Desktop is a UI application on Mac, use cask to install it.

Homebrew v2.x:

brew cask install --appdir="/Applications" docker

Homebrew v3.x:

brew install --cask --appdir="/Applications" docker

Docker Desktop must be launched to complete the installation so be sure to open the application after installing it:

open /Applications/Docker.app

Once installed, confirm the latest versions of both docker and docker-compose executables were installed.

docker --version # => Docker version 19.03.12, build 48a66213fe
docker-compose --version # => docker-compose version 1.27.2, build 18f557f9

Note: Some users have reported errors while running Fabric-Samples with the Docker Desktop gRPC FUSE for file sharing option checked. Please uncheck this option in your Docker Preferences to continue using osxfs for file sharing.

Go¶
Optional: Install the latest Fabric supported version of Go if it is not already installed (only required if you will be writing Go chaincode or SDK applications).

brew install go@1.21.9
go version # => go1.21.9 darwin/amd64

JQ¶
Optional: Install the latest version of jq if it is not already installed (only required for the tutorials related to channel configuration transactions).

brew install jq
jq --version # => jq-1.6

FOR LINUX
---------------------------------------------------------
Linux (Ubuntu/Debian based distro)¶
Prerequisites: git, cURL, Docker

sudo apt-get install git curl docker-compose -y

- Make sure the Docker daemon is running.
sudo systemctl start docker

- Add your user to the Docker group.
sudo usermod -a -G docker <username>

- Check version numbers  
docker --version
docker-compose --version

- Optional: If you want the Docker daemon to start when the system starts, use the following:
sudo systemctl enable docker
Go¶
Optional: Install the latest version of Go (only required if you will be writing Go chaincode or SDK applications).

JQ¶
Optional: Install the latest version of jq (only required for the tutorials related to channel configuration transactions).

For Windows
---------------------------------------------------------
Docker¶
Install the latest version of Docker Desktop if it is not already installed.

WSL2¶
Both the Fabric documentation and Fabric samples rely heavily on a bash environment. The recommended path is to use WSL2 (Windows Subsystem for Linux version 2) to provide a native Linux environment and then you can follow the Linux prerequisites section (excluding the Linux Docker prerequisite as you already have Docker Desktop) and install them into your WSL2 linux distribution.

WSL2 may not be installed by default; you can check and install WSL2 by going into “Programs and Features”, clicking on “Turn Windows features on or off” and ensuring that both “Windows Subsystem For Linux” and “Virtual Machine Platform” are selected.

Next you will need to install a Linux distribution such as Ubuntu-20.04 and make sure it’s set to using version 2 of WSL. Refer to Install WSL for more information.

Finally, you need to ensure Docker Desktop has integration enabled for your distribution so it can interact with Docker elements, such as a bash command window. To do this, open the Docker Desktop gui and go into settings, select Resources and them WSL Integration and ensure the checkbox for enable integration is checked. You should then see your WSL2 linux distribution listed (if you don’t then it is probably because it is still a WSL1 distribution and needs to be converted to WSL2) and you can then toggle the switch to enable integration for that distro. Refer to Docker Desktop WSL2 backend for more information

Microsoft VS Code (Optional)¶
Microsoft VS Code provides an IDE that has tight integration with WSL2 Linux Distributions. Search the Microsoft Marketplace in VS Code for the Remote Development extension pack for more information. This pack includes, among other things, the Remote - WSL extension and the Remote - Containers extension.

Git For Windows (Optional)¶
Although not required, if you do decide to install Git on Windows and manage the Fabric repositories natively (as opposed to within WSL2 and its Git installation), then make sure you configure Git as follows:

Update the following git configurations:

git config --global core.autocrlf false
git config --global core.longpaths true
You can check the setting of these parameters with the following commands:

git config --get core.autocrlf
git config --get core.longpaths
These output from these commands should be false and true respectively.

Pulling Github Repo
---------------------------------------------------------
A working directory is required - for example, Go Developers use the $HOME/go/src/github.com/<your_github_userid> directory.  This is a Golang Community recommendation for Go projects.

mkdir -p $HOME/go/src/github.com/<your_github_userid>
cd $HOME/go/src/github.com/<your_github_userid>

To get the install script:

curl -sSLO https://raw.githubusercontent.com/hyperledger/fabric/main/scripts/install-fabric.sh && chmod +x install-fabric.sh
Run the script with the -h option to see the options:

./install-fabric.sh -h
Usage: ./install-fabric.sh [-f|--fabric-version <arg>] [-c|--ca-version <arg>] <comp-1> [<comp-2>] ... [<comp-n>] ...
        <comp>: Component to install one or more of  d[ocker]|b[inary]|s[amples]. If none specified, all will be installed
        -f, --fabric-version: FabricVersion (default: '2.5.6')
        -c, --ca-version: Fabric CA Version (default: '1.5.9')


now pull Our HLF-repo
git clone --single-branch --branch master https://github.com/subrat2004/iot-blockchain-integration.git

Setting up the network
---------------------------------------------------------
- fabric-sample two organization test-network setup with two peers, ordering service,
  and 2 certificate authorities, with the state database using couchdb
         ===> from directory /fabric-samples/test-network
         ./network.sh up createChannel -ca -s couchdb
 - Use any of the asset-transfer-ledger-queries chaincodes deployed on the channel "mychannel"
   with the chaincode name of "ledger". The following deploy command will package,
   install, approve, and commit the javascript chaincode, all the actions it takes
   to deploy a chaincode to a channel.
         ===> from directory /fabric-samples/test-network
         ./network.sh deployCC -ccn ledger -ccp ../asset-transfer-ledger-queries/chaincode-javascript/ -ccl javascript
 - Be sure that node.js is installed
         ===> from directory /fabric-samples/asset-transfer-ledger-queries/application-javascript
         node -v
 - npm installed code dependencies
         ===> from directory /fabric-samples/asset-transfer-ledger-queries/application-javascript
         npm install
 - to run this test application
         ===> from directory /fabric-samples/asset-transfer-ledger-queries/application-javascript
         node app.js

Setting up the environment
---------------------------------------------------------
Create an .env file similar to this
   USER_EMAIL= MAILID
   USER_PASS=PASSWORD
   USER_JWT_TOKEN=JWT TOKEN

  PASSWORD MUST BE GENERATED USING GOOGLE TWO FACTOR AUTHENTICATION.

JWT TOKEN GENERATION
---------------------------------------------------------
Signup
The endpoints concerning signup is http://{ip/domain}/signup.
Send a post request on the endpoint (/signup) with following JSON (application/json) data in request body:
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

cURL example:
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

  Login
The endpoints concerning login is http://{ip/domain}/login.
Send a post request on the endpoint (/login) with following JSON (application/json) data in request body:
{
  "username": "proffapt",
  "password": "proffapt@scmb"
}

         
   

