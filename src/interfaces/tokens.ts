import { JwtPayload } from "jsonwebtoken";

export interface JwtData extends JwtPayload {
    id:string
}