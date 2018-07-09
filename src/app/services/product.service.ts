import { Injectable } from '@angular/core';
import { Jsonp, Response, Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { Constants } from './../constants';
import { Product } from './../models/product';
import { KeyService } from './../services/keys.service'


@Injectable()
export class ProductService{
    private productSearchUrl: string = Constants.ProductSearchUrl;
    private productLookupUrl: string = Constants.ProductLookupUrl;
    private productRecUrl: string = Constants.ProductRecommendationUrl;
    private apiQP: string = Constants.APIQueryParam;
    private jsonpSuffix: string = Constants.JSONPSuffix;
    private products : Product[] = [];

    constructor(
        private jsonp: Jsonp, 
        private http: Http,
        private keyService: KeyService
    ) {}

    /**
     * method used to return search products
     * will return observable of products returned by api based on search term
     * otherwise will return error if string is empty,null or undefined
     * @param query search term entered by user
     */
    public searchProducts(query: string): Observable<Product[]>{
        let obs: Observable<Product[]> = null;
        if(query){
            obs = this.keyService.retrieveAPIKey()
                .map(apiKey => apiKey)
                .switchMap(key => {
                    return this.jsonp
                            .request(`${this.productSearchUrl}${query}${this.apiQP}${key}${this.jsonpSuffix}`)
                            .map(res => this.mapTake(res));
                })
        } else{
            obs = Observable.throw("Empty or null string provided");
        }
        return obs;
    }

    /**
     * method used to lookup products 
     * will return observable of products returned by api based on item ids
     * otherwise will return error if array passed in is empty
     * @param items arry of item ids
     */
    public lookupProducts(items: number[]): Observable<Product[]>{
        let obs: Observable<Product[]> = null;
        if(items.length > 0){
            let ids: string = items.join(',');
            obs = this.keyService.retrieveAPIKey()
                .map(apiKey => apiKey)
                .switchMap(key => {
                    return this.jsonp
                        .request(`${this.productLookupUrl}${ids}${this.apiQP}${key}${this.jsonpSuffix}`)
                        .map(res => this.mapTake(res));
                })
        } else{
            obs = Observable.throw("Empty array provided")
        }
        return obs;
    }

    /**
     * method to retrieve recommended products
     * will return observable of products returned by recommendation api
     * otherwise will return error if item id is null, empty or undefined
     * @param itemId itemId of product to retrieve recommendations about
     */
    public recommendProducts(itemId: string): Observable<number[]>{
        let obs: Observable<number[]> = null;
        if(itemId){
            obs = this.keyService.retrieveAPIKey()
                .map(apiKey => apiKey)
                .switchMap(key => {
                    return this.http
                        .get(`${this.productRecUrl}${itemId}/${key}`)
                        .map(res => {
                            let items = res.json() as Product[];
                            return items.map(item => {return item.itemId}).slice(0,9);
                        });
                })
            
        } else {
            obs = Observable.throw("Empty or null string provided")
        }
        return obs;
    }
    
    /**
     * method used to retrieve product from service store if available
     * @param itemId item id of product
     */
    public retrieveProduct(itemId: string): Product {
        let retProduct = null;
        if(itemId){
            let prods = this.products.filter(product => { return product.itemId.toString() === itemId });
            if(prods.length > 0){
                retProduct = prods[0];
            }
        }

        return retProduct;
    }

    /**
     * method used to map response to this.products member, then returns the member 
     * @param res response from api
     */
    private mapTake(res: Response) : Product[] {
        if(res){
            let newProds: Product[] = res.json().items as Product[];
            let itemsToAdd: Product[] = newProds.filter(this.compareProducts(this.products));
            this.products = this.products.concat(itemsToAdd);
            return newProds;
        }
    }

    /**
     * returns predicate to pass into filter method to compare Product arrays and return unique items
     * @param otherArray array to compare against
     */
    private compareProducts(otherArray: Product[]): (current: Product) => boolean {
        return (current: Product) => {
            return otherArray.filter((other: Product) => { return other.itemId == current.itemId; }).length == 0;
        }
    }
}