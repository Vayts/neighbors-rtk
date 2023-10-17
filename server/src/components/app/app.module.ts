import { Module } from '@nestjs/common';
import * as process from 'process';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from '../auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { NeighborhoodModule } from '../neighborhood/neighborhood.module';
import { DebtModule } from '../debt/debt.module';
import { PlanModule } from '../plan/plan.module';
import { ChatModule } from '../chat/chat.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../../..', 'client/public/img'),
      exclude: ['/api/(.*)'],
      serveRoot: '/img',
    }),
    // ServeStaticModule.forRoot({
    //   rootPath: join(__dirname, '../../../..', 'client/dist'),
    //   exclude: ['/api/(.*)'],
    // }),
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI),
    AuthModule,
    NeighborhoodModule,
    DebtModule,
    PlanModule,
    ChatModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
