import Gender from "./Gender";

class Person {
  id: number
  lobbyID: number
  name: string
  identity: Gender
  preference: Gender[]

  constructor(
    id: number, 
    lobbyID: number,
    name: string, 
    identity: Gender, 
    preference: Gender[]
  ) {
    this.id = id
    this.lobbyID = lobbyID
    this.name = name
    this.identity = identity
    this.preference = preference
  }
}

export default Person
