import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { IPagination } from './Models/Pagination';
import { IProduct } from './Models/Product';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  
  title = 'client';
  products : IProduct[] = [];
  responseglobal : any | undefined ;
  constructor(private http: HttpClient ) {}

  ngOnInit(): void {
   this.http.get('https://localhost:44379/api/products?PageSize=20').
      subscribe((response) => {
        this.responseglobal = response;
      this.products = this.responseglobal.data
    /*}, error => {
     console.log(error);*/
      });
  }
}
