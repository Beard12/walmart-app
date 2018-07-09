import { Component, OnInit, OnDestroy } from '@angular/core';
import { Http } from '@angular/http';
import { ActivatedRoute, ParamMap } from '@angular/router'
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/takeUntil';

import { Constants } from './../../constants';
import { ProductService } from './../../services/product.service';
import { Product } from './../../models/product';
import { ProductDisplayComponent } from './../product-display-component/product.display.component';

@Component({
    selector: 'products',
    templateUrl: './products.component.html',
    styleUrls: ['./products.component.css']
})

/**
 * component to display list of searched products
 */
export class ProductsComponent implements OnInit, OnDestroy {
    public products: Array<Product> = [];
    public showError: boolean = false;
    public errorMessage: string = "";
    private ngUnsubscribe: Subject<any> = new Subject();

    constructor(
        private productService: ProductService,
        private route: ActivatedRoute,
    ) { }

    /**
     * ngOnInit function, subscribes to query params and updates page based on new params
     */
    public ngOnInit(): void {
        this.route
            .queryParamMap
            .takeUntil(this.ngUnsubscribe)
            .switchMap((queryParams: ParamMap) => this.productService.searchProducts(queryParams.get('query')))
            .subscribe(
                res => this.products = res,
                error => {
                    this.showError = true;
                    this.errorMessage = "There was an issue loading the products. Please reload and try again";
                }
            );
    }

    /**
     * ngOnDestroy function, unsubscribes to queryparammap on destruction of component
     */
    public ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}
