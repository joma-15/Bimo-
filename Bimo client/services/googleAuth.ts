import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { useEffect } from "react";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { auth } from "./firebase";

WebBrowser.maybeCompleteAuthSession();

export const useGoogleAuth = () => {
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: "21992675084-2krab3mqvv1v5633dj0ldaagvormg97g.apps.googleusercontent.com",
  });

  useEffect(() => {
    if (response?.type === "success") {
      const idToken = response.params?.id_token;

      if (!idToken) {
        console.log("❌ No ID token found");
        return;
      }

      const credential = GoogleAuthProvider.credential(idToken);

      signInWithCredential(auth, credential)
        .then((userCred) => {
          console.log("✅ Logged in:", userCred.user);
        })
        .catch((err) => {
          console.log("❌ Firebase error:", err);
        });
    }
    console.log('firebase connection was being triggered')
  }, [response]);

  return { promptAsync };
};