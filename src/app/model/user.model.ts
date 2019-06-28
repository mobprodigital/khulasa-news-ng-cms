export class UserModel {

    userId: number = null;
    firstName: string = '';
    lastName: string = '';
    email: string = '';
    password: string = '';
    confirmPassword: string = '';
    mobile: string = '';
    skype: string = '';
    roleId: number = null;
    image: string = '';


    public get fullName(): string {
        return `${this.firstName} ${this.lastName}`;
    }


    constructor();
    constructor(userModelProperties: Partial<UserModel>);
    constructor(args?: undefined | Partial<UserModel>) {
        if (args) {
            const keys = Object.keys(args);
            if (keys && keys.length > 0) {
                keys.forEach(k => {
                    if (typeof this[k] !== 'undefined') {
                        this[k] = args[k];
                    }
                });
            }
        }
    }
}
