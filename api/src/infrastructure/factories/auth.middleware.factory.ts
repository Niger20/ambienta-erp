import { AuthMiddleware } from "../middlewares/auth.middleware";
import { JwtAdapter } from "../auth/jwt.adapter";
import { UserDatasourceImpl } from "../datasource/user.datasource.impl";
import { UserRepositoryImpl } from "../repositories/user.repository.impl";
import { GetByIdUser } from "../../domain/use-cases/auth/getById-user";

export const buildAuthMiddleware = (): AuthMiddleware => {
    const tokenSigner = new JwtAdapter();
    const userDatasource = new UserDatasourceImpl();
    const userRepository = new UserRepositoryImpl(userDatasource);
    const getByIdUser = new GetByIdUser(userRepository);

    return new AuthMiddleware(tokenSigner, getByIdUser);
};

