import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer'
import { SendEmailDto } from './dto/send-email.dto';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'kireluriel@gmail.com',
        pass: 'djcy yydq hmxs ojuq',
      },
    });
  }
  async sendMail(userData: SendEmailDto, code: string): Promise<void> {
    const mailOptions: nodemailer.SendMailOptions = {
      from: '"Gateway Soluciones en TI"',
      to: userData.to,
      subject: 'Codigo de Recuperación de Contraseña',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4; text-align: center;">
          <h2 style="color: #333;">¡Recuperación de Contraseña!</h2>
          <p>Estimado Usuario,</p>
          <p>Hemos recibido una solicitud para restablecer la contraseña asociada a tu cuenta. Utiliza el siguiente código para completar el proceso:</p>
          <h3 style="color: #007BFF;">Código de Verificación: ${code}</h3>
          <p>Este código es válido por un tiempo limitado. No lo compartas con nadie.</p>
          <p>Si no has solicitado el restablecimiento de contraseña, puedes ignorar este mensaje.</p>
          <p>Gracias,</p>
        </div>
      `,
    };

    const info = await this.transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);
  }
    
    

    generateCode():string{
        const caracteres = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let codigo = '';

        for (let i = 0; i < 10; i++) {
          const indiceAleatorio = Math.floor(Math.random() * caracteres.length);
          codigo += caracteres.charAt(indiceAleatorio);
        }

        return codigo;
    }
  
}
