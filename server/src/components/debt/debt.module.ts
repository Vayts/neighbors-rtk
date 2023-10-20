import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DebtService } from './debt.service';
import { DebtController } from './debt.controller';
import { Debt, DebtSchema } from '../../schemas/debt.schema';

@Global()
@Module({
  providers: [DebtService],
  controllers: [DebtController],
  imports: [
    MongooseModule.forFeature([{ name: Debt.name, schema: DebtSchema }]),
  ],
  exports: [DebtService],
})
export class DebtModule {}
