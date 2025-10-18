import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestFeedback } from './guest-feedback';

describe('GuestFeedback', () => {
  let component: GuestFeedback;
  let fixture: ComponentFixture<GuestFeedback>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuestFeedback]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GuestFeedback);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
