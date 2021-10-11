import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PaginationModel } from './model/pagination.model';
import { PeopleModel } from './model/people.model';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PersonService {

  private _base = 'https://swapi.dev/api/people/'

  constructor(private _http: HttpClient) { }

  GetPeopleList(page: number) {
    const url = this._base + (page > 0 ? '?page=' + page : '')
    return this._http.get<PaginationModel<PeopleModel>>(url)
  }

  SearchPeople(search: string) {
    const url = this._base + (search ? '?search=' + search : '')
    return this._http.get<PaginationModel<PeopleModel>>(url)
  }

  Search(terms: Observable<string>) {
    return terms.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((term: string) => this.SearchPeople(term))
    )
  }
}
