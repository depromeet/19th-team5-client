import { IconLockFill } from '@karrotmarket/react-monochrome-icon';
import type { ComponentPropsWithRef } from 'react';
import { Link, type To } from 'react-router';
import { IconIdMini } from '@/assets/icons';
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
  lobbyTo?: To;
  myPageTo?: To;
  notificationsTo?: To;
  activePage?: MemberPage | null;
  ticketCount: number;
  hasUnreadNotifications?: boolean;
  onBookInterview?: () => void;
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
      <IconIdMini className={styles.ticketIcon} aria-hidden='true' />
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
  const links: { page: MemberPage; label: string; to?: To }[] = [
    { page: 'lobby', label: labels.lobby, to: lobbyTo },
    { page: 'myPage', label: labels.myPage, to: myPageTo },
    { page: 'notifications', label: labels.notifications, to: notificationsTo },
  ];
  return (
    <>
      <nav className={styles.menu} aria-label={labels.navigation}>
        {links.map(({ page, label, to }) => {
          const unread = page === 'notifications' && hasUnreadNotifications;
          const content = (
            <>
              {label}
              {unread && (
                <span className={styles.unreadDot} aria-hidden='true' />
              )}
            </>
          );
          const linkProps = {
            className: styles.memberLink,
            'aria-label': unread
              ? `${label}, ${labels.notificationsUnread}`
              : undefined,
          };
          return to === undefined ? (
            <button
              key={page}
              type='button'
              disabled
              aria-current={page === activePage ? 'location' : undefined}
              {...linkProps}
            >
              {content}
            </button>
          ) : (
            <Link
              key={page}
              to={to}
              aria-current={page === activePage ? 'page' : undefined}
              {...linkProps}
            >
              {content}
            </Link>
          );
        })}
      </nav>
      <div className={styles.actions}>
        <TicketBalance
          label={labels.tickets}
          amount={`${ticketCount}${labels.ticketUnit}`}
        />
        <Button
          className={styles.filledButton}
          disabled={!onBookInterview}
          onClick={onBookInterview}
        >
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
          <span className={styles.logo}>{labels.brand}</span>
        ) : (
          <Link to={homeTo} className={styles.logo} aria-label={labels.home}>
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
