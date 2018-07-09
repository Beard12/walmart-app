import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ProductComponent } from './../components/product-component/product.component';
import { ProductsComponent } from './../components/products-component/products.component';

const routes: Routes = [
    { path: 'product/:itemId', component: ProductComponent },
    { path: 'products', component: ProductsComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }