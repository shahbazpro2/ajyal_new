importScripts('https://www.gstatic.com/firebasejs/8.2.3/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.3/firebase-messaging.js');

const config = {
    apiKey: "AIzaSyDh6kuRa8c_lFW5QZV-NCdRMco7VVOr5x8",
    authDomain: "shop-test-project.firebaseapp.com",
    projectId: "shop-test-project",
    storageBucket: "shop-test-project.appspot.com",
    messagingSenderId: "998375176389",
    appId: "1:998375176389:web:c3da21c48b6d6b1881d8ac",
    measurementId: "G-VVLXY1NKH7"
};

firebase.initializeApp(config);

const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function (payload) {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    const notificationTitle = payload.data.title;
    const notificationOptions = {
        body: payload.data.body,
        icon: '/firebase-logo.png'
    };
    return self.registration.showNotification(notificationTitle,
        notificationOptions);
});

self.addEventListener('notificationclick', event => {
    console.log(event)
    return event;
});