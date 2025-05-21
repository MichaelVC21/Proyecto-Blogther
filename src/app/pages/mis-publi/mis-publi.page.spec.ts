import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MisPubliPage } from './mis-publi.page';

describe('MisPubliPage', () => {
  let component: MisPubliPage;
  let fixture: ComponentFixture<MisPubliPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MisPubliPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
