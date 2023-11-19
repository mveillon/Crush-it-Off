// Will be used for filtering. Practicality is going to have to supercede
// political correctness, so while the gender selector can have more than
// just these three options, if the person selects anything other than male
// or female, it will just have to go to NonBinary because otherwise this will
// just be a mess
enum Gender {
  Male,
  Female,
  NonBinary
}

export default Gender
