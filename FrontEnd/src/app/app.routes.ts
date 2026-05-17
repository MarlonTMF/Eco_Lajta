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

import { adminAuthGuard }      from './presentation/guards/admin-auth.guard';
import { AdminLayoutComponent } from './presentation/layout/admin-layout/admin-layout.component';

export const routes: Routes = [
  { path: '', redirectTo: 'onboarding', pathMatch: 'full' },
  { path: 'onboarding', component: Onboarding },
  { path: 'login', component: Login },
  { path: 'dashboard', component: Dashboard },
  { path: 'my-recycling', component: MyRecycling },
  { path: 'register-bag', component: RegisterBag },
  { path: 'pickup-confirmation', component: PickupConfirmation },
  { path: 'report-step-1', component: ReportStep1 },
  { path: 'report-step-2', component: ReportStep2 },
  { path: 'report', redirectTo: 'report-step-2' },
  { path: 'map', component: Map },
  { path: 'projects', component: ExploreMissions },
  { path: 'mission-detail', component: MissionDetail },
  { path: 'participation-success', component: ParticipationSuccess },
  { path: 'profile', component: ProfileComponent },
  { path: 'community', component: CommunityComponent },
  { path: 'rewards', component: RewardsComponent },
  { path: 'rewards/confirm/:id', component: RedeemConfirmComponent },
  { path: 'rewards/ticket/:id', component: RedeemTicketComponent },
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
