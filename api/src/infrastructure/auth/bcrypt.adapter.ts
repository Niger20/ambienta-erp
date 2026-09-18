import { compareSync, genSaltSync, hashSync } from "bcrypt";
import { PasswordHasher } from "../../domain";

export class BcryptAdapter implements PasswordHasher {
    hash(password: string): string {
        const salt = genSaltSync();
        return hashSync(password, salt);
    }

    compare(password: string, hashed: string): boolean {
        return compareSync(password, hashed);
    }
}
