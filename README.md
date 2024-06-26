# Meeting Notes application
This is a meeting notes application where the user can create new notes or view existing ones!

## Features
### Notes creation
The user can create new notes and add content as per their need.

### Edit your notes
You can edit the note content and add new action items if you missed them during creation.

### Action Items
Action items can be created while making a new note. They can also be added for existing notes. A simple checkbox will toggle between open and completed status of the action item.

### Filter notes
Filter notes with keywords or date range.

### Real-time updates
You will know when each note has been created or edited from the timestamp.

## Get this project
1. Clone this repository.
2. Run the following commands - 
```
npm init
npm i -s express mongoose cors dotenv debug
npm install express mongoose body-parser
npm install react react-dom
npm install concurrently --save-dev
```
3. Create a ```.env``` file add the PORT and MongoDB connection URL.
```
PORT=3000
MONGO_CONNECTION=<your_mongodb_url>
```
4. Change the MongoDB connection URL in the ```app.js``` to your own connection URL.
5. Navigate to ```meeting-notes-app``` and run the following commands - 
```
npm install -s @mui/material @emotion/react @emotion/styled
npm i -s @mui/icons-material
npm install react-router-dom @material-ui/core @material-ui/icons @types/react-router-dom
npm install @types/react @types/react-dom typescript
```
6. Run the command ```npm run meetingnote``` to run the application.

## Tools used
React + TypeScript, JavaScript, Express.js, Node.js, MongoDB