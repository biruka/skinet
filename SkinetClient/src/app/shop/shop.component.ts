import { Component, OnInit, ViewChild,ElementRef } from '@angular/core';
import { IBrand } from '../shared/Models/Brand';
import { IProduct } from '../shared/Models/Product';
import { IType } from '../shared/Models/Type';
import { ShopService } from './shop.service';
import { ShopParams } from '../shared/Models/shopParams';
@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit {
  @ViewChild("search", {static: false}) searcTerm: ElementRef;
  products: any;
  brands !: IBrand[];
  types !: IType[];
  shopParams = new ShopParams();
  totalCount: number;
  sortOptions = [
    {name: 'Alphabetical', value: 'name'},
    {name: 'Price: Low to High', value: 'priceAsc'},
    {name: 'Price: High to Low', value: 'priceDesc'}
  ];

  constructor(private shopService : ShopService) { }
  ngOnInit() {
    this.getProdcts();
    this.getBrands();
    this.getTypes();
  }

  getProdcts() {
    this.shopService.getProducts(this.shopParams).subscribe(response =>{
      this.products = response?.data;
      this.shopParams.pageNumber = response.pageIndex;
      this.shopParams.pageSize = response.pageSize;
      this.totalCount = response.count;
      console.log(this.products);
    }, error => {
      console.log(error);
    })
  }

  getBrands(){
    this.shopService.getBrands().subscribe(brandResponse => {
      this.brands = [{id: 0, name: 'All'}, ...brandResponse];
    }, error => {
      console.log(error);
    })
  }

  getTypes(){
    this.shopService.getTypes().subscribe(typesResponse => {
      this.types = [{id: 0, name: 'All'}, ...typesResponse];;
    }, error => {
      console.log(error);
    })
  }

  onBrandSelected(brandId: number){
    this.shopParams.brandId = brandId;
    this.shopParams.pageNumber = 1;
    this.getProdcts();
  }

  onTypeSelected(typeId: number){
    this.shopParams.typeId = typeId;
    this.shopParams.pageNumber = 1;
    this.getProdcts();
  }

  onSortSelected(sort: string)
  {
    this.shopParams.sort = sort;
    this.getProdcts();
  }

  onPageChanged(event: any){
    this.shopParams.pageNumber = event;
    this.getProdcts();
  }

  onSearch() {
    this.shopParams.search = this.searcTerm.nativeElement.value;
    this.shopParams.pageNumber = 1;
    this.getProdcts();
  }

  onReset() {
    this.searcTerm.nativeElement.value = "";
    this.shopParams = new ShopParams();
    this.getProdcts();
  }
}
