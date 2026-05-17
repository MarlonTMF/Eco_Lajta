import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExploreMissions } from './explore-missions';

describe('ExploreMissions', () => {
  let component: ExploreMissions;
  let fixture: ComponentFixture<ExploreMissions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExploreMissions]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExploreMissions);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
