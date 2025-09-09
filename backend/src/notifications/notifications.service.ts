import { Injectable } from '@nestjs/common';
import { Subject } from 'rxjs';

@Injectable()
export class NotificationsService {
  private readonly notificationsSubject = new Subject<any>();

  public get notifications$() {
    return this.notificationsSubject.asObservable();
  }

  public notifyNewReservation(data: any) {
    this.notificationsSubject.next(data);
  }
}
