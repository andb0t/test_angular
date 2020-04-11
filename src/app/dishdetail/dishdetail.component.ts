import { Component, OnInit, Input } from '@angular/core';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss']
})
export class DishdetailComponent implements OnInit {

  dish: Dish;

  constructor(private dishService: DishService,
              private location: Location,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    // tslint:disable-next-line:no-string-literal
    const id = this.route.snapshot.params['id'];
    this.dishService.getDish(id)
      .then(dish => this.dish = dish);
  }

  goBack() {
    this.location.back();
  }

}
