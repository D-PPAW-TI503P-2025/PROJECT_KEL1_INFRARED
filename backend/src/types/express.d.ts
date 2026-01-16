import { JwtPayloadCustom } from '../middleware/authMiddleware';


declare global {
    namespace Express {
        interface Request {
            user?: JwtPayloadCustom;
        }
    }
}