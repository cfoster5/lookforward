import { appleAuth } from "@invertase/react-native-apple-authentication";
import auth, {
  getAuth,
  signInWithCredential,
} from "@react-native-firebase/auth";
import { router } from "expo-router";
import { Alert, Platform } from "react-native";

export async function signInWithApple() {
  // Only available on iOS
  if (Platform.OS !== "ios") {
    Alert.alert(
      "Not Available",
      "Apple Sign-In is only available on iOS devices",
    );
    return;
  }

  // Check if Apple Sign-In is supported on this device
  if (!appleAuth.isSupported) {
    Alert.alert(
      "Not Supported",
      "Apple Sign-In is not supported on this device",
    );
    return;
  }

  try {
    // Start the sign-in request
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      // Note: It's important to include scopes here
      requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
    });

    // Ensure Apple returned a user identity token
    if (!appleAuthRequestResponse.identityToken) {
      throw new Error("Apple Sign-In failed - no identity token returned");
    }

    // Create a Firebase credential from the response
    const { identityToken, nonce } = appleAuthRequestResponse;
    const appleCredential = auth.AppleAuthProvider.credential(
      identityToken,
      nonce,
    );

    // Sign the user in with the credential
    signInWithCredential(getAuth(), appleCredential);
    Alert.alert("Signed In", "You have successfully signed in.");
    router.dismissAll();
  } catch (error) {
    const appleError = error as { code?: string; message?: string };
    if (appleError.code === appleAuth.Error.CANCELED) {
      // User canceled the sign-in flow
      console.log("User canceled Apple Sign-In");
    } else if (appleError.code === appleAuth.Error.FAILED) {
      Alert.alert("Sign-In Failed", "Apple Sign-In failed. Please try again.");
    } else if (appleError.code === appleAuth.Error.INVALID_RESPONSE) {
      Alert.alert(
        "Invalid Response",
        "Apple Sign-In returned an invalid response",
      );
    } else if (appleError.code === appleAuth.Error.NOT_HANDLED) {
      Alert.alert(
        "Not Handled",
        "Apple Sign-In could not be handled at this time",
      );
    } else if (appleError.code === appleAuth.Error.UNKNOWN) {
      Alert.alert(
        "Unknown Error",
        "An unknown error occurred during Apple Sign-In",
      );
    } else {
      // Other Firebase errors
      console.error("Apple Sign-In error:", error);
      Alert.alert(
        "Error",
        appleError.message || "An error occurred during sign-in",
      );
    }
  }
}

export async function revokeAppleToken() {
  // Only available on iOS
  if (Platform.OS !== "ios" || !appleAuth.isSupported) {
    return;
  }

  try {
    // Get the authorization code needed for revocation
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.REFRESH,
    });

    const { authorizationCode } = appleAuthRequestResponse;

    if (!authorizationCode) {
      console.warn("No authorization code returned for token revocation");
      return;
    }

    // Revoke the token with Firebase
    await auth().revokeToken(authorizationCode);

    console.log("Apple token revoked successfully");
  } catch (error) {
    console.error("Error revoking Apple token:", error);
    // Don't throw - this is a best-effort operation during account deletion
  }
}
