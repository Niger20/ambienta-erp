import {ProveedorEntity} from "../../entitites/proveedor.entity";
import { UpdateProveedorDto} from "../../dtos";
import {ProveedorRepository} from "../../repositories/proveedor.repository";


export interface UpdateProveedorUseCase {
    execute( dto: UpdateProveedorDto ): Promise<ProveedorEntity|null>;
}

export class UpdateProveedor implements UpdateProveedorUseCase {

    constructor(private readonly proveedorRepository: ProveedorRepository) {}

    execute(dto: UpdateProveedorDto): Promise<ProveedorEntity|null> {
        return this.proveedorRepository.update(dto);
    }

}