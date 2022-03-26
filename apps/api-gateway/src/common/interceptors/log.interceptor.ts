import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LogInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    // The route is intercepted before it reaches the controller
    const now = Date.now();
    console.log('Inicio: ', new Date());

    return (
      // the route is then intercepted again in the return, before it reaches the frontend
      next
        .handle()
        .pipe(tap(() => console.log('Fim: +', Date.now() - now, 'ms')))
    );
  }
}
