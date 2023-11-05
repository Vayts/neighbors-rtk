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
import { CoreModule } from '../core/core.module';
import { EventModule } from '../event/event.module';
import { DutyModule } from '../duty/duty.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../..', '/public/img'),
      exclude: ['/api/(.*)'],
      serveRoot: '/img',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../../..', 'client/dist'),
      exclude: ['/api/(.*)'],
    }),
    CoreModule,
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI),
    AuthModule,
    DutyModule,
    NeighborhoodModule,
    DebtModule,
    EventModule,
    PlanModule,
    ChatModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
