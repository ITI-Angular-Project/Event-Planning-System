import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrustedByLeaders } from './trusted-by-leaders';

describe('TrustedByLeaders', () => {
  let component: TrustedByLeaders;
  let fixture: ComponentFixture<TrustedByLeaders>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrustedByLeaders]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrustedByLeaders);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
