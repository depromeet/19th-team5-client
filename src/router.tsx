import { createBrowserRouter } from 'react-router';
import { HomePage } from '@/pages/HomePage';
import { AvatarSelectionPage } from '@/pages/signup/AvatarSelectionPage';
import { ResumeGuidePage } from '@/pages/signup/ResumeGuidePage';
import { SignupLayout } from '@/pages/signup/SignupLayout';

export const router = createBrowserRouter([
  { path: '/', Component: HomePage },
  {
    path: '/signup',
    Component: SignupLayout,
    children: [
      { index: true, Component: AvatarSelectionPage },
      { path: 'avatar', Component: AvatarSelectionPage },
      { path: 'resume-guide', Component: ResumeGuidePage },
    ],
  },
]);
