import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrontendContainerComponent } from './frontend-container.component';

describe('FrontendContainerComponent', () => {
  let component: FrontendContainerComponent;
  let fixture: ComponentFixture<FrontendContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FrontendContainerComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrontendContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
