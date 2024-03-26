import { ComponentRef, Injectable, viewChild, ViewChild, ViewContainerRef } from "@angular/core";
import { NotificationComponent } from "../components/notification/notification.component";
import { NotificationsListComponent } from "../components/notifications-list/notifications-list.component";

@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    constructor(
        private notifications: ViewContainerRef
    ) {}

    notifsCount: number = -1;

    addNotification(data?: any) {
        const deleteNotification = (delay: any, clear: boolean = !1, notifRef: ComponentRef<NotificationComponent>) => {
            if (clear) clearNotif();
            else setTimeout(clearNotif, delay);

            function clearNotif() {
                notifRef.setInput('hide', !0);

                setTimeout(() => notifRef.destroy(), (data && data.unspawnDuration) || 300);
            };
        };

        const notificationRef = this.notifications.createComponent(NotificationComponent);

        this.notifsCount++;

        notificationRef.setInput('index', this.notifsCount);

        if (data) for (const field in data) notificationRef.setInput(field, data[field]);

        notificationRef.instance.delete.subscribe(({ delay, clear }) => deleteNotification(delay, clear, notificationRef));
    };

    resetNotifications() {
        this.notifications.clear();
        this.notifsCount = -1;
    }
}