import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PickupConfirmation } from './pickup-confirmation';

describe('PickupConfirmation', () => {
  let component: PickupConfirmation;
  let fixture: ComponentFixture<PickupConfirmation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PickupConfirmation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PickupConfirmation);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
