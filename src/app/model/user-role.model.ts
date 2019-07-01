export interface IUserRightProperties {
    add: boolean;
    edit: boolean;
    delete: boolean;
}

export interface IUSerRights {
    post: IUserRightProperties;
    userAccount: IUserRightProperties;
}


export class UserRoleModel {
    constructor(
        public roleId: number,
        public roleName: string,
        public userRights?: IUSerRights
    ) {

    }
}

