import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { ActivatedRoute, ParamMap } from '@angular/router'
import { forkJoin } from 'rxjs/observable/forkJoin';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/takeUntil';

import { Product } from './../../models/product';
import { ProductService } from './../../services/product.service';
import { ProductDisplayComponent } from './../product-display-component/product.display.component';

@Component({
    selector: 'product',
    templateUrl: './product.component.html',
    styleUrls: ['./product.component.css']
})

/**
 * single product component page
 */
export class ProductComponent implements OnInit {
    public model: Product = null;
    public recommendedProducts: Product[] = [];
    public errorMessage: string = "";
    public showError: boolean = false;
    private ngUnsubscribe: Subject<any> = new Subject();
    constructor(
        private productService: ProductService,
        private route: ActivatedRoute,
    ) { }

    /**
     * ngOnInit function, subscribes to params and will update page on new route navigation
     */
    public ngOnInit(): void {
        this.route
            .paramMap
            .takeUntil(this.ngUnsubscribe)
            .switchMap((params: ParamMap) => this.handleLoad(params.get('itemId')))
            .subscribe(
                loadSuccess => {},
                error => this.showError = true
            );
    }

    /**
     * ngOnDestroy function, unsubscribes to paramMap subscription when component is destroyed
     */
    public ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    /**
     * method to handle page load, forkjoins the product lookup observable and the recommend product observable
     * will load main product from service if navigating from search 
     * @param itemId requested item id
     */
    private handleLoad(itemId: string): Observable<boolean[]> {
        this.model = this.productService.retrieveProduct(itemId);
        return forkJoin(this.productObs(this.model,itemId), this.recommendedProductsObs(itemId))
    }

    /**
     * method to retrieve the product information, if model already loaded will complete the observable immediately 
     * @param model the main product model
     * @param itemId the item id of the requested item
     */
    private productObs(model: Product, itemId: string): Observable<boolean>{
        return new Observable<boolean>((observer: Observer<boolean>) => {
            if(model == null){
                this.productService.lookupProducts([+itemId])
                    .take(1)
                    .subscribe(
                        (products: Product[]) => this.model = products[0],
                        error => {
                            this.errorMessage = "There was an error loading the product. Please reload the page and try again."; 
                            observer.error(error);
                            observer.complete();
                        }
                    );
            }
            observer.next(true);
            observer.complete();  
        });
    }

    /**
     * method to retrieve the recommended products, makes a call to the recommendation service, then with the associated item ids
     * makes a call to the lookup api
     * @param itemId the item id to retrieve recommendations for
     */
    private recommendedProductsObs(itemId: string): Observable<boolean> {
        return new Observable<boolean>((observer: Observer<boolean>) => {
            this.productService.recommendProducts(itemId)
                .take(1)
                .subscribe(
                    (ids: number[]) => {
                        if(ids.length > 0){
                            this.productService.lookupProducts(ids)
                                .take(1)
                                .subscribe(
                                    (products: Product[]) =>{
                                        this.recommendedProducts = products
                                        if(this.recommendedProducts.length == 0){

                                        }
                                    }, 
                                    error => {
                                        this.errorMessage = "There was an error loading the recommended products. Please reload the page and try again.";
                                        observer.error(error);
                                        observer.complete();
                                    }
                                );
                        } else{
                            this.showError = true;
                            this.errorMessage = "There are no recommended products associated with this product"
                        }
                        observer.next(true);
                        observer.complete();
                    },
                    error => {
                        this.errorMessage = "There was an error loading the recommended products. Please reload the page and try again.";
                        observer.error(error);
                        observer.complete();
                    }
                );
        })
    }
}