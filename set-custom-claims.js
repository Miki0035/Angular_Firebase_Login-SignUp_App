var admin = require("firebase-admin");
var uid = process.argv[2];

var serviceAccount = require("./src/fir-angular-1e9db-firebase-adminsdk-uq8dp-bdd9e8781b.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

admin.auth().setCustomUserClaims(uid, {admin: true})
.then(() => {
    console.log('custom claims set for user', uid);
    process.exit();
})
.catch(error => {
    console.log('error:', error);
    process.exit(1);
});
