import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UIComponentComponent } from './ui-component.component';

describe('UIComponentComponent', () => {
  let component: UIComponentComponent;
  let fixture: ComponentFixture<UIComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UIComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UIComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});