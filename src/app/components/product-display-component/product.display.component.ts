import { Component, Input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Product } from './../../models/product';

@Component({
    selector: 'product-display',
    templateUrl: './product.display.component.html',
    styleUrls: ['./product.display.component.css']
})

/**
 * component meant to display listing of a component
 */
export class ProductDisplayComponent {
    @Input() model: Product = null;
}