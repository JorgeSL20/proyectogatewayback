import { Module } from '@nestjs/common';
import { SubcategoriaService } from './subcategoria.service';
import { SubcategoriaController } from './subcategoria.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subcategoria } from './entities/subcategoria.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Subcategoria])],
  controllers: [SubcategoriaController],
  providers: [SubcategoriaService],
  exports: [SubcategoriaService],
})
export class SubcategoriaModule {}

