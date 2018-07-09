import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { ProductComponent } from './../components/product-component/product.component';
import { ProductsComponent } from './../components/products-component/products.component';
import { ProductDisplayComponent } from './../components/product-display-component/product.display.component';
import { ProductService } from './../services/product.service';
import { KeyService } from './../services/keys.service';

@NgModule({
    imports: [
        RouterModule,
        CommonModule,
    ],
    declarations: [
        ProductComponent,
        ProductsComponent,
        ProductDisplayComponent
    ],
    providers: [
        ProductService,
        KeyService
    ],
    exports: [
        ProductComponent,
        ProductsComponent,
        ProductDisplayComponent
    ],

})
export class ProductsModule {}