/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { OpenweathermapService } from './openweathermap.service';

describe('OpenweathermapService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OpenweathermapService]
    });
  });

  it('should ...', inject([OpenweathermapService], (service: OpenweathermapService) => {
    expect(service).toBeTruthy();
  }));
});
