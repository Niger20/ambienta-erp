import { PermissionMiddleware } from "../middlewares/permission.middleware";
import { UserDatasourceImpl } from "../datasource/user.datasource.impl";
import { UserRepositoryImpl } from "../repositories/user.repository.impl";

export const buildPermissionMiddleware = (): PermissionMiddleware => {
    const userDatasource = new UserDatasourceImpl();
    const userRepository = new UserRepositoryImpl(userDatasource);

    return new PermissionMiddleware(userRepository);
};
