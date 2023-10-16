import { ConsoleLogger, Controller, Get, Param, Post, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { CookieOptions, Request, Response } from 'express';

let count = 0;
const users = new Map<number, number>();

const strip = (url: string) => {
  let domain = '';
  if (url.startsWith('http')) {
    domain = url.split('://')[1].split('/')[0];
  } else {
    domain = url.split('/')[0];
  }

  return domain.startsWith('localhost') ? domain.split(':')[0] : domain;
}

@Controller()
export class AppController {
  logger = new ConsoleLogger();
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('signin')
  signin(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const id = ++count;
    const now = Date.now();
    users.set(id, now);
    this.logger.log(`/signin ${id} ${now}`);

    const isSecure = req.secure || req.headers['x-forwarded-proto'] === 'https';
    const isSameSite = (req: Request) => {
      const referer = req.headers['referer'];
      const host = req.headers['host'];
      console.log('isSameSite', isSecure, referer, host);
      return strip(referer) === strip(host) ? 'lax' : 'none';
    }
    const cookieOptions: CookieOptions = {
      httpOnly: true,
      secure: isSecure,
      sameSite: isSameSite(req),
    }

    res.cookie('id', id, cookieOptions);
    res.cookie('now', now, cookieOptions);
    return { id };
  }

  @Get('user')
  getUser(
    @Req() req: Request,
  ) {
    this.logger.log(`/user ${req.cookies}`);
    const id = Number(req.cookies['id']);
    const date = users.get(id);
    return { date }
  }
}
