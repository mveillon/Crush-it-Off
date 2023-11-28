import Gender from "./Gender";

class Person {
  id: number
  lobbyID: number
  name: string
  identity: Gender
  preference: boolean[] // male, female, non-binary

  constructor(
    id: number, 
    lobbyID: number,
    name: string, 
    identity: Gender, 
    preference: boolean[]
  ) {
    this.id = id
    this.lobbyID = lobbyID
    this.name = name
    this.identity = identity
    this.preference = preference
  }
}

export default Person
