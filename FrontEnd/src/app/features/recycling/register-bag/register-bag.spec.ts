import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterBag } from './register-bag';

describe('RegisterBag', () => {
  let component: RegisterBag;
  let fixture: ComponentFixture<RegisterBag>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterBag]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterBag);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
