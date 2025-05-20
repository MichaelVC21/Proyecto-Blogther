import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditPlantEntryPage } from './edit-plant-entry.page';

describe('EditPlantEntryPage', () => {
  let component: EditPlantEntryPage;
  let fixture: ComponentFixture<EditPlantEntryPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPlantEntryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
