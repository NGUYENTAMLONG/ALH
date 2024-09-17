import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { extname } from 'path';

@Injectable()
export class PdfMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (extname(req.params.fileName) === '.pdf') {
      res.setHeader('Content-Disposition', 'inline');
      res.setHeader('Content-Type', 'application/pdf');
    }
    next();
  }
}
