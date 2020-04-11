import { Component, OnInit, Input, ViewChild, Inject } from '@angular/core';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { switchMap } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { Rating } from '../shared/rating';
import { Comment } from '../shared/comment';


@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss']
})
export class DishdetailComponent implements OnInit {

  ratingForm: FormGroup;
  rating: Rating;
  dish: Dish;
  dishIds: string[];
  prev: string;
  next: string;
  errMess: string;
  dishcopy: Dish;

  @ViewChild('fform') ratingFormDirective;

  formErrors = {
    'name': '',
    'comment': '',
  };

  validationMessages = {
    'name': {
      'required':      'Name is required.',
      'minlength':     'Name must be at least 2 characters long.',
      'maxlength':     'Name cannot be more than 50 characters long.'
    },
    'comment': {
      'required':      'Comment is required.',
    },
  };

  constructor(private dishService: DishService,
              private location: Location,
              private route: ActivatedRoute,
              private fb: FormBuilder,
              @Inject('BaseURL') public BaseURL) {
    this.createForm();
   }

 createForm() {
   this.ratingForm = this.fb.group({
     name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)] ],
     score: [5, [] ],
     comment: ['', [Validators.required] ],
   });

    this.ratingForm.valueChanges
     .subscribe(data => this.onValueChanged(data));

    this.onValueChanged(); // (re)set validation messages now
  }

  onValueChanged(data?: any) {
    if (!this.ratingForm) { return; }
    const form = this.ratingForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        // clear previous error message (if any)
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  onSubmit() {
    this.rating = this.ratingForm.value;
    // save comment
    const date = new Date();
    const dataISO = date.toISOString();
    const newComment: Comment = {
      rating: this.rating.score,
      comment: this.rating.comment,
      author: this.rating.name,
      date: dataISO,
    }
    this.dishcopy.comments.push(newComment);
    this.dishService.putDish(this.dishcopy)
      .subscribe(dish => {this.dish = dish; this.dishcopy = dish;},
                 errmess => { this.dish = null; this.dishcopy = null; this.errMess = <any>errmess; });
    // reset value and form
    this.ratingFormDirective.resetForm();
    this.ratingForm.reset({
      name: '',
      score: 5,
      comment: '',
    });
  }

  ngOnInit() {
    this.dishService.getDishIds()
      .subscribe(dishIds => this.dishIds = dishIds, errmess => this.errMess = <any>errmess);
    this.route.params
      .pipe(switchMap((params: Params) => this.dishService.getDish(params['id'])))
      .subscribe(dish => {this.dish = dish;
                          this.dishcopy = dish;
                          this.setPrevNext(dish.id); },
                 errmess => this.errMess = <any>errmess);
  }

  setPrevNext(dishId: string) {
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
  }

  goBack() {
    this.location.back();
  }

}
