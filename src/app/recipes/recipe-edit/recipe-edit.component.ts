import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';

import { RecipeService } from 'src/app/shared/services/recipe.service';
import { Recipe } from 'src/app/shared/models/recipe.model';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.scss']
})
export class RecipeEditComponent implements OnInit {
  id: number;
  editMode: boolean = false;
  recipeForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeService,
    private router: Router) { }

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        this.id = +params['id'];
        this.editMode = params['id'] != null;
        this.initForm();
      }
    )
  }

  onSubmit() {
    // const newRecipe: Recipe = new Recipe(
    //   this.recipeForm.value.name,
    //   this.recipeForm.value.description,
    //   this.recipeForm.value.imagePath,
    //   this.recipeForm.value.ingredients
    // )
    if(this.editMode) {
      this.recipeService.updateRecipe(this.id, this.recipeForm.value)
    } else {
      this.recipeService.addRecipe(this.recipeForm.value);
    }
    this.onCancel();
  }

  onCancel() {
    this.router.navigate(['../'], {relativeTo: this.route});
  }

  onAddIngredient() {
    (<FormArray>this.recipeForm.get('ingredients')).push(
      new FormGroup({
        "name": new FormControl(null, Validators.required),
        "amount": new FormControl(null, [
          Validators.required,
          Validators.pattern(/^[1-9]+[0-9]*$/)
        ])
      })
    )
  }

  onRemoveIngredient(indexOfIngredient: number) {
    (<FormArray>this.recipeForm.get('ingredients')).removeAt(indexOfIngredient);
  }

  private initForm() {
    let editedRecipe = {
      name: '',
      imagePath: '',
      description: '',
      ingredients: new FormArray([])
    };

    if(this.editMode) {
      const recipe = this.recipeService.getRecipe(this.id);
      editedRecipe.name = recipe.name;
      editedRecipe.description = recipe.description;
      editedRecipe.imagePath = recipe.imagePath;

      if(recipe.ingredients) {
        recipe.ingredients.forEach(ingredient => {
          editedRecipe.ingredients.push(
            new FormGroup({
              'name': new FormControl(ingredient.name, Validators.required),
              'amount': new FormControl(ingredient.amount, [
                Validators.required,
                Validators.pattern(/^[1-9]+[0-9]*$/)
              ])
            })
          )
        })
      }
    }

    this.recipeForm =  new FormGroup({
      'name': new FormControl(editedRecipe.name, Validators.required),
      'imagePath': new FormControl(editedRecipe.imagePath, Validators.required),
      'description': new FormControl(editedRecipe.description, Validators.required),
      'ingredients': editedRecipe.ingredients
    });
  }

  getControls() {
    return (<FormArray>this.recipeForm.get('ingredients')).controls;
  }

}
