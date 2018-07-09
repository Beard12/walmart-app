import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';

import { Constants } from './../constants';
import { Keys } from './../models/keys';


@Injectable()
export class KeyService{
    private keyCollection: Keys = new Keys();
    private keysPath = Constants.APIKeyPath;

    constructor(private http: Http) {}

    private setKey(): Observable<string> {
        return this.http
            .get(this.keysPath)
            .take(1)
            .map(keys => {
                this.keyCollection.setAPIKey(keys.json().apiKey);
                return this.keyCollection.retrieveAPIKey();
            })
    }

    public retrieveAPIKey(): Observable<string> {
        if(this.keyCollection.retrieveAPIKey()){
            return Observable.of(this.keyCollection.retrieveAPIKey());          
        }
        else{        
            return this.setKey();
        } 
    }

}


