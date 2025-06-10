import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BirdsModule } from '@birds/birds.module';

@Module({
    imports: [
        BirdsModule
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
