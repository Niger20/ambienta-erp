import {ProveedorEntity} from "../../entitites/proveedor.entity";
import {ProveedorRepository} from "../../repositories/proveedor.repository";


export interface DeleteProveedorUseCase {
    execute( id: number ): Promise<ProveedorEntity>;
}

export class DeleteProveedor implements DeleteProveedorUseCase {

    constructor(private readonly proveedorRepository: ProveedorRepository) {}

    execute( id: number): Promise<ProveedorEntity> {
        return this.proveedorRepository.delete(id);
    }

}