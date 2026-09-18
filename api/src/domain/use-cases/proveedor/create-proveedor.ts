import {ProveedorEntity} from "../../entitites/proveedor.entity";
import {CreateProveedorDto} from "../../dtos";
import {ProveedorRepository} from "../../repositories/proveedor.repository";


export interface CreateProveedorUseCase {
    execute( dto: CreateProveedorDto ): Promise<ProveedorEntity>;
}

export class CreateProveedor implements CreateProveedorUseCase {

    constructor(private readonly proveedorRepository: ProveedorRepository) {}

    execute(dto: CreateProveedorDto): Promise<ProveedorEntity> {
        return this.proveedorRepository.create(dto);
    }

}