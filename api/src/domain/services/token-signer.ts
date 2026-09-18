export interface TokenSigner {
    generate(payload: object, expiresIn?: string | number): string;
    validate<Token extends object = object>(token: string): Token | null;
}

