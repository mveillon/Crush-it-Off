// this is the structure of the Firebase database

export type userLink = {
  "uid": string // should correspond to a user in users
  "crushes": string[]
}

export type lobbyT = {
  [index: number]: {
    "users": userLink[]
  }
}

export type userT = {
  "name": string,
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
  [NUM_LOBBIES]: numLobbiesT

  [LOBBIES]: lobbyT[]

  [USERS]: userT[]
}
