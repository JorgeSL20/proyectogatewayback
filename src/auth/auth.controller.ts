import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto, CreateInformacionDto, CreatePreguntasDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Usuarios
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
    return this.authService.update(email, updateAuthDto);
  }

  @Patch('password/:email')
  updatePassword(@Param('email') email: string, @Body() updateAuthDto: {password: string, ip: string, fecha: string}) {
    return this.authService.updatePassword(email, updateAuthDto);
  }

  @Patch('perfil/:id')
  updateById(@Param('id') id: string, @Body() updateAuthDto: CreateAuthDto) {
    return this.authService.updateById(parseInt(id), updateAuthDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }

  @Get('user/:id')
  getUserById(@Param('id') id: string) {
    return this.authService.getUserById(id);
  }

  // Informacion
  @Get('informacion/:id')
  getInformacionById(@Param('id') id: string) {
    return this.authService.getInformacionById(id);
  }

  @Patch('informacion/:id')
  updateInformacionById(@Param('id') id: string, @Body() updateInformacionDto: CreateInformacionDto) {
    return this.authService.updateInformacionById(id, updateInformacionDto);
  }

  // Pregunta
  @Get('preguntas/:data')
  getPreguntas(@Param('data') data: string) {
    return this.authService.getPreguntas();
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

  @Delete('user/:email')
  deleteUser(@Param('email') email: string) {
    return this.authService.deleteUser(email);
  }

  @Patch('role/:email')
  updateRoleByEmail(@Param('email') email: string, @Body() updateRoleDto: { role: string }) {
    return this.authService.updateRoleByEmail(email, updateRoleDto.role);
  }

  // Endpoint para subir imagenes de perfil
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    const result = await this.authService.uploadImage(file);
    return { secure_url: result.secure_url };
  }
}
