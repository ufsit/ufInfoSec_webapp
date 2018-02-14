import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileComponent } from './profile.component';
import { RouterTestingModule } from '@angular/router/testing';
import { SessionService } from '../session.service';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs/observable/of';
import { TimeAgoPipe } from '../time-ago.pipe';

let date;

class MockSessionService {
  private profile = null;

  public getProfile() {
    return this.profile;
  }

  public setProfile(data) {
    this.profile = data;
  }

}

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let element;

  beforeEach(async(() => {
    date = new Date();
    TestBed.configureTestingModule({
      declarations: [ ProfileComponent, TimeAgoPipe ],
      imports: [ RouterTestingModule ],
      providers: [
        {provide: SessionService, useClass: MockSessionService},
        {provide: ActivatedRoute, useValue: {
          snapshot: {
            params: { id: undefined },
            data:
              {profile: {
                full_name: 'Mock User',
                email: 'mockuser@email.com',
                grad_date: 'Spring 2018',
                mass_mail_optin: '0',
                registration_date: date
              }}
          }
          }
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    element = fixture.debugElement.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Own profile', () => {
    it('should update the SessionService\'s profile data', () => {
      const sessionService = TestBed.get(SessionService);
      const profile = {
        full_name: 'Mock User',
        email: 'mockuser@email.com',
        grad_date: 'Spring 2018',
        mass_mail_optin: '0',
        registration_date: date
      };
      expect(sessionService.getProfile().full_name === profile.full_name).toBe(true);
      expect(sessionService.getProfile().email === profile.email).toBe(true);
      expect(sessionService.getProfile().grad_date === profile.grad_date).toBe(true);
      expect(sessionService.getProfile().mass_mail_optin === profile.mass_mail_optin).toBe(true);
      expect(sessionService.getProfile().registration_date === profile.registration_date).toBe(true);
      expect(component.getTitle() === 'Your Profile').toBe(true);
      expect(component.getEditLink() === '/edit_profile').toBe(true);
    });

    it('should not update the SessionService\'s profile data when route data is null', () => {
      const sessionService = TestBed.get(SessionService);
      TestBed.overrideProvider(ActivatedRoute, {useValue: {
        snapshot: {
          params: { id: undefined },
          data:
            {profile: null}
        }
      }
      });

      fixture.detectChanges();
      fixture.whenStable().then( () => {
        expect(sessionService.getProfile() != null).toBe(true);
        expect(component.getTitle() === 'Your Profile').toBe(true);
        expect(component.getEditLink() === '/edit_profile').toBe(true);
      });
    });
  });

  describe('Other user\'s profile', () => {
    it('should not overwrite the SessionService\'s', () => {
      const sessionService = TestBed.get(SessionService);
      const activatedRoute = TestBed.get(ActivatedRoute);
      TestBed.overrideProvider(ActivatedRoute, {useValue: {
        snapshot: {
          params: { id: 1 },
          data:
            {profile: {
              full_name: 'Other mock user',
              email: 'othermockuser@email.com',
              grad_date: 'Spring 2017',
              mass_mail_optin: '1',
              registration_date: new Date()
            }}
        }
      }
      });

      fixture.detectChanges();
      fixture.whenStable().then( () => {
        expect(sessionService.getProfile().full_name != activatedRoute.profile.full_name).toBe(true);
        expect(sessionService.getProfile().email != activatedRoute.profile.email).toBe(true);
        expect(sessionService.getProfile().grad_date != activatedRoute.profile.grad_date).toBe(true);
        expect(sessionService.getProfile().mass_mail_optin != activatedRoute.profile.mass_mail_optin).toBe(true);
        expect(sessionService.getProfile().registration_date != activatedRoute.profile.registration_date).toBe(true);
        expect(component.getTitle() === activatedRoute.profile.full_name + '\'s Profile').toBe(true);
        expect(component.getEditLink() === '/profile/' + activatedRoute.params.id + '/edit').toBe(true);
      });
    });
  });
});
