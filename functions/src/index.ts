// functions folder is created when we run the firebase cli command
// firebase init functions

import * as functions from "firebase-functions";
import * as admin   from 'firebase-admin';
const cors = require('cors')({origin: true});
const StreamChat = require('stream-chat').StreamChat;

const serverStreamClient = StreamChat.getInstance(
    // Below config keys created using firebase cli command
        // firebase functions:config:set stream.key="App Access Key from Stream website" stream.secret="Secret key from Stream website"
    functions.config().stream.key, 
    functions.config().stream.secret
);

admin.initializeApp();

export const createStreamUser = functions.https.onRequest((request, response) => {
  
    cors(request, response, async () => {
        const { user } = request.body;
        if (!user) {
            throw new functions.https.HttpsError('failed-precondition', 'Bad request');
        } else {
            try {
                await serverStreamClient.upsertUser({
                    id: user.uid,
                    name: user.displayName,
                    email: user.email
                });
                response.status(200).send({ message: 'User created'});
            } catch (error) {
                throw new functions.https.HttpsError('aborted', "Could not create Stream user");
            }
        }
    })
});

export const createStreamToken = functions.https.onRequest((request, response) => {
  
    cors(request, response, async () => {
        const { user } = request.body;
        if (!user) {
            throw new functions.https.HttpsError('failed-precondition', 'The function must be called whiled authenticated.');
        } else {
            try {
                const token = await serverStreamClient.createStreamToken(user.uid);
                response.status(200).send({ token });
            } catch (error) {
                throw new functions.https.HttpsError('aborted', "Could not get Stream user");
            }
        }
    })
});
