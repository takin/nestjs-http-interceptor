import { NestInterceptor, ExecutionContext, CallHandler, HttpException, HttpStatus } from "@nestjs/common";
import { Observable, throwError } from "rxjs";
import { map, catchError } from "rxjs/operators";

export class HttpResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const response = context.switchToHttp().getResponse();
    return next
      .handle()
      .pipe(
        map(data => ({
          statusCode: response.statusCode,
          message: HttpStatus[response.statusCode],
          payload: data
        }))
      )
      .pipe(
        catchError(err =>
          throwError(
            new HttpException(
              {
                statusCode: err.status,
                message: err.response,
                payload: []
              },
              err.status
            )
          )
        )
      );
  }
}
