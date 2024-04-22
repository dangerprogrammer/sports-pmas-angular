import { ComponentRef, Injectable, ViewContainerRef } from "@angular/core";
import { NotificationComponent } from "../components/notification/notification.component";

@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    constructor(
        private notifications: ViewContainerRef
    ) {}

    notifsCount: number = -1;

    addNotification(data?: any) {
        const notificationRef = this.notifications.createComponent(NotificationComponent);

        this.notifsCount++;

        notificationRef.setInput('index', this.notifsCount);

        if (data) for (const field in data) notificationRef.setInput(field, data[field]);

        notificationRef.instance.delete.subscribe(({ delay, clear }) => this.deleteNotification(data, delay, clear, notificationRef));
    };

    private deleteNotification(data: any = {}, delay: number, clear: boolean = !1, notifRef: ComponentRef<NotificationComponent>) {
        if (clear) clearNotif();
        else setTimeout(clearNotif, delay);

        function clearNotif() {
            notifRef.setInput('hide', !0);

            setTimeout(() => notifRef.destroy(), (data.unspawnDuration) || 300);
        };
    }

    resetNotifications() {
        this.notifications.clear();
        this.notifsCount = -1;
    }
}