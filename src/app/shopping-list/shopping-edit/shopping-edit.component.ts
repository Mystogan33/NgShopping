import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { Ingredient } from 'src/app/shared/models/ingredient.model';
//import { ShoppingListService } from 'src/app/shared/services/shopping-list.service';
import * as ShoppingListActions from '../store/shopping-list.actions';
import * as fromShoppingList from '../store/shopping-list.reducer';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.scss']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('f', { static: false }) slForm: NgForm;
  editingSubscription: Subscription;
  editMode = false;
  editedItem: Ingredient;

  constructor
  (
    //private shoppingService: ShoppingListService,
    private store: Store<fromShoppingList.AppState>
  ) { }

  ngOnInit() {
    this.editingSubscription = this.store.select('shoppingList').subscribe(stateData => {
      if(stateData.editedIngredientIndex > -1) {
        this.editMode = true;
        this.editedItem = stateData.editedIngredient;
        this.slForm.setValue({
          name: this.editedItem.name,
         amount: this.editedItem.amount
        });
      } else {
        this.editMode = false;
      }
    })
    // this.editingSubscription = this.shoppingService.startedEditing.subscribe(
    //   (index: number) => {
    //     this.editedItemIndex = index;
    //     this.editMode = true;
    //     this.editedItem = this.shoppingService.getIngredient(index);
    //     this.slForm.setValue({
    //       name: this.editedItem.name,
    //       amount: this.editedItem.amount
    //     })
    //   });
    }

    onAddOrUpdateItem(form: NgForm) {
      const newIngredient: Ingredient = new Ingredient(form.value.name, form.value.amount);
      if(this.editMode) {
        //this.shoppingService.updateIngredient(this.editedItemIndex, newIngredient);
        this.store.dispatch(new ShoppingListActions.UpdateIngredient(newIngredient));
      } else {
        //this.shoppingService.addIngredient(newIngredient);
        this.store.dispatch(new ShoppingListActions.AddIngredient(newIngredient));
      }
      this.onClear();
    }

    onDelete() {
      //this.shoppingService.deleteIngredient(this.editedItemIndex);
      this.store.dispatch(new ShoppingListActions.DeleteIngredient(/*this.editedItemIndex*/));
      this.onClear();
    }


    onClear() {
      this.slForm.reset();
      //[this.editMode, this.editedItem, this.editedItemIndex] = [false, null, null];
      [this.editMode, this.editedItem] = [false, null];
      this.stopEditing();
    }


    stopEditing() {
      this.store.dispatch(new ShoppingListActions.StopEdit());
    }

    ngOnDestroy() {
      this.editingSubscription.unsubscribe();
      this.stopEditing();
    }
  }
