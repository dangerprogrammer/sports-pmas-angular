import { Component, ComponentRef, Injectable, ViewContainerRef } from "@angular/core";
import { AlertComponent } from "../components/alert/alert.component";

@Injectable({
    providedIn: 'root'
})
export class AlertService {
    constructor(
        private alerts: ViewContainerRef
    ) {}

    alertsCount: number = -1;

    createAlert({ title, renderComponent }: { title?: string, renderComponent: (content: ViewContainerRef) => ComponentRef<any> }) {
        const alertRef = this.alerts.createComponent(AlertComponent);

        this.alertsCount++;

        alertRef.setInput('index', this.alertsCount);
        
        alertRef.setInput('title', title);
        alertRef.setInput('renderComponent', renderComponent);

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