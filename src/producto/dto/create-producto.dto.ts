export class CreateProductoDto {
    id: number;
    url: string;
    producto: string;
    categoria: string;
    marca: string;
    descripcion: string;
    precio: number;
    existencias: number;
}
