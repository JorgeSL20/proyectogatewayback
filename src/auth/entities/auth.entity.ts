import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from "typeorm"; 
import { Logs } from "./logs.entity";
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

    @Column({ nullable: true })
    intentos?: number | null;

    @OneToMany(() => Logs, logs => logs.usuario)
    logs:Logs[];
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
