import { Injectable } from '@angular/core';
import { Observable, Subject, Subscription, timer } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IdleTimeoutService {
    private _count: number = 0;
    private _serviceId: string = 'idleTimeoutSvc-' + Math.floor(Math.random() * 10000);
    private _timeoutMilliseconds: number = (3.6 * Math.pow(10,6))/2;
    private timerSubscription: Subscription;
    private timer: Observable<number>;
    private _timer: Observable<number>;
    private resetOnTrigger: boolean = false;
    private lastTime: number;
    private dateTimer: Observable<any>;
    private dateTimerSubscription: Subscription;
    private MINUTE_NUMBER = 10
    private dateTimerInterval : number = (3.6 * Math.pow(10,6))/2;
    public timeoutExpired: Subject<number> = new Subject<number>();

    constructor() {
        this.timeoutExpired.subscribe(n => {
        });

        this.startTimer();
        this.startDateCompare();
    }

    private setSubscription() {
        this._timer = timer(this._timeoutMilliseconds);
        this.timerSubscription = this._timer.subscribe(n => {
            this.timerComplete(n);
        });
    }

    private startDateCompare() {
        this.lastTime = (new Date()).getTime();
        this.dateTimer = timer(this.dateTimerInterval); // compare every five minutes
        this.dateTimerSubscription = this.dateTimer.subscribe(n => {
            this.dateTimerSubscription.unsubscribe();
            this.startDateCompare();
        });
    }

    public startTimer() {
        if (this.timerSubscription) {
            this.stopTimer();
        }
        
        this.setSubscription();
    }

    public stopTimer() {
        this.timerSubscription.unsubscribe();
    }

    public resetTimer() {
        this.startTimer();
    }

    private timerComplete(n: number) {
        this.timeoutExpired.next(++this._count);

        if (this.resetOnTrigger) {
            this.startTimer();
        }
    }
}
