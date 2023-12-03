
/**
 * Gets the user's ID from local storage, and errors if the user is not
 * authenticated
 * @returns the user's ID in Firebase
 */
function getUserID(): string {
  const res = localStorage.getItem("userID")
  if (res === null) {
    throw new Error('User is not authenticated!')
  }
  return res
}

export default getUserID