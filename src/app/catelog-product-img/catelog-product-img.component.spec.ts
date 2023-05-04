import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CatelogProductImgComponent } from './catelog-product-img.component';

describe('CatelogProductImgComponent', () => {
  let component: CatelogProductImgComponent;
  let fixture: ComponentFixture<CatelogProductImgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CatelogProductImgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatelogProductImgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
