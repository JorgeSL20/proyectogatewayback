import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Logs } from 'src/auth/entities/logs.entity';
import { Carrito } from 'src/carrito/entities/carrito.entity'; // Ajusta esta importación según la ubicación de tu entidad Carrito

@Entity({ name: 'usuarios' })
export class Auth {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

    @Column()
    lastNameP: string;

    @Column()
    lastNameM: string;

    @Column()
    password: string;

    @Column()
    pregunta: string;

    @Column()
    respuesta: string;

    @Column({ nullable: true, default: 0 })
    intentos: number;

    @Column({ type: 'timestamp', nullable: true })
    fechaUltimoIntento: Date;

    @OneToMany(() => Logs, logs => logs.usuario)
    logs: Logs[];
    
    @OneToMany(() => Carrito, carrito => carrito.usuario)
    carritos: Carrito[];
}


@Entity({ name: 'informacion' })
export class Informacion {
    @PrimaryGeneratedColumn()
    id_informacion: number;

    @Column({ type: 'text' })
    mision: string;

    @Column({ type: 'text' })
    vision: string;

    @Column({ type: 'text' })
    quienessomos: string;
}


@Entity({ name: 'preguntas' })
export class Preguntas {
    @PrimaryGeneratedColumn()
    id_preguntas: number;

    @Column()
    preguntas: string;

    @Column()
    respuestas: string;
}
