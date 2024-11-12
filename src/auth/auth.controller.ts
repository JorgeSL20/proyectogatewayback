import {Controller,Get,Post,Body,Patch,Param,Delete,UploadedFile,UseInterceptors,BadRequestException,} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto, CreateInformacionDto, CreatePreguntasDto } from './dto/create-auth.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Crear un nuevo usuario con imagen
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async create(@UploadedFile() file: Express.Multer.File, @Body() createAuthDto: CreateAuthDto) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    const result = await this.authService.uploadImage(file);
    createAuthDto.url = result.secure_url; // Asigna la URL de la imagen subida
    return this.authService.create(createAuthDto);
  }
  @Post('upload-image/:id')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file: Express.Multer.File, @Param('id') id: string) {
    const result = await this.authService.uploadImage(file); // Usa el servicio para subir la imagen
    return { secure_url: result.secure_url }; // Retorna la URL de la imagen subida
  }

  // Obtener todos los usuarios
  @Get()
  findAll() {
    return this.authService.findAll();
  }

  // Obtener usuario por ID
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(id);
  }

  // Actualizar usuario por correo electrónico con imagen
  @Patch(':email')
  @UseInterceptors(FileInterceptor('file'))
  async update(
    @Param('email') email: string,
    @Body() updateAuthDto: CreateAuthDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      const result = await this.authService.uploadImage(file);
      updateAuthDto.url = result.secure_url;
    }
    return this.authService.update(email, updateAuthDto);
  }

  // Actualizar contraseña de usuario
  @Patch('password/:email')
  updatePassword(
    @Param('email') email: string,
    @Body() updateAuthDto: { password: string; ip: string; fecha: string },
  ) {
    return this.authService.updatePassword(email, updateAuthDto);
  }

  // Actualizar perfil de usuario por ID
  @Patch('perfil/:id')
  @UseInterceptors(FileInterceptor('file'))
  async updateById(
    @Param('id') id: string,
    @Body() updateAuthDto: CreateAuthDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      const result = await this.authService.uploadImage(file);
      updateAuthDto.url = result.secure_url;
    }
    return this.authService.updateById(parseInt(id), updateAuthDto);
  }

  // Eliminar usuario por ID
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }

  // Obtener usuario por ID
  @Get('user/:id')
  getUserById(@Param('id') id: string) {
    return this.authService.getUserById(id);
  }

  // Manejo de información adicional del usuario
  @Get('informacion/:id')
  getInformacionById(@Param('id') id: string) {
    return this.authService.getInformacionById(id);
  }

  @Patch('informacion/:id')
  updateInformacionById(
    @Param('id') id: string,
    @Body() updateInformacionDto: CreateInformacionDto,
  ) {
    return this.authService.updateInformacionById(id, updateInformacionDto);
  }

  // Manejo de preguntas de seguridad
  @Get('preguntas/:data')
  getPreguntas(@Param('data') data: string) {
    return this.authService.getPreguntas();
  }

  @Patch('preguntas/:id')
  updatePreguntasById(
    @Param('id') id: string,
    @Body() updatePreguntasDto: CreatePreguntasDto,
  ) {
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

  // Autenticación y eliminación de usuario por email
  @Get('auth')
  getAuth() {
    return this.authService.getAuth();
  }

  @Delete('user/:email')
  deleteUser(@Param('email') email: string) {
    return this.authService.deleteUser(email);
  }

  // Actualizar rol de usuario por email
  @Patch('role/:email')
  updateRoleByEmail(@Param('email') email: string, @Body() updateRoleDto: { role: string }) {
    return this.authService.updateRoleByEmail(email, updateRoleDto.role);
  }
}
