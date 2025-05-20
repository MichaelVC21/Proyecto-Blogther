import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CameraViewPage } from './camera-view.page';

describe('CameraViewPage', () => {
  let component: CameraViewPage;
  let fixture: ComponentFixture<CameraViewPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CameraViewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
