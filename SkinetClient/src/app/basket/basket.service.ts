import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Basket, IBasket, IBasketItem, IBasketTotals } from '../shared/Models/Basket';
import { map } from 'rxjs/operators';
import { IProduct } from '../shared/Models/Product';

@Injectable({
  providedIn: 'root'
})

export class BasketService {

  baseUrl = environment.apiUrl;

  private basketSource = new BehaviorSubject<IBasket| null>(null);
  
  basket$ = this.basketSource.asObservable();

  private basketTotalSource = new BehaviorSubject<IBasketTotals | null>(null);

  basketTotal$ = this.basketTotalSource.asObservable();
  
  constructor(private http: HttpClient) { }
  
  getBasket(id: string){
    return this.http.get(this.baseUrl + 'basket?id='+ id)
        .pipe(
          map((basket : any) => {
            this.basketSource.next(basket);
            this.calculateTotals();
          })
      );
  }

  setBasket(basket: any) {
    return this.http.post(this.baseUrl + 'basket', basket)
          .subscribe((response: any) => {
              this.basketSource.next(response);
              this.calculateTotals()
            }, error => {
              console.log(error);
        });
  }

  getcurrentBasketValue() {
    return this.basketSource.value;
  }

  addItemToBasket(item:IProduct, quantity = 1){
    const itemToAdd: IBasketItem = this.mapProductItemToBasketItem(item, quantity);
    const basket = this.getcurrentBasketValue() ?? this.createBasket();
    basket.items = this.addOrUpdateItem(basket.items,itemToAdd,quantity);
    this.setBasket(basket);
  }

  private addOrUpdateItem(items: IBasketItem[], itemToAdd: IBasketItem, quantity: number): IBasketItem[] {
      const index = items.findIndex(i => i.id === itemToAdd.id);
      if(index === -1)
      {
        itemToAdd.quantity = quantity;
        items.push(itemToAdd);
      }
      else {
        items[index].quantity += quantity;
      }
      return items;
  }

  private createBasket(): IBasket {
    const basket = new Basket();
    localStorage.setItem('basket_id', basket.id);
    return basket;
  }

  private mapProductItemToBasketItem(item: IProduct, quantity: number): IBasketItem {
    return {
      id: item.id,
      productName: item.name,
      quantity,
      price : item.price,
      pictureUrl: item.pictureUrl,
      brand : item.productBrand,
      type : item.productType
    };
  }

  private calculateTotals() {
    const basket = this.getcurrentBasketValue();
    const shipping = 0;
    let subtotal : number = 0;
    let total : number = 0;
    if(basket) {
      subtotal = basket.items.reduce((a,b) => (b.price * b.quantity)+ a ,0);
      total = subtotal + shipping;
    }
    this.basketTotalSource.next({shipping,total, subtotal});
  }

  incrementItemQuantity(item: any) {
    const basket = this.getcurrentBasketValue();
    let foundItemIndex = 0;
    if(basket) {
      foundItemIndex = basket.items.findIndex(x => x.id === item.id);
      basket.items[foundItemIndex].quantity++;
    }
    this.setBasket(basket);
  }

  decrementItemQuantity(item: IBasketItem) {
    const basket = this.getcurrentBasketValue();
    let foundItemIndex = 0;
    if(basket) {
      foundItemIndex = basket.items.findIndex(x => x.id === item.id);
      if(basket.items[foundItemIndex].quantity > 1){
        foundItemIndex = basket.items[foundItemIndex].quantity--;
      } else {
        this.removeItemFromBasket(item);
      }
    }
    this.setBasket(basket);
  }

  removeItemFromBasket(item: IBasketItem) {
    const basket = this.getcurrentBasketValue();
    if(basket?.items.some(x => x.id === item.id)){
      basket.items = basket.items.filter(i => i.id != item.id);
      if(basket.items.length > 0){
        this.setBasket(basket);
      } else {
        this.deleteBasket(basket);
      }
    }
  }

  deleteBasket(basket: IBasket) {
    return this.http.delete(this.baseUrl + 'basket?id=' + basket.id).subscribe(() =>
      {
        this.basketSource.next(null);
        this.basketTotalSource.next(null);
        localStorage.removeItem('basket_id')
      }, error => { console.error(); }      
    );
  }
}

