import { Profile } from "@prisma/client";

export interface Token {
    id: string;
    email: string;
    isActive: boolean;
    joinDate: Date;
    lastLogin: Date;
    iat: number;
    profile: Profile;
}

export interface AuthenticatedUser {
    id: string;
    email: string;
    joinDate: Date;
    lastLogin: Date;
    token: string;
}
