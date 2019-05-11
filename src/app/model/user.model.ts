export class UserModel {
    userId : string = '';
    firstName : string = '';
    lastName : string = '';
    middleName : string = '';
    email : string = '';
    password : string = '';
    confirmPassword : string = '';
    role : string = '';
    profilePicture : string = '';

    
    public get fullName() : string {
        return `${this.firstName} ${this.middleName} ${this.lastName}`; 
    }
    

    constructor(){
        
    }
}