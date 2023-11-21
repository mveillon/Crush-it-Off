import { 
  getAuth, 
  onAuthStateChanged, 
  GoogleAuthProvider, 
  signInWithRedirect
} from "firebase/auth";

/**
 * Checks that the user is logged in. If they are, saves their uid to
 * local storage. Otherwise, logs the user back in then redirects them
 * back to whatever page they were before
 * @param redirectBack where to send the user after they log in
 */
function checkLoggedIn() {
  const auth = getAuth()
  onAuthStateChanged(auth, user => {
    if (user) {
      localStorage.setItem("userID", user.uid)
    } else {
      const auth = getAuth()
      const provider = new GoogleAuthProvider()
      signInWithRedirect(auth, provider)
    }
  })
}

export default checkLoggedIn
