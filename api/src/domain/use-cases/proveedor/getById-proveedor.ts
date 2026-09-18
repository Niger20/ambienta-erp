import {ProveedorEntity} from "../../entitites/proveedor.entity";
import { UpdateProveedorDto } from "../../dtos";
import {ProveedorRepository} from "../../repositories/proveedor.repository";


export interface GetByIdProveedorUseCase {
    execute( id : Number ): Promise<ProveedorEntity|null>;
}

export class GetByIdProveedor implements GetByIdProveedorUseCase {

    constructor(private readonly proveedorRepository: ProveedorRepository) {}

    execute( id : number): Promise<ProveedorEntity|null> {
        return this.proveedorRepository.getById(id);
    }

}