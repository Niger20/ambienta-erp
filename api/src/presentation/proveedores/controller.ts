import { PaginationDto } from "../../domain";
import {Request, Response, Router} from 'express';
import {

     CreateProveedor, CreateProveedorDto,  DeleteProveedor,
     GetByIdProveedor,
     GetProveedor,
     ProveedorRepository,  UpdateProveedor, UpdateProveedorDto
} from "../../domain";

export class ProveedorController {

    //* DI
    constructor(
        private readonly repository: ProveedorRepository,
    ) {}

    public getProveedor = (req: Request, res: Response) => {
        new GetProveedor( this.repository )
            .execute()
            .then( proveedor => res.json(proveedor))
            .catch( err => res.status(400).json({ error: err }));
    }

    public getProveedorById = (req: Request, res: Response) => {
        const id  = +req.params.id;
        if (isNaN(id)) return res.status(400).json({error: 'Invalid ID'});

        new GetByIdProveedor( this.repository )
            .execute( id )
            .then( category => res.json(category))
            .catch( err => res.status(400).json({ error: err }));
    }


    public createProveedor = (req: Request, res: Response) => {

        const [error, createProveedorDto] = CreateProveedorDto.create(req.body);
        if (error) return res.status(400).json({error: 'Error en la categoria'});

        new CreateProveedor( this.repository )
            .execute( createProveedorDto! )
            .then( category => res.json(category))
            .catch( err => res.status(400).json({ error: err }));
    }

    public updateProveedor = (req: Request, res: Response) => {

        const id = +req.params.id;
        const [error, updateProveedorDto] = UpdateProveedorDto.create({...req.body, id});

        if (error) return res.status(400).json({ error });

        new UpdateProveedor( this.repository )
            .execute( updateProveedorDto! )
            .then( category => res.json(category))
            .catch( err => res.status(400).json({ error: err }));
    }

    public deleteProveedor = (req: Request, res: Response) => {
        const id = +req.params.id;

        new DeleteProveedor( this.repository )
            .execute( id )
            .then( category => res.json(category))
            .catch( err => res.status(400).json({ error: err }));
    }
}