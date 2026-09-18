import jwt, { SignOptions, Secret } from 'jsonwebtoken';
import { envs } from '../../config/envs';
import { TokenSigner } from '../../domain';


const JWT_SEED: Secret = envs.JWT_SEED;



export class JwtAdapter implements TokenSigner {

    generate(payload: object, expiresIn: string | number = '8h'): string {
        const options: SignOptions = { expiresIn: expiresIn as SignOptions['expiresIn'] };
        return jwt.sign(payload, JWT_SEED, options);
    }

    validate<T extends object = object>(token: string): T | null {
        try {
            return jwt.verify(token, JWT_SEED) as T;
        } catch {
            return null;
        }
    }

}