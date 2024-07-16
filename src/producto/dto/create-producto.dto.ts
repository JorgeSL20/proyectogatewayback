// src/producto/dto/create-producto.dto.ts
export class CreateProductoDto {
    id: number;
    url: string;
    publicId: string;
    producto: string;
    categoria: string;
    marca: string;
    descripcion: string;
    precio: number;
    existencias: number;
  }
  