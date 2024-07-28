// types/express.d.ts

import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      file: MulterFile;
    }

    interface MulterFile {
      fieldname: string;
      originalname: string;
      encoding: string;
      mimetype: string;
      size: number;
      destination: string;
      filename: string;
      path: string;
      buffer: Buffer;
    }
  }
}
