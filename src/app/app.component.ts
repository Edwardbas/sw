import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { Subject } from 'rxjs';
import { PaginationModel } from './model/pagination.model';
import { PeopleModel } from './model/people.model';
import { PersonService } from './person.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  People: PeopleModel[] | undefined
  Prev: number | undefined
  Next: number | undefined
  Current: number | undefined
  Count: number | undefined

  searchTerm$ = new Subject<string>();
  searchRegime: boolean = false
  searchText: string = ''

  constructor(private _person: PersonService) {
    this._person.Search(this.searchTerm$).subscribe(data => {
      this.searchRegime = (this.searchText && this.searchText.length > 0) ? true : false
      this.parseData(data)
    });
  }

  ngOnInit(): void {
    this.loadPersons(1)
  }

  OnSearch($event: Event) {
    const val = ($event.target as HTMLInputElement).value
    this.searchText = val
    this.searchTerm$.next(val)
  }

  OnPrev() {
    if (this.Prev && this.Prev > 0)
      this.loadPersons(this.Prev)
  }

  OnNext() {
    if (this.Next && this.Count && this.Next <= this.Count)
      this.loadPersons(this.Next)
  }

  private loadPersons(page: number | undefined) {
    page = page ? page : 1
    this._person.GetPeopleList(page).subscribe(data => {
      this.searchRegime = false
      this.parseData(data)
    })
  }

  private getPageNumber(url: string | undefined): number {
    return url ? parseInt(url.split('page=')[1]) : 0
  }

  private parseData(data: PaginationModel<PeopleModel>) {
    if (data) {
      this.People = data.results
      this.Count = this.calculatePagesCount(data?.count)
      this.Next = this.getPageNumber(data.next)
      this.Prev = this.getPageNumber(data.previous)
      this.Current = (this.Next && this.Next > 0 ? this.Next : (this.Count + 1)) - 1
    }
  }

  private calculatePagesCount(rowsCount: number | undefined): number {
    rowsCount = rowsCount ? rowsCount : 0
    let c = Math.round(rowsCount / 10)
    let d = rowsCount % 10
    if (d > 0)
      c++
    return c
  }
}
