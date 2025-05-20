import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GalleryViewPage } from './gallery-view.page';

describe('GalleryViewPage', () => {
  let component: GalleryViewPage;
  let fixture: ComponentFixture<GalleryViewPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(GalleryViewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
