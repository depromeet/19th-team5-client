import { createBrowserRouter, Navigate, useLocation } from 'react-router';
import { HomePage } from '@/pages/HomePage';
import { AvatarSelectionPage } from '@/pages/signup/AvatarSelectionPage';
import { VisitorPassPage } from '@/pages/signup/pass/VisitorPassPage';
import { ResumeGuidePage } from '@/pages/signup/ResumeGuidePage';
import { ResumeEditorPage } from '@/pages/signup/resume/ResumeEditorPage';
import { SignupLayout } from '@/pages/signup/SignupLayout';

function SignupIndexRedirect() {
  const { search, hash, state } = useLocation();
  return (
    <Navigate to={{ pathname: 'avatar', search, hash }} state={state} replace />
  );
}

export const router = createBrowserRouter([
  { path: '/', Component: HomePage },
  {
    path: '/signup',
    Component: SignupLayout,
    children: [
      { index: true, Component: SignupIndexRedirect },
      { path: 'avatar', Component: AvatarSelectionPage },
      { path: 'resume-guide', Component: ResumeGuidePage },
      { path: 'resume', Component: ResumeEditorPage },
      { path: 'pass', Component: VisitorPassPage },
    ],
  },
]);
