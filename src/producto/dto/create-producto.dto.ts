export class CreateProductoDto {
    id: number;
    imagenP: string; 
    producto: string;
    categoria: string;
    marca: string;
    descripcion: string;
    precio: number;
    existencias: number;
}
