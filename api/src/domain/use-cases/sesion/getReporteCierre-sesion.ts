import { SesionRepository } from "../../repositories/sesion.repository";


export interface GetReporteCierreSesionUseCase {
    execute(id: number): Promise<any>;
}

export class GetReporteCierreSesion implements GetReporteCierreSesionUseCase {

    constructor(private readonly sesionRepository: SesionRepository) { }

    execute(id: number): Promise<any> {
        return this.sesionRepository.getReporteCierre(id);
    }

}
