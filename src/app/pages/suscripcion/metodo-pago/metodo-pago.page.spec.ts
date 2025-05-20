import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MetodoPagoPage } from './metodo-pago.page';

describe('MetodoPagoPage', () => {
  let component: MetodoPagoPage;
  let fixture: ComponentFixture<MetodoPagoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MetodoPagoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
