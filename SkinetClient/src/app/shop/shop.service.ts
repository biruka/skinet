import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { IPagination } from '../shared/Models/Pagination';
import { IBrand } from '../shared/Models/Brand';
import { IType } from '../shared/Models/Type';
import { map } from 'rxjs/operators';
import { ShopParams } from '../shared/Models/shopParams';
@Injectable({
  providedIn: 'root'
})
export class ShopService {
  baseUrl = 'https://localhost:44379/api/';

  constructor(private http: HttpClient) { }

  getProducts(shopParams: ShopParams) {
    let params = new HttpParams(); 
    
    if(shopParams.brandId != 0)
    {
      params = params.append("brandId", shopParams.brandId.toString());
    }
    if(shopParams.typeId != 0)
    {
      params = params.append("typeId", shopParams.typeId.toString());
    }
    if(shopParams.search) {
      params = params.append("search", shopParams.search);
    }
    params = params.append("sort", shopParams.sort);
    params = params.append("pageIndex", shopParams.pageNumber.toString());
    params = params.append("pageSize", shopParams.pageSize.toString());

    return this.http.get<IPagination>(this.baseUrl + 'products', {params});
  }

  getBrands() {
    return this.http.get<IBrand[]>(this.baseUrl + 'products/brands');
  }

  getTypes() {
    return this.http.get<IType[]>(this.baseUrl + 'products/types')
  }
}
