export interface User {
    _id: string;
    name: string;
    email: string;
    password: string;
}

export interface LoginUserTypes {
    email: string;
    password: string;
}