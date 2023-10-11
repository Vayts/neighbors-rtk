import { Body, Controller, Put, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { ROUTES } from '../../constants/routes';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../../guards/jwtAuth.guard';

@Controller(ROUTES.CHAT.DEFAULT)
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Put(ROUTES.CHAT.UPDATE_VIEWED_MESSAGES)
  @UseGuards(JwtAuthGuard)
  login(@Req() req: Request, @Body() body: { messageIds: string[] }) {
    return this.chatService.updateMessageSeenBy(body.messageIds, req);
  }
}
