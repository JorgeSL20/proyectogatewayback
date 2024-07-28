export class CreatePagoDto {
    usuarioId: number;
    monto: number;
    metodoPago: string;
    estado: string;
    detalles?: string;
  }
  