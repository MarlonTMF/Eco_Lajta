import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyRecycling } from './my-recycling';

describe('MyRecycling', () => {
  let component: MyRecycling;
  let fixture: ComponentFixture<MyRecycling>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyRecycling]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyRecycling);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
