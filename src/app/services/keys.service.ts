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

    /**
     * method to set api key, retrieves from json file
     */
    private setKey(): Observable<string> {
        return this.http
            .get(this.keysPath)
            .take(1)
            .map(keys => {
                this.keyCollection.setAPIKey(keys.json().apiKey);
                return this.keyCollection.retrieveAPIKey();
            })
    }

    /**
     * method to retrieve api key, will set if not already set
     */
    public retrieveAPIKey(): Observable<string> {
        if(this.keyCollection.retrieveAPIKey()){
            return Observable.of(this.keyCollection.retrieveAPIKey());          
        }
        else{        
            return this.setKey();
        } 
    }

}


