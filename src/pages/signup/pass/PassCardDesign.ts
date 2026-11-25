import employeeLarge from './art/EmployeePassL.svg';
import employeeMedium from './art/EmployeePassM.svg';
import employeeSmall from './art/EmployeePassS.svg';
import visitorLarge from './art/VisitorPassL.svg';
import visitorMedium from './art/VisitorPassM.svg';
import visitorSmall from './art/VisitorPassS.svg';

export type PassCardSize = 'L' | 'M' | 'S';

type PassCardBase = {
  size: PassCardSize;
  name: string;
  portraitUrl: string;
  issuedAt: number;
  interviews: number;
};

export type PassCardData = PassCardBase &
  (
    | { kind: 'visitor'; levelLabel: string }
    | { kind: 'employee'; likes: number }
  );

export const passBackgrounds = {
  visitor: { L: visitorLarge, M: visitorMedium, S: visitorSmall },
  employee: { L: employeeLarge, M: employeeMedium, S: employeeSmall },
};

export const passLayouts = {
  L: {
    width: 288,
    height: 392,
    radius: 23.4,
    slot: [17.3, 44.2, 7.8],
    photo: [20, 56, 98.8, 119.6, 15.6],
    name: [136, 86, 24],
    roleY: 115,
    badgeY: 140,
    tie: [140.75, 201.52, 145, 191],
    details: {
      x: 20,
      valueX: 109,
      dividerY: 200,
      rowY: 231,
      gap: 26,
      dividerWidth: 244.4,
    },
  },
  M: {
    width: 220,
    height: 300,
    radius: 18,
    slot: [12, 36, 8],
    photo: [16, 44, 76, 92, 12],
    name: [104, 65, 20],
    roleY: 89,
    badgeY: 108,
    tie: [106.73, 154.1, 111.54, 146.92],
    details: {
      x: 16,
      valueX: 85,
      dividerY: 152,
      rowY: 183,
      gap: 20,
      dividerWidth: 188,
    },
  },
  S: {
    width: 160,
    height: 216,
    radius: 18,
    slot: [12, 28, 8],
    photo: [48, 32, 64, 77.47, 10.1],
    name: [80, 136, 14],
    roleY: 153,
    badgeY: 164,
    tie: [106.73, 155.1, 111.54, 146.92],
    details: null,
  },
} as const;

export function getPassLabels(data: PassCardData) {
  if (data.kind === 'visitor')
    return {
      type: '방문증',
      role: '면접자',
      badge: data.levelLabel,
      stats: '면접',
    };
  const likes = data.likes > 99 ? '99+' : data.likes;
  return {
    type: '사원증',
    role: '면접관',
    badge: `좋아요 ${likes}개`,
    stats: '면접관',
  };
}
