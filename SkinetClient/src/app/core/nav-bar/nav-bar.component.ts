import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { BasketService } from 'src/app/basket/basket.service';
import { IBasket } from 'src/app/shared/Models/Basket';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {

  baskets$: Observable<any> | null;
  constructor(private basketService: BasketService) { }

  ngOnInit(): void {
    this.baskets$ = this.basketService.basket$ 
  }
}
