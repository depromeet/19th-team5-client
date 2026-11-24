import { IconLockFill } from '@karrotmarket/react-monochrome-icon';
import type { ComponentPropsWithRef } from 'react';
import { Link, type To } from 'react-router';
import { logo } from '@/components/logo/logo.css';
import { Button } from '../button';
import * as styles from './gnb.css';

type MemberPage = 'lobby' | 'myPage' | 'notifications';

type NavigationLabels = {
  brand: string;
  home?: string;
  navigation: string;
  lobby: string;
};

type MemberProps = {
  variant: 'member';
  labels: NavigationLabels & {
    myPage: string;
    notifications: string;
    notificationsUnread: string;
    tickets: string;
    ticketUnit: string;
    bookInterview: string;
  };
  lobbyTo: To;
  myPageTo: To;
  notificationsTo: To;
  activePage?: MemberPage | null;
  ticketCount: number;
  hasUnreadNotifications?: boolean;
  onBookInterview: () => void;
};

type GuestProps = {
  variant: 'guest';
  labels: NavigationLabels & {
    about: string;
    login: string;
    enter: string;
  };
  lobbyTo: To;
  aboutTo: To;
  onLogin: () => void;
  onEnter: () => void;
};

type WaitingProps = {
  variant: 'waiting';
  labels: NavigationLabels & {
    myPage: string;
    waitingMessage: string;
  };
};

export type GNBProps = Pick<
  ComponentPropsWithRef<'header'>,
  'className' | 'ref'
> & {
  homeTo?: To;
} & (MemberProps | GuestProps | WaitingProps | { variant: 'interview' });

function TicketBalance({ label, amount }: { label: string; amount: string }) {
  return (
    <span className={styles.ticket}>
      <svg
        className={styles.ticketIcon}
        width='16'
        height='22'
        viewBox='0 0 16 22'
        aria-hidden='true'
      >
        <rect
          x='0.48'
          y='1.08'
          width='15.04'
          height='19.84'
          rx='3.52'
          className={styles.ticketCard}
          stroke='currentColor'
          strokeWidth='0.96'
        />
        <g fill='currentColor'>
          <rect x='4.8' y='3.8' width='6.4' height='1.6' rx='0.8' />
          <circle cx='8' cy='11' r='2.4' />
          <rect x='4' y='15' width='8' height='2.4' rx='1.2' />
        </g>
      </svg>
      <span>{label}</span>
      <span className={styles.ticketCount}>{amount}</span>
    </span>
  );
}

function MemberNavigation({
  labels,
  lobbyTo,
  myPageTo,
  notificationsTo,
  activePage = 'lobby',
  ticketCount,
  hasUnreadNotifications,
  onBookInterview,
}: Omit<MemberProps, 'variant'>) {
  const links: { page: MemberPage; label: string; to: To }[] = [
    { page: 'lobby', label: labels.lobby, to: lobbyTo },
    { page: 'myPage', label: labels.myPage, to: myPageTo },
    { page: 'notifications', label: labels.notifications, to: notificationsTo },
  ];
  return (
    <>
      <nav className={styles.menu} aria-label={labels.navigation}>
        {links.map(({ page, label, to }) => {
          const unread = page === 'notifications' && hasUnreadNotifications;
          return (
            <Link
              key={page}
              to={to}
              className={styles.memberLink}
              aria-current={page === activePage ? 'page' : undefined}
              aria-label={
                unread ? `${label}, ${labels.notificationsUnread}` : undefined
              }
            >
              {label}
              {unread && (
                <span className={styles.unreadDot} aria-hidden='true' />
              )}
            </Link>
          );
        })}
      </nav>
      <div className={styles.actions}>
        <TicketBalance
          label={labels.tickets}
          amount={`${ticketCount}${labels.ticketUnit}`}
        />
        <Button className={styles.filledButton} onClick={onBookInterview}>
          {labels.bookInterview}
        </Button>
      </div>
    </>
  );
}

function GuestNavigation({
  labels,
  lobbyTo,
  aboutTo,
  onLogin,
  onEnter,
}: Omit<GuestProps, 'variant'>) {
  return (
    <>
      <nav className={styles.menu} aria-label={labels.navigation}>
        <Link className={styles.menuLink} to={lobbyTo}>
          {labels.lobby}
        </Link>
        <Link className={styles.menuLink} to={aboutTo}>
          {labels.about}
        </Link>
        <Button className={styles.login} variant='text' onClick={onLogin}>
          {labels.login}
        </Button>
      </nav>
      <div className={styles.actions}>
        <Button className={styles.filledButton} onClick={onEnter}>
          {labels.enter}
        </Button>
      </div>
    </>
  );
}

function WaitingNavigation({ labels }: Pick<WaitingProps, 'labels'>) {
  return (
    <>
      <nav className={styles.menu} aria-label={labels.navigation}>
        <Button className={styles.disabledLink} variant='text' disabled>
          {labels.lobby}
        </Button>
        <Button className={styles.disabledLink} variant='text' disabled>
          {labels.myPage}
        </Button>
      </nav>
      <span className={styles.waitingMessage}>
        <IconLockFill
          className={styles.lockIcon}
          size={16}
          aria-hidden='true'
        />
        {labels.waitingMessage}
      </span>
    </>
  );
}

export function GNB(props: GNBProps) {
  if (props.variant === 'interview') return null;

  const { variant, labels, homeTo = '/', className, ref } = props;
  return (
    <header
      ref={ref}
      className={[styles.header, className].filter(Boolean).join(' ')}
    >
      <div className={styles.content}>
        {variant === 'waiting' ? (
          <span className={logo}>{labels.brand}</span>
        ) : (
          <Link to={homeTo} className={logo} aria-label={labels.home}>
            {labels.brand}
          </Link>
        )}
        {props.variant === 'member' && <MemberNavigation {...props} />}
        {props.variant === 'guest' && <GuestNavigation {...props} />}
        {props.variant === 'waiting' && (
          <WaitingNavigation labels={props.labels} />
        )}
      </div>
    </header>
  );
}
