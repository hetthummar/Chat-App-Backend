
# Chatapp Backend 

Backend for Flutter ChatApp - written using Node js. 
You can find repository of flutter app [here](https://linktodocumentation)

![App Screenshot](https://firebasestorage.googleapis.com/v0/b/resume-b40bc.appspot.com/o/chat_app_ss_1.png?alt=media&token=2b38f613-442d-47f7-81e5-46703f199f9f)

## Tech Stack

Node js, Socket IO, Mongo DB and Firebase Auth

## Features

- Online/Offline Status Update
- Search functionality and fuzzy searching
- Auto download of messages on connecting
- Recent chat feature
- Profile status with image update


## Usage

In order to run this project follow this steps.

**Step 1:** Clone this project and open it in any editor.

**Step 2:** Create env file with name .env at root of this project.

**Step 3:** Create mongo DB project and paste your mongo db url in env file like this

```bash
  MONGO_DB_URL=[YOUR_MONGO_DB_URL]
```
**Step 4:** Create firebase project then enable authantication in firebase project. download serviceaccount file of firebase project and paste it to the root of this project.
## License

```
MIT License

Copyright (c) [2021] [Het Thummar]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

