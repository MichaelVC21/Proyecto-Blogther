import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AgregarPubliPage } from './agregar-publi.page';

describe('AgregarPubliPage', () => {
  let component: AgregarPubliPage;
  let fixture: ComponentFixture<AgregarPubliPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AgregarPubliPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
