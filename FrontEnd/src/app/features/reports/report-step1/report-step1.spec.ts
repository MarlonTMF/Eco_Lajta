import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportStep1 } from './report-step1';

describe('ReportStep1', () => {
  let component: ReportStep1;
  let fixture: ComponentFixture<ReportStep1>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportStep1]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportStep1);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
