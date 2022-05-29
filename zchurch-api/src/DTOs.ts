export interface AuthenticatedUser {
    id: string;
    email: string;
    joinDate: Date;
    lastLogin: Date;
    token: string;
}
