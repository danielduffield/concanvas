# ConCanvas
An app for web users who want to draw on a collective, real-time updating canvas.

### Heroku Hosted URL
https://con-canvas.herokuapp.com/

![ConCanvas Drawing Demo](/server/public/images/concanvas-demo-1.gif?raw=true "Drawing Demonstration")

Draw simultaneously with other users on a shared canvas.

![ConCanvas Chat Demo](/server/public/images/concanvas-demo-2.gif?raw=true "Chat Demonstration")

Chat with other artists to collaborate.

![ConCanvas Snapshot Demo](/server/public/images/concanvas-demo-3.gif?raw=true "Snapshot Demonstration")

Save and download your masterpiece with the snapshot tool.

### How to Use
Clone the repository using the following git command:
```
git clone https://github.com/danielduffield/concanvas
```
Create a .env file in the root directory of the cloned repository to contain the PORT information.
```
PORT=3000
```
Install required dependencies using the following git command:
```
npm install
```
Use the "watch" command defined in the package.json file to create a bundle file and run the server on the specified port.
```
npm run watch
```
Load the page in a web browser at the provided port. (Ex: localhost:3000)

### Technologies Used
* Express       v4.15.4
* Socket.io     v2.0.3
* Redux         v3.7.2
* React         v15.6.1
* React-Redux   v5.0.5
