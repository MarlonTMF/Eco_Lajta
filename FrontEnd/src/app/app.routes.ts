import { Routes } from '@angular/router';
import { Onboarding } from './features/auth/onboarding/onboarding';
import { Login } from './features/auth/login/login';
import { Dashboard } from './features/dashboard/dashboard/dashboard';
import { MyRecycling } from './features/recycling/my-recycling/my-recycling';
import { RegisterBag } from './features/recycling/register-bag/register-bag';
import { PickupConfirmation } from './features/recycling/pickup-confirmation/pickup-confirmation';
import { ReportStep1 } from './features/reports/report-step1/report-step1';
import { ReportStep2 } from './features/reports/report-step2/report-step2';
import { Map } from './features/map/map/map';
import { ExploreMissions } from './features/missions/explore-missions/explore-missions';
import { MissionDetail } from './features/missions/mission-detail/mission-detail';
import { ParticipationSuccess } from './features/missions/participation-success/participation-success';
import { ProfileComponent }       from './features/profile/profile';
import { CommunityComponent }   from './features/community/community';
import { RewardsComponent }     from './features/rewards/rewards';
import { RedeemConfirmComponent } from './features/rewards/redeem-confirm/redeem-confirm';
import { RedeemTicketComponent }  from './features/rewards/redeem-ticket/redeem-ticket';
import { authGuard } from './shared/guards/auth.guard';

import { adminAuthGuard }      from './presentation/guards/admin-auth.guard';
import { AdminLayoutComponent } from './presentation/layout/admin-layout/admin-layout.component';

export const routes: Routes = [
  { path: '', redirectTo: 'onboarding', pathMatch: 'full' },
  { path: 'onboarding', component: Onboarding },
  { path: 'login', component: Login },
  { path: 'dashboard', component: Dashboard, canActivate: [authGuard] },
  { path: 'my-recycling', component: MyRecycling, canActivate: [authGuard] },
  { path: 'register-bag', component: RegisterBag, canActivate: [authGuard] },
  { path: 'pickup-confirmation', component: PickupConfirmation, canActivate: [authGuard] },
  { path: 'report-step-1', component: ReportStep1, canActivate: [authGuard] },
  { path: 'report-step-2', component: ReportStep2, canActivate: [authGuard] },
  { path: 'report', redirectTo: 'report-step-2'},
  { path: 'map', component: Map, canActivate: [authGuard] },
  { path: 'projects', component: ExploreMissions, canActivate: [authGuard] },
  { path: 'mission-detail', component: MissionDetail, canActivate: [authGuard] },
  { path: 'participation-success', component: ParticipationSuccess, canActivate: [authGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
  { path: 'community', component: CommunityComponent, canActivate: [authGuard] },
  { path: 'rewards', component: RewardsComponent, canActivate: [authGuard] },
  { path: 'rewards/confirm/:id', component: RedeemConfirmComponent, canActivate: [authGuard] },
  { path: 'rewards/ticket/:id', component: RedeemTicketComponent, canActivate: [authGuard] },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [adminAuthGuard],
    children: [
      { path: '', redirectTo: 'missions', pathMatch: 'full' },
      {
        path: 'missions',
        loadComponent: () =>
          import('./presentation/screens/admin/missions/missions.component')
            .then(m => m.AdminMissionsComponent),
      },
      {
        path: 'missions/:id',
        loadComponent: () =>
          import('./presentation/screens/admin/mission-detail/mission-detail.component')
            .then(m => m.AdminMissionDetailComponent),
      },
    ],
  },
  { path: '**', redirectTo: 'dashboard' }
];
