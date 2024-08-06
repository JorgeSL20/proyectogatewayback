// src/pago/dto/create-pago.dto.ts
export class CreatePagoDto {
  id:number;
  usuarioId: number;
  total:number;
  items:string;
}
