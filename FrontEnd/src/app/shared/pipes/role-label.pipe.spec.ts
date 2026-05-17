import { TestBed } from '@angular/core/testing';

import { RoleLabelPipe } from './role-label.pipe';

describe('RoleLabelPipe', () => {
  let service: RoleLabelPipe;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RoleLabelPipe);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
