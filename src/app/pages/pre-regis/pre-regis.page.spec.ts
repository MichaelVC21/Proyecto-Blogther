import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PreRegisPage } from './pre-regis.page';

describe('PreRegisPage', () => {
  let component: PreRegisPage;
  let fixture: ComponentFixture<PreRegisPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PreRegisPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
