import { Request, Response, NextFunction } from 'express';


function sanitize(target: any): any {
  if (target instanceof Object) {
    for (const key in target) {
      if (Object.prototype.hasOwnProperty.call(target, key)) {
        if (key.startsWith('$') || key.includes('.')) {
          delete target[key];
        } else {
          sanitize(target[key]);
        }
      }
    }
  }
  return target;
}

export const mongoSanitizeMiddleware = (req: Request, _res: Response, next: NextFunction): void => {
  if (req.body) sanitize(req.body);
  if (req.query) sanitize(req.query);
  if (req.params) sanitize(req.params);
  next();
};
