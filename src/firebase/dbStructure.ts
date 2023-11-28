// this is the structure of the Firebase database
// this is not to be used in the actual code really
// it's just for reference and planning
type firebaseDB = {
  "numLobbies": number,

  "lobbies": {
    "lobbyID": number, // INDEX
    "users": {
      "uid": string, // should correspond to a user in users
      "crushes": number[]
    }[],
  }[],

  "users": {
    "name": string,
    "gender": string,
    "preferences": boolean[] // male, female, non-binary
  }[]
}

export {}