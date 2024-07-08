export class CreateAuthDto {
    id: number;
    name: string;
    email: string;
    lastNameP: string;
    lastNameM: string;
    password: string;
    pregunta: string;
    respuesta: string;
    ip:string;
    fecha_log?:string;
}

export class CreateInformacionDto{
    id_informacion: number;
    quienessomos: string;
    vision: string;
    mision: string;
}

export class CreatePreguntasDto{  
    preguntas: string;
    respuestas: string;
}
