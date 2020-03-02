import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RecipeService } from './recipe.service';
import { Recipe } from '../models/recipe.model';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {

  private dbUrl: string = "https://ng-shopping-14631.firebaseio.com/recipes.json";

  constructor(
    private http: HttpClient,
    private recipeService: RecipeService
  ) {}

  storeRecipes() {
    const recipes = this.recipeService.recipes;
    return this.http
    .put(this.dbUrl, recipes)
  }

  fetchRecipes() {
    return this.http
    .get<Recipe[]>(this.dbUrl)
    .pipe(
      map((recipes: Recipe[]) => {
        return recipes.map((recipe: Recipe) => {
          return {
            ...recipe,
            ingredients: recipe.ingredients ? recipe.ingredients : []
          }
        })
      }),
      tap(recipes => this.recipeService.recipes = recipes)
    )
  }
}
