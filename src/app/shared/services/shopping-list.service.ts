import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { Ingredient } from '../models/ingredient.model';

@Injectable({
  providedIn: 'root'
})
export class ShoppingListService {
  public startedEditing = new Subject<number>();
  public ingredientsChanged = new Subject<Ingredient[]>();
  private _ingredients: Ingredient[] = [
     new Ingredient('Apples', 6),
     new Ingredient('Tomatoes', 10)
]

  constructor() { }

  get ingredients(): Ingredient[] {
    return this._ingredients.slice();
  }

  set ingredients(ingredients: Ingredient[]) {
    this._ingredients = ingredients;
    this.dispatchChanges();
  }

  getIngredient(indexOfIngredient: number) {
    return this.ingredients[indexOfIngredient];
  }

  addIngredient(ingredient: Ingredient) {
    this._ingredients.push(ingredient);
    this.dispatchChanges();
  }

  addIngredients(ingredients: Ingredient[]) {
    this._ingredients.push(...ingredients);
    this.dispatchChanges();
  }

  updateIngredient(indexOfIngredient: number, newIngredient: Ingredient) {
    this._ingredients[indexOfIngredient] = newIngredient;
    this.dispatchChanges();
  }

  deleteIngredient(indexOfIngredient: number) {
    this._ingredients.splice(indexOfIngredient, 1);
    this.dispatchChanges();
  }

  private dispatchChanges() {
    this.ingredientsChanged.next(this.ingredients);
  }

}
