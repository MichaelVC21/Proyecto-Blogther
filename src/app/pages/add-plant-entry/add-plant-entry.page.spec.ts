import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddPlantEntryPage } from './add-plant-entry.page';

describe('AddPlantEntryPage', () => {
  let component: AddPlantEntryPage;
  let fixture: ComponentFixture<AddPlantEntryPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPlantEntryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
