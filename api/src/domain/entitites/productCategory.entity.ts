



export class ProductCategoryEntity {

    constructor(
        public readonly id: number,
        public readonly name: string,
        public readonly description?: string | null,
    ) { }

    get isDescriptionAvailable() {
        return !!this.description;
    }

    public static fromObject(object: { [key: string]: any }): ProductCategoryEntity {
        const { id, categoriaid, name, nombre, description, descripcion } = object;

        const _id = id || categoriaid;
        const _name = name || nombre;
        const _description = description || descripcion;

        if (!_id) throw 'ID is required';
        if (!_name) throw 'Name is required';

        return new ProductCategoryEntity(_id, _name, _description);
    }


}