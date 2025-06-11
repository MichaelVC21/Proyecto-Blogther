import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewPlantHistorialPage } from './new-plant-historial.page';

describe('NewPlantHistorialPage', () => {
  let component: NewPlantHistorialPage;
  let fixture: ComponentFixture<NewPlantHistorialPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(NewPlantHistorialPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
