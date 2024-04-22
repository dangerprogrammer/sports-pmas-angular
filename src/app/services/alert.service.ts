import { ComponentRef, Injectable, ViewContainerRef } from "@angular/core";
import { AlertComponent } from "../components/alert/alert.component";

@Injectable({
    providedIn: 'root'
})
export class AlertService {
    constructor(
        private alerts: ViewContainerRef
    ) {}

    alertsCount: number = -1;

    createAlert(data?: any) {
        const alertRef = this.alerts.createComponent(AlertComponent);

        this.alertsCount++;

        alertRef.setInput('index', this.alertsCount);

        if (data) for (const field in data) alertRef.setInput(field, data[field]);

        alertRef.location.nativeElement.style.zIndex = this.alertsCount;
        alertRef.instance.delete.subscribe(() => this.deleteAlert(alertRef));
    }

    private deleteAlert(alertRef: ComponentRef<AlertComponent>) {
        alertRef.setInput('deleting', !0);
        alertRef.location.nativeElement.classList.add('deleting');

        setTimeout(() => alertRef.destroy(), 2e2);
    }

    resetAlerts() {
        this.alerts.clear();
        this.alertsCount = -1;
    }
}