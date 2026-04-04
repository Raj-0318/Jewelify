import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { adminGuard } from './guards/admin.guard';
import { ProductList } from './components/product-list/product-list';
import { ProductDetail } from './components/product-detail/product-detail';
import { Cart } from './components/cart/cart';
import { Checkout } from './components/checkout/checkout';
import { OrderHistory } from './components/order-history/order-history';
import { Profile } from './components/profile/profile';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { Wishlist } from './components/wishlist/wishlist.component';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'wishlist', component: Wishlist },
    { path: 'products', component: ProductList },
    { path: 'product/:id', component: ProductDetail },
    { path: 'cart', component: Cart },
    { path: 'checkout', component: Checkout },
    { path: 'orders', component: OrderHistory },
    { path: 'orders/:id', loadComponent: () => import('./components/order-detail/order-detail').then(m => m.OrderDetail) },
    { path: 'profile', component: Profile },
    { path: 'orders', component: OrderHistory },
    {
        path: 'admin',
        loadComponent: () => import('./components/admin/admin-layout/admin-layout').then(m => m.AdminLayout),
        canActivate: [adminGuard],
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'dashboard', loadComponent: () => import('./components/admin/dashboard/dashboard').then(m => m.AdminDashboard) },
            { path: 'products', loadComponent: () => import('./components/admin/products/product-list').then(m => m.AdminProductList) },
            { path: 'products/new', loadComponent: () => import('./components/admin/product-form/product-form').then(m => m.AdminProductForm) },
            { path: 'products/edit/:id', loadComponent: () => import('./components/admin/product-form/product-form').then(m => m.AdminProductForm) },
            { path: 'orders', loadComponent: () => import('./components/admin/orders/order-list').then(m => m.AdminOrderList) },
            { path: 'users', loadComponent: () => import('./components/admin/users/user-list').then(m => m.AdminUserList) },
            { path: 'reviews', loadComponent: () => import('./components/admin/reviews/review-list').then(m => m.AdminReviewList) },
        ]
    },
    { path: 'about', loadComponent: () => import('./components/about/about').then(m => m.About) },
    { path: 'contact', loadComponent: () => import('./components/contact/contact').then(m => m.Contact) },
    { path: 'login', component: Login },
    { path: 'register', component: Register },
    { path: '**', redirectTo: '' }
];
