import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipationSuccess } from './participation-success';

describe('ParticipationSuccess', () => {
  let component: ParticipationSuccess;
  let fixture: ComponentFixture<ParticipationSuccess>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParticipationSuccess]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParticipationSuccess);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
