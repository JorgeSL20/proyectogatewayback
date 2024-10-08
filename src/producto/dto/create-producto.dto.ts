// src/producto/dto/create-producto.dto.ts
export class CreateProductoDto {
    id: number;
    url: string;
    producto: string;
    categoria: string;
    marca: string;
    descripcion: string;
    cantidadMay: number;
    precioMen: number;
    precioMay: number;
    existencias: number;
    fechaCreacion?: Date;  // Propiedad opcional para la fecha de creación
}
