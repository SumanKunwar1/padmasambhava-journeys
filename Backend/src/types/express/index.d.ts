// types/express/index.d.ts
import { IAdmin } from '../../models/Admin.model';

declare global {
  namespace Express {
    interface Request {
      user?: IAdmin;
    }
  }
}