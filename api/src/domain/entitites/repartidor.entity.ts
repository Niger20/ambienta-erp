export class RepartidorEntity {

    constructor(
        public readonly id: number,
        public readonly nombre: string,
        public readonly telefono?: string | null,
    ) {}

    get isTelefonoAvailable() {
        return !!this.telefono;
    }

    public static fromObject(object: { [key: string]: any }): RepartidorEntity {
        const id = object.id ?? object.repartidorid;
        const { nombre, telefono } = object;

        if (id == null) throw 'ID is required';
        if (!nombre) throw 'Nombre is required';

        return new RepartidorEntity(Number(id), nombre, telefono);
    }


}