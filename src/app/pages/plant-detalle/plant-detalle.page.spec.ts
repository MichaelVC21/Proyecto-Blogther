import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlantDetallePage } from './plant-detalle.page';

describe('PlantDetallePage', () => {
  let component: PlantDetallePage;
  let fixture: ComponentFixture<PlantDetallePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PlantDetallePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
