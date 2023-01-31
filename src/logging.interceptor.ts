import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('进入了，拦截器...');

    console.log(context.switchToHttp().getResponse().data);

    // 计算了请求时长
    const now = Date.now();
    return next
      .handle()
      .pipe(
        tap(() => console.log(`${context.switchToHttp().getRequest().originalUrl} 请求耗时 ${Date.now() - now}ms`)),
      );
  }
}
