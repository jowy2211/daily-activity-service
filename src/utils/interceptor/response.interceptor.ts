import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';

interface ResponseInterface<T> {
  statusCode: number;
  message: string;
  data: T;
}

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, ResponseInterface<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ResponseInterface<T>> {
    return next.handle().pipe(
      map((response) => ({
        statusCode: context.switchToHttp().getResponse().statusCode,
        message: response?.message ?? 'Success',
        data: response?.data || response,
      })),
    );
  }
}
