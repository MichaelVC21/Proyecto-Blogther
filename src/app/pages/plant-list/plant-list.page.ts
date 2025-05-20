import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { plantsData, PlantData } from '../../data/plantsData';


@Component({
  selector: 'app-plant-list',
  templateUrl: './plant-list.page.html',
  styleUrls: ['./plant-list.page.scss'],
  standalone: false,
})
export class PlantListPage implements OnInit {
  plantCategories: PlantData[] = [];


  constructor(private router: Router) {}

  ngOnInit(): void {
    // Equivalente a Object.values(plantsData)
    this.plantCategories = Object.values(plantsData);
  }

  goToDetail(id: number) {
    this.router.navigate(['/plant-detail', id]);
  }

  goToNewPlant(): void {
    this.router.navigate(['/new-plant']);
  }
}