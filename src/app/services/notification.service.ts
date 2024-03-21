import { Injectable, viewChild, ViewChild, ViewContainerRef } from "@angular/core";
import { NotificationComponent } from "../components/notification/notification.component";
import { NotificationsListComponent } from "../components/notifications-list/notifications-list.component";

@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    constructor(
        private notifications: ViewContainerRef
    ) {}

    notificationsList: { component: any, index: number, oldIndex: number, timeout?: any }[] = [];
    notifsCount: number = -1;

    addNotification(data?: any) {
        const deleteNotification = (delay: any, index: number = 0, clear: boolean = !1) => {
            const that = this;
            const findedNotif = this.notificationsList.find(({ oldIndex }) => oldIndex == index) as any;

            if (clear) {
                findedNotif.timeout = clearTimeout(findedNotif.timeout);

                clearNotif();
            } else findedNotif.timeout = setTimeout(clearNotif, delay);

            function clearNotif() {
                const nextNotifs = that.notificationsList.filter(({ index, oldIndex }) => index >= findedNotif.index && oldIndex != findedNotif.oldIndex);

                nextNotifs.forEach(({ index }, ind) => (nextNotifs[ind].index = Math.max(index, 1) - 1));

                that.notificationsList[findedNotif.index].component.setInput('hide', !0);

                setTimeout(() => {
                    that.notifications.remove(findedNotif.index);
                    that.notificationsList.splice(findedNotif.index, 1);
                }, (data && data.unspawnDuration) || 300);
            };
        };

        const notificationRef = this.notifications.createComponent(NotificationComponent);

        this.notifsCount++;
        this.notificationsList.push({ component: notificationRef, index: this.notificationsList.length, oldIndex: this.notifsCount });

        notificationRef.setInput('index', this.notifsCount);

        if (data) for (const field in data) notificationRef.setInput(field, data[field]);

        notificationRef.instance.delete.subscribe(({ delay, index, clear }) => deleteNotification(delay, index, clear));
    };

    resetNotifications() {
        this.notifications.clear();
        this.notificationsList = [];
        this.notifsCount = -1;
    }
}