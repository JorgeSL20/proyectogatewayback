import { Controller, Get, Post, Body, Patch, Param, Delete,UseGuards,HttpStatus  } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto,CreateInformacionDto,CreatePreguntasDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { RolesGuard } from './roles.guard';
import { Roles } from './entities/roles.decorator';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
//usuarios
@Post()
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.create(createAuthDto);
  }

  @UseGuards(RolesGuard)
  @Roles('admin')
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
@Get('email/:email')
async getUserByEmail(@Param('email') email: string) {
  try {
    const user = await this.authService.getUser(email);
    if (!user) {
      return {
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Usuario no encontrado',
      };
    }
    return {
      statusCode: HttpStatus.OK,
      data: user,
    };
  } catch (error) {
    console.error('Error en getUserByEmail:', error);
    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Error en el servidor',
    };
  }
}

  @Patch('password/:email')
  updatePassword(@Param('email') email: string, @Body() updateAuthDto: {password:string,ip:string,fecha:string}) {
    console.log(updateAuthDto)
    return this.authService.updatePassword(email, updateAuthDto);
  }
  @Patch('perfil/:id')
    async updateById(@Param('id') id: string, @Body() updateAuthDto: CreateAuthDto) {
        const result = await this.authService.updateById(parseInt(id), updateAuthDto);
        if (result.status !== HttpStatus.OK) {
            throw new Error(result.message);
        }
        return result;
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

}