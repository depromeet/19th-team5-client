import { Component, type ReactNode } from 'react';

type SceneBoundaryProps = {
  /** 3D 씬을 띄우지 못했을 때 대신 보여줄 화면 */
  fallback: ReactNode;
  children: ReactNode;
};

/**
 * WebGL을 쓸 수 없거나 GLB를 불러오지 못하면 3D 씬 대신 fallback을 보여준다.
 * HUD와 페이지 동작은 씬과 따로 돌아가서, 씬이 실패해도 화면은 그대로 쓸 수 있다.
 */
export class SceneBoundary extends Component<
  SceneBoundaryProps,
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
