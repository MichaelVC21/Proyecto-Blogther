import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CambContraPage } from './camb-contra.page';

describe('CambContraPage', () => {
  let component: CambContraPage;
  let fixture: ComponentFixture<CambContraPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CambContraPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
