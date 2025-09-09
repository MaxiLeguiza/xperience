import { Controller, Sse, MessageEvent } from '@nestjs/common';
import { interval, map, Observable } from 'rxjs';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Sse('sse')
  sse(): Observable<MessageEvent> {
    return interval(60000).pipe(
      map((_) => {
        const now = new Date();
        const formattedDate = now.toLocaleDateString('es-ES', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        });
        const formattedTime = now.toLocaleTimeString('es-ES', {
          hour: '2-digit',
          minute: '2-digit',
        });
        return {
          data: {
            message: 'Actualización por tiempo',
            timestamp: `${formattedDate} ${formattedTime}`,
          },
        };
      }),
    );

    // Esto esta para cuando se conecte con bien con el client(frontend) las reservas
    // return this.notificationsService.notifications$.pipe(
    //   map((data) => ({ data })),
    // );
  }
}
