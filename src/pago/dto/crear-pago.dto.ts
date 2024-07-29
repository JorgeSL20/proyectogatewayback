// src/pago/dto/create-pago.dto.ts
export class CreatePagoDto {
  usuarioId: number;
  monto: number;
  metodoPago: string;
  estado: string;
  detalles?: string;
}
