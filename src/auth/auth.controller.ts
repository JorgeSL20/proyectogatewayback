import { Controller, Get, Post, Body, Patch, Param, Delete,UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto,CreateInformacionDto,CreatePreguntasDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { FileInterceptor } from '@nestjs/platform-express';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
//usuarios
  @Post()
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.create(createAuthDto);
  }
  

  @Get()
  findAll() {
    return this.authService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(id);
  }

  @Patch(':email')
  update(@Param('email') email: string, @Body() updateAuthDto: CreateAuthDto) {
    console.log(updateAuthDto)
    return this.authService.update(email, updateAuthDto);
  }
  @Patch('password/:email')
  updatePassword(@Param('email') email: string, @Body() updateAuthDto: {password:string,ip:string,fecha:string}) {
    console.log(updateAuthDto)
    return this.authService.updatePassword(email, updateAuthDto);
  }
  // Método para actualizar usuario por ID, incluyendo archivo
  @Patch('perfil/:id')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 10 * 1024 * 1024 }, // Limita el tamaño del archivo a 10MB
    }),
  )
  async updateById(
    @Param('id') id: string,
    @Body() updateAuthDto: CreateAuthDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      // Si se proporciona un archivo, maneja la actualización de la imagen
      const result = await this.authService.updateById(parseInt(id), updateAuthDto, file);
      return result;
    } else {
      throw new BadRequestException('No file uploaded');
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
  @Get('user/:id')
  getUserById(@Param('id') id:string){
    return this.authService.getUserById(id)
  }

  ///INFORMACION
  @Get('informacion/:id')
  getInformacionById(@Param('id') id:string){
    return this.authService.getInformacionById(id)
  }
  @Patch('informacion/:id')
  updateInformacionById(@Param('id') id: string, @Body() updateInformacionDto: CreateInformacionDto) {
    return this.authService.updateInformacionById(id, updateInformacionDto);
  }
///PREGUNTA
  @Get('preguntas/:data')
  getPreguntas(@Param('data')data:string){
    return this.authService.getPreguntas()
  }
  @Patch('preguntas/:id')
updatePreguntasById(@Param('id') id: string, @Body() updatePreguntasDto: CreatePreguntasDto) {
  return this.authService.updatePreguntasById(id, updatePreguntasDto);
}
@Post('preguntas')
createPreguntas(@Body() createPreguntasDto: CreatePreguntasDto) {
  return this.authService.createPreguntas(createPreguntasDto);
}
@Delete('preguntas/:id')
deletePregunta(@Param('id') id: string) {
  return this.authService.deletePregunta(parseInt(id));
}


@Get('auth')
getAuth() {
  return this.authService.getAuth();
}

@Delete('user/:email') // Define la ruta para el método deleteUser, con el parámetro email en la URL
deleteUser(@Param('email') email: string) { // Captura el parámetro email de la URL
  return this.authService.deleteUser(email); // Llama al método correspondiente en el servicio y pasa el email
}

@Patch('role/:email')
updateRoleByEmail(@Param('email') email: string, @Body() updateRoleDto: { role: string }) {
  return this.authService.updateRoleByEmail(email, updateRoleDto.role);
}
}