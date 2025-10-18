import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestInvite } from './guest-invite';

describe('GuestInvite', () => {
  let component: GuestInvite;
  let fixture: ComponentFixture<GuestInvite>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuestInvite]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GuestInvite);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
