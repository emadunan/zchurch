export interface Token {
    id: string;
    email: string;
    isActive: boolean;
    joinDate: Date;
    lastLogin: Date;
    iat: number;
}

export interface AuthenticatedUser {
    id: string;
    email: string;
    joinDate: Date;
    lastLogin: Date;
    token: string;
}
