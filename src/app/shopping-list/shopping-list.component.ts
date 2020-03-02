import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs'; /*Subscription,*/
import { Store } from '@ngrx/store';
//import { ShoppingListService } from '../shared/services/shopping-list.service';
import * as ShoppingListActions from './store/shopping-list.actions';
import * as fromShoppingList from './store/shopping-list.reducer';
import { Ingredient } from '../shared/models/ingredient.model';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.scss']
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  ingredients:  Observable<{ ingredients: Ingredient[] }>;
  //private subscription: Subscription;

  constructor(
    //private shoppingService: ShoppingListService,
    private store: Store<fromShoppingList.AppState>
  ) {}

  ngOnInit() {
    this.ingredients = this.store.select('shoppingList');
    // this.ingredients = this.shoppingService.ingredients;
    // this.subscription = this.shoppingService.ingredientsChanged.subscribe((ingredients: Ingredient[]) => {
    //   this.ingredients = ingredients;
    // })
  }

  onEditItem(indexOfIngredient: number) {
    //this.shoppingService.startedEditing.next(indexOfIngredient);
    this.store.dispatch(new ShoppingListActions.StartEdit(indexOfIngredient));
  }

  ngOnDestroy() {
    //this.subscription.unsubscribe();
  }
}
