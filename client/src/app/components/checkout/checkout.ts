import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart';
import { AuthService } from '../../services/auth';
import { OrderService } from '../../services/order';

@Component({
    selector: 'app-checkout',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './checkout.html',
    styleUrl: './checkout.css',
})
export class Checkout implements OnInit {
    private cartService = inject(CartService);
    private authService = inject(AuthService);
    private orderService = inject(OrderService);
    private router = inject(Router);

    shipping = {
        name: '',
        address: '',
        city: '',
        zip: '',
        country: ''
    };

    ngOnInit() {
        if (!this.cartService.cart()) {
            const user = this.authService.currentUser();
            if (user) {
                this.cartService.getCart(user.id).subscribe();
            } else {
                this.router.navigate(['/login']);
            }
        }
    }

    onZipInput(event: any) {
        const input = event.target as HTMLInputElement;
        // Remove non-numeric characters
        let value = input.value.replace(/[^0-9]/g, '');
        // Limit to 6 characters
        if (value.length > 6) {
            value = value.substring(0, 6);
        }
        this.shipping.zip = value;
        input.value = value;
    }

    selectedPaymentMethod: 'CARD' | 'UPI' | 'COD' = 'CARD';

    payment = {
        cardNumber: '',
        expiry: '',
        cvv: '',
        upiId: ''
    };

    get cartItems() {
        return this.cartService.cart()?.products || [];
    }

    taxRate = 0.18; // 18% tax

    get subtotal() {
        const products = this.cartService.cart()?.products;
        if (!products) return 0;
        return products.reduce((acc, item) => acc + (item.productId.price * item.quantity), 0);
    }

    get tax() {
        return this.subtotal * this.taxRate;
    }

    get totalAmount() {
        return this.subtotal + this.tax;
    }

    placeOrder() {
        const user = this.authService.currentUser();
        if (!user) return;

        // Basic Shipping Validation
        if (!this.shipping.name || !this.shipping.address || !this.shipping.city || !this.shipping.zip) {
            alert('Please fill in all shipping fields');
            return;
        }

        // Payment Validation
        if (this.selectedPaymentMethod === 'CARD') {
            if (!this.payment.cardNumber || !this.payment.expiry || !this.payment.cvv) {
                alert('Please fill in all card details');
                return;
            }
        } else if (this.selectedPaymentMethod === 'UPI') {
            if (!this.payment.upiId) {
                alert('Please enter your UPI ID');
                return;
            }
        }

        // COD needs no extra validation

        // Prepare Order Payload
        const orderData = {
            userId: user.id,
            products: this.cartItems.map(item => ({
                productId: item.productId._id,
                quantity: item.quantity,
                price: item.productId.price
            })),
            totalAmount: this.totalAmount,
            shipping: this.shipping,
            paymentMethod: this.selectedPaymentMethod
        };

        // Call API
        this.orderService.createOrder(orderData).subscribe({
            next: (res) => {
                console.log('Order created:', res);
                // Clear cart locally
                this.cartService.cart.set(null);

                alert('Order placed successfully! Order ID: ' + res._id);
                this.router.navigate(['/']);
            },
            error: (err) => console.error('Error placing order:', err)
        });
    }
}
