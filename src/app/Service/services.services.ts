import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, interval, switchMap, startWith } from 'rxjs';
import { urls } from '../../environments/localEnvironment';
import { Order } from '../components/order/order';
import { Courier } from '../components/courier/courier';

@Injectable({
  providedIn: 'root',
})

export class ServiceService {
    constructor(private http: HttpClient) {}

    getOrdenes(): Observable<any> {
        return this.http.get<any>(
            `${urls.produccion}/Orders`,
        );
    }

    getOrdersPolling(intervalSeconds: number = 20): Observable<Order[]> {
        return interval(intervalSeconds * 1000).pipe(
        startWith(0), // Ejecutar inmediatamente
        switchMap(() => this.http.get<Order[]>(`${urls.produccion}/Orders`))
        );
    }

    getCouriersDetailsPolling(intervalSeconds: number = 20) : Observable<Courier[]> {
        return interval(intervalSeconds * 1000).pipe(
            startWith(0), 
            switchMap(() => this.http.get<Courier[]>( `${urls.produccion}/Couriers/Details`))
        )
    }

    getCouriersDetails() : Observable<any> {
        return this.http.get<any>(
            `${urls.produccion}/Couriers/Details`,
        );
    }

    getPendingOrdersFromPastDaysPolling(intervalSeconds : number = 86400, days : number) : Observable<number> { // generalmente una vez al dia
        return interval(intervalSeconds * 1000).pipe(
            startWith(0), 
            switchMap(() => this.http.get<number>(`${urls.produccion}/Orders/Pending`, { params: new HttpParams().set('days', days) })))
    }

    getPendingOrdersFromPastDays(days : number) : Observable<any> {
        return this.http.get<any>(
            `${urls.produccion}/Orders/Pending`,
            { params: new HttpParams().set('days', days) }
        );
    }
}