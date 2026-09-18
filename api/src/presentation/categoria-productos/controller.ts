import { PaginationDto } from "../../domain";
import {Request, Response, Router} from 'express';
import prisma from "../../data/postgres";
import {
    CreateProductCategory,
    CreateProductCategoryDto, DeleteProductCategory,
    GetByIdProductCategory,
    GetProductCategory,
    ProductCategoryEntity, UpdateProductCategory
} from "../../domain";
import {UpdateProductCategoryDto} from "../../domain";
import {ProductCategoryRepository} from "../../domain";

export class ProductsCategoryController {

    //* DI
    constructor(
        private readonly repository: ProductCategoryRepository,
    ) {}

    public getProductCategory = (req: Request, res: Response) => {
        new GetProductCategory( this.repository )
            .execute()
            .then( category => res.json(category))
            .catch( err => res.status(400).json({ error: err }));
    }

    public getProductCategorybyId = (req: Request, res: Response) => {
        const id  = +req.params.id;
        if (isNaN(id)) return res.status(400).json({error: 'Invalid ID'});

        new GetByIdProductCategory( this.repository )
            .execute( id )
            .then( category => res.json(category))
            .catch( err => res.status(400).json({ error: err }));
    }


    public createProductCategory = (req: Request, res: Response) => {

        const [error, createProductCategoryDto] = CreateProductCategoryDto.create(req.body);
        if (error) return res.status(400).json({error: 'Error en la categoria'});

        new CreateProductCategory( this.repository )
            .execute( createProductCategoryDto! )
            .then( category => res.json(category))
            .catch( err => res.status(400).json({ error: err }));
    }

    public updateProductCategory = (req: Request, res: Response) => {

        const id = +req.params.id;
        const [error, updateProductCategoryDto] = UpdateProductCategoryDto.create({...req.body, id});

        if (error) return res.status(400).json({ error });

        new UpdateProductCategory( this.repository )
            .execute( updateProductCategoryDto! )
            .then( category => res.json(category))
            .catch( err => res.status(400).json({ error: err }));
    }

    public deleteProductCategory = (req: Request, res: Response) => {
        const id = +req.params.id;

        new DeleteProductCategory( this.repository )
            .execute( id )
            .then( category => res.json(category))
            .catch( err => res.status(400).json({ error: err }));
    }
}