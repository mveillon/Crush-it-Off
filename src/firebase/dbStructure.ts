// this is the structure of the Firebase database

export type userLink = {
  "submitted": boolean,
  "crushes": string[] // ids should correspond to ids in users collection
}

export type lobbyT = {
  "users": {
    [index: string]: userLink
  }
}

export type userT = {
  "name": string,
  "phone": string,
  "gender": string,
  "preferences": boolean[],
  "profile-pic": string
}

export type numLobbiesT = {
  "n": number
}

export const NUM_LOBBIES = "numLobbies"
export const LOBBIES = "lobbies"
export const USERS = "users"
export const PFPs = "pfps"
export const GENDER_MAP: { [index: string]: number } = {
  "Male": 0,
  "Female": 1,
  "Non-Binary": 2
}

export type firebaseDB = {
  [NUM_LOBBIES]: { "numLobbies": numLobbiesT }

  [LOBBIES]: { [index: number]: lobbyT }

  [USERS]: { [index: string]: userT }
}
