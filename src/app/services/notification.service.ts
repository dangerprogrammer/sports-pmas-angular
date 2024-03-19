import { Injectable, ViewContainerRef } from "@angular/core";
import { NotificationComponent } from "../components/notification/notification.component";

@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    constructor(
        private notifications: ViewContainerRef
    ) { }

    notificationsCount: number = -1;
    notificationsIndex: any[] = [];
    notificationsTimeout: any[] = [];

    addNotification(data?: any) {
        const deleteNotification = ({ timeout, index, message }: any) => {
            if (message) {
                this.notificationsTimeout[index] = clearTimeout(this.notificationsTimeout[index]);
                for (let i = index; i < this.notificationsIndex.length; i++) {
                    this.notificationsIndex[i]--;
                };
                console.log(`Delete notif ${this.notificationsIndex[index]}`);
                this.notifications.remove(this.notificationsIndex[index]);
            };
            // this.notificationsTimeout[index] = setTimeout(() => (this.notificationsCount--, this.notifications.remove(index)), timeout);
        };

        this.notificationsCount++;
        this.notificationsIndex[this.notificationsCount] = this.notificationsCount;
        const notificationRef = this.notifications.createComponent(NotificationComponent);

        notificationRef.setInput('index', this.notificationsCount);
        if (data) for (const field in data) notificationRef.setInput(field, data[field]);

        notificationRef.instance.delete.subscribe(({ timeout, index, message }) => deleteNotification({ timeout, index, message }));
    };
}