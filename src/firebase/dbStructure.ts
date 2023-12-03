// this is the structure of the Firebase database

export type userLink = {
  "uid": string, // should correspond to a user in users
  "submitted": boolean,
  "crushes": string[]
}

export type lobbyT = {
  "users": {
    [index: string]: userLink
  }
}

export type userT = {
  "name": string,
  "email": string,
  "gender": string,
  "preferences": boolean[]
}

export type numLobbiesT = {
  "n": number
}

export const NUM_LOBBIES = "numLobbies"
export const LOBBIES = "lobbies"
export const USERS = "users"

export type firebaseDB = {
  [NUM_LOBBIES]: { "numLobbies": numLobbiesT }

  [LOBBIES]: { [index: number]: lobbyT }

  [USERS]: { [index: string]: userT }
}
