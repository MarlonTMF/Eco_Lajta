import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportStep2 } from './report-step2';

describe('ReportStep2', () => {
  let component: ReportStep2;
  let fixture: ComponentFixture<ReportStep2>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportStep2]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportStep2);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
