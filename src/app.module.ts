import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; 
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BirdsModule } from './birds/birds.module'; 

@Module({
  imports: [
    ConfigModule.forRoot({
    
      isGlobal: true, 
    }),
    BirdsModule, 
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
