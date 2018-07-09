import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Constants } from './constants';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    constructor(
        private router: Router,
    ) { }

    /**
     * product search method called by click event on search button, will navigate to products page with associated search term
     * @param product input element
     */
    public productSearch(product: HTMLInputElement): void {
        if(product.value){
            this.navigate(product.value);
            product.value = "";
        }
    }

    /**
     * product search method called by keydown event on input, will navigate to products page with associated search term if enter is pressed
     * @param event keydown event
     * @param product input element
     */
    public productSearchByKey(event: any, product: HTMLInputElement): void {
        if(event.keyCode === 13 && product.value){
            this.navigate(product.value);
            product.value = "";
        }
    }

    /**
     * navigation method to products page, passing search term as query parameter
     * @param product query string
     */
    private navigate(product: string): void {
        this.router.navigate(['/products'], { queryParams: { query: product } })
    }
}
