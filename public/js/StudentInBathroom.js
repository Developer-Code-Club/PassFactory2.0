class StudentInBathroom
{
  
  constructor()
  {
    this.firstName = "     ";
    this.lastName = "     ";
    this.ID = 000000;
    this.timeIn = null;
    this.timeOut = null;
    this.inBathroom = null;
  }
  
  constructor(firstName, lastName, ID)
  {
    this.firstName = firstName;
    this.lastName = lastName;
    this.ID = ID;
    this.timeIn = findTime(); //run method to calculate time in
    timeOut = null;
    this.inBathroom = true;
  }

  getFirstName(){
    return firstName;
  }

  setFirstName(firstName){
    this.firstName = firstName;
  }

  getLastName(){
    return lastName;
  }

  setLastName(lastName){
    this.lastName = lastName;
  }

  getID(){
    return ID;
  }

  setID(ID){
    this.ID = ID;
  }

  enterBathroom()
  {
    timeIn = findTime();
    inBathroom = true;
  }
  
  leaveBathroom()
  {
    timeOut = findTime();
    inBathroom = false;
  }
  
  findTime()
  {
    var today = new Date();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    return(time);
  }
}
