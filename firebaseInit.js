import firebase from 'firebase/app';
import 'firebase/messaging';

const config = {
    apiKey: "AIzaSyCuFiXFlxTYqdyte-TsZAfxUJjch3jU1o8",
    authDomain: "ajyal-shop.firebaseapp.com",
    projectId: "ajyal-shop",
    storageBucket: "ajyal-shop.appspot.com",
    messagingSenderId: "953067270092",
    appId: "1:953067270092:web:b4469316c4c0da4e413769",
    measurementId: "G-7Y3Q3WJ0MP"
};

let isSafari = false;

var ua;

if (typeof window !== "undefined") {
    ua = navigator.userAgent.toLowerCase();
    if (ua.indexOf("safari") != -1) {
        if (ua.indexOf("chrome") > -1) {

        } else {
            isSafari = true;
        }
    }
}


if (!firebase.apps.length && !isSafari) {
    firebase.initializeApp(config);
}

let messaging;
if (typeof window !== "undefined" && !isSafari) {
    messaging = firebase.messaging();
}
// const messaging = firebase.messaging();

// next block of code goes here
export const requestFirebaseNotificationPermission = () => {
    if (isSafari)
        return;
    return new Promise((resolve, reject) => {
        messaging
            .getToken()
            // .then(() => messaging.getToken())
            .then((firebaseToken) => {
                resolve(firebaseToken);
            })
            .catch((err) => {
                reject(err);
            });
    });
}

export const onMessageListener = () => {
    if (isSafari)
        return;
    return new Promise((resolve) => {
        messaging.onMessage((payload) => {
            resolve(payload);
        });
    });
}
