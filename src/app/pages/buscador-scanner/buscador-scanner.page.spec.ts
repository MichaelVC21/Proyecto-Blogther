import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BuscadorScannerPage } from './buscador-scanner.page';

describe('BuscadorScannerPage', () => {
  let component: BuscadorScannerPage;
  let fixture: ComponentFixture<BuscadorScannerPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(BuscadorScannerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
