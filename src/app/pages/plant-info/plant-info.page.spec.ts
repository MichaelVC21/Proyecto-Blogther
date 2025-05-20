import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlantInfoPage } from './plant-info.page';

describe('PlantInfoPage', () => {
  let component: PlantInfoPage;
  let fixture: ComponentFixture<PlantInfoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PlantInfoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
