import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ArtiPage } from './arti.page';

describe('ArtiPage', () => {
  let component: ArtiPage;
  let fixture: ComponentFixture<ArtiPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ArtiPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
