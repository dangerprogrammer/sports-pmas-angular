import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
    providedIn: 'root',
})
export class PaddingService {
    private leftSubject = new BehaviorSubject<number>(0);

    getLeft() {
        return this.leftSubject.asObservable();
    }

    setLeft(level: number) {
        this.leftSubject.next(level);
    }
}