import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlantDaysPage } from './plant-days.page';

describe('PlantDaysPage', () => {
  let component: PlantDaysPage;
  let fixture: ComponentFixture<PlantDaysPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PlantDaysPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
