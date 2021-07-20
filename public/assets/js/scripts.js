/** @format */

// Config vars
const OKTA_ORG_URL = "https://dev-41458117.okta.com";
const OKTA_CLIENT_ID = "0oa19wdci44lPtB9j5d7";
const CUSTOM_TOKEN_ENDPOINT = "/api/firebaseCustomToken";

(async () => {
  // Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyCAD2Tno2UAkLuOvYYaDs_ZsXWyDYDsu2U",
    authDomain: "test-spa-task.firebaseapp.com",
    projectId: "test-spa-task",
    storageBucket: "test-spa-task.appspot.com",
    messagingSenderId: "436668943723",
    appId: "1:436668943723:web:82632979bddb813d05502e",
    measurementId: "G-GKER1150XJ",
  };

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();

  const oktaSignIn = new OktaSignIn({
    baseUrl: OKTA_ORG_URL,
    redirectUri: window.location.url,
    authParams: {
      display: "page",
    },
    el: "#signin-widget",
  });

  window.oktaSignIn = oktaSignIn;

  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      // User is signed in. Display some user profile information.
      document.getElementById("user-info").innerHTML = `\
                    <table>
                        <tr><th>Display name</th><td>${user.displayName}</td></tr>
                        <tr><th>Email address</th><td>${user.email}</td></tr>
                        <tr><th>Unique ID</th><td>${user.uid}</td></tr>
                    </table>`;
      document.getElementById("authenticated-user-content").hidden = false;
      document.getElementById("signin-widget").hidden = true;
    } else {
      // User is signed out. Display the Okta sign-in widget.
      oktaSignIn.showSignInToGetTokens({
        clientId: OKTA_CLIENT_ID,
        redirectUri: window.location.url,
        getAccessToken: true,
        getIdToken: true,
        scope: "openid profile email",
      });
      document.getElementById("authenticated-user-content").hidden = true;
      document.getElementById("signin-widget").hidden = false;
    }
  });

  if (oktaSignIn.hasTokensInUrl()) {
    // The user has been redirected back to your app after signing in with
    // Okta. Get the Okta access token from the response and use it to
    // authenticate with Firebase.

    // Get the access token from Okta.
    const oktaTokenResponse = await oktaSignIn.authClient.token.parseFromUrl();
    const accessToken = oktaTokenResponse.tokens.accessToken.value;

    const oktaUserName = oktaTokenResponse.tokens.idToken.claims.name || "";
    const oktaUserEmail = oktaTokenResponse.tokens.idToken.claims.email || "";

    // Use the access token to call the firebaseCustomToken endpoint.
    const firebaseTokenResponse = await fetch(CUSTOM_TOKEN_ENDPOINT, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const firebaseToken = await firebaseTokenResponse.text();

    // Use the Firebase custom token to authenticate with Firebase.
    try {
      await firebase.auth().signInWithCustomToken(firebaseToken);

      // Now that the user is authenticated, you can use auth-enabled
      // Firebase services. In this example, we update the Firebase
      // user profile with information from Okta:
      const user = firebase.auth().currentUser;

      if (user.email !== oktaUserEmail || user.displayName !== oktaUserName) {
        document.getElementById("user-info").innerHTML = `\
                    <table>
                        <tr><th>Display name</th><td>${oktaUserEmail}</td></tr>
                        <tr><th>Email address</th><td>${oktaUserName}</td></tr>
                        <tr><th>Unique ID</th><td>${user.uid}</td></tr>
                    </table>`;
      }

      if (user.displayName !== oktaUserName) {
        await user.updateProfile({ displayName: oktaUserName });
      }
      if (user.email !== oktaUserEmail) {
        await user.updateEmail(oktaUserEmail);
      }
    } catch (err) {
      console.error("Error signing in with custom token.");
    }
  }
})();

function firebaseLogout() {
  window.oktaSignIn.remove();
  firebase.auth().signOut();
}
