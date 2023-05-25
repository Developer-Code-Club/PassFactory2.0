class Bathroom
{
  constructor()
  {
    this.bathroomSize = 6;
    const studentArray = new Array(bathroomSize);
  }
  
  constructor (bathroomSize)
  {
    this.bathroomSize = bathroomSize;
    const studentArray = new Array(bathroomSize);
  }

  getSize(){
    return this.bathroomSize;
  }

  setSize(size){
    this.bathroomSize = size;
  }

  addStudent(student)
  {
    studentArray.unshift(student);
    studentArray.pop();
    student.enerBathroom();
  }

  removeStudent(student)
  {
    studentArray.splice(studentArray.indexOf(student), 1);
    studentArray.push();
    student.leaveBathroom();
  }
}