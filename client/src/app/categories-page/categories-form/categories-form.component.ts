import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {CategoriesService} from "../../shared/services/categories.service";
import {switchMap} from "rxjs/internal/operators";
import {of} from "rxjs/index";
import {MaterialService} from "../../shared/classes/material.service";
import {Category} from "../../shared/interfaces";

@Component({
  selector: 'app-categories-form',
  templateUrl: './categories-form.component.html',
  styleUrls: ['./categories-form.component.scss']
})
export class CategoriesFormComponent implements OnInit {
  public isNew: boolean = true;
  public form: FormGroup;
  public image: File;
  public imagePreview;
  private category: Category;
  @ViewChild('input') input: ElementRef;

  constructor(private route: ActivatedRoute,
              private categoryService: CategoriesService,
              private router: Router) {
  }

  ngOnInit() {
    this.createForm();
    this.getCategory();
  }

  public deleteCategory() {
    const decision = window.confirm(`Are you want delete ${this.category.name} category?`);
    if (decision) {
      this.categoryService.delete(this.category._id).subscribe(
        ({message}) => MaterialService.toast(message),
        error => MaterialService.toast(error.error.message),
        () => this.router.navigate(['/categories']).then())
    }
  }

  public onSubmit() {
    this.form.disable();
    let obs$;
    if (this.isNew) {
      obs$ = this.categoryService.creat(this.form.value.name, this.image)
    } else {
      obs$ = this.categoryService.update(this.category._id, this.form.value.name, this.image)
    }
    obs$.subscribe(
      category => {
        MaterialService.toast('Category updated');
        this.form.enable();
      },
      error => {
        this.form.enable();
        MaterialService.toast(error.error.message);
      }
    );
  }

  private getCategory() {
    this.form.disable();
    this.route.params
      .pipe(
        switchMap((params: Params) => {
          if (params['id']) {
            this.isNew = false;
            return this.categoryService.getById(params['id'])
          }
          return of(null)
        })
      )
      .subscribe(
        (category: Category) => {
          if (category) {
            this.category = category;
            this.form.patchValue({
              name: category.name
            });
            this.imagePreview = category.imageSrc;
            MaterialService.updateTextInputs();
          }
          this.form.enable();
        },
        error => {
          MaterialService.toast(error.error.message);
        }
      )
  }

  public triggerClick() {
    this.input.nativeElement.click();
  }

  public onFileUpload(event: any): void {
    const file = event.target.files[0];
    this.image = file;
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(file);
  }

  private createForm() {
    this.form = new FormGroup({
      name: new FormControl(null, [Validators.required])
    })
  }
}
